const {Server} = require('socket.io');
const logger = require('../lib/logger');

let ioInstance;

function initSocket(httpSv){
    ioInstance = new Server(httpSv, {
        cors:{
            origin: '*',
        }
    });

    ioInstance.on('connection', (socket) => {
        logger.info(`Một trình duyệt vừa kết nối với id: ${socket.id}`);

        socket.on('join_table', (tableId) => {
            socket.join(`table_${tableId}`);
            logger.info(`Trình duyệt ${socket.id} đã vào bàn số ${tableId}`);
       });

        socket.on('disconnect', () => {
        logger.info(`Trình duyệt ${socket.id} đã ngắt kết nối`);
       });
    })
    return ioInstance;
}

function getIo() {
    if (!ioInstance) {
        throw new Error("Socket chưa được khởi tạo!");
    }
    return ioInstance;
}

module.exports = { initSocket, getIo };