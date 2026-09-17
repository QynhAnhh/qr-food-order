const express = require("express");
const cors = require("cors");
const { createServer } = require("http");

const env = require("./configs/env.config");
const { connectRedis } = require("./configs/redis.config");
const { initSocket } = require("./configs/socket.config");
const logger = require("./lib/logger");

const errorHandler = require("./middlewares/error.mid");
const authRoutes = require("./modules/auth/auth.route");
const userRoutes = require("./modules/users/user.route");
const tableRoutes = require('./modules/tables/table.route');
const menuItemRoutes = require('./modules/menuItems/menuItem.route');
const orderRoutes = require('./modules/orders/order.route');
const feedbackRoutes = require('./modules/feedbacks/feedback.route');


const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
connectRedis();
initSocket(httpServer);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use('/tables', tableRoutes);
app.use('/menu-items', menuItemRoutes);
app.use('/orders', orderRoutes);
app.use('/feedbacks', feedbackRoutes);


app.use(errorHandler);

httpServer.listen(env.PORT, () => {
  logger.info(`Server đang chạy tại http://localhost:${env.PORT}`);
});
