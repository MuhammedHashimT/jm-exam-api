const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  requireVerification: {
    type: Boolean,
    default: true
  },
  autoVerify: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one settings document exists
settingSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

settingSchema.statics.updateSettings = async function(updates) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updates);
  } else {
    Object.assign(settings, updates);
    settings.updatedAt = new Date();
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('Setting', settingSchema);