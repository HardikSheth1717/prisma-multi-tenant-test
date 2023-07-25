const express = require('express');
const helloRoutes = require('./routes/hello');
const selectTenant = require('./connection/pg-connection');
require('./connection/prisma-pool');

const app = express();

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.post('/tenants', async (req, res) => {
    try {
        const { name, db_url } = req.body;
        await global.prismaPool.$queryRaw`CREATE DATABASE ${[name.toString().toLowerCase().replace(' ', '') + '_db']}`;
        await global.prismaPool.$queryRaw`INSERT INTO tenants (name, db_url) VALUES (${name}, ${db_url})`;
        res.status(201).json({ message: 'Tenant created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        //await global.prismaPool.release();
    }
});

app.use(selectTenant);

app.use(helloRoutes);

app.post('/users-entry', async (req, res) => {
    const client = await req.db;

    try {
        const { firstName, lastName } = req.body;
        await client.$queryRaw`INSERT INTO users (firstname, lastname) VALUES (${firstName}, ${lastName});`;
        res.json({result: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        //client.release();
    }
});

app.post('/users', async (req, res) => {
    const client = await req.db;

    try {
        await client.$queryRaw`CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            firstname VARCHAR(255) UNIQUE NOT NULL,
            lastname VARCHAR(255) UNIQUE NOT NULL
          );
          `;
        res.json({result: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // client.release();
    }
});

app.get('/users', async (req, res) => {
    const client = await req.db;

    try {
        const result = await client.$queryRaw`SELECT * FROM states`;
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // client.release();
    }
});

// process.on('exit', () => {
//     global.pool.end();
// });

app.listen(4001);