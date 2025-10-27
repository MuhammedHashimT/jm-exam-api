const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Student = require('../src/models/Student');
const Counter = require('../src/models/Counter');
const { REGISTRATION_CONFIG } = require('../src/config/constants');

const reconcile = async () => {
  try {
    await connectDB();

    for (const section of Object.keys(REGISTRATION_CONFIG)) {
      console.log(`Processing section: ${section}`);
      const config = REGISTRATION_CONFIG[section];

      // Aggregate to find max numeric part of registrationNumber for this section
      const agg = await Student.aggregate([
        { $match: { section } },
        { $project: { num: { $toInt: { $substr: ["$registrationNumber", 1, 6] } } } },
        { $group: { _id: null, maxNum: { $max: "$num" } } }
      ]).allowDiskUse(true);

      let desiredSequence = 0;

      if (agg && agg.length > 0 && agg[0].maxNum) {
        const lastNumber = agg[0].maxNum;
        desiredSequence = lastNumber - config.start + 1;
      }

      desiredSequence = Math.max(0, desiredSequence);

      await Counter.findOneAndUpdate(
        { _id: section },
        { $max: { sequence_value: desiredSequence } },
        { upsert: true }
      );

      console.log(`Set counter for ${section} to at least ${desiredSequence}`);
    }

    console.log('Reconciliation complete.');
    process.exit(0);
  } catch (error) {
    console.error('Reconciliation error:', error);
    process.exit(1);
  }
};

reconcile();
