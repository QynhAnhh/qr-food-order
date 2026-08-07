const {createClient} = require('redis');
const env = require('./env.config');

const redisClient = createClient({
    url: env.REDIS_URL
});

redisClient.on('error', (err) => {
    console.log('Lỗi kết nối redis:', err);
});

redisClient.on('connect', () => {
    console.log('Đã kết nối thành công tới máy chủ Redis!');
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error(error);
    }
};

module.exports = { redisClient, connectRedis };