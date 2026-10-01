import React from 'react';
import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';

const LINES = [
  { prompt: true, text: 'git commit -m "ship feature"', tone: 'text-paper-200' },
  { text: '[main] 3 files changed, 128 insertions(+)', tone: 'text-paper-400' },
  { prompt: true, text: 'deploy --env production', tone: 'text-paper-200' },
  { text: 'Build complete. Live in 4.2s.', tone: 'text-paper-400' },
  { prompt: true, text: 'open --channel andhadoon', tone: 'text-paper-200' },
  { text: 'Loading next story', tone: 'text-brass', caret: true },
];

const POINTS = [
  [10, 150],
  [110, 120],
  [210, 90],
  [310, 130],
];

// Terminal types itself out, then a hand-drawn route line draws across a map
// motif and the brand statement resolves word by word out of a blur.
const CodeToStories = () => {
  const { data: profile } = useFetch('/profile', null);
  const statement =
    profile?.brandStatement || 'I build digital products by day and tell stories through documentaries beyond code.';

  return (
    <section className="relative overflow-hidden bg-ink-950 py-28">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 animate-drift rounded-full bg-signal-teal/15 blur-3xl" />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 animate-drift rounded-full bg-brass/20 blur-3xl"
        style={{ animationDelay: '-6s' }}
      />

      <div className="section-shell relative grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -60, rotateY: 18 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1000 }}
          className="rounded-xl border border-ink-700 bg-ink-900 p-6 font-code text-xs text-paper-200 shadow-2xl shadow-signal-teal/5 sm:text-sm"
        >
          <div className="mb-4 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          {LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.55 }}
              className={`${line.tone} ${line.prompt ? 'mt-3' : 'mt-1'}`}
            >
              {line.prompt && <span className="mr-2 text-signal-teal">$</span>}
              {line.text}
              {line.caret && <span className="animate-blink">_</span>}
            </motion.p>
          ))}
        </motion.div>

        <div>
          <svg viewBox="0 0 320 200" className="w-full text-brass/80" fill="none" strokeLinecap="round">
            <path d="M0 40h320M0 70h320M0 170h320" stroke="currentColor" strokeWidth="1" opacity="0.15" />
            <motion.path
              d="M10 150 Q 60 80 110 120 T 210 90 T 310 130"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="4 6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 2.6, delay: 0.3, ease: 'easeInOut' }}
            />
            {POINTS.map(([cx, cy], i) => (
              <g key={i}>
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="currentColor"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.5 + i * 0.7 }}
                />
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: [1, 3.4], opacity: [0.7, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 1 + i * 0.5, ease: 'easeOut' }}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
              </g>
            ))}
          </svg>
          <p aria-label={statement} className="mt-3 font-editorial text-2xl italic leading-snug text-paper-50 sm:text-3xl lg:text-4xl">
            {statement.split(' ').map((w, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.09 }}
                className="mr-[0.28em] inline-block"
              >
                {w}
              </motion.span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CodeToStories;
