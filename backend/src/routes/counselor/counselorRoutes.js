const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { ensureCounselorSeed } = require('../../scripts/seedCounselorData');

const profileController = require('../../controllers/counselor/profileController');
const appointmentController = require('../../controllers/counselor/appointmentController');
const studentController = require('../../controllers/counselor/studentController');
const messageController = require('../../controllers/counselor/messageController');
const availabilityController = require('../../controllers/counselor/availabilityController');
const videoSessionController = require('../../controllers/counselor/videoSessionController');

// All counselor-module routes require a valid JWT.
router.use(protect);

// Seed the counselor demo data once per process when the collections are empty.
router.use(ensureCounselorSeed);

// Profile & stats
router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.get('/stats', profileController.getStats);

// Appointments
router.get('/appointments', appointmentController.getAppointments);
router.get('/appointments/:id', appointmentController.getAppointmentById);
router.put('/appointments/:id', appointmentController.updateAppointmentStatus);

// Students
router.get('/students', studentController.getStudents);
router.get('/students/:id', studentController.getStudentById);
router.post('/students/:id/notes', studentController.saveSessionNotes);

// Messages
router.get('/messages', messageController.getMessages);
router.get('/messages/:studentId', messageController.getMessageByStudentId);
router.post('/messages', messageController.sendMessage);

// Availability
router.get('/availability', availabilityController.getAvailability);
router.post('/availability', availabilityController.createAvailability);
router.put('/availability/:id', availabilityController.updateAvailability);
router.delete('/availability/:id', availabilityController.deleteAvailability);

// Video session placeholder
router.post('/video-session/start', videoSessionController.startVideoSession);

module.exports = router;
