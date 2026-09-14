const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/lib/hash');
const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu khởi tạo dữ liệu...');

  await prisma.table.createMany({
    data: [
      { name: 'Bàn 1' },
      { name: 'Bàn 2' },
      { name: 'Bàn 3' },
      { name: 'Bàn 4' }
    ],
    skipDuplicates: true, // bỏ qua bản ghi (bàn) trùng lặp
  });
  console.log('Đã tạo xong Bàn ăn mẫu!');

  await prisma.menuItem.createMany({
    data: [
      { name: 'Phở Bò Tái Nạm', description: 'Nước dùng đậm đà', price: 50000 },
      { name: 'Cơm Chiên Dương Châu', description: 'Cơm chiên hải sản', price: 55000 },
      { name: 'Trà Đá', description: 'Trà đá giải khát', price: 5000 },
      { name: 'Coca Cola', description: 'Nước ngọt có gas', price: 15000 }
    ],
    skipDuplicates: true, // bỏ qua bản ghi (món ăn) trùng lặp
  });
  console.log('Đã tạo xong Thực đơn mẫu!');

  const defaultPassword = await hashPassword('123456');

  await prisma.user.createMany({
    data: [
      { username: 'admin', password: defaultPassword, role: 'ADMIN' },
      { username: 'waiter1', password: defaultPassword, role: 'WAITER' },
      { username: 'kitchen1', password: defaultPassword, role: 'KITCHEN' },
    ],
    skipDuplicates: true, // bỏ qua bản ghi (tài khoản) trùng lặp
  });
  console.log('Đã tạo xong Tài khoản mẫu!');

  console.log('Hoàn tất quá trình khởi tạo dữ liệu ban đầu!');
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); 
  });
