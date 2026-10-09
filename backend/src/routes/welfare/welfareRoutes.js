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
  getWelfareAppointments,
  getWelfareAppointmentById,
  updateWelfareAppointment,
  deleteWelfareAppointment,
  getMyNotifications,
  markNotificationRead,
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
 * APPOINTMENTS
 * GET    /api/welfare/appointments         – all appointments (welfare dashboard)
 * GET    /api/welfare/appointments/:id     – single appointment with full details
 * PUT    /api/welfare/appointments/:id     – update (reschedule, status, notes)
 * DELETE /api/welfare/appointments/:id     – hard delete + notify student & counselor
 */
router.get('/appointments', authorise('welfare', 'management'), getWelfareAppointments);
router.get('/appointments/:id', authorise('welfare', 'management'), getWelfareAppointmentById);
router.put('/appointments/:id', authorise('welfare', 'management'), updateWelfareAppointment);
router.delete('/appointments/:id', authorise('welfare', 'management'), deleteWelfareAppointment);

/**
 * NOTIFICATIONS
 * GET  /api/welfare/notifications       – current user's notifications
 * PUT  /api/welfare/notifications/:id   – mark one as read
 */
router.get('/notifications', getMyNotifications);
router.put('/notifications/:id/read', markNotificationRead);

/**
 * GET  /api/welfare/:staffId – direct alias by staffId (must be LAST to avoid conflicts)
 */
router.get('/:staffId', authorise('welfare', 'management'), (req, res, next) => {
  const reserved = ['profile', 'dashboard', 'services', 'counselor', 'schedule', 'all', 'appointments', 'notifications'];
  if (reserved.includes(req.params.staffId.toLowerCase())) {
    return next();
  }
  return getByStaffId(req, res, next);
});

module.exports = router;
