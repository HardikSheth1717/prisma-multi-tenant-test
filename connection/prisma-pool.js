const { PrismaClient } = require('@prisma/client');

// let pool;

try {
    global.prismaPool = new PrismaClient({
        datasources: {
          db: {
            url: 'postgresql://postgres:Admin123@localhost:6432/main_database?schema=public&pgbouncer=true',
          },
        },
      });
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
}

// module.exports = pool;