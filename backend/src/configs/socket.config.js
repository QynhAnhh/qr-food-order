const { Server } = require("socket.io");
const logger = require("../lib/logger");
const { redisClient } = require("./redis.config");
const SOCKET_EVENTS = require("../constants/socketEvents");

let ioInstance;

function initSocket(httpSv) {
  ioInstance = new Server(httpSv, {
    cors: {
      origin: "*",
    },
  });

  ioInstance.on("connection", (socket) => {
    logger.info(`Một trình duyệt vừa kết nối với id: ${socket.id}`);

    socket.on("join_table", (tableId) => {
      socket.join(`table_${tableId}`);
      logger.info(`Trình duyệt ${socket.id} đã vào bàn số ${tableId}`);
    });

    socket.on(SOCKET_EVENTS.ADD_ITEM, async (data) => {
      const { tableId, item } = data;
      const cartKey = `cart:${tableId}`;
      try {
        let cartData = await redisClient.get(cartKey);
        let cart = cartData ? JSON.parse(cartData) : [];

        const existingItemIndex = cart.findIndex(   // findIndex: tìm kiếm vị trí lặp qua một mảng và trả về vị trí của phần tử đầu tiên thỏa mãn điều kiện, nếu kh tìm thấy thì trả về -1
          (cartItem) => cartItem.menuItemId === item.menuItemId,  // điều kiện
        );
        if (existingItemIndex > -1) {
          cart[existingItemIndex].quantity += item.quantity;
        } else {
          cart.push(item);
        }
        await redisClient.set(cartKey, JSON.stringify(cart));

        ioInstance
          .to(`table_${tableId}`)
          .emit(SOCKET_EVENTS.CART_UPDATED, cart);
        logger.info(
          `Bàn ${tableId} vừa thêm món ${item.menuItemId} vào giỏ hàng.`,
        );
      } catch (error) {
        logger.error("Lỗi khi cập nhật giỏ hàng", error);
      }
    });

    socket.on("disconnect", () => {
      logger.info(`Trình duyệt ${socket.id} đã ngắt kết nối`);
    });
  });
  return ioInstance;
}

function getIo() {
  if (!ioInstance) {
    throw new Error("Socket chưa được khởi tạo!");
  }
  return ioInstance;
}

module.exports = { initSocket, getIo };
