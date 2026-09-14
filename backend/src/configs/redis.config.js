const {createClient} = require('redis');
const logger = require('../lib/logger');
const env = require('./env.config');

const redisClient = createClient({
    url: env.REDIS_URL
});

redisClient.on('error', (err) => {
    logger.error('Lỗi kết nối redis:', err);
});

redisClient.on('connect', () => {
    logger.info('Đã kết nối thành công tới máy chủ Redis!');
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        logger.error('Lỗi khởi tạo kết nối Redis:', error);
    }
};

module.exports = { redisClient, connectRedis };