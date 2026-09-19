const express = require("express");
const cors = require("cors");
const { createServer } = require("http");

const env = require("./configs/env.config");
const { connectRedis } = require("./configs/redis.config");
const { initSocket } = require("./configs/socket.config");
const logger = require("./lib/logger");

const errorHandler = require("./middlewares/error.mid");

const apiV1Routes = require('./api/v1/routes');


const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
connectRedis();
initSocket(httpServer);

app.use('/api/v1', apiV1Routes);

app.use(errorHandler);

httpServer.listen(env.PORT, () => {
  logger.info(`Server đang chạy tại http://localhost:${env.PORT}`);
});
