require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./src/models/Student');
const Counter = require('./src/models/Counter');
const { REGISTRATION_CONFIG } = require('./src/config/constants');
const connectDB = require('./src/config/db');

// Initialize counters based on existing students
const initializeCounters = async () => {
  try {
    console.log('🔧 Initializing registration number counters...');
    
    const sections = Object.keys(REGISTRATION_CONFIG);
    
    for (const section of sections) {
      console.log(`\n📊 Processing section: ${section}`);
      
      // Find the highest registration number for this section
      const lastStudent = await Student.findOne({ section })
        .sort({ registrationNumber: -1 })
        .select('registrationNumber')
        .lean();
      
      let sequenceValue = 0;
      
      if (lastStudent) {
        // Extract numeric part from registration number (e.g., I250132 -> 250132)
        const numericPart = lastStudent.registrationNumber.replace(/^[A-Z]/, '');
        const lastNumber = parseInt(numericPart, 10);
        
        // Calculate how many students have been registered for this section
        const config = REGISTRATION_CONFIG[section];
        sequenceValue = lastNumber - config.start + 1;
        
        console.log(`   Last registration number: ${lastStudent.registrationNumber}`);
        console.log(`   Sequence value: ${sequenceValue}`);
      } else {
        console.log(`   No students found, starting from 0`);
      }
      
      // Initialize or update the counter
      await Counter.findOneAndUpdate(
        { _id: section },
        { sequence_value: sequenceValue },
        { upsert: true, new: true }
      );
      
      console.log(`   ✅ Counter initialized for ${section}`);
    }
    
    console.log('\n🎉 All counters initialized successfully!');
    
    // Verify the counters
    console.log('\n📋 Counter verification:');
    const counters = await Counter.find({}).lean();
    for (const counter of counters) {
      const config = REGISTRATION_CONFIG[counter._id];
      const nextNumber = config.start + counter.sequence_value;
      console.log(`   ${counter._id}: sequence_value=${counter.sequence_value}, next=${config.prefix}${nextNumber.toString().padStart(6, '0')}`);
    }
    
  } catch (error) {
    console.error('❌ Error initializing counters:', error);
    throw error;
  }
};

// Run the migration
const runMigration = async () => {
  try {
    await connectDB();
    await initializeCounters();
    console.log('\n✅ Migration completed successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { initializeCounters };