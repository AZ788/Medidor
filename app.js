require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const routes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// Configuraciones de Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true
}));

// Rutas para las vistas
app.get('/pt100', (req, res) => {
  if (req.session.userId) {
    res.render('pt100');  // Renderizamos el archivo pt100.ejs
  } else {
    res.redirect('/login');  // Redirigir si no está autenticado
  }
});

// Rutas
app.use('/', routes);
app.use('/api', apiRoutes);  // Rutas de la API

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
