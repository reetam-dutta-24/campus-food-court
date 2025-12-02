const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Add this:
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(requestLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
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

// ✅ FIXED: Get menu with QUERY parameter (?vendorId=1)
app.get('/api/menu', async (req, res) => {
    try {
        const vendorId = req.query.vendorId; // Get from query string
        
        if (vendorId) {
            logger.info(`Fetching menu items for vendor ${vendorId}`);
            const [rows] = await db.query('SELECT * FROM menu_items WHERE vendor_id = ?', [vendorId]);
            logger.info(`Successfully fetched ${rows.length} menu items`);
            res.json(rows);
        } else {
            // If no vendorId provided, return all menu items
            logger.info('Fetching all menu items');
            const [rows] = await db.query('SELECT * FROM menu_items');
            logger.info(`Successfully fetched ${rows.length} menu items`);
            res.json(rows);
        }
    } catch (error) {
        logger.error('Error fetching menu:', error);
        res.status(500).json({ error: error.message });
    }
});

// Keep the path parameter version too
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

// Get all foods
app.get('/api/foods', async (req, res) => {
    try {
        logger.info('Fetching all food items');
        const [rows] = await db.query('SELECT * FROM menu_items');
        logger.info(`Successfully fetched ${rows.length} food items`);
        res.json(rows);
    } catch (error) {
        logger.error('Error fetching foods:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        logger.info('Fetching all orders');
        const [rows] = await db.query('SELECT * FROM orders');
        logger.info(`Successfully fetched ${rows.length} orders`);
        res.json(rows);
    } catch (error) {
        logger.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ FIXED: Create order with flexible column handling
app.post('/api/orders', async (req, res) => {
    try {
        logger.info('Received order request:', req.body);
        
        const { vendor_id, items, total_amount, customer_name } = req.body;
        
        // Use default values
        const finalVendorId = vendor_id || 1;
        const finalAmount = total_amount || 100;
        const finalName = customer_name || 'Test Customer';
        
        // First, let's check what columns exist in orders table
        const [columns] = await db.query("SHOW COLUMNS FROM orders");
        logger.info('Orders table columns:', columns.map(c => c.Field));
        
        // Try different possible column combinations
        let result;
        const columnNames = columns.map(c => c.Field);
        
        if (columnNames.includes('status')) {
            // Has status column
            [result] = await db.query(
                'INSERT INTO orders (vendor_id, total_amount, customer_name, status) VALUES (?, ?, ?, ?)',
                [finalVendorId, finalAmount, finalName, 'pending']
            );
        } else {
            // No status column
            [result] = await db.query(
                'INSERT INTO orders (vendor_id, total_amount, customer_name) VALUES (?, ?, ?)',
                [finalVendorId, finalAmount, finalName]
            );
        }
        
        logger.info(`Order created successfully with ID: ${result.insertId}`);
        res.status(201).json({ 
            message: 'Order created successfully', 
            orderId: result.insertId,
            data: {
                vendor_id: finalVendorId,
                total_amount: finalAmount,
                customer_name: finalName
            }
        });
    } catch (error) {
        logger.error('Detailed error creating order:', error);
        res.status(500).json({ 
            error: error.message,
            sqlMessage: error.sqlMessage || 'Unknown SQL error',
            details: 'Database error - check table structure'
        });
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