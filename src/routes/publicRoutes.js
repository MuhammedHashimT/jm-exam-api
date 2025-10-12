const express = require('express');
const router = express.Router();
const { KERALA_DISTRICTS, SUBJECTS, SECTIONS } = require('../config/constants');

// @route   GET /api/districts
// @desc    Get all Kerala districts
// @access  Public
router.get('/districts', (req, res) => {
  res.json({
    success: true,
    data: { districts: KERALA_DISTRICTS }
  });
});

// @route   GET /api/sections
// @desc    Get all sections
// @access  Public
router.get('/sections', (req, res) => {
  res.json({
    success: true,
    data: { sections: SECTIONS }
  });
});

// @route   GET /api/subjects
// @desc    Get all subjects by section
// @access  Public
router.get('/subjects', (req, res) => {
  res.json({
    success: true,
    data: { subjects: SUBJECTS }
  });
});

// @route   GET /api/subjects/:section
// @desc    Get subjects for a specific section
// @access  Public
router.get('/subjects/:section', (req, res) => {
  const { section } = req.params;
  
  if (!SUBJECTS[section]) {
    return res.status(400).json({
      success: false,
      message: 'Invalid section'
    });
  }

  res.json({
    success: true,
    data: {
      section,
      subjects: SUBJECTS[section]
    }
  });
});

// @route   GET /api/health
// @desc    Health check endpoint
// @access  Public
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;