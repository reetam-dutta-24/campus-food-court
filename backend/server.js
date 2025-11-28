const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodcourt_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('⚠️  Running in mock mode without database');
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Health check endpoint - IMPORTANT for monitoring
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Campus Food Court API',
    version: '1.0.0',
    database: db.state === 'authenticated' ? 'connected' : 'disconnected'
  };
  res.json(health);
});

// Get all vendors
app.get('/api/vendors', (req, res) => {
  const query = 'SELECT * FROM vendors WHERE is_active = true';
  
  db.query(query, (err, results) => {
    if (err) {
      // Fallback mock data if DB fails
      return res.json([
        { id: 1, name: 'Burger Hub', cuisine: 'Fast Food', rating: 4.5 },
        { id: 2, name: 'Pizza Corner', cuisine: 'Italian', rating: 4.7 },
        { id: 3, name: 'Desi Dhaba', cuisine: 'Indian', rating: 4.3 }
      ]);
    }
    res.json(results);
  });
});

// Get menu for specific vendor
app.get('/api/menu/:vendorId', (req, res) => {
  const { vendorId } = req.params;
  const query = 'SELECT * FROM menu_items WHERE vendor_id = ? AND is_available = true';
  
  db.query(query, [vendorId], (err, results) => {
    if (err) {
      return res.json([
        { id: 101, name: 'Sample Item', price: 100, available: true }
      ]);
    }
    res.json(results);
  });
});

// Create new order
app.post('/api/orders', (req, res) => {
  const { vendor_id, customer_name, items, total_amount } = req.body;
  
  const query = 'INSERT INTO orders (vendor_id, customer_name, total_amount, status) VALUES (?, ?, ?, ?)';
  
  db.query(query, [vendor_id, customer_name, total_amount, 'pending'], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create order' });
    }
    res.status(201).json({
      id: result.insertId,
      vendor_id,
      customer_name,
      total_amount,
      status: 'pending',
      message: 'Order created successfully'
    });
  });
});

// Get order by ID
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const query = 'SELECT * FROM orders WHERE id = ?';
  
  db.query(query, [orderId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(results[0]);
  });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  const query = 'SELECT * FROM orders ORDER BY created_at DESC LIMIT 50';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.json([]);
    }
    res.json(results);
  });
});

// Update order status
app.patch('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  
  const query = 'UPDATE orders SET status = ? WHERE id = ?';
  
  db.query(query, [status, orderId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update order' });
    }
    res.json({ message: 'Order status updated', orderId, status });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API base URL: http://localhost:${PORT}/api`);
  console.log(`🕐 Started at: ${new Date().toLocaleString()}`);
});