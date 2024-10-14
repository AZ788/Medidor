const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
    const { user, password } = req.body;

    const query = 'SELECT * FROM users WHERE user = ?';
    db.query(query, [user], (err, results) => {
        if (err) return res.status(500).send('Error en el servidor');

        if (results.length > 0) {
            const userData = results[0];

            // Verificar la contraseña
            bcrypt.compare(password, userData.password, (err, result) => {
                if (result) {
                    // Autenticación exitosa
                    req.session.user_id = userData.id;
                    return res.redirect('/dashboard');  // Ajusta la ruta según tu sistema
                } else {
                    return res.send('Contraseña incorrecta');
                }
            });
        } else {
            return res.send('Usuario no existe');
        }
    });
});

module.exports = router;
