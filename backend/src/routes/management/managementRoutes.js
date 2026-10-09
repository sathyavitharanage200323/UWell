const express = require('express');
const router = express.Router();
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
} = require('../../controllers/management/managementController');

// Auth
router.post('/register', registerManagement);
router.post('/login', loginManagement);
router.post('/logout', logoutManagement);

// Manager approval workflows for counselors and welfare officers
router.get('/pending-requests', getPendingRequests);
router.get('/all-requests', getAllRequests);
router.post('/approve-request', approveRequest);
router.post('/reject-request', rejectRequest);
router.get('/dashboard-stats', getDashboardStats);

// Profile
router.get('/profile', getManagementProfile);
router.put('/profile', updateManagementProfile);

module.exports = router;
