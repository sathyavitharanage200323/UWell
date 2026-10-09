const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../../middleware/auth');
const {
  getProfile,
  getByStudentId,
  updateProfile,
  changePassword,
  getAllStudents,
  getCounselors,
  getCounselorById,
  getCounselorAvailability,
  submitWellbeingCheck,
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
 * COUNSELORS FOR STUDENTS
 * GET /api/student/counselors
 * GET /api/student/counselors/:id
 * GET /api/student/counselors/:id/availability
 */
router.get('/counselors', getCounselors);
router.get('/counselors/:id/availability', getCounselorAvailability);
router.get('/counselors/:id', getCounselorById);

/**
 * WELLBEING CHECK
 * POST /api/student/wellbeing-check
 */
router.post('/wellbeing-check', submitWellbeingCheck);

/**
 * GET /api/student/all
 * Accessible by welfare / management / counselor roles only
 */
router.get('/all', authorise('welfare', 'management', 'counselor'), getAllStudents);

/**
 * GET /api/student/:studentId
 * Look up a student by their unique studentId (e.g. STU20231001)
 */
router.get('/:studentId', (req, res, next) => {
  const reserved = ['profile', 'mood', 'appointments', 'counselors', 'all', 'change-password', 'wellbeing-check'];
  if (reserved.includes(req.params.studentId.toLowerCase())) {
    return next();
  }
  return getByStudentId(req, res, next);
});

module.exports = router;
