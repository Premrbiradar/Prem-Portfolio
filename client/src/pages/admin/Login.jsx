import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const { admin, login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  if (!loading && admin) {
    return <Navigate to={location.state?.from || '/admin'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid email or password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-96 w-96 animate-aurora rounded-full bg-signal-teal/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 animate-aurora-slow rounded-full bg-brass/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            color: 'rgba(148,163,184,0.25)',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-signal-teal to-brass font-display text-lg font-bold text-ink-950 shadow-lg shadow-signal-teal/20">
            PB
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-paper-50">Admin Login</h1>
          <p className="mt-1 text-sm text-paper-400">Sign in to manage the portfolio.</p>
        </div>

        <div className="rounded-2xl border border-ink-700/60 bg-ink-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3.5 top-[38px] h-4 w-4 text-paper-400" />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="pl-10"
              />
            </div>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-[38px] h-4 w-4 text-paper-400" />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Signing in…' : (
                <>
                  Sign In <FiArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
