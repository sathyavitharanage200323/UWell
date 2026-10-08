const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent } = require('../../controllers/student/authController');

/**
 * POST /api/auth/student/register
 * Body: { firstName, lastName, studentId, faculty, degreeProgram, yearOfStudy, email, phone, password }
 */
router.post('/register', registerStudent);

/**
 * POST /api/auth/student/login
 * Body: { email, password }
 */
router.post('/login', loginStudent);

module.exports = router;
