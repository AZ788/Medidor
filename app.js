const express = require('express');
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth');

// Middleware para manejar datos POST
app.use(express.urlencoded({ extended: true }));

// Usar las rutas de autenticación
app.use('/routes/auth', authRoutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz
app.get('/', (req, res) => {
  res.redirect('/routes/auth/login');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
