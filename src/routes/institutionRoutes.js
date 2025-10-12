const express = require('express');
const router = express.Router();
const {
  registerInstitution,
  loginInstitution,
  getProfile,
  updateProfile
} = require('../controllers/institutionController');
const { institutionAuth } = require('../middleware/authMiddleware');

// @route   POST /api/institutions/register
// @desc    Register new institution
// @access  Public
router.post('/register', registerInstitution);

// @route   POST /api/institutions/login
// @desc    Login institution
// @access  Public
router.post('/login', loginInstitution);

// @route   GET /api/institutions/profile
// @desc    Get institution profile
// @access  Private (Institution)
router.get('/profile', institutionAuth, getProfile);

// @route   PUT /api/institutions/profile
// @desc    Update institution profile
// @access  Private (Institution)
router.put('/profile', institutionAuth, updateProfile);

module.exports = router;