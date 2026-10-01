const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    youtubeUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    category: {
      type: String,
      enum: ['History', 'Geography', 'Documentary', 'Informative', 'Other'],
      default: 'History',
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Extract a YouTube video ID from common URL formats, used to build thumbnail/embed URLs.
youtubeVideoSchema.methods.getVideoId = function getVideoId() {
  const match = this.youtubeUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
};

module.exports = mongoose.model('YoutubeVideo', youtubeVideoSchema);
