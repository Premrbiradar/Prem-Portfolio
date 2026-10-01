import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import SectionHeader from '../components/ui/SectionHeader';
import { FiFolder } from 'react-icons/fi';
import TiltCard from '../components/fx/TiltCard';

const FILTERS = ['All', 'MERN', 'React', 'Node.js', 'Full Stack', 'Other'];

const ProjectCard = ({ project, index }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 60, scale: 0.94 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-60px' }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
  >
    <TiltCard max={7} className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface-card">
      <div className="relative aspect-video w-full overflow-hidden bg-ink-500/10">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-signal-teal/10 to-brass/10 font-code text-sm text-secondary transition-transform duration-700 group-hover:scale-110">
            {'</>'} {project.category}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-medium text-primary">{project.title}</h3>
          {project.featured && <Badge tone="brass">Featured</Badge>}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-secondary">{project.description}</p>

        {project.technologies?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="rounded-md border border-subtle px-2 py-0.5 text-xs text-secondary transition-colors hover:border-accent-teal hover:text-accent-teal"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {project.features?.length > 0 && (
          <ul className="mt-4 space-y-1 text-xs text-secondary">
            {project.features.slice(0, 4).map((f, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent-teal" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex gap-4 pt-1">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-accent-teal transition-transform hover:translate-x-1"
            >
              GitHub →
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-accent-brass transition-transform hover:translate-x-1"
            >
              Live Demo →
            </a>
          )}
        </div>
      </div>
    </TiltCard>
  </motion.div>
);

const Projects = () => {
  const { data: projects, loading } = useFetch('/projects', []);
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter]
  );

  return (
    <section id="projects" className="relative overflow-hidden bg-surface-alt py-24">
      <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 animate-drift rounded-full bg-signal-teal/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader icon={FiFolder} eyebrow="Projects" title="Things I've built" />

          {projects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`relative rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    filter === f ? 'border-transparent text-accent-teal' : 'border-subtle text-secondary hover:text-primary'
                  }`}
                >
                  {filter === f && (
                    <motion.span
                      layoutId="project-filter-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full border border-accent-teal bg-signal-tealDeep/10 dark:bg-signal-teal/10"
                    />
                  )}
                  <span className="relative">{f}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="mt-10">
            <EmptyState
              title="Projects coming soon"
              description="Add your first project from the Admin Panel, it will appear here instantly."
            />
          </div>
        )}

        {!loading && projects.length > 0 && (
          <motion.div layout className="mt-12 grid gap-8 sm:grid-cols-2">
            <AnimatePresence>
              {filtered.map((project, i) => (
                <ProjectCard key={project._id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
