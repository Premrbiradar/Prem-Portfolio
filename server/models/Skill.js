const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Languages', 'Frontend', 'Backend', 'Databases', 'DevOps & Tools'],
    },
    proficiency: { type: Number, min: 0, max: 100, default: null }, // only shown if explicitly set
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
