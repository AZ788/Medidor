const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 6000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  console.log('Conectado a la base de datos');
});

app.post('/insertar', (req, res) => {
  console.log('Solicitud POST recibida');
  const { serie, temp } = req.body;
  console.log(`Datos recibidos: serie=${serie}, temp=${temp}`);

  const query = 'INSERT INTO datos (Fecha, Serie, Temperatura) VALUES (current_timestamp(), ?, ?)';
  connection.query(query, [serie, temp], (err, result) => {
    if (err) {
      console.error('Error al insertar los datos:', err.stack);
      res.status(500).send('Error al insertar los datos');
      return;
    }
    res.send('Datos ingresados correctamente');
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
