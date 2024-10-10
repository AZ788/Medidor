const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // Para verificar la contraseña encriptada
const path = require('path');

const app = express();

// Configurar la sesión
app.use(session({
  secret: 'clave-secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Asegúrate de que esto esté desactivado si no estás usando HTTPS
}));

// Middleware para procesar datos enviados en formularios (POST)
app.use(express.urlencoded({ extended: true }));

// Configurar carpeta pública para archivos estáticos como HTML
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'medidor-temperatura.c7y4wmu64ljd.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'AZS12ADSFsa1',
  database: 'medidor-temperatura'
});

// Ruta para servir la página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para validar el login (equivalente a `login_validate.php`)
app.post('/login_validate', (req, res) => {
  const { user, password } = req.body;

  // Consulta a la base de datos para obtener el usuario
  const query = 'SELECT * FROM users WHERE user = ?';
  connection.query(query, [user], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const row = results[0];

      // Verificar la contraseña encriptada usando bcrypt
      bcrypt.compare(password, row.password, (err, match) => {
        if (match) {
          // Contraseña correcta, crear sesión
          req.session.logged = true;
          req.session.user_id = row.id;

          // Actualizar la fecha del último ingreso
          const hoy = new Date();
          const updateQuery = 'UPDATE users SET ultimo_ingreso = ? WHERE user = ?';
          connection.query(updateQuery, [hoy, user], (err) => {
            if (err) throw err;
          });

          // Redirigir a la página protegida
          res.redirect('/front');
        } else {
          // Contraseña incorrecta
          res.send('Contraseña incorrecta');
        }
      });
    } else {
      // Usuario no existe
      res.send('Usuario no existe');
    }
  });
});

// Ruta para la página protegida
app.get('/front', (req, res) => {
  if (req.session.logged) {
    res.sendFile(path.join(__dirname, 'views', 'front.html'));
  } else {
    res.redirect('/login');
  }
});

// Escuchar en el puerto 3000
app.listen(3306, () => {
  console.log('Servidor corriendo en http://localhost:3306');
});
