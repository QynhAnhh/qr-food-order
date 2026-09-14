// Vẽ mã QR cho mỗi bàn

const {PrismaClient} = require('@prisma/client');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const BASE_FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000/order';

async function main(){
    console.log('Bắt đầu tạo mã QR cho bàn...')
const qrDir = path.join(__dirname, '..', 'qrcodes');
if (!fs.existsSync(qrDir)){
    fs.mkdirSync(qrDir);
}

const tables = await prisma.table.findMany({
    where:{isActive: true}
});
if (tables.length ===0){
    console.log('Không tìm thấy bàn nào, chạy seed.js trước!');
    return;
}

for (const table of tables){
    const url = `${BASE_FRONTEND_URL}?tableId=${table.id}`;
    const filePath = path.join(qrDir, `table-${table.id}.png`);

    await QRCode.toFile(filePath, url, {
        width: 300,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    });
    console.log(`Đã tạo ảnh QR cho bàn ${table.name} tại ${filePath}`);
}
console.log('Quá trình tạo mã QR đã hoàn tất!')
}
main ()
    .catch((e) =>{
        console.error('Lỗi khi tạo mã QR', e);
        process.exit(1);
    
    })
    .finally(async () => {
        await prisma.$disconnect();
    });