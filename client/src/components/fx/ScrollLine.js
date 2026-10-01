import { useRef } from 'react';
import { useScroll, useSpring } from 'framer-motion';

// Drives a timeline line that "draws" itself as the section scrolls into view.
export const useScrollLine = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return { ref, scaleY };
};

export default useScrollLine;
