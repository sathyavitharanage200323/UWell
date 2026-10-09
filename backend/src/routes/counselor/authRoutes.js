const express = require('express');
const router = express.Router();
const { registerCounselor, loginCounselor } = require('../../controllers/counselor/authController');

router.post('/register', registerCounselor);
router.post('/login', loginCounselor);

module.exports = router;
