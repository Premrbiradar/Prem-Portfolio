import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '../../hooks/useFinePointer';

// A lagging ring that grows over clickable things, plus a soft light that
// trails the pointer across the page. Native cursor stays visible.
const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"]';

const CustomCursor = () => {
  const enabled = useFinePointer();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });
  const gx = useSpring(x, { stiffness: 70, damping: 20 });
  const gy = useSpring(y, { stiffness: 70, damping: 20 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e) => setHovering(Boolean(e.target.closest?.(INTERACTIVE)));
    const leave = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{
          x: gx,
          y: gy,
          background:
            'radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(251,146,60,0.06) 40%, transparent 70%)',
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-30 -ml-[260px] -mt-[260px] h-[520px] w-[520px] rounded-full"
      />
      <motion.div
        aria-hidden="true"
        style={{ x: rx, y: ry }}
        className="pointer-events-none fixed left-0 top-0 z-[60] -ml-4 -mt-4 h-8 w-8"
      >
        <motion.div
          animate={{
            scale: hovering ? 1.9 : pressed ? 0.7 : 1,
            opacity: visible ? 1 : 0,
            backgroundColor: hovering ? 'rgba(34,211,238,0.16)' : 'rgba(34,211,238,0)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="h-full w-full rounded-full border border-signal-teal/80"
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
