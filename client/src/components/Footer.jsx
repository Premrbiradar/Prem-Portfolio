import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiLinkedin, FiGithub, FiYoutube, FiMail, FiArrowUp } from 'react-icons/fi';
import Magnetic from './fx/Magnetic';

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'contact', label: 'Contact' },
];

const SOCIAL_ICON = { linkedin: FiLinkedin, github: FiGithub, youtube: FiYoutube, email: FiMail };

const Footer = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get('/profile')
      .then(({ data }) => setProfile(data.data))
      .catch(() => {});
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const socials = [
    profile?.linkedin && { key: 'linkedin', href: profile.linkedin },
    profile?.github && { key: 'github', href: profile.github },
    profile?.youtube && { key: 'youtube', href: profile.youtube },
    profile?.email && { key: 'email', href: `mailto:${profile.email}` },
  ].filter(Boolean);

  return (
    <footer className="relative border-t border-subtle bg-surface-alt">
      <div className="section-shell grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5 font-display text-lg text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-signal-teal to-brass text-sm font-bold text-ink-950">
              PB
            </span>
            Prem Rajpal Biradar
          </div>
          <p className="mt-2 text-sm text-secondary">Full Stack Developer</p>
          <p className="mt-4 max-w-sm text-sm text-secondary">
            Building digital experiences and exploring stories beyond code.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map((s) => {
                const Icon = SOCIAL_ICON[s.key];
                return (
                  <Magnetic key={s.key} strength={0.5}>
                    <a
                      href={s.href}
                      target={s.key === 'email' ? undefined : '_blank'}
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-subtle text-secondary transition-all hover:border-accent-teal hover:text-accent-teal hover:shadow-[0_0_18px_rgba(34,211,238,0.3)]"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Magnetic>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-primary">Navigate</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => scrollTo(l.id)}
                  className="text-sm text-secondary transition-colors hover:text-accent-teal"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-primary">Connect</p>
          <ul className="space-y-2 text-sm">
            {profile?.linkedin && (
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-secondary hover:text-accent-teal">
                  LinkedIn
                </a>
              </li>
            )}
            {profile?.github && (
              <li>
                <a href={profile.github} target="_blank" rel="noreferrer" className="text-secondary hover:text-accent-teal">
                  GitHub
                </a>
              </li>
            )}
            {profile?.youtube && (
              <li>
                <a href={profile.youtube} target="_blank" rel="noreferrer" className="text-secondary hover:text-accent-teal">
                  YouTube
                </a>
              </li>
            )}
            {profile?.email && (
              <li>
                <a href={`mailto:${profile.email}`} className="text-secondary hover:text-accent-teal">
                  {profile.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-subtle py-6">
        <div className="section-shell flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-secondary">© 2026 Prem Rajpal Biradar. All Rights Reserved.</p>
          <Magnetic strength={0.4}>
            <button
              onClick={() => scrollTo('home')}
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-subtle text-secondary transition-colors hover:border-accent-teal hover:text-accent-teal"
            >
              <FiArrowUp className="h-4 w-4" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
