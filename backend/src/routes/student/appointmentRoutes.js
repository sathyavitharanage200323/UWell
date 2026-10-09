const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../../middleware/auth');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
} = require('../../controllers/student/appointmentController');

router.use(protect);
router.use(authorise('student'));

/**
 * POST /api/student/appointments     — Book appointment
 * GET  /api/student/appointments     — Get all appointments
 */
router.route('/')
  .post(createAppointment)
  .get(getAppointments);

/**
 * GET    /api/student/appointments/:id  — Get one
 * PUT    /api/student/appointments/:id  — Reschedule / update status
 * DELETE /api/student/appointments/:id  — Cancel
 */
router.route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(cancelAppointment);

module.exports = router;
