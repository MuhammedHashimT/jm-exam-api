const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Institution = require('../models/Institution');
const Student = require('../models/Student');
const Setting = require('../models/Setting');

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@portal.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

// Generate JWT token
const generateToken = (id, type = 'admin') => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken('admin');

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: {
          email: ADMIN_EMAIL,
          type: 'admin'
        },
        token
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// @desc    Get all institutions
// @route   GET /api/admin/institutions
// @access  Private (Admin)
const getInstitutions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      district, 
      verified,
      mudarris 
    } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { place: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by district
    if (district) {
      query.district = district;
    }

    // Filter by verification status
    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    // Filter by mudarris name
    if (mudarris) {
      query.mudarrisName = { $regex: mudarris, $options: 'i' };
    }

    const institutions = await Institution.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Institution.countDocuments(query);

    // Get student counts for each institution
    const institutionsWithCounts = await Promise.all(
      institutions.map(async (institution) => {
        const studentCount = await Student.countDocuments({ 
          institutionId: institution._id 
        });
        return {
          ...institution.toObject(),
          studentCount
        };
      })
    );

    res.json({
      success: true,
      data: {
        institutions: institutionsWithCounts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get institutions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch institutions'
    });
  }
};

// @desc    Verify institution
// @route   PUT /api/admin/institutions/:id/verify
// @access  Private (Admin)
const verifyInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    institution.verified = true;
    await institution.save();

    res.json({
      success: true,
      message: 'Institution verified successfully',
      data: { institution }
    });
  } catch (error) {
    console.error('Verify institution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify institution'
    });
  }
};

// @desc    Decline institution
// @route   PUT /api/admin/institutions/:id/decline
// @access  Private (Admin)
const declineInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    institution.verified = false;
    await institution.save();

    res.json({
      success: true,
      message: 'Institution verification declined',
      data: { institution }
    });
  } catch (error) {
    console.error('Decline institution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to decline institution'
    });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      institution,
      district,
      section,
      subject1,
      subject2
    } = req.query;

    // Build aggregation pipeline
    const pipeline = [];

    // Match stage for filtering
    const matchStage = {};

    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: 'i' } },
        { place: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (section) {
      matchStage.section = section;
    }

    if (subject1) {
      matchStage['subject1.code'] = subject1;
    }

    if (subject2) {
      matchStage['subject2.code'] = subject2;
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Populate institution details
    pipeline.push({
      $lookup: {
        from: 'institutions',
        localField: 'institutionId',
        foreignField: '_id',
        as: 'institution'
      }
    });

    pipeline.push({
      $unwind: '$institution'
    });

    // Filter by institution or district after population
    const postMatchStage = {};

    if (institution) {
      postMatchStage['institution.name'] = { $regex: institution, $options: 'i' };
    }

    if (district) {
      postMatchStage['institution.district'] = district;
    }

    if (Object.keys(postMatchStage).length > 0) {
      pipeline.push({ $match: postMatchStage });
    }

    // Sort
    pipeline.push({ $sort: { createdAt: -1 } });

    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Student.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Add pagination
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: parseInt(limit) });

    const students = await Student.aggregate(pipeline);

    res.json({
      success: true,
      data: {
        students,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalInstitutions = await Institution.countDocuments();
    const verifiedInstitutions = await Institution.countDocuments({ verified: true });
    const pendingInstitutions = await Institution.countDocuments({ verified: false });
    const totalStudents = await Student.countDocuments();

    // Get students by section
    const studentsBySection = await Student.aggregate([
      {
        $group: {
          _id: '$section',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get institutions by district
    const institutionsByDistrict = await Institution.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get recent registrations
    const recentInstitutions = await Institution.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name district verified createdAt');

    res.json({
      success: true,
      data: {
        statistics: {
          totalInstitutions,
          verifiedInstitutions,
          pendingInstitutions,
          totalStudents
        },
        studentsBySection,
        institutionsByDistrict,
        recentInstitutions
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
const updateSettings = async (req, res) => {
  try {
    const { requireVerification, autoVerify } = req.body;

    const updates = {};
    if (typeof requireVerification === 'boolean') {
      updates.requireVerification = requireVerification;
    }
    if (typeof autoVerify === 'boolean') {
      updates.autoVerify = autoVerify;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid settings provided'
      });
    }

    const settings = await Setting.updateSettings(updates);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
const getSettings = async (req, res) => {
  try {
    const settings = await Setting.getSettings();

    res.json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
};

module.exports = {
  loginAdmin,
  getInstitutions,
  verifyInstitution,
  declineInstitution,
  getAllStudents,
  getDashboardStats,
  updateSettings,
  getSettings
};