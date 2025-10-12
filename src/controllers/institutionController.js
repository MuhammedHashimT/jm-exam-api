const jwt = require('jsonwebtoken');
const Institution = require('../models/Institution');
const Setting = require('../models/Setting');

// Generate JWT token
const generateToken = (id, type = 'institution') => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new institution
// @route   POST /api/institutions/register
// @access  Public
const registerInstitution = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      place,
      district,
      mudarrisName,
      mudarrisPlace,
      mudarrisContact
    } = req.body;

    // Check if institution already exists
    const existingInstitution = await Institution.findOne({ email });
    if (existingInstitution) {
      return res.status(400).json({
        success: false,
        message: 'Institution with this email already exists'
      });
    }

    // Get current settings
    const settings = await Setting.getSettings();

    // Create new institution
    const institution = new Institution({
      name,
      email,
      password,
      place,
      district,
      mudarrisName,
      mudarrisPlace,
      mudarrisContact,
      verified: settings.autoVerify || !settings.requireVerification
    });

    await institution.save();

    // Generate token
    const token = generateToken(institution._id);

    res.status(201).json({
      success: true,
      message: settings.autoVerify || !settings.requireVerification
        ? 'Institution registered successfully'
        : 'Institution registered successfully. Please wait for admin verification.',
      data: {
        institution,
        token,
        needsVerification: settings.requireVerification && !settings.autoVerify
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// @desc    Login institution
// @route   POST /api/institutions/login
// @access  Public
const loginInstitution = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find institution and include password for comparison
    const institution = await Institution.findOne({ email }).select('+password');
    if (!institution) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await institution.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if institution is verified
    if (!institution.verified) {
      return res.status(403).json({
        success: false,
        message: 'Institution not verified. Please wait for admin approval.'
      });
    }

    // Generate token
    const token = generateToken(institution._id);

    // Remove password from response
    institution.password = undefined;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        institution,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// @desc    Get institution profile
// @route   GET /api/institutions/profile
// @access  Private (Institution)
const getProfile = async (req, res) => {
  try {
    const institution = await Institution.findById(req.user.id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    res.json({
      success: true,
      data: { institution }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// @desc    Update institution profile
// @route   PUT /api/institutions/profile
// @access  Private (Institution)
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      place,
      district,
      mudarrisName,
      mudarrisPlace,
      mudarrisContact
    } = req.body;

    const institution = await Institution.findById(req.user.id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    // Update fields if provided
    if (name) institution.name = name;
    if (place) institution.place = place;
    if (district) institution.district = district;
    if (mudarrisName) institution.mudarrisName = mudarrisName;
    if (mudarrisPlace) institution.mudarrisPlace = mudarrisPlace;
    if (mudarrisContact) institution.mudarrisContact = mudarrisContact;

    await institution.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { institution }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};

module.exports = {
  registerInstitution,
  loginInstitution,
  getProfile,
  updateProfile
};