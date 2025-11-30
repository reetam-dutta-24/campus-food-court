const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Log request
    logger.info('Incoming Request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info('Request Completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`
        });
    });

    next();
};

module.exports = requestLogger;