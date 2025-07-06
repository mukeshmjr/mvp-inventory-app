
const express = require('express');
const cors = require('cors'); // if used
const json = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
// Middleware for authentication
const auth = require('./middleware/auth');
const app = express();
const response = require('./utils/response');

// Middleware to enable CORS for the frontend
app.use(cors({ origin: 'https://inventory-frontend.onrender.com' }));
// Middleware to parse JSON bodies
app.use(json.json());

const PORT = 3000;
const SECRET = 'secret123';
let items = [];

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    const token = jsonwebtoken.sign({ username }, SECRET, { expiresIn: '1h' });
    return response(res, 200, 'Login successful', { token });
  } else {
    return response(res, 401, 'Invalid credentials', null);
  }
});

// Save Items Endpoint
app.post('/save-item', auth(SECRET), (req, res) => {
  const { title, description, qty, price, imageUrl, createdAt } = req.body;

  if (!title || !description || !qty || !price) {
    return response(res, 201, 'Missing required fields', null);
  }

  const newItem = {
    id: Date.now().toString(),
    title,
    description,
    qty,
    price,
    imageUrl: imageUrl || '',
    createdAt: createdAt || new Date().toISOString()
  };

  items.push(newItem);
  return response(res, 200, 'Item saved successfully', newItem);

});

// Get Items Endpoint
app.get('/get-items', auth(SECRET), (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);
  return response(res, 200, 'Items retrieved successfully', { items: paginatedItems, total: items.length });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
