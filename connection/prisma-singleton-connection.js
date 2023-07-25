const { PrismaClient } = require('@prisma/client');

class Database {
  constructor(connectionString) {
    if (!Database.instances) {
      Database.instances = {};
    }

    if (!Database.instances[connectionString]) {
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: connectionString,
          },
        },
      });

      Database.instances[connectionString] = prisma;
    }

    // Increment the reference count for the singleton instance
    Database.instanceRefCount = (Database.instanceRefCount || 0) + 1;

    return Database.instances[connectionString];
  }
}

module.exports = Database;
