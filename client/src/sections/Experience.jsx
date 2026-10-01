import React from 'react';
import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import SectionHeader from '../components/ui/SectionHeader';
import { FiBriefcase } from 'react-icons/fi';
import TiltCard from '../components/fx/TiltCard';
import useScrollLine from '../components/fx/ScrollLine';

const listParent = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } };
const listItem = { hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } };

const smallCard = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Experience = () => {
  const { data: experience, loading: loadingExp } = useFetch('/experience', []);
  const { data: education, loading: loadingEdu } = useFetch('/education', []);
  const { data: certifications, loading: loadingCert } = useFetch('/certifications', []);
  const { ref: lineRef, scaleY } = useScrollLine();

  return (
    <section id="experience" className="relative overflow-hidden bg-surface py-24">
      <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 animate-drift rounded-full bg-signal-teal/10 blur-3xl" />
      <div className="section-shell relative">
        <SectionHeader icon={FiBriefcase} eyebrow="Experience" title="Where I've worked" />

        {loadingExp && (
          <div className="mt-10 space-y-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        )}

        {!loadingExp && experience.length === 0 && (
          <div className="mt-10">
            <EmptyState title="No experience listed yet" description="Add roles from the Admin Panel." />
          </div>
        )}

        {!loadingExp && experience.length > 0 && (
          <div ref={lineRef} className="relative mt-14 pl-10">
            <div className="absolute bottom-2 left-[9px] top-2 w-px bg-ink-500/20 dark:bg-paper-400/20" />
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="absolute bottom-2 left-[9px] top-2 w-0.5 -translate-x-[0.5px] bg-gradient-to-b from-signal-tealDeep via-signal-tealDim to-brass shadow-[0_0_12px_rgba(34,211,238,0.6)]"
            />
            <ol className="space-y-10">
              {experience.map((exp) => (
                <li key={exp._id} className="relative">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                    className="absolute -left-10 top-8 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-teal bg-surface"
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-teal" />
                  </motion.span>
                  <TiltCard
                    max={4}
                    scale={1.01}
                    variants={{
                      hidden: { opacity: 0, x: -50 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                    }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="rounded-xl bg-surface-card p-6"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-medium text-primary">{exp.position}</h3>
                      <span className="rounded-full border border-subtle px-3 py-1 font-code text-xs text-accent-brass">
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-accent-teal">
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ''}
                    </p>
                    {exp.responsibilities?.length > 0 && (
                      <motion.ul variants={listParent} className="mt-4 space-y-1.5 text-sm text-secondary">
                        {exp.responsibilities.map((r, idx) => (
                          <motion.li key={idx} variants={listItem} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-accent-teal" />
                            <span>{r}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </TiltCard>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-24 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-xl font-medium text-primary">Education</h3>
            {loadingEdu && <Skeleton className="mt-5 h-24" />}
            {!loadingEdu && education.length === 0 && (
              <p className="mt-4 text-sm text-secondary">Add education entries from the Admin Panel.</p>
            )}
            <div className="mt-5 space-y-4">
              {education.map((edu) => (
                <TiltCard
                  key={edu._id}
                  max={6}
                  variants={smallCard}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="rounded-xl bg-surface-card p-5"
                >
                  <p className="font-display text-sm font-medium text-primary">{edu.degree}</p>
                  <p className="mt-1 text-sm text-secondary">{edu.institution}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-secondary">
                    <span>
                      {edu.startYear} – {edu.endYear}
                    </span>
                    {edu.grade && <span className="text-accent-brass">{edu.grade}</span>}
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl font-medium text-primary">Certifications</h3>
            {loadingCert && <Skeleton className="mt-5 h-24" />}
            {!loadingCert && certifications.length === 0 && (
              <p className="mt-4 text-sm text-secondary">Add certifications from the Admin Panel.</p>
            )}
            <div className="mt-5 space-y-4">
              {certifications.map((cert) => (
                <TiltCard
                  key={cert._id}
                  max={6}
                  variants={smallCard}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-40px' }}
                  className="rounded-xl bg-surface-card p-5"
                >
                  <p className="font-display text-sm font-medium text-primary">{cert.title}</p>
                  <p className="mt-1 text-sm text-secondary">{cert.issuer}</p>
                  <p className="mt-2 text-xs text-accent-brass">{cert.date}</p>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
