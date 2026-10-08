const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../../middleware/auth');
const {
  getProfile,
  getByStaffId,
  updateProfile,
  updateSchedule,
  getDashboard,
  getAllWelfareOfficers,
  getCounselingServices,
  updateCounselorStatus,
} = require('../../controllers/welfare/welfareController');

// All routes below require valid JWT
router.use(protect);

/**
 * GET  /api/welfare/services/counseling – counseling services, live sessions, & demand
 * GET  /api/welfare/services – direct alias
 */
router.get('/services/counseling', getCounselingServices);
router.get('/services', getCounselingServices);

/**
 * PUT  /api/welfare/counselor/:id/status – update counselor availability status
 */
router.put('/counselor/:id/status', updateCounselorStatus);

/**
 * GET  /api/welfare/profile – get logged-in welfare officer's profile
 * PUT  /api/welfare/profile – update profile fields
 */
router.route('/profile')
  .get(getProfile)
  .put(authorise('welfare'), updateProfile);

/**
 * PUT  /api/welfare/schedule – update working schedule & availability
 */
router.put('/schedule', authorise('welfare'), updateSchedule);

/**
 * GET  /api/welfare/dashboard – get dashboard stats + officer profile
 */
router.get('/dashboard', authorise('welfare'), getDashboard);

/**
 * GET  /api/welfare/all – list all approved welfare officers (accessible by welfare, management)
 */
router.get('/all', authorise('welfare', 'management'), getAllWelfareOfficers);

/**
 * GET  /api/welfare/staff/:staffId – look up by unique staffId (e.g. STF01, WLF2024001)
 */
router.get('/staff/:staffId', authorise('welfare', 'management'), getByStaffId);

/**
 * GET  /api/welfare/:staffId – direct alias by staffId
 */
router.get('/:staffId', authorise('welfare', 'management'), getByStaffId);

module.exports = router;
