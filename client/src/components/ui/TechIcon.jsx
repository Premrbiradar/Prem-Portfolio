import React from 'react';
import {
  SiJavascript, SiTypescript, SiHtml5, SiCss, SiMysql,
  SiReact, SiRedux, SiReactrouter, SiTailwindcss,
  SiNodedotjs, SiExpress, SiJsonwebtokens,
  SiMongodb, SiMongoose, SiPostgresql,
  SiDocker, SiGithubactions, SiGit, SiPostman, SiJira, SiNpm, SiVite,
  SiNextdotjs,
} from 'react-icons/si';
import { FiCode, FiCloud, FiShield, FiLayers } from 'react-icons/fi';

// Maps a skill name (as stored in MongoDB) to a real brand icon. Falls back
// to a generic glyph for anything new an admin adds that isn't in the map,
// so the UI never breaks when content changes.
const MAP = {
  'javascript es6+': SiJavascript,
  javascript: SiJavascript,
  typescript: SiTypescript,
  html5: SiHtml5,
  css3: SiCss,
  sql: SiMysql,
  'react.js': SiReact,
  react: SiReact,
  'redux toolkit': SiRedux,
  'react router': SiReactrouter,
  'tailwind css': SiTailwindcss,
  'next.js': SiNextdotjs,
  'node.js': SiNodedotjs,
  'express.js': SiExpress,
  'jwt authentication': SiJsonwebtokens,
  mongodb: SiMongodb,
  mongoose: SiMongoose,
  postgresql: SiPostgresql,
  docker: SiDocker,
  'aws ec2': FiCloud,
  'aws s3': FiCloud,
  'github actions': SiGithubactions,
  git: SiGit,
  'git flow': SiGit,
  postman: SiPostman,
  jira: SiJira,
  npm: SiNpm,
  vite: SiVite,
  'restful apis': FiCode,
  authorization: FiShield,
  'mvc architecture': FiLayers,
  'schema design': FiLayers,
  'query optimization': FiLayers,
  'responsive web design': FiCode,
};

const TechIcon = ({ name, className = 'h-4 w-4' }) => {
  const Icon = MAP[name?.trim().toLowerCase()] || FiCode;
  return <Icon className={className} aria-hidden="true" />;
};

export default TechIcon;
