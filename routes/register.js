const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Ruta de registro de usuario
router.post('/register', (req, res) => {
    const { user, mail, password, r_password, terms } = req.body;

    // Validaciones
    if (password !== r_password) return res.send('Las contraseñas no coinciden');

    // Encriptar la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO users (user, mail, password) VALUES (?, ?, ?)';
    db.query(query, [user, mail, hashedPassword], (err, results) => {
        if (err) return res.status(500).send('Error en el servidor');

        res.redirect('/login');
    });
});

module.exports = router;
