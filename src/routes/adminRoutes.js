const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getInstitutions,
  getInstitutionById,
  verifyInstitution,
  declineInstitution,
  editInstitution,
  deleteInstitution,
  getAllStudents,
  getStudentById,
  editStudent,
  deleteStudent,
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

// @route   GET /api/admin/institutions/:id
// @desc    Get single institution
// @access  Private (Admin)
router.get('/institutions/:id', adminAuth, getInstitutionById);

// @route   PUT /api/admin/institutions/:id
// @desc    Edit institution
// @access  Private (Admin)
router.put('/institutions/:id', adminAuth, editInstitution);

// @route   DELETE /api/admin/institutions/:id
// @desc    Delete institution
// @access  Private (Admin)
router.delete('/institutions/:id', adminAuth, deleteInstitution);

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

// @route   GET /api/admin/students/:id
// @desc    Get single student
// @access  Private (Admin)
router.get('/students/:id', adminAuth, getStudentById);

// @route   PUT /api/admin/students/:id
// @desc    Edit student
// @access  Private (Admin)
router.put('/students/:id', adminAuth, editStudent);

// @route   DELETE /api/admin/students/:id
// @desc    Delete student
// @access  Private (Admin)
router.delete('/students/:id', adminAuth, deleteStudent);

// @route   PUT /api/admin/settings
// @desc    Update system settings
// @access  Private (Admin)
router.put('/settings', adminAuth, updateSettings);

// @route   GET /api/admin/settings
// @desc    Get system settings
// @access  Private (Admin)
router.get('/settings', adminAuth, getSettings);

module.exports = router;