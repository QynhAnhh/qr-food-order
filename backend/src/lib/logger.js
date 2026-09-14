const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',  // Mức độ ghi log: info, warn, error
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`; 
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;
