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

// @desc    Bulk approve institutions
// @route   PUT /api/admin/institutions/bulk/approve
// @access  Private (Admin)
const bulkApproveInstitutions = async (req, res) => {
  try {
    const { institutionIds } = req.body;

    // Validate input
    if (!institutionIds || !Array.isArray(institutionIds) || institutionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Institution IDs array is required'
      });
    }

    // Validate all IDs are valid MongoDB ObjectIds
    const mongoose = require('mongoose');
    const invalidIds = institutionIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid institution ID(s) provided',
        invalidIds
      });
    }

    // Update all institutions
    const result = await Institution.updateMany(
      { _id: { $in: institutionIds } },
      { $set: { verified: true } }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} institution(s) approved successfully`,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk approve institutions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve institutions'
    });
  }
};

// @desc    Bulk decline institutions
// @route   PUT /api/admin/institutions/bulk/decline
// @access  Private (Admin)
const bulkDeclineInstitutions = async (req, res) => {
  try {
    const { institutionIds } = req.body;

    // Validate input
    if (!institutionIds || !Array.isArray(institutionIds) || institutionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Institution IDs array is required'
      });
    }

    // Validate all IDs are valid MongoDB ObjectIds
    const mongoose = require('mongoose');
    const invalidIds = institutionIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid institution ID(s) provided',
        invalidIds
      });
    }

    // Update all institutions
    const result = await Institution.updateMany(
      { _id: { $in: institutionIds } },
      { $set: { verified: false } }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} institution(s) declined successfully`,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk decline institutions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to decline institutions'
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
      institutionId,
      institutionName,
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

    // Filter by institution ID if provided
    if (institutionId) {
      try {
        matchStage.institutionId = require('mongoose').Types.ObjectId(institutionId);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Invalid institution ID format'
        });
      }
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

    // Filter by institution name or district after population
    const postMatchStage = {};

    if (institutionName) {
      postMatchStage['institution.name'] = { $regex: institutionName, $options: 'i' };
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

// @desc    Edit institution
// @route   PUT /api/admin/institutions/:id
// @access  Private (Admin)
const editInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Find the institution first
    const institution = await Institution.findById(id).select('+password');

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    // Handle password update separately if provided
    let passwordUpdated = false;
    if (updateData.password) {
      if (updateData.password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }
      institution.password = updateData.password;
      passwordUpdated = true;
      delete updateData.password; // Remove from updateData to handle separately
    }

    // Update other fields
    Object.keys(updateData).forEach(key => {
      institution[key] = updateData[key];
    });

    // Save the institution (this will trigger password hashing if password was changed)
    await institution.save();

    // Remove password from response
    institution.password = undefined;

    res.json({
      success: true,
      message: passwordUpdated ? 'Institution and password updated successfully' : 'Institution updated successfully',
      data: { institution }
    });
  } catch (error) {
    console.error('Edit institution error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update institution'
    });
  }
};

// @desc    Delete institution
// @route   DELETE /api/admin/institutions/:id
// @access  Private (Admin)
const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if institution exists
    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    // Check if institution has students
    const studentCount = await Student.countDocuments({ institutionId: id });
    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete institution. It has ${studentCount} registered students. Please delete or transfer students first.`
      });
    }

    // Delete the institution
    await Institution.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Institution deleted successfully'
    });
  } catch (error) {
    console.error('Delete institution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete institution'
    });
  }
};

// @desc    Edit student
// @route   PUT /api/admin/students/:id
// @access  Private (Admin)
const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.registrationNumber; // Registration number should not be changed

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('institutionId', 'name district');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: { student }
    });
  } catch (error) {
    console.error('Edit student error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update student'
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Delete the student
    await Student.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student'
    });
  }
};

// @desc    Get single institution
// @route   GET /api/admin/institutions/:id
// @access  Private (Admin)
const getInstitutionById = async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      });
    }

    // Get student count for this institution
    const studentCount = await Student.countDocuments({ institutionId: id });

    res.json({
      success: true,
      data: {
        institution: {
          ...institution.toObject(),
          studentCount
        }
      }
    });
  } catch (error) {
    console.error('Get institution by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch institution'
    });
  }
};

// @desc    Get single student
// @route   GET /api/admin/students/:id
// @access  Private (Admin)
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate('institutionId', 'name district place');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: { student }
    });
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student'
    });
  }
};

module.exports = {
  loginAdmin,
  getInstitutions,
  getInstitutionById,
  verifyInstitution,
  declineInstitution,
  bulkApproveInstitutions,
  bulkDeclineInstitutions,
  editInstitution,
  deleteInstitution,
  getAllStudents,
  getStudentById,
  editStudent,
  deleteStudent,
  getDashboardStats,
  updateSettings,
  getSettings
};