const logger = require('../lib/logger');
const ERROR_CODES = require('../constants/errorCodes');

const errorHandler = (err, req, res, next) => {
    logger.error("API Error", { method: req.method, url: req.url, error: err.message });

    const statusCode = err.statusCode || ERROR_CODES.SERVER_ERROR;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Lỗi hệ thống!",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
};

module.exports = errorHandler;

/* trong err bao gồm .message . statusCode . stack
 trong req bao gồm .method .url 
 trong res bao gồm .status(mã) .json({})
*/