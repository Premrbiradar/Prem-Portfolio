import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const KEY = 'pb-intro';

// The intro plays once per browser session (add ?intro to the URL to replay).
export const shouldShowIntro = () => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.location.search.includes('intro')) return true;
  return !sessionStorage.getItem(KEY);
};

// How long the hero should wait so its entrance plays after the curtain lifts.
export const introDelay = () => (shouldShowIntro() ? 1.9 : 0);

const Preloader = () => {
  const [show, setShow] = useState(shouldShowIntro);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!show) return undefined;
    document.body.style.overflow = 'hidden';
    const startedAt = performance.now();
    const total = 1400;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - startedAt) / total);
      setCount(Math.round((1 - (1 - p) ** 3) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setShow(false), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, [show]);

  useEffect(() => {
    if (!show) {
      document.body.style.overflow = '';
      sessionStorage.setItem(KEY, '1');
    }
  }, [show]);

  const letters = 'PREM BIRADAR'.split('');

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950 text-paper-50"
        >
          <div
            className="pointer-events-none absolute -bottom-px left-0 right-0 h-24 translate-y-full rounded-b-[50%] bg-ink-950"
            aria-hidden="true"
          />
          <div className="flex overflow-hidden" aria-label="Prem Biradar">
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl font-semibold tracking-tight sm:text-6xl"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-3 font-code text-xs text-signal-teal"
          >
            full stack developer · storyteller
          </motion.p>
          <div className="absolute bottom-10 left-6 right-6 sm:left-12 sm:right-12">
            <div className="flex items-end justify-between">
              <span className="font-display text-6xl font-semibold tabular-nums text-paper-50/90 sm:text-8xl">
                {String(count).padStart(3, '0')}
              </span>
              <span className="font-code text-xs text-paper-400">loading portfolio</span>
            </div>
            <div className="mt-4 h-px w-full bg-ink-700">
              <div
                className="h-full bg-gradient-to-r from-signal-teal to-brass"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
