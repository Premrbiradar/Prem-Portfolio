import React from 'react';

// A fixed, full-viewport backdrop of slowly drifting colour fields plus a
// faint grain, sitting behind every section on the public site so the whole
// page feels alive, not just the hero. Extremely low opacity by design.
const AuroraBackground = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface">
    <div className="absolute -left-1/4 -top-1/4 h-[60vw] w-[60vw] animate-aurora rounded-full bg-signal-teal/10 blur-[120px] dark:bg-signal-teal/[0.08]" />
    <div className="absolute -right-1/4 top-1/3 h-[55vw] w-[55vw] animate-aurora-slow rounded-full bg-brass/10 blur-[120px] dark:bg-brass/[0.07]" />
    <div className="absolute bottom-[-20%] left-1/3 h-[50vw] w-[50vw] animate-aurora rounded-full bg-indigo-500/10 blur-[130px] dark:bg-indigo-500/[0.06]" />
    <div className="absolute inset-0 bg-noise opacity-[0.025] mix-blend-overlay dark:opacity-[0.04]" />
  </div>
);

export default AuroraBackground;
