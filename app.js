const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión
app.use(session({
  secret: 'secret-key', // Cambia esto por una clave secreta más segura
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Ponlo en true si usas HTTPS
}));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', authRoutes); // Rutas de autenticación
app.use('/', indexRoutes); // Página de medición

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
