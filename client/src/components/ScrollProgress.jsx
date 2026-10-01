import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, originX: 0 }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 bg-gradient-to-r from-signal-tealDeep via-signal-teal to-brass"
    />
  );
};

export default ScrollProgress;
