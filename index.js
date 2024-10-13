const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Configuración de conexión a MySQL
const connection = mysql.createConnection({
  host: 'medidor-temperatura.c7y4wmu64ljd.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'AZS12ADSFsa1',
  database: 'medidor_temperatura',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Ruta para insertar datos
app.post('/insertar', (req, res) => {
  const datos = { Serie: 'ABC123', Temperatura: 25.5 };
  
  const query = 'INSERT INTO datos SET ?';
  
  connection.query(query, datos, (err, result) => {
    if (err) {
      console.error('Error al insertar los datos:', err.stack);
      res.status(500).send('Error al insertar los datos');
      return;
    }
    res.send('Datos ingresados correctamente');
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
