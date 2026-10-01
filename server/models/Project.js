const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    technologies: [{ type: String, trim: true }],
    features: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: ['MERN', 'React', 'Node.js', 'Full Stack', 'Other'],
      default: 'MERN',
    },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
