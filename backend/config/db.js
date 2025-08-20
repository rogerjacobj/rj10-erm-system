const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const dbconfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

const connPool = new sql.ConnectionPool(dbconfig).connect().then(pool => {
        console.log('Connected to the database');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err)
    })

module.exports = {
    sql, connPool
}
