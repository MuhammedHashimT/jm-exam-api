#!/usr/bin/env node

/**
 * Development Script for JM Exam Portal API
 * This script helps with database seeding and testing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Institution = require('./src/models/Institution');
const Student = require('./src/models/Student');
const Setting = require('./src/models/Setting');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Seed sample data
const seedData = async () => {
  try {
    console.log('🌱 Seeding sample data...');

    // Clear existing data
    await Institution.deleteMany({});
    await Student.deleteMany({});
    await Setting.deleteMany({});

    // Create sample settings
    await Setting.create({
      requireVerification: true,
      autoVerify: false
    });

    // Create sample institutions
    const institutions = await Institution.create([
      {
        name: 'Al-Azhar Academy',
        email: 'admin@alazhar.edu',
        password: 'password123',
        place: 'Kozhikode',
        district: 'Kozhikode',
        mudarrisName: 'Sheikh Ahmad',
        mudarrisPlace: 'Kozhikode',
        mudarrisContact: '+91 9876543210',
        verified: true
      },
      {
        name: 'Islamic Institute',
        email: 'admin@islamic.edu',
        password: 'password123',
        place: 'Malappuram',
        district: 'Malappuram',
        mudarrisName: 'Sheikh Ibrahim',
        mudarrisPlace: 'Malappuram',
        mudarrisContact: '+91 9876543211',
        verified: false
      }
    ]);

    // Create sample students
    await Student.create([
      {
        institutionId: institutions[0]._id,
        name: 'Muhammad Ali',
        place: 'Kozhikode',
        section: 'المرحلة الإبتدائية',
        subject1: { code: 'I-101', name: 'الفقه' },
        subject2: { code: 'I-102', name: 'التوحيد' }
      },
      {
        institutionId: institutions[0]._id,
        name: 'Fatima Ahmad',
        place: 'Kozhikode',
        section: 'المرحلة المتوسطة',
        subject1: { code: 'M-201', name: 'الفقه' },
        subject2: { code: 'M-202', name: 'النحو' }
      },
      {
        institutionId: institutions[1]._id,
        name: 'Ahmad Hassan',
        place: 'Malappuram',
        section: 'المرحلة العالية',
        subject1: { code: 'H-301', name: 'الحديث' },
        subject2: { code: 'H-302', name: 'البلاغة' }
      }
    ]);

    console.log('✅ Sample data seeded successfully');
    console.log('\n📝 Sample Credentials:');
    console.log('Institution 1: admin@alazhar.edu / password123 (Verified)');
    console.log('Institution 2: admin@islamic.edu / password123 (Not Verified)');
    console.log('Admin: admin@portal.com / Admin@123');
    
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};

// Clear all data
const clearData = async () => {
  try {
    console.log('🗑️ Clearing all data...');
    await Institution.deleteMany({});
    await Student.deleteMany({});
    await Setting.deleteMany({});
    console.log('✅ All data cleared');
  } catch (error) {
    console.error('❌ Clear data error:', error.message);
  }
};

// Show statistics
const showStats = async () => {
  try {
    const institutionCount = await Institution.countDocuments();
    const verifiedCount = await Institution.countDocuments({ verified: true });
    const studentCount = await Student.countDocuments();
    
    console.log('📊 Database Statistics:');
    console.log(`Institutions: ${institutionCount} (${verifiedCount} verified)`);
    console.log(`Students: ${studentCount}`);
    
    const settings = await Setting.findOne();
    if (settings) {
      console.log(`Settings: Verification ${settings.requireVerification ? 'Required' : 'Not Required'}, Auto-verify ${settings.autoVerify ? 'On' : 'Off'}`);
    }
  } catch (error) {
    console.error('❌ Stats error:', error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'seed':
      await seedData();
      break;
    case 'clear':
      await clearData();
      break;
    case 'stats':
      await showStats();
      break;
    default:
      console.log('🚀 JM Exam Portal API - Development Script');
      console.log('\nAvailable commands:');
      console.log('  node dev-script.js seed  - Seed sample data');
      console.log('  node dev-script.js clear - Clear all data');
      console.log('  node dev-script.js stats - Show database statistics');
  }
  
  mongoose.connection.close();
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { seedData, clearData, showStats };