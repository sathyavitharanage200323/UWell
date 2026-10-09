const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../../middleware/auth');
const {
  registerManagement,
  loginManagement,
  getPendingRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  getDashboardStats,
  getManagementProfile,
  updateManagementProfile,
  logoutManagement,
  getManagementAppointments,
  updateManagementAppointment,
  generateUsageReport,
  saveUsageReport,
  getSavedReports,
  deleteSavedReport,
  getUsageDetails,
  addServiceNote,
  deleteServiceNote,
  getSecurityInfo,
  changePassword,
} = require('../../controllers/management/managementController');

// Auth (public)
router.post('/register', registerManagement);
router.post('/login', loginManagement);
router.post('/logout', logoutManagement);

// Everything below needs a valid management login
router.use(protect, authorise('management'));

// Manager approval workflows for counselors and welfare officers
router.get('/pending-requests', getPendingRequests);
router.get('/all-requests', getAllRequests);
router.post('/approve-request', approveRequest);
router.post('/reject-request', rejectRequest);
router.get('/dashboard-stats', getDashboardStats);

// Appointment summary
router.get('/appointments', getManagementAppointments);
router.put('/appointments/:id', updateManagementAppointment);

// Usage reports
router.post('/usage-report', generateUsageReport);
router.route('/reports').get(getSavedReports).post(saveUsageReport);
router.delete('/reports/:id', deleteSavedReport);

// Usage details and service notes
router.get('/usage-details', getUsageDetails);
router.post('/usage-details/notes', addServiceNote);
router.delete('/usage-details/notes/:id', deleteServiceNote);

// Privacy & security
router.get('/security', getSecurityInfo);
router.put('/password', changePassword);

// Profile
router.get('/profile', getManagementProfile);
router.put('/profile', updateManagementProfile);

module.exports = router;
