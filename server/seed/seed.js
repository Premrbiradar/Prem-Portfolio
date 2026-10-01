/**
 * Seeds the database with the real content from Prem's resume so the site
 * has meaningful content on first run. Safe to re-run: it only creates the
 * admin user and reference collections if they are currently empty, so it
 * will never overwrite edits made later from the Admin Panel.
 *
 * Usage: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certification = require('../models/Certification');

const skills = [
  // Languages
  { name: 'JavaScript ES6+', category: 'Languages', order: 1 },
  { name: 'TypeScript', category: 'Languages', order: 2 },
  { name: 'HTML5', category: 'Languages', order: 3 },
  { name: 'CSS3', category: 'Languages', order: 4 },
  { name: 'SQL', category: 'Languages', order: 5 },
  // Frontend
  { name: 'React.js', category: 'Frontend', order: 1 },
  { name: 'Redux Toolkit', category: 'Frontend', order: 2 },
  { name: 'React Router', category: 'Frontend', order: 3 },
  { name: 'Tailwind CSS', category: 'Frontend', order: 4 },
  { name: 'Responsive Web Design', category: 'Frontend', order: 5 },
  // Backend
  { name: 'Node.js', category: 'Backend', order: 1 },
  { name: 'Express.js', category: 'Backend', order: 2 },
  { name: 'RESTful APIs', category: 'Backend', order: 3 },
  { name: 'JWT Authentication', category: 'Backend', order: 4 },
  { name: 'Authorization', category: 'Backend', order: 5 },
  { name: 'MVC Architecture', category: 'Backend', order: 6 },
  // Databases
  { name: 'MongoDB', category: 'Databases', order: 1 },
  { name: 'Mongoose', category: 'Databases', order: 2 },
  { name: 'PostgreSQL', category: 'Databases', order: 3 },
  { name: 'Schema Design', category: 'Databases', order: 4 },
  { name: 'Query Optimization', category: 'Databases', order: 5 },
  // DevOps & Tools
  { name: 'Docker', category: 'DevOps & Tools', order: 1 },
  { name: 'AWS EC2', category: 'DevOps & Tools', order: 2 },
  { name: 'AWS S3', category: 'DevOps & Tools', order: 3 },
  { name: 'GitHub Actions', category: 'DevOps & Tools', order: 4 },
  { name: 'Git', category: 'DevOps & Tools', order: 5 },
  { name: 'Git Flow', category: 'DevOps & Tools', order: 6 },
  { name: 'Postman', category: 'DevOps & Tools', order: 7 },
  { name: 'Jira', category: 'DevOps & Tools', order: 8 },
  { name: 'npm', category: 'DevOps & Tools', order: 9 },
  { name: 'Vite', category: 'DevOps & Tools', order: 10 },
];

const experience = [
  {
    company: 'SoftGrid Info Pvt. Ltd.',
    position: 'Software Engineer / Full Stack Developer',
    location: 'Pune, India',
    startDate: 'May 2025',
    endDate: 'Present',
    order: 1,
    responsibilities: [
      'Developed and maintained full-stack web applications using MERN stack and modern JavaScript.',
      'Developed RESTful APIs using Node.js and Express.js.',
      'Built reusable React.js components.',
      'Implemented JWT authentication and role-based access control.',
      'Designed MongoDB and PostgreSQL database structures.',
      'Optimized database queries and API performance.',
      'Worked with Docker.',
      'Assisted with AWS EC2 and S3 deployment.',
      'Collaborated with developers, QA engineers and UI/UX teams in an Agile/Scrum environment.',
    ],
  },
  {
    company: 'The Skybrisk',
    position: 'Web Development Intern',
    location: 'Pune, India',
    startDate: 'January 2026',
    endDate: 'June 2026',
    order: 2,
    responsibilities: [
      'Developed full-stack applications using MERN.',
      'Built Node.js/Express REST APIs.',
      'Created responsive React.js and Tailwind CSS interfaces.',
      'Implemented JWT authentication.',
      'Worked with MongoDB and PostgreSQL.',
      'Used Git, Docker and AWS EC2/S3.',
    ],
  },
];

const education = [
  {
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Anantrao Pawar College of Engineering & Research, Pune',
    startYear: '2023',
    endYear: '2025',
    grade: 'CGPA: 7.11 / 10',
    order: 1,
  },
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Dr. D. Y. Patil Arts, Commerce & Science College, Pune',
    startYear: '2019',
    endYear: '2022',
    grade: 'CGPA: 8.25 / 10',
    order: 2,
  },
];

const certifications = [
  {
    title: 'Coding: Development & Advanced Engineering',
    issuer: 'Accenture North America',
    date: 'April 2025',
    order: 1,
  },
  {
    title: '2-Day Generative AI Mastermind',
    issuer: 'Outskill',
    date: 'April 2026',
    order: 2,
  },
];

const projects = [
  {
    title: 'Technical Spark — Ed-Tech Learning Platform',
    category: 'MERN',
    description:
      'A MERN-based ed-tech platform offering IT and cybersecurity courses, blogs and career-support resources.',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'AWS', 'GitHub Actions'],
    features: [
      'Course content',
      'Blog',
      'Career resources',
      'Resume templates',
      'Interview preparation',
      'JWT authentication',
      'Role-based access control',
      'REST APIs',
      'AWS deployment',
      'GitHub Actions CI/CD',
    ],
    featured: true,
    order: 1,
  },
  {
    title: 'Vimal Transformers — Transformer Repair Service Website',
    category: 'Full Stack',
    description: 'A full-stack business website designed for transformer repair services.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    features: [
      'Responsive React interface',
      'Service showcase',
      'Customer inquiries',
      'Service requests',
      'Booking APIs',
      'MongoDB data storage',
    ],
    featured: false,
    order: 2,
  },
];

const run = async () => {
  await connectDB();

  // --- Admin user ---
  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL?.toLowerCase() });
  if (!existingAdmin) {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin creation.');
    } else {
      await User.create({
        name: process.env.ADMIN_NAME || 'Prem Rajpal Biradar',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log(`Admin account created for ${process.env.ADMIN_EMAIL}`);
    }
  } else {
    console.log('Admin account already exists — skipping.');
  }

  // --- Profile (singleton) ---
  const profileCount = await Profile.countDocuments();
  if (profileCount === 0) {
    await Profile.create({});
    console.log('Profile document created with default values.');
  }

  // --- Reference collections: only seed if empty, never overwrite edits ---
  const seedIfEmpty = async (Model, data, label) => {
    const count = await Model.countDocuments();
    if (count === 0) {
      await Model.insertMany(data);
      console.log(`Seeded ${data.length} ${label}.`);
    } else {
      console.log(`${label} already has data — skipping.`);
    }
  };

  await seedIfEmpty(Skill, skills, 'skills');
  await seedIfEmpty(Experience, experience, 'experience entries');
  await seedIfEmpty(Education, education, 'education entries');
  await seedIfEmpty(Certification, certifications, 'certifications');
  await seedIfEmpty(Project, projects, 'projects');

  console.log('Seed complete. YouTube videos and the resume PDF are added from the Admin Panel.');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
