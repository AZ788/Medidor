const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'medidor-temperatura.c7y4wmu64ljd.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'AZS12ADSFsa1',
  database: 'medidor-temperatura',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
