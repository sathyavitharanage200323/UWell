const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../../middleware/auth');
const {
  getProfile,
  getByStudentId,
  updateProfile,
  changePassword,
  getAllStudents,
} = require('../../controllers/student/studentController');

// All routes below require a valid JWT
router.use(protect);

/**
 * GET  /api/student/profile          – get logged-in student's profile
 * PUT  /api/student/profile          – update editable fields
 */
router.route('/profile')
  .get(authorise('student'), getProfile)
  .put(authorise('student'), updateProfile);

/**
 * PUT /api/student/change-password
 */
router.put('/change-password', authorise('student'), changePassword);

/**
 * GET /api/student/all
 * Accessible by welfare / management / counselor roles only
 */
router.get('/all', authorise('welfare', 'management', 'counselor'), getAllStudents);

/**
 * GET /api/student/:studentId
 * Look up a student by their unique studentId (e.g. STU20231001)
 */
router.get('/:studentId', getByStudentId);

module.exports = router;
