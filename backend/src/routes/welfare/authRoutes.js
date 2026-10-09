const express = require('express');
const router = express.Router();
const { registerWelfare, loginWelfare } = require('../../controllers/welfare/authController');

router.post('/register', registerWelfare);
router.post('/login', loginWelfare);

module.exports = router;
