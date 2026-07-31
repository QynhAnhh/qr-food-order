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

redisClient.connect().catch(console.error);

module.exports = redisClient;