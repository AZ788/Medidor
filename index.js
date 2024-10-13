const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'medidor-temperatura.c7y4wmu64ljd.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'AZS12ADSFsa1',
  database: 'medidor-temperatura',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos como id', connection.threadId);
});
connection.query('SELECT * FROM temperaturas', (error, results) => {
    if (error) throw error;
    console.log('Datos de la tabla temperaturas: ', results);
  });
  