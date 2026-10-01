import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFinePointer } from '../../hooks/useFinePointer';

/**
 * 3D tilt toward the cursor, plus a spotlight and a glare that follow the
 * pointer. Extra props (initial, whileInView, variants, layout...) pass
 * straight through to the underlying motion.div.
 */
const TiltCard = ({
  children,
  className = '',
  max = 9,
  scale = 1.02,
  glow = 'rgba(34,211,238,0.16)',
  glare = true,
  ...rest
}) => {
  const ref = useRef(null);
  const enabled = useFinePointer();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 190, damping: 18 });
  const sy = useSpring(y, { stiffness: 190, damping: 18 });
  const sh = useSpring(hover, { stiffness: 200, damping: 24 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const spot = useMotionTemplate`radial-gradient(380px circle at ${gx} ${gy}, ${glow}, transparent 62%)`;
  const shine = useMotionTemplate`radial-gradient(200px circle at ${gx} ${gy}, rgba(255,255,255,0.22), transparent 65%)`;

  const onMove = (e) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  const onEnter = () => enabled && hover.set(1);
  const onLeave = () => {
    x.set(0.5);
    y.set(0.5);
    hover.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={enabled ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      whileHover={enabled ? { scale } : undefined}
      className={`relative ${className}`}
      {...rest}
    >
      {children}
      {enabled && (
        <>
          <motion.div
            aria-hidden="true"
            style={{ background: spot, opacity: sh }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
          />
          {glare && (
            <motion.div
              aria-hidden="true"
              style={{ background: shine, opacity: sh, mixBlendMode: 'overlay' }}
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default TiltCard;
