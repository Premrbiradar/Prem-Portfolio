import React from 'react';
import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import SectionHeader from '../components/ui/SectionHeader';
import { FiUser, FiCompass } from 'react-icons/fi';
import TiltCard from '../components/fx/TiltCard';
import useScrollLine from '../components/fx/ScrollLine';
import defaultPhoto from '../assets/profile-secondary.jpg';

const INFO_CARDS = ['Full Stack Developer', 'MERN Stack', 'Pune, India', 'Software Engineer', 'YouTube Creator'];

const JOURNEY = [
  { label: 'BCA', detail: 'Dr. D. Y. Patil Arts, Commerce & Science College' },
  { label: 'MCA', detail: 'Anantrao Pawar College of Engineering & Research' },
  { label: 'MERN / Full Stack Development', detail: 'Self-driven specialization' },
  { label: 'Web Development Internship', detail: 'The Skybrisk' },
  { label: 'Software Engineer', detail: 'SoftGrid Info Pvt. Ltd.' },
  { label: 'Current Journey', detail: 'Full stack development, ongoing' },
];

const chipsParent = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
const chip = {
  hidden: { opacity: 0, scale: 0.6, y: 14 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 16 } },
};

const About = () => {
  const { data: profile } = useFetch('/profile', null);
  const { ref: lineRef, scaleY } = useScrollLine();

  return (
    <section id="about" className="relative overflow-hidden bg-surface py-24">
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 animate-drift rounded-full bg-signal-teal/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -3 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-xs lg:max-w-sm"
          >
            <TiltCard max={12} className="group overflow-hidden rounded-2xl bg-surface-card p-2">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={profile?.profilePhotoUrl || defaultPhoto}
                  alt="Prem Biradar"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover object-[50%_25%] transition duration-700 group-hover:scale-110 group-hover:saturate-[1.15]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </TiltCard>
          </motion.div>

          <div>
            <SectionHeader icon={FiUser} eyebrow="About" title="What I do" />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-prose text-base leading-relaxed text-secondary"
            >
              {profile?.about}
            </motion.p>
            {profile?.currentRoleNote && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-sm font-medium text-accent-brass"
              >
                {profile.currentRoleNote}
              </motion.p>
            )}

            <motion.div
              variants={chipsParent}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="mt-7 flex flex-wrap gap-2.5"
            >
              {INFO_CARDS.map((label) => (
                <motion.span
                  key={label}
                  variants={chip}
                  whileHover={{ y: -4, scale: 1.06 }}
                  className="cursor-default rounded-full bg-surface-card px-4 py-2 text-sm text-primary transition-shadow hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                >
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="mt-28">
          <SectionHeader icon={FiCompass} eyebrow="Developer Journey" title="From classroom to codebase" />

          <div ref={lineRef} className="relative mt-14 pl-10">
            <div className="absolute bottom-2 left-[9px] top-2 w-px bg-ink-500/20 dark:bg-paper-400/20" />
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="absolute bottom-2 left-[9px] top-2 w-0.5 -translate-x-[0.5px] bg-gradient-to-b from-signal-tealDeep via-signal-tealDim to-brass shadow-[0_0_12px_rgba(34,211,238,0.6)]"
            />
            <ol className="space-y-10">
              {JOURNEY.map((step, i) => (
                <motion.li
                  key={step.label}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 6 }}
                  className="relative"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}
                    className="absolute -left-10 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-teal bg-surface"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-teal" />
                  </motion.span>
                  <p className="font-code text-xs text-accent-brass">{String(i + 1).padStart(2, '0')}</p>
                  <p className="font-display text-lg font-medium text-primary">{step.label}</p>
                  <p className="text-sm text-secondary">{step.detail}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
