const { cleanEnv, str, port, url } = require('envalid');
require('dotenv').config();

const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }), 
  FRONTEND_URL: url(), 
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  REDIS_URL: str({ default: 'redis://localhost:6379' }),
});

module.exports = env;
