const express = require('express');
const router = express.Router();
const {
  addStudent,
  getStudents,
  getStudentById,
  getStudentsBySection,
  editStudent,
  deleteStudent,
  exportStudentsPDF,
  exportStudentsExcel,
  getSubjectsForSection
} = require('../controllers/studentController');
const { institutionAuth } = require('../middleware/authMiddleware');

// @route   POST /api/students/add
// @desc    Add new student
// @access  Private (Institution)
router.post('/add', institutionAuth, addStudent);

// @route   GET /api/students/list
// @desc    Get all students for institution
// @access  Private (Institution)
router.get('/list', institutionAuth, getStudents);

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private (Institution)
router.get('/:id', institutionAuth, getStudentById);

// @route   PUT /api/students/:id
// @desc    Edit student
// @access  Private (Institution)
router.put('/:id', institutionAuth, editStudent);

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private (Institution)
router.delete('/:id', institutionAuth, deleteStudent);

// @route   GET /api/students/list/:section
// @desc    Get students by section
// @access  Private (Institution)
router.get('/list/:section', institutionAuth, getStudentsBySection);

// @route   GET /api/students/export/pdf
// @desc    Export students to PDF
// @access  Private (Institution)
router.get('/export/pdf', institutionAuth, exportStudentsPDF);

// @route   GET /api/students/export/excel
// @desc    Export students to Excel
// @access  Private (Institution)
router.get('/export/excel', institutionAuth, exportStudentsExcel);

// @route   GET /api/students/subjects/:section
// @desc    Get available subjects for a section
// @access  Private (Institution)
router.get('/subjects/:section', institutionAuth, getSubjectsForSection);

module.exports = router;