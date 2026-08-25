import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div className="card-elevated" style={{ maxWidth: '480px', padding: '3rem 2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
          }}
        >
          <Activity size={32} />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-800)', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.35rem', margin: '0.75rem 0 0.5rem 0' }}>Page Not Found</h2>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.92rem', marginBottom: '2rem' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return Home
          </Link>
          <Link to="/doctors" className="btn btn-secondary">
            Find Doctors
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
