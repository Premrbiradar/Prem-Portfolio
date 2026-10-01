import React from 'react';
import { motion } from 'framer-motion';

// Icon badge + eyebrow fade in, each title word rises out of a mask, and a
// flowing gradient line draws underneath.
const SectionHeader = ({ eyebrow, title, icon: Icon }) => (
  <div>
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2.5"
    >
      {Icon && (
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent-teal/40 bg-signal-tealDeep/10 text-accent-teal dark:bg-signal-teal/10">
          <Icon className="h-3.5 w-3.5" />
        </span>
      )}
      <span className="text-sm text-accent-teal">{eyebrow}</span>
    </motion.div>
    <h2
  aria-label={title}
  className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl lg:text-5xl"
>
  {title.split(' ').map((word, i) => (
    <span
      key={i}
      aria-hidden="true"
      className="mr-[0.25em] inline-block pb-1 align-bottom"
    >
      <motion.span
        className="inline-block"
        initial={{ y: '115%', opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{
          duration: 0.75,
          delay: 0.07 * i,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {word}
      </motion.span>
    </span>
  ))}
</h2>
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      style={{ originX: 0 }}
      className="bg-flow mt-4 block h-0.5 w-20 rounded-full"
    />
  </div>
);

export default SectionHeader;
