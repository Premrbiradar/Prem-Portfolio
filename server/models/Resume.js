const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, default: '' },
    fileName: { type: String, default: 'Prem_Biradar_Resume.pdf' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
