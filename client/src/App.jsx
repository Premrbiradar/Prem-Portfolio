import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Profile = lazy(() => import('./pages/admin/Profile'));
const Skills = lazy(() => import('./pages/admin/Skills'));
const Projects = lazy(() => import('./pages/admin/Projects'));
const Experience = lazy(() => import('./pages/admin/Experience'));
const Education = lazy(() => import('./pages/admin/Education'));
const Certifications = lazy(() => import('./pages/admin/Certifications'));
const Youtube = lazy(() => import('./pages/admin/Youtube'));
const Resume = lazy(() => import('./pages/admin/Resume'));
const Messages = lazy(() => import('./pages/admin/Messages'));

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
    <p className="font-display text-4xl font-semibold text-primary">404</p>
    <p className="mt-2 text-secondary">This page doesn't exist.</p>
  </div>
);

const App = () => (
  <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-surface text-secondary">Loading…</div>}>
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
    </Route>

    <Route path="/admin/login" element={<Login />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="skills" element={<Skills />} />
      <Route path="projects" element={<Projects />} />
      <Route path="experience" element={<Experience />} />
      <Route path="education" element={<Education />} />
      <Route path="certifications" element={<Certifications />} />
      <Route path="youtube" element={<Youtube />} />
      <Route path="resume" element={<Resume />} />
      <Route path="messages" element={<Messages />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
  </Suspense>
);

export default App;
