import React from 'react';

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-ink-500/10 dark:bg-ink-700/60 ${className}`} />
);

export default Skeleton;
