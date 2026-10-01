import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFolder, FiLayers, FiYoutube, FiInbox, FiAward, FiBookOpen,
  FiUser, FiFileText, FiStar, FiTrendingUp,
} from 'react-icons/fi';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';

const TONES = {
  teal: { bg: 'bg-signal-teal/10', text: 'text-signal-teal', ring: 'group-hover:shadow-signal-teal/20' },
  brass: { bg: 'bg-brass/10', text: 'text-brass', ring: 'group-hover:shadow-brass/20' },
  violet: { bg: 'bg-indigo-400/10', text: 'text-indigo-300', ring: 'group-hover:shadow-indigo-400/20' },
};

const StatCard = ({ label, value, to, icon: Icon, tone = 'teal', delay = 0 }) => {
  const t = TONES[tone];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <Link to={to} className="group block">
        <Card className={`relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${t.ring}`}>
          <div className="flex items-start justify-between">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.bg} ${t.text}`}>
              <Icon className="h-5 w-5" />
            </span>
            <FiTrendingUp className="h-4 w-4 text-paper-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="mt-4 font-display text-3xl font-semibold text-paper-50">{value}</p>
          <p className="mt-1 text-xs text-paper-400">{label}</p>
        </Card>
      </Link>
    </motion.div>
  );
};

const InfoTile = ({ label, value, icon: Icon, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
    <Card className="flex items-center gap-3 p-5">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-ink-700/60 text-paper-300">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-paper-400">{label}</p>
        <p className="truncate text-sm font-medium text-paper-50">{value}</p>
      </div>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const [state, setState] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      api.get('/projects'),
      api.get('/skills'),
      api.get('/youtube'),
      api.get('/messages'),
      api.get('/certifications'),
      api.get('/education'),
      api.get('/profile'),
      api.get('/resume'),
    ])
      .then(([projects, skills, youtube, messages, certifications, education, profile, resume]) => {
        setState({
          projects: projects.data.data,
          skills: skills.data.data,
          youtube: youtube.data.data,
          messages: messages.data.data,
          certifications: certifications.data.data,
          education: education.data.data,
          profile: profile.data.data,
          resume: resume.data.data,
        });
      })
      .catch(() => showToast('Could not load dashboard data.', 'error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  const featuredProject = state.projects.find((p) => p.featured);
  const featuredVideo = state.youtube.find((v) => v.featured);
  const unreadCount = state.messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-semibold text-paper-50"
      >
        Welcome back, {state.profile?.name?.split(' ')[0] || 'Prem'} 👋
      </motion.h2>
      <p className="mt-1 text-sm text-paper-400">Here's what's live on your portfolio right now.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Projects" value={state.projects.length} to="/admin/projects" icon={FiFolder} tone="teal" delay={0.02} />
        <StatCard label="Total Skills" value={state.skills.length} to="/admin/skills" icon={FiLayers} tone="violet" delay={0.06} />
        <StatCard label="YouTube Videos" value={state.youtube.length} to="/admin/youtube" icon={FiYoutube} tone="brass" delay={0.1} />
        <StatCard
          label={`Messages${unreadCount ? ` · ${unreadCount} new` : ''}`}
          value={state.messages.length}
          to="/admin/messages"
          icon={FiInbox}
          tone="teal"
          delay={0.14}
        />
        <StatCard label="Certifications" value={state.certifications.length} to="/admin/certifications" icon={FiAward} tone="violet" delay={0.18} />
        <StatCard label="Education Entries" value={state.education.length} to="/admin/education" icon={FiBookOpen} tone="brass" delay={0.22} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoTile label="Current Profile" value={`${state.profile?.name} — ${state.profile?.title}`} icon={FiUser} delay={0.26} />
        <InfoTile label="Current Resume" value={state.resume ? state.resume.fileName : 'Not uploaded'} icon={FiFileText} delay={0.3} />
        <InfoTile label="Featured Project" value={featuredProject ? featuredProject.title : 'None set'} icon={FiStar} delay={0.34} />
        <InfoTile label="Featured YouTube Video" value={featuredVideo ? featuredVideo.title : 'None set'} icon={FiStar} delay={0.38} />
      </div>
    </div>
  );
};

export default Dashboard;
