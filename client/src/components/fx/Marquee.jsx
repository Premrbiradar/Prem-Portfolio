import React from 'react';

const TECH = [
  'React.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'TypeScript',
  'Next.js', 'Docker', 'AWS', 'GitHub Actions', 'REST APIs', 'JWT', 'Tailwind CSS',
];
const STORIES = ['History', 'Geography', 'Documentaries', 'Stories', 'Andhadoon'];

const Row = ({ items, reverse, tone }) => {
  const list = [...items, ...items, ...items, ...items];
  return (
    <div
      className="group flex overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <div
        className={`flex shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused] ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
        style={{ width: 'max-content' }}
      >
        {list.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`flex items-center gap-10 whitespace-nowrap font-display text-2xl font-medium sm:text-3xl ${
              tone === 'brass' ? 'text-accent-brass' : 'text-secondary'
            }`}
          >
            {item}
            <span className={`h-1.5 w-1.5 rounded-full ${tone === 'brass' ? 'bg-brass' : 'bg-accent-teal'}`} />
          </span>
        ))}
      </div>
    </div>
  );
};

// Two counter-scrolling rows: the developer stack, then the storyteller side.
const Marquee = () => (
  <div className="space-y-4 overflow-hidden border-y border-subtle bg-surface-alt py-8" aria-hidden="true">
    <Row items={TECH} />
    <Row items={STORIES} reverse tone="brass" />
  </div>
);

export default Marquee;
