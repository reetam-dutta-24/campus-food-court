const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const helmet = require('helmet');

const app = express();
app.use(helmet());
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
    logger.info('Health check endpoint called');
    res.json({ status: 'OK', message: 'Server is running' });
});

// Get all vendors
app.get('/api/vendors', async (req, res) => {
    try {
        logger.info('Fetching all vendors');
        const [rows] = await db.query('SELECT * FROM vendors');
        logger.info(`Successfully fetched ${rows.length} vendors`);
        res.json(rows);
    } catch (error) {
        logger.error('Error fetching vendors:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get menu items by vendor
app.get('/api/menu/:vendorId', async (req, res) => {
    try {
        const { vendorId } = req.params;
        logger.info(`Fetching menu items for vendor ${vendorId}`);
        const [rows] = await db.query('SELECT * FROM menu_items WHERE vendor_id = ?', [vendorId]);
        logger.info(`Successfully fetched ${rows.length} menu items`);
        res.json(rows);
    } catch (error) {
        logger.error('Error fetching menu items:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { vendor_id, items, total_amount, customer_name } = req.body;
        logger.info('Creating new order', { vendor_id, customer_name, total_amount });
        
        const [result] = await db.query(
            'INSERT INTO orders (vendor_id, total_amount, customer_name, status) VALUES (?, ?, ?, ?)',
            [vendor_id, total_amount, customer_name, 'pending']
        );
        
        logger.info(`Order created successfully with ID: ${result.insertId}`);
        res.status(201).json({ 
            message: 'Order created successfully', 
            orderId: result.insertId 
        });
    } catch (error) {
        logger.error('Error creating order:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
    logger.info(`📊 Monitoring & Logging enabled`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { promise, reason });
});