const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'medidor-temperatura.c7y4wmu64ljd.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'AZS12ADSFsa1',
  database: 'medidor-temperatura'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos: ', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

module.exports = db;
