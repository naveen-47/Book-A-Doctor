import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Activity,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  User,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react';

const Login = () => {
  const { login, quickLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');

      // Redirect based on role or previous location
      const returnUrl = location.state?.from?.pathname;
      if (returnUrl) {
        navigate(returnUrl);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      showToast(error.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    try {
      const user = await quickLogin(role);
      showToast(`Logged in as Demo ${role.toUpperCase()}`, 'success');
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/dashboard');
    } catch (error) {
      showToast('Demo login error: ' + error.message, 'error');
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e6f7f6 100%)',
      }}
    >
      <div
        className="card-elevated"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-800))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 1rem auto',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Activity size={28} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginTop: '4px' }}>
            Sign in to access your Book a Doctor portal
          </p>
        </div>

        {/* 1-Click Demo Login Helper Box */}
        <div
          style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--primary-800)',
              marginBottom: '0.6rem',
            }}
          >
            <Sparkles size={14} color="var(--primary-500)" /> Instant 1-Click Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('patient')}
              className="btn btn-sm"
              style={{
                background: '#ffffff',
                border: '1px solid var(--neutral-300)',
                color: 'var(--neutral-800)',
                fontSize: '0.78rem',
                padding: '0.4rem',
              }}
            >
              <User size={13} color="var(--primary-600)" /> Patient
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('doctor')}
              className="btn btn-sm"
              style={{
                background: '#ffffff',
                border: '1px solid var(--neutral-300)',
                color: 'var(--neutral-800)',
                fontSize: '0.78rem',
                padding: '0.4rem',
              }}
            >
              <Stethoscope size={13} color="var(--accent-teal)" /> Doctor
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="btn btn-sm"
              style={{
                background: '#ffffff',
                border: '1px solid var(--neutral-300)',
                color: 'var(--neutral-800)',
                fontSize: '0.78rem',
                padding: '0.4rem',
              }}
            >
              <ShieldCheck size={13} color="var(--accent-indigo)" /> Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color="var(--neutral-400)"
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }}
              />
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color="var(--neutral-400)"
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px' }}
              />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '1.25rem' }}
          >
            {submitting ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
