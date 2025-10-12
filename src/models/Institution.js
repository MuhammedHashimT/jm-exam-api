const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  place: {
    type: String,
    required: [true, 'Place is required'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    enum: [
      "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
      "Kottayam", "Idukki", "Ernakulam", "Thrissur",
      "Palakkad", "Malappuram", "Kozhikode", "Wayanad",
      "Kannur", "Kasaragod"
    ]
  },
  mudarrisName: {
    type: String,
    required: [true, 'Mudarris name is required'],
    trim: true
  },
  mudarrisPlace: {
    type: String,
    required: [true, 'Mudarris place is required'],
    trim: true
  },
  mudarrisContact: {
    type: String,
    required: [true, 'Mudarris contact is required'],
    trim: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
institutionSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
institutionSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
institutionSchema.methods.toJSON = function() {
  const institution = this.toObject();
  delete institution.password;
  return institution;
};

module.exports = mongoose.model('Institution', institutionSchema);