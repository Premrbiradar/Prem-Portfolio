import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiUser, FiLayers, FiFolder, FiBriefcase, FiBookOpen,
  FiAward, FiYoutube, FiFileText, FiInbox, FiLogOut, FiMenu, FiX, FiExternalLink,
} from 'react-icons/fi';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true, icon: FiGrid },
  { to: '/admin/profile', label: 'Profile', icon: FiUser },
  { to: '/admin/skills', label: 'Skills', icon: FiLayers },
  { to: '/admin/projects', label: 'Projects', icon: FiFolder },
  { to: '/admin/experience', label: 'Experience', icon: FiBriefcase },
  { to: '/admin/education', label: 'Education', icon: FiBookOpen },
  { to: '/admin/certifications', label: 'Certifications', icon: FiAward },
  { to: '/admin/youtube', label: 'YouTube', icon: FiYoutube },
  { to: '/admin/resume', label: 'Resume', icon: FiFileText },
  { to: '/admin/messages', label: 'Messages', icon: FiInbox },
];

// The Admin Panel always renders in the dark palette, independent of the
// public site's light/dark toggle, since it's a working tool rather than a
// themeable public page.
const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="dark relative flex min-h-screen bg-ink-950 text-paper-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 animate-aurora rounded-full bg-signal-teal/[0.06] blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 animate-aurora-slow rounded-full bg-brass/[0.06] blur-[120px]" />
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto border-r border-ink-700/60 bg-ink-900/95 p-5 backdrop-blur-xl transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-signal-teal to-brass font-display text-sm font-bold text-ink-950">
              PB
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-paper-50">Admin Panel</p>
              <p className="truncate text-[11px] text-paper-400">{admin?.email}</p>
            </div>
          </div>
          <button aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="text-paper-400 lg:hidden">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive ? 'text-signal-teal' : 'text-paper-300 hover:bg-ink-800 hover:text-paper-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="admin-nav-active"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-signal-teal/10"
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="admin-nav-bar"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-signal-teal to-brass"
                      />
                    )}
                    <Icon className="relative h-4 w-4 flex-shrink-0" />
                    <span className="relative">{link.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 space-y-1 border-t border-ink-700/60 pt-5">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-paper-400 hover:bg-ink-800 hover:text-paper-50"
          >
            <FiExternalLink className="h-4 w-4" /> View public site
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10"
          >
            <FiLogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-ink-950/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex h-14 items-center gap-4 border-b border-ink-700/60 bg-ink-900/80 px-5 backdrop-blur lg:hidden">
          <button aria-label="Open menu" onClick={() => setSidebarOpen(true)} className="text-paper-100">
            <FiMenu className="h-5 w-5" />
          </button>
          <p className="font-display text-sm font-medium text-paper-50">Admin Panel</p>
        </div>
        <main className="p-5 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
