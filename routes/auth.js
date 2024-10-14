const express = require('express');
const path = require('path');
const router = express.Router();

// Servir archivos estáticos como CSS e imágenes
router.use(express.static(path.join(__dirname, '../public')));

// Ruta para el login
router.get('/public/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// Ruta para el registro
router.get('/public/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'register.html'));
});

module.exports = router;
