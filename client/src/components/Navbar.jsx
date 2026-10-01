import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Magnetic from './fx/Magnetic';
import { FiSun, FiMoon, FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
  setOpen(false);

  setTimeout(() => {
    const element = document.getElementById(id);

    if (element) {
      const navbarHeight = 65;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth',
      });
    }
  }, 100);
};
  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? 'bg-surface-nav border-b border-subtle shadow-lg shadow-black/[0.03] backdrop-blur-xl dark:shadow-black/20' : 'bg-transparent'
      }`}
    >
      <nav className="section-shell flex h-16 items-center justify-between">
        <button
          onClick={() => scrollTo('home')}
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-primary"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-signal-teal to-brass font-display text-sm font-bold text-ink-950">
            PB
          </span>
          Prem Biradar
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => scrollTo(link.id)}
                className={`relative rounded-md px-3.5 py-2 text-sm transition-colors ${
                  active === link.id ? 'text-accent-teal' : 'text-secondary hover:text-primary'
                }`}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-md bg-signal-tealDeep/10 dark:bg-signal-teal/10"
                  />
                )}
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-subtle text-secondary transition-colors hover:border-accent-teal hover:text-accent-teal"
          >
            {theme === 'dark' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
          </button>
          <Magnetic strength={0.25}>
            <button
              onClick={() => scrollTo('contact')}
              className="btn-shine flex items-center gap-1.5 rounded-md bg-accent-teal px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-95"
            >
              Let's talk <FiArrowUpRight className="h-4 w-4" />
            </button>
          </Magnetic>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center text-primary lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-subtle bg-surface lg:hidden"
          >
            <ul className="section-shell flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className={`block w-full rounded-md px-3 py-2.5 text-left text-sm ${
                      active === link.id ? 'text-accent-teal' : 'text-secondary'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="flex items-center gap-3 px-3 pt-2">
                <button
                  onClick={toggleTheme}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-subtle text-secondary"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => scrollTo('contact')}
                  className="flex items-center gap-1.5 rounded-md bg-accent-teal px-4 py-2 text-sm font-medium text-ink-950"
                >
                  Let's talk <FiArrowUpRight className="h-4 w-4" />
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
