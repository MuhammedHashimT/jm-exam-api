const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getInstitutions,
  verifyInstitution,
  declineInstitution,
  getAllStudents,
  getDashboardStats,
  updateSettings,
  getSettings
} = require('../controllers/adminController');
const { adminAuth } = require('../middleware/authMiddleware');

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', loginAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', adminAuth, getDashboardStats);

// @route   GET /api/admin/institutions
// @desc    Get all institutions
// @access  Private (Admin)
router.get('/institutions', adminAuth, getInstitutions);

// @route   PUT /api/admin/institutions/:id/verify
// @desc    Verify institution
// @access  Private (Admin)
router.put('/institutions/:id/verify', adminAuth, verifyInstitution);

// @route   PUT /api/admin/institutions/:id/decline
// @desc    Decline institution
// @access  Private (Admin)
router.put('/institutions/:id/decline', adminAuth, declineInstitution);

// @route   GET /api/admin/students
// @desc    Get all students
// @access  Private (Admin)
router.get('/students', adminAuth, getAllStudents);

// @route   PUT /api/admin/settings
// @desc    Update system settings
// @access  Private (Admin)
router.put('/settings', adminAuth, updateSettings);

// @route   GET /api/admin/settings
// @desc    Get system settings
// @access  Private (Admin)
router.get('/settings', adminAuth, getSettings);

module.exports = router;