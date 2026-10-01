import React from 'react';

const tones = {
  teal: 'border-accent-teal text-accent-teal bg-signal-tealDeep/10 dark:bg-signal-teal/10',
  brass: 'border-brass-dark/40 dark:border-brass/40 text-accent-brass bg-brass/10',
  neutral: 'border-subtle text-secondary bg-ink-500/5',
};

const Badge = ({ tone = 'neutral', children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
