import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789<>/{}[]=+*#';

// "Decodes" text from random characters into the final string. The invisible
// copy reserves the final size so the layout never jumps.
const ScrambleText = ({ text, className = '', delay = 300, duration = 1100 }) => {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(reduce ? text : '');

  useEffect(() => {
    if (reduce) {
      setOut(text);
      return undefined;
    }
    let raf = 0;
    let start = 0;
    const timer = setTimeout(() => {
      const tick = (now) => {
        if (!start) start = now;
        const p = Math.min(1, (now - start) / duration);
        const reveal = Math.floor(p * text.length);
        let s = '';
        for (let i = 0; i < text.length; i += 1) {
          const ch = text[i];
          s += ch === ' ' || i < reveal ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setOut(s);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text, reduce, delay, duration]);

  return (
    <span className={`relative inline-block ${className}`} aria-label={text}>
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0 whitespace-nowrap" aria-hidden="true">
        {out}
      </span>
    </span>
  );
};

export default ScrambleText;
