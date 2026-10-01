const mongoose = require('mongoose');

// Singleton document holding all editable "about me" content.
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Prem Rajpal Biradar' },
    title: { type: String, default: 'Full Stack Developer' },
    secondaryTitle: { type: String, default: 'MERN Stack Developer' },
    headline: {
      type: String,
      default:
        'Full Stack Developer | MERN Stack | React.js | Node.js | Express.js | MongoDB | Next.js | REST APIs | TypeScript',
    },
    heroIntro: {
      type: String,
      default:
        'I build scalable, responsive and production-ready web applications using modern JavaScript technologies, while also creating informative historical, geographical and documentary content on YouTube.',
    },
    about: {
      type: String,
      default:
        'Prem Biradar is a Full Stack Developer with hands-on experience building scalable and responsive web applications using the MERN stack, Next.js, TypeScript and SQL databases. He specializes in React.js, Node.js, Express.js, MongoDB, PostgreSQL, REST APIs, JWT authentication, role-based authorization, database design, API development, performance optimization, Docker and AWS.',
    },
    brandStatement: {
      type: String,
      default:
        'I build digital products by day and tell stories through documentaries beyond code.',
    },
    currentRoleNote: {
      type: String,
      default: 'Currently working as a Software Engineer at SoftGrid Info Pvt. Ltd.',
    },
    location: { type: String, default: 'Pune, Maharashtra, India' },
    email: { type: String, default: 'premrb2001@gmail.com' },
    phone: { type: String, default: '+91-9834624603' },
    linkedin: { type: String, default: 'https://www.linkedin.com/in/prembiradar' },
    github: { type: String, default: '' },
    youtube: { type: String, default: 'https://www.youtube.com/@Andhadoon' },
    youtubeChannelName: { type: String, default: 'Andhadoon' },
    youtubeTagline: { type: String, default: 'History • Geography • Documentaries • Stories' },
    profilePhotoUrl: { type: String, default: '' },
    profilePhotoPublicId: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
