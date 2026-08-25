import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, MapPin, Heart, Shield, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#082842',
        color: '#cbd5e1',
        paddingTop: '4rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="container-custom">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--primary-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Activity size={22} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                Book<span style={{ color: 'var(--primary-500)' }}>A</span>Doctor
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Your trusted full-stack healthcare partner. Book verified specialist appointments, manage health records, and connect with top doctors instantly.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#02c39a', fontSize: '0.85rem' }}>
              <Shield size={16} /> 100% HIPAA & Data Privacy Compliant
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.25rem', fontWeight: 700 }}>
              Specialties
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/doctors?specialization=Cardiologist" style={{ color: '#94a3b8' }}>
                  Cardiology & Heart Care
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Dermatologist" style={{ color: '#94a3b8' }}>
                  Dermatology & Skin
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Neurologist" style={{ color: '#94a3b8' }}>
                  Neurology & Brain
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Pediatrician" style={{ color: '#94a3b8' }}>
                  Pediatrics & Child Care
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialization=Orthopedic Surgeon" style={{ color: '#94a3b8' }}>
                  Orthopedics & Joints
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.25rem', fontWeight: 700 }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/doctors" style={{ color: '#94a3b8' }}>
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#94a3b8' }}>
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: '#94a3b8' }}>
                  Join as Doctor
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: '#94a3b8' }}>
                  Admin Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.25rem', fontWeight: 700 }}>
              Emergency Assistance
            </h4>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f87171', marginBottom: '0.5rem', fontWeight: 700 }}>
                <Phone size={18} /> 24/7 Hotline: (800) 555-DOCTOR
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <Clock size={16} /> Open 365 Days a Year
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                <MapPin size={16} /> Medical District, NY 10021
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} Book a Doctor. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Engineered with <Heart size={14} color="#f43f5e" /> for Seamless Healthcare
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
