import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// True only on devices with a real mouse/trackpad and when the user hasn't
// asked for reduced motion. Hover-driven effects (tilt, cursor, magnetic)
// switch themselves off on touch screens.
export const useFinePointer = () => {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return fine && !reduce;
};

export default useFinePointer;
