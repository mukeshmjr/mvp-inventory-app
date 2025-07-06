const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config(); // Load .env variables

// App setup
const app = express();
// Environment variables
const PORT = process.env.PORT;
const SECRET = process.env.JWT_SECRET;
const mongoURI = process.env.MONGO_URI;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
// Check if MONGO_URI is defined
if (!mongoURI) {
  console.error('❌ MONGO_URI is not defined in .env file');
  process.exit(1);
}
// Check if PORT is defined
if (!PORT) {
  console.error('❌ PORT is not defined in .env file');
  process.exit(1);
}
// Check if JWT_SECRET is defined
if (!SECRET) {
  console.error('❌ JWT_SECRET is not defined in .env file');
  process.exit(1);
}


// Local imports
const auth = require('./middleware/auth');
const response = require('./utils/response');
const InventoryItem = require('./models/inventoryItem');

// MongoDB Connection using Mongoose and environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
// const allowedOrigins = ['http://localhost:4200', FRONTEND_ORIGIN];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true // optional, if sending cookies/auth headers
// }));

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });


// ===========================================
// ✅ ROUTES
// ===========================================

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    return response(res, 200, 'Login successful', { token });
  } else {
    return response(res, 401, 'Invalid credentials', null);
  }
});

// Save Item Endpoint
app.post('/save-items', auth(SECRET), async (req, res) => {
  try {
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return response(res, 400, 'No items provided', null);
    }

    const preparedItems = items.map(item => ({
      title: item.title,
      description: item.description,
      qty: Number(item.qty),
      price: Number(item.price),
      image: item.image || '',
      date: item.date || new Date()
    }));

    const savedItems = await InventoryItem.insertMany(preparedItems);
    return response(res, 200, 'Items saved successfully', savedItems);

  } catch (err) {
    return response(res, 500, 'Failed to save items', { error: err.message });
  }
});


// Get Items Endpoint
app.get('/get-items', auth(SECRET), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const title = req.query.title || '';
    const createdDate = req.query.createdDate ? new Date(req.query.createdDate) : null
    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // case-insensitive search
    }
    if (createdDate) {
      filter.date = {
        $gte: new Date(createdDate.setHours(0, 0, 0, 0)),
        $lt: new Date(createdDate.setHours(23, 59, 59, 999))
      };
    }

    const skip = (page - 1) * pageSize;
    // Execute both queries in parallel
    const [items, total] = await Promise.all([
      InventoryItem.find(filter).skip(skip).limit(pageSize).sort({ date: -1 }),
      InventoryItem.countDocuments(filter)
    ]);

    return response(res, 200, 'Items retrieved successfully', { items, total });

  } catch (err) {
    return response(res, 500, 'Failed to fetch items', { error: err.message });
  }
});

// Upload Image Endpoint
app.post('/upload-image', auth(SECRET), upload.single('image'), (req, res) => {
  if (!req.file) {
    return response(res, 400, 'No file uploaded', null);
  }

  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  return response(res, 200, 'Image uploaded successfully', { imageUrl });
});


// ===========================================
// ✅ Start Server
// ===========================================
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
