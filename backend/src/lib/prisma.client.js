const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const prismaExtended = prisma.$extends({
    query:{
        user:{
            async findMany({args, query}){
                args.where = {isActive: true, ...args.where};
                return query(args);
            },
            async findFirst ({args, query}){
                args.where = {isActive: true, ...args.where};
                return query(args);
            },
            async delete({args, query}){
                return prisma.user.update({
                    where: args.where,
                    data: {isActive: false}
                });
            },
            async deleteMany({args, query}){
                return prisma.user.updateMany({
                    where: args.where,
                    data: {isActive: false}
                });
            }
        },
        menuItem:{
            async findMany({args, query}){
                args.where = {isActive: true, ...args.where};
                return query(args);
            },
            async findFirst({args, query}){
                args.where = {isActive: true, ...args.where};
                return query(args);
            },
            async delete({args, query}){
                return prisma.menuItem.update({
                    where: args.where,
                    data: {isActive: false},
                });

            },
            async deleteMany({args, query}){
                return prisma.menuItem.updateMany({
                    where: args.where,
                    data: {isActive: false},
                });
            }
            
        }

    }
});

module.exports = prismaExtended;
    