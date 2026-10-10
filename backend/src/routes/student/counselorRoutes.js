const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../../middleware/auth');
const {
  getCounselors,
  getCounselorById,
  getCounselorAvailability,
} = require('../../controllers/student/counselorController');

// All routes require a valid student JWT
router.use(protect);
router.use(authorise('student'));

/**
 * GET /api/student/counselors                      – list counselors
 * GET /api/student/counselors/:id                  – single counselor
 * GET /api/student/counselors/:id/availability     – counselor weekly availability
 */
router.get('/', getCounselors);
router.get('/:id', getCounselorById);
router.get('/:id/availability', getCounselorAvailability);

module.exports = router;
