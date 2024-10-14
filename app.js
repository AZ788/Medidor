const express = require('express');
const path = require('path');
const session = require('express-session');

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use(loginRoute);
app.use(registerRoute);

// Escuchar el servidor
app.listen(5000, () => {
  console.log('Servidor corriendo en el puerto 5000');
});
