const express = require('express');
const router = express.Router();

router.get('/medicion', (req, res) => {
  if (!req.session.logged) {
    return res.redirect('/login');
  }
  
  res.render('medicion', { userId: req.session.userId });
});

module.exports = router;
