const {Server} = require('socket.io');
const logger = require('../lib/logger');
function initSocket(httpSv){
    const io = new Server(httpSv, {
        cors:{
            origin: '*',
        }
    });

    io.on('connection', (socket) => {
        logger.info(`Một trình duyệt vừa kết nối với id: ${socket.id}`);

        socket.on('join_table', (tableId) => {
            socket.join(`table_${tableId}`);
            logger.info(`Trình duyệt ${socket.id} đã vào bàn số ${tableId}`);
       });

        socket.on('disconnect', () => {
        logger.info(`Trình duyệt ${socket.id} đã ngắt kết nối`);
       });
    })
    return io;
}

module.exports = { initSocket };