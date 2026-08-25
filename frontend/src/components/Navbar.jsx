import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Activity,
  Calendar,
  User,
  ShieldCheck,
  Stethoscope,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, quickLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleQuickLogin = async (role) => {
    try {
      await quickLogin(role);
      showToast(`Logged in as ${role.toUpperCase()}`, 'success');
      setDemoMenuOpen(false);
      if (role === 'admin') navigate('/admin');
      else if (role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/dashboard');
    } catch (error) {
      showToast('Quick login failed: ' + error.message, 'error');
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'doctor') return '/doctor/dashboard';
    return '/dashboard';
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--neutral-200)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div
        className="container-custom"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-800))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 168, 150, 0.3)',
            }}
          >
            <Activity size={24} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--primary-800)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Book<span style={{ color: 'var(--primary-500)' }}>A</span>Doctor
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: 'var(--neutral-500)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Healthcare Portal
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          <Link
            to="/"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: location.pathname === '/' ? 'var(--primary-600)' : 'var(--neutral-600)',
              borderBottom: location.pathname === '/' ? '2px solid var(--primary-500)' : 'none',
              paddingBottom: '4px',
            }}
          >
            Home
          </Link>
          <Link
            to="/doctors"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: location.pathname === '/doctors' ? 'var(--primary-600)' : 'var(--neutral-600)',
              borderBottom: location.pathname === '/doctors' ? '2px solid var(--primary-500)' : 'none',
              paddingBottom: '4px',
            }}
          >
            Find Doctors
          </Link>

          {/* Quick 1-Click Demo Login Selector */}
          {!user && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="btn btn-sm btn-secondary"
                style={{
                  background: '#f0fdfa',
                  borderColor: '#99deda',
                  color: 'var(--primary-700)',
                  fontSize: '0.82rem',
                }}
              >
                <Sparkles size={14} color="var(--primary-500)" />
                Demo 1-Click Login
              </button>

              {demoMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--neutral-200)',
                    padding: '0.5rem',
                    width: '210px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <button
                    onClick={() => handleQuickLogin('patient')}
                    className="btn btn-sm"
                    style={{
                      justifyContent: 'flex-start',
                      background: '#f8fafc',
                      color: 'var(--neutral-800)',
                    }}
                  >
                    <User size={14} color="var(--primary-500)" />
                    Patient (Alex)
                  </button>
                  <button
                    onClick={() => handleQuickLogin('doctor')}
                    className="btn btn-sm"
                    style={{
                      justifyContent: 'flex-start',
                      background: '#f8fafc',
                      color: 'var(--neutral-800)',
                    }}
                  >
                    <Stethoscope size={14} color="var(--accent-teal)" />
                    Doctor (Dr. Sophia)
                  </button>
                  <button
                    onClick={() => handleQuickLogin('admin')}
                    className="btn btn-sm"
                    style={{
                      justifyContent: 'flex-start',
                      background: '#f8fafc',
                      color: 'var(--neutral-800)',
                    }}
                  >
                    <ShieldCheck size={14} color="var(--accent-indigo)" />
                    Admin (Sarah)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Auth Buttons or Profile Menu */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to={getDashboardLink()} className="btn btn-sm btn-primary">
                {user.role === 'admin' && <ShieldCheck size={16} />}
                {user.role === 'doctor' && <Stethoscope size={16} />}
                {user.role === 'patient' && <Calendar size={16} />}
                {user.role === 'admin'
                  ? 'Admin Portal'
                  : user.role === 'doctor'
                  ? 'Doctor Dashboard'
                  : 'My Appointments'}
              </Link>

              {/* User Avatar & Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--neutral-100)',
                }}
              >
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      user.name
                    )}`
                  }
                  alt={user.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--primary-500)',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--neutral-800)',
                    maxWidth: '120px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.name.split(' ')[0]}
                </span>
                <span
                  className={`badge ${
                    user.role === 'admin'
                      ? 'badge-danger'
                      : user.role === 'doctor'
                      ? 'badge-primary'
                      : 'badge-success'
                  }`}
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                >
                  {user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-sm btn-secondary"
                title="Logout"
                style={{ padding: '0.45rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--neutral-800)',
            cursor: 'pointer',
            display: 'none',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid var(--neutral-200)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--neutral-800)' }}
          >
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--neutral-800)' }}
          >
            Find Doctors
          </Link>
          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Go to Dashboard ({user.role})
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
