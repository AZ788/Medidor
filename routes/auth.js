const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  secure:true
});

// Ruta de login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { user, password } = req.body;
  db.query('SELECT * FROM users WHERE user = ?', [user], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const user = results[0];
      const isMatch = await argon2.verify(user.password, password);
      if (isMatch) {
        if (user.confirmed) {
          req.session.userId = user.id;
          res.redirect('/measurement');
        } else {
          res.render('login', { error: 'Por favor confirma tu correo electrónico.' });
        }
      } else {
        res.render('login', { error: 'Contraseña incorrecta.' });
      }
    } else {
      res.render('login', { error: 'Usuario no encontrado.' });
    }
  });
});

// Ruta de registro
router.get('/register', (req, res) => {
  
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const { user, email, password, r_password } = req.body;
  
  if (password !== r_password) {
    return res.render('register', { error: 'Las contraseñas no coinciden.' });
  }

  const hashedPassword = await argon2.hash(password);
  const confirmationToken = uuidv4();

  db.query('INSERT INTO users (user, email, password, confirmationToken) VALUES (?, ?, ?, ?)', 
    [user, email, hashedPassword, confirmationToken], 
    (err, result) => {
      if (err) throw err;
      
      const confirmUrl = `http://98.81.214.228:5000/confirm/${confirmationToken}`;
      const mailOptions ={
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirma tu cuenta - Bienvenido a Temperatubies',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="text-align: center;">
              <h1 style="color: #333;">Bienvenido a Temperatubies!</h1>
              <p style="color: #555;">Estamos muy emocionados de tenerte con nosotros. Por favor, confirma tu cuenta haciendo clic en el enlace a continuación.</p>
              <a href="${confirmUrl}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px;">Confirmar Cuenta</a>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; text-align: center;">Si no creaste una cuenta en Temperatubies, por favor ignora este correo.</p>
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>Temperatubies© 2024</p>
              <p><a href="https://www.Temperatubies.com" style="color: #999; text-decoration: none;">Visita nuestro sitio web</a></p>
            </div>
          </div>
        `
      };
      
      
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        res.render('emailConfirmation');
      });
  });
});

// Ruta para confirmar el email
router.get('/confirm/:token', (req, res) => {
  const token = req.params.token;
  db.query('SELECT * FROM users WHERE confirmationToken = ?', [token], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      db.query('UPDATE users SET confirmed = 1 WHERE confirmationToken = ?', [token], (err, result) => {
        if (err) throw err;
        res.send('Correo confirmado, ahora puedes iniciar sesión.');
      });
    } else {
      res.send('Token inválido.');
    }
  });
});

// Ruta de medición (measurement)
router.get('/measurement', (req, res) => {
  if (req.session.userId) {
    // Obtén el nombre del usuario de la base de datos utilizando su ID de sesión
    const userId = req.session.userId;
    
    db.query('SELECT nombre FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) throw err;
      
      if (results.length > 0) {
        const usuario = results[0];  // Información del usuario
        res.render('measurement', { usuario });  // Pasar 'usuario' al renderizar la vista
      } else {
        res.redirect('/login');  // Redirigir si el usuario no se encuentra
      }
    });
  } else {
    res.redirect('/login');  // Redirigir si no está autenticado
  }
});


// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
