
const express = require('express');
const cors = require('cors'); // if used
const json = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
// Middleware for authentication
const auth = require('./middleware/auth');
const app = express();

app.use(cors());
app.use(json.json());

const PORT = 3000;
const SECRET = 'secret123';
let items = [];

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    const token = jsonwebtoken.sign({ username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Save Items Endpoint
app.post('/save-item', auth(SECRET), (req, res) => {
  items.push(...req.body.items);
  res.json({ message: 'Items saved' });
});

// Get Items Endpoint
app.get('/get-items', auth(SECRET), (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);
  res.json({ items: paginatedItems, total: items.length });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
