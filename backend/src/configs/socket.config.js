const {Server} = require('socket.io');
function initSocket(httpSv){
    const io = new Server(httpSv, {
        cors:{
            origin: '*',
        }
    });

    io.on('connection', (socket) => {
        console.log(`Một trình duyệt vừa kết nối với id: ${socket.id}`);

        socket.on('join_table', (tableId) => {
            socket.join(`table_${tableId}`);
            console.log(`Trình duyệt ${socket.id} đã vào bàn số ${tableId}`);
       });

        socket.on('disconnect', () => {
        console.log(`Trình duyệt ${socket.id} đã ngắt kết nối`);
       });
    })
    return io;
}

module.exports = { initSocket };