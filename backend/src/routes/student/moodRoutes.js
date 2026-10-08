const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../../middleware/auth');
const {
  createMood,
  getMoods,
  getMoodById,
  updateMood,
  deleteMood,
} = require('../../controllers/student/moodController');

// All mood routes require authentication
router.use(protect);
router.use(authorise('student'));

/**
 * POST /api/student/mood        — Create mood entry
 * GET  /api/student/mood        — Get all mood entries (last 30)
 */
router.route('/')
  .post(createMood)
  .get(getMoods);

/**
 * GET    /api/student/mood/:id  — Get single entry
 * PUT    /api/student/mood/:id  — Update entry
 * DELETE /api/student/mood/:id  — Delete entry
 */
router.route('/:id')
  .get(getMoodById)
  .put(updateMood)
  .delete(deleteMood);

module.exports = router;
