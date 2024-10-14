const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/database');
const nodemailer = require('nodemailer');
const router = express.Router();

// Renderizar el formulario de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Validar el login
router.post('/login', async (req, res) => {
  const { user, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user = ?', [user]);

    if (rows.length > 0) {
      const userRecord = rows[0];

      // Comparar la contraseña cifrada
      const match = await bcrypt.compare(password, userRecord.password);

      if (match) {
        req.session.logged = true;
        req.session.userId = userRecord.id;
        res.redirect('/medicion');
      } else {
        res.render('login', { error: 'Contraseña incorrecta' });
      }
    } else {
      res.render('login', { error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Renderizar el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Procesar el registro de usuario
router.post('/register', async (req, res) => {
  const { user, email, password, r_password } = req.body;

  if (password !== r_password) {
    return res.render('register', { error: 'Las contraseñas no coinciden' });
  }

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.render('register', { error: 'Correo ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (user, email, password) VALUES (?, ?, ?)', [user, email, hashedPassword]);

    // Enviar correo de confirmación
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'edwinsamboni2004@gmail.com',
        pass: 'AZUREBLADESB2004',
      },
    });

    const mailOptions = {
      from: 'edwinsamboni2004@gmail.com',
      to: email,
      subject: 'Confirmación de registro',
      text: 'Gracias por registrarte en Medidor de Temperatura.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    });

    res.redirect('/login');
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
