import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import SectionHeader from '../components/ui/SectionHeader';
import TechIcon from '../components/ui/TechIcon';
import { FiLayers } from 'react-icons/fi';
import TiltCard from '../components/fx/TiltCard';

const CATEGORY_ORDER = ['Languages', 'Frontend', 'Backend', 'Databases', 'DevOps & Tools'];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.05, delayChildren: 0.25 },
  },
};
const chipVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 15 } },
};

const Skills = () => {
  const { data: skills, loading } = useFetch('/skills', []);

  const grouped = useMemo(() => {
    const map = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, []]));
    skills.forEach((s) => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [skills]);

  return (
    <section id="skills" className="relative overflow-hidden bg-surface-alt py-24">
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 animate-drift rounded-full bg-brass/10 blur-3xl" />
      <div className="section-shell relative">
        <SectionHeader icon={FiLayers} eyebrow="Skills" title="Tools of the trade" />

        {loading && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        )}

        {!loading && skills.length === 0 && (
          <div className="mt-10">
            <EmptyState
              title="Skills coming soon"
              description="Add skills from the Admin Panel to display them here, grouped by category."
            />
          </div>
        )}

        {!loading && skills.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((category, idx) => (
              <TiltCard
                key={category}
                max={8}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                className="rounded-xl bg-surface-card p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-medium text-primary">{category}</h3>
                  <span className="font-code text-xs text-accent-brass">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {grouped[category].map((skill) => (
                    <motion.span
                      key={skill._id}
                      variants={chipVariants}
                      whileHover={{ y: -4, scale: 1.1 }}
                      className="flex cursor-default items-center gap-1.5 rounded-md border border-subtle px-3 py-1.5 text-xs text-secondary transition-all hover:border-accent-teal hover:text-accent-teal hover:shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                    >
                      <TechIcon name={skill.name} />
                      {skill.name}
                      {typeof skill.proficiency === 'number' && (
                        <span className="ml-1.5 text-accent-teal">{skill.proficiency}%</span>
                      )}
                    </motion.span>
                  ))}
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
