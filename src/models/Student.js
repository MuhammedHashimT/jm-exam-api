const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: [true, 'Institution ID is required']
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  place: {
    type: String,
    required: [true, 'Place is required'],
    trim: true
  },
  registrationNumber: {
    type: String,
    unique: true,
    required: [true, 'Registration number is required']
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    enum: ['المرحلة الإبتدائية', 'المرحلة المتوسطة', 'المرحلة العالية']
  },
  subject1: {
    code: {
      type: String,
      required: [true, 'Subject 1 code is required']
    },
    name: {
      type: String,
      required: [true, 'Subject 1 name is required']
    },
    category: {
      type: Number,
      required: [true, 'Subject 1 category is required'],
      enum: [1]
    },
    examTime: {
      type: String,
      required: [true, 'Subject 1 exam time is required']
    }
  },
  subject2: {
    code: {
      type: String,
      required: [true, 'Subject 2 code is required']
    },
    name: {
      type: String,
      required: [true, 'Subject 2 name is required']
    },
    category: {
      type: Number,
      required: [true, 'Subject 2 category is required'],
      enum: [2]
    },
    examTime: {
      type: String,
      required: [true, 'Subject 2 exam time is required']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
studentSchema.index({ institutionId: 1, section: 1 });
studentSchema.index({ 'subject1.code': 1, 'subject2.code': 1 });
studentSchema.index({ registrationNumber: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);