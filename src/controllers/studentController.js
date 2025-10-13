const Student = require('../models/Student');
const Institution = require('../models/Institution');
const { SUBJECTS, generateRegistrationNumber } = require('../config/constants');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');

// @desc    Add new student
// @route   POST /api/students/add
// @access  Private (Institution)
const addStudent = async (req, res) => {
  try {
    const { name, place, section, subject1, subject2 } = req.body;

    // Validate required fields
    if (!name || !place || !section || !subject1 || !subject2) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate section
    if (!SUBJECTS[section]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section'
      });
    }

    // Validate subjects
    const availableSubjects = SUBJECTS[section];
    const subject1Valid = availableSubjects.subject1.some(s => 
      s.code === subject1.code && s.name === subject1.name && s.category === 1
    );
    const subject2Valid = availableSubjects.subject2.some(s => 
      s.code === subject2.code && s.name === subject2.name && s.category === 2
    );

    if (!subject1Valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject1. Must select from Subject 1 category'
      });
    }

    if (!subject2Valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject2. Must select from Subject 2 category'
      });
    }

    // Check if subjects are different (still good practice)
    if (subject1.code === subject2.code) {
      return res.status(400).json({
        success: false,
        message: 'Subject 1 and Subject 2 must be different'
      });
    }

    // Generate registration number
    // Find the last registration number for this section
    const lastStudent = await Student.findOne({ section })
      .sort({ registrationNumber: -1 })
      .exec();
    
    const registrationNumber = generateRegistrationNumber(section, lastStudent?.registrationNumber);

    // Get full subject details from constants
    const selectedSubject1 = availableSubjects.subject1.find(s => s.code === subject1.code);
    const selectedSubject2 = availableSubjects.subject2.find(s => s.code === subject2.code);

    // Create new student
    const student = new Student({
      institutionId: req.user.id,
      registrationNumber,
      name,
      place,
      section,
      subject1: {
        code: selectedSubject1.code,
        name: selectedSubject1.name,
        category: selectedSubject1.category
      },
      subject2: {
        code: selectedSubject2.code,
        name: selectedSubject2.name,
        category: selectedSubject2.category
      }
    });

    await student.save();

    // Populate institution details
    await student.populate('institutionId', 'name place district');

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: { student }
    });
  } catch (error) {
    console.error('Add student error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add student'
    });
  }
};

