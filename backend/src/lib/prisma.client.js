const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const env = require("../configs/env.config");

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20, // Tối đa 20 kết nối được mở cùng lúc (Mặc định là 10)
  idleTimeoutMillis: 30000, // Nếu 1 cánh cửa không ai dùng trong 30 giây -> Đóng lại cho nhẹ máy
  connectionTimeoutMillis: 3000, // Nếu khách xếp hàng đợi quá 2 giây chưa tới lượt -> Báo lỗi Timeout ngay lập tức
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const prismaExtended = prisma.$extends({
  query: {
    user: {
      async findMany({ args, query }) {
        args.where = { isActive: true, ...args.where };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { isActive: true, ...args.where };
        return query(args);
      },
      async delete({ args, query }) {
        return prisma.user.update({
          where: args.where,
          data: { isActive: false },
        });
      },
      async deleteMany({ args, query }) {
        return prisma.user.updateMany({
          where: args.where,
          data: { isActive: false },
        });
      },
    },
    menuItem: {
      async findMany({ args, query }) {
        args.where = { isActive: true, ...args.where };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { isActive: true, ...args.where };
        return query(args);
      },
      async delete({ args, query }) {
        return prisma.menuItem.update({
          where: args.where,
          data: { isActive: false },
        });
      },
      async deleteMany({ args, query }) {
        return prisma.menuItem.updateMany({
          where: args.where,
          data: { isActive: false },
        });
      },
    },
  },
});

module.exports = prismaExtended;
