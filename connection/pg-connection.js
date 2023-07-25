const Database = require('./prisma-singleton-connection');
const Redis = require('ioredis');

// Initialize a Redis client
const redis = new Redis({
    port: 5001, // Redis port
    host: "127.0.0.1", // Redis host
    password: "Admin123"
});

async function selectTenant(req, res, next) {
    const tenantName = req.headers['tenant'];
    // const client = await global.prismaPool;

    try {
        let dbUrl = await redis.get(`pg:${tenantName}`);

        if (!dbUrl) {
            // const result = await global.prismaPool.$queryRaw`SELECT db_url FROM tenants WHERE name = ${tenantName}`;
            const result = await global.prismaPool.$queryRaw`SELECT db_url FROM tenant_db WHERE account_id = ${tenantName}::uuid`;

            if (result.length === 0) {
                return res.status(400).json({ message: 'Invalid tenant' });
            }

            dbUrl = result[0].db_url;
            await redis.set(`pg:${tenantName}`, dbUrl);
        }

        const tenantPool = new Database(dbUrl);
        req.db = tenantPool;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // client.release();
    }
}

module.exports = selectTenant;