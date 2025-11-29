const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// CORS - MUST BE FIRST
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodcourt_db'
});

let dbConnected = false;

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('⚠️  Running in mock mode without database');
    dbConnected = false;
  } else {
    console.log('✅ Connected to MySQL database');
    dbConnected = true;
  }
});

// Mock data for when database is not connected
const mockVendors = [
  { id: 1, name: 'Burger Hub', cuisine: 'Fast Food', rating: 4.5, contact_number: '9876543210' },
  { id: 2, name: 'Pizza Corner', cuisine: 'Italian', rating: 4.7, contact_number: '9876543211' },
  { id: 3, name: 'Desi Dhaba', cuisine: 'Indian', rating: 4.3, contact_number: '9876543212' }
];

const mockMenuItems = {
  '1': [
    { id: 101, name: 'Classic Burger', price: 120.00, category: 'Burgers', is_available: true },
    { id: 102, name: 'Cheese Burger', price: 150.00, category: 'Burgers', is_available: true },
    { id: 103, name: 'French Fries', price: 60.00, category: 'Sides', is_available: true }
  ],
  '2': [
    { id: 201, name: 'Margherita Pizza', price: 200.00, category: 'Pizza', is_available: true },
    { id: 202, name: 'Pepperoni Pizza', price: 280.00, category: 'Pizza', is_available: true }
  ],
  '3': [
    { id: 301, name: 'Dal Makhani', price: 130.00, category: 'Main Course', is_available: true },
    { id: 302, name: 'Paneer Tikka', price: 180.00, category: 'Starters', is_available: true }
  ]
};

let mockOrders = [
  { id: 1, vendor_id: 1, customer_name: 'John Doe', total_amount: 270.00, status: 'delivered', created_at: new Date() },
  { id: 2, vendor_id: 2, customer_name: 'Jane Smith', total_amount: 280.00, status: 'preparing', created_at: new Date() }
];

let orderCounter = 3;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Campus Food Court API',
    version: '1.0.0',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Get all vendors
app.get('/api/vendors', (req, res) => {
  if (dbConnected) {
    const query = 'SELECT * FROM vendors WHERE is_active = true';
    db.query(query, (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.json(mockVendors);
      }
      res.json(results);
    });
  } else {
    res.json(mockVendors);
  }
});

// Get menu for specific vendor
app.get('/api/menu/:vendorId', (req, res) => {
  const { vendorId } = req.params;
  
  if (dbConnected) {
    const query = 'SELECT * FROM menu_items WHERE vendor_id = ? AND is_available = true';
    db.query(query, [vendorId], (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.json(mockMenuItems[vendorId] || []);
      }
      res.json(results);
    });
  } else {
    res.json(mockMenuItems[vendorId] || []);
  }
});

// Get all orders
app.get('/api/orders', (req, res) => {
  if (dbConnected) {
    const query = 'SELECT * FROM orders ORDER BY created_at DESC LIMIT 50';
    db.query(query, (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.json(mockOrders);
      }
      res.json(results);
    });
  } else {
    res.json(mockOrders);
  }
});

// Create new order
app.post('/api/orders', (req, res) => {
  const { vendor_id, customer_name, customer_phone, total_amount } = req.body;
  
  if (dbConnected) {
    const query = 'INSERT INTO orders (vendor_id, customer_name, customer_phone, total_amount, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [vendor_id, customer_name, customer_phone || '', total_amount, 'pending'], (err, result) => {
      if (err) {
        console.error('DB Error:', err);
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
  } else {
    // Mock mode
    const newOrder = {
      id: orderCounter++,
      vendor_id,
      customer_name,
      customer_phone: customer_phone || '',
      total_amount,
      status: 'pending',
      created_at: new Date()
    };
    mockOrders.push(newOrder);
    res.status(201).json({
      ...newOrder,
      message: 'Order created successfully (mock mode)'
    });
  }
});

// Get order by ID
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  
  if (dbConnected) {
    const query = 'SELECT * FROM orders WHERE id = ?';
    db.query(query, [orderId], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(results[0]);
    });
  } else {
    const order = mockOrders.find(o => o.id == orderId);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  }
});

// Update order status
app.patch('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  
  if (dbConnected) {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(query, [status, orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update order' });
      }
      res.json({ message: 'Order status updated', orderId, status });
    });
  } else {
    const order = mockOrders.find(o => o.id == orderId);
    if (order) {
      order.status = status;
      res.json({ message: 'Order status updated (mock mode)', orderId, status });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API base URL: http://localhost:${PORT}/api`);
  console.log(`🕐 Started at: ${new Date().toLocaleString()}`);
});