// @desc    Get all students for institution
// @route   GET /api/students/list
// @access  Private (Institution)
const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, section, search } = req.query;
    
    const query = { institutionId: req.user.id };
    
    // Filter by section if provided
    if (section) {
      query.section = section;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { place: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('institutionId', 'name place district')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

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
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

// @desc    Get students by section
// @route   GET /api/students/list/:section
// @access  Private (Institution)
const getStudentsBySection = async (req, res) => {
  try {
    const { section } = req.params;
    const { page = 1, limit = 10, search } = req.query;

    // Validate section
    if (!SUBJECTS[section]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section'
      });
    }

    const query = { 
      institutionId: req.user.id,
      section 
    };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { place: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('institutionId', 'name place district')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      success: true,
      data: {
        students,
        section,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get students by section error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

// @desc    Export students to PDF
// @route   GET /api/students/export/pdf
// @access  Private (Institution)
const exportStudentsPDF = async (req, res) => {
  try {
    const { section } = req.query;
    
    const query = { institutionId: req.user.id };
    if (section) query.section = section;

    const students = await Student.find(query)
      .populate('institutionId', 'name place district')
      .sort({ section: 1, createdAt: -1 });

    const institution = await Institution.findById(req.user.id);

    // Create PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="students-${Date.now()}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('Student Registration Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text(`Institution: ${institution.name}`);
    doc.text(`District: ${institution.district}`);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Add table headers
    doc.fontSize(12).text('Students List:', { underline: true });
    doc.moveDown();

    students.forEach((student, index) => {
      doc.text(`${index + 1}. ${student.name}`);
      doc.text(`   Place: ${student.place}`);
      doc.text(`   Section: ${student.section}`);
      doc.text(`   Subject 1: ${student.subject1.name} (${student.subject1.code})`);
      doc.text(`   Subject 2: ${student.subject2.name} (${student.subject2.code})`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export PDF'
    });
  }
};

// @desc    Export students to Excel
// @route   GET /api/students/export/excel
// @access  Private (Institution)
const exportStudentsExcel = async (req, res) => {
  try {
    const { section } = req.query;
    
    const query = { institutionId: req.user.id };
    if (section) query.section = section;

    const students = await Student.find(query)
      .populate('institutionId', 'name place district')
      .sort({ section: 1, createdAt: -1 });

    const institution = await Institution.findById(req.user.id);

    // Prepare data for Excel
    const data = students.map((student, index) => ({
      'S.No': index + 1,
      'Student Name': student.name,
      'Place': student.place,
      'Section': student.section,
      'Subject 1 Code': student.subject1.code,
      'Subject 1 Name': student.subject1.name,
      'Subject 2 Code': student.subject2.code,
      'Subject 2 Name': student.subject2.name,
      'Registration Date': student.createdAt.toLocaleDateString()
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="students-${Date.now()}.xlsx"`);

    res.send(buffer);
  } catch (error) {
    console.error('Export Excel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export Excel'
    });
  }
};

// @desc    Get available subjects for a section
// @route   GET /api/students/subjects/:section
// @access  Private (Institution)
const getSubjectsForSection = async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects'
    });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private (Institution)
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      _id: id,
      institutionId: req.user.id // Ensure institution can only access their own students
    }).populate('institutionId', 'name place district');

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

// @desc    Edit student
// @route   PUT /api/students/:id
// @access  Private (Institution)
const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, place, section, subject1, subject2 } = req.body;

    // Find student and ensure it belongs to the current institution
    const existingStudent = await Student.findOne({
      _id: id,
      institutionId: req.user.id
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Validate section if provided
    if (section && !SUBJECTS[section]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section'
      });
    }

    // If section is being changed or subjects are being changed, validate subjects
    if (section || subject1 || subject2) {
      const studentSection = section || existingStudent.section;
      const availableSubjects = SUBJECTS[studentSection];

      if (subject1) {
        const subject1Valid = availableSubjects.subject1.some(s => 
          s.code === subject1.code && s.name === subject1.name && s.category === 1
        );
        if (!subject1Valid) {
          return res.status(400).json({
            success: false,
            message: 'Invalid subject1. Must select from Subject 1 category'
          });
        }
      }

      if (subject2) {
        const subject2Valid = availableSubjects.subject2.some(s => 
          s.code === subject2.code && s.name === subject2.name && s.category === 2
        );
        if (!subject2Valid) {
          return res.status(400).json({
            success: false,
            message: 'Invalid subject2. Must select from Subject 2 category'
          });
        }
      }

      // Check if subjects are different
      const finalSubject1 = subject1 || existingStudent.subject1;
      const finalSubject2 = subject2 || existingStudent.subject2;
      
      if (finalSubject1.code === finalSubject2.code) {
        return res.status(400).json({
          success: false,
          message: 'Subject 1 and Subject 2 must be different'
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (place) updateData.place = place;
    if (section) updateData.section = section;
    if (subject1) {
      const availableSubjects = SUBJECTS[section || existingStudent.section];
      const selectedSubject1 = availableSubjects.subject1.find(s => s.code === subject1.code);
      updateData.subject1 = {
        code: selectedSubject1.code,
        name: selectedSubject1.name,
        category: selectedSubject1.category
      };
    }
    if (subject2) {
      const availableSubjects = SUBJECTS[section || existingStudent.section];
      const selectedSubject2 = availableSubjects.subject2.find(s => s.code === subject2.code);
      updateData.subject2 = {
        code: selectedSubject2.code,
        name: selectedSubject2.name,
        category: selectedSubject2.category
      };
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('institutionId', 'name place district');

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
// @route   DELETE /api/students/:id
// @access  Private (Institution)
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find student and ensure it belongs to the current institution
    const student = await Student.findOne({
      _id: id,
      institutionId: req.user.id
    });

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

module.exports = {
  addStudent,
  getStudents,
  getStudentById,
  getStudentsBySection,
  editStudent,
  deleteStudent,
  exportStudentsPDF,
  exportStudentsExcel,
  getSubjectsForSection
};