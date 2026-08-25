import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import BookingModal from '../components/BookingModal';
import {
  Search,
  Calendar,
  ShieldCheck,
  Award,
  Users,
  Clock,
  ArrowRight,
  HeartPulse,
  Brain,
  Baby,
  Smile,
  Sparkles,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';

const specialtyIcons = {
  Cardiologist: HeartPulse,
  Dermatologist: Sparkles,
  Neurologist: Brain,
  Pediatrician: Baby,
  'Orthopedic Surgeon': Award,
  'General Physician': HeartPulse,
  Psychiatrist: Smile,
  Ophthalmologist: Clock,
};

const Home = () => {
  const navigate = useNavigate();
  const [topDoctors, setTopDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [docsRes, specsRes] = await Promise.all([
          doctorAPI.getTop(),
          doctorAPI.getSpecialties(),
        ]);
        if (docsRes.data && docsRes.data.success) {
          setTopDoctors(docsRes.data.doctors || []);
        }
        if (specsRes.data && specsRes.data.success) {
          setSpecialties(specsRes.data.specialties || []);
        }
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedSpecialty) params.append('specialization', selectedSpecialty);
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <div>
      {/* 1. Hero Section with Gradient Background */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0b3b60 0%, #056676 50%, #028090 100%)',
          color: '#ffffff',
          padding: '5rem 0 6rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative glow rings */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 168, 150, 0.25) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#99deda',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Sparkles size={16} /> Fast, Reliable, Verified Medical Care
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              Find and Book Top Doctors <br />
              <span style={{ color: '#02c39a' }}>In Real Time</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#cceeed',
                marginBottom: '2.5rem',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Connect with board-certified physicians, schedule instant in-clinic consultations, upload clinical reports, and manage all your healthcare in one secure portal.
            </p>

            {/* Quick Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                background: '#ffffff',
                padding: '0.75rem',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
                maxWidth: '740px',
                margin: '0 auto 2rem auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  flex: '1 1 240px',
                  padding: '0 0.75rem',
                }}
              >
                <Search size={20} color="var(--neutral-400)" />
                <input
                  type="text"
                  placeholder="Doctor name, hospital or symptom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: 'var(--neutral-800)',
                  }}
                />
              </div>

              <div
                style={{
                  borderLeft: '1px solid var(--neutral-200)',
                  flex: '1 1 200px',
                  padding: '0 0.75rem',
                }}
              >
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.92rem',
                    color: 'var(--neutral-700)',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">All Specialties</option>
                  {specialties.map((s, idx) => (
                    <option key={idx} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.75rem', borderRadius: 'var(--radius-lg)' }}
              >
                <Search size={18} /> Search Doctors
              </button>
            </form>

            {/* Platform Stats Pills */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                flexWrap: 'wrap',
                color: '#e6f7f6',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#02c39a" /> 500+ Verified Doctors
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="#02c39a" /> Zero Waiting Time
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="#02c39a" /> 100% Secure & Confidential
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Medical Specialties Grid */}
      <section style={{ padding: '4.5rem 0', background: 'var(--surface-white)' }}>
        <div className="container-custom">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                Explore Care
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--neutral-900)' }}>
                Consult by Medical Specialty
              </h2>
              <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
                Find verified specialists suited to your medical needs
              </p>
            </div>
            <Link to="/doctors" className="btn btn-outline btn-sm">
              View All Specialties <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {specialties.slice(0, 8).map((spec, idx) => {
              const IconComponent = specialtyIcons[spec.name] || HeartPulse;
              return (
                <Link
                  key={idx}
                  to={`/doctors?specialization=${encodeURIComponent(spec.name)}`}
                  className="card-elevated"
                  style={{
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: 'var(--primary-50)',
                      color: 'var(--primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                      transition: 'transform var(--transition-fast)',
                    }}
                  >
                    <IconComponent size={28} />
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '0.25rem' }}>
                    {spec.name}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                    {spec.count} Doctor{spec.count > 1 ? 's' : ''} Available
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Doctors Section */}
      <section style={{ padding: '4.5rem 0', background: 'var(--neutral-50)' }}>
        <div className="container-custom">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                Top Rated
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--neutral-900)' }}>
                Featured Medical Specialists
              </h2>
              <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
                Highly reviewed doctors ready to care for your health
              </p>
            </div>
            <Link to="/doctors" className="btn btn-outline btn-sm">
              Browse All Doctors <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--neutral-500)' }}>
              Loading top doctors...
            </div>
          ) : (
            <div className="grid-3">
              {topDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onBookClick={(doc) => setSelectedDoctorForBooking(doc)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. How It Works Timeline */}
      <section style={{ padding: '4.5rem 0', background: 'var(--surface-white)' }}>
        <div className="container-custom" style={{ textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
            Simple 3 Steps
          </span>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--neutral-900)', marginBottom: '0.75rem' }}>
            How Book a Doctor Works
          </h2>
          <p style={{ color: 'var(--neutral-500)', maxWidth: '600px', margin: '0 auto 3.5rem auto' }}>
            Experience effortless digital healthcare booking from anywhere
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            <div
              className="card-elevated"
              style={{
                padding: '2.25rem 1.75rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Search & Filter</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', lineHeight: 1.6 }}>
                Browse hundreds of verified specialists by expertise, hospital, fee range, and reviews.
              </p>
            </div>

            <div
              className="card-elevated"
              style={{
                padding: '2.25rem 1.75rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Select Time Slot</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', lineHeight: 1.6 }}>
                Check live doctor availability calendar, choose your convenient slot, and confirm instantly.
              </p>
            </div>

            <div
              className="card-elevated"
              style={{
                padding: '2.25rem 1.75rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Consult & Get Records</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--neutral-600)', lineHeight: 1.6 }}>
                Meet your doctor, upload past reports, receive digital prescriptions, and track progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Emergency Banner CTA */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0b3b60 0%, #056676 100%)',
          color: '#ffffff',
          padding: '3.5rem 0',
        }}
      >
        <div
          className="container-custom"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.4rem' }}>
              Are you a licensed medical practitioner?
            </h3>
            <p style={{ color: '#cceeed', fontSize: '0.95rem' }}>
              Join our network of healthcare specialists. Manage patient queues, issue e-prescriptions, and grow your clinic.
            </p>
          </div>
          <Link
            to="/register"
            className="btn"
            style={{
              background: '#02c39a',
              color: '#082842',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.85rem 1.85rem',
            }}
          >
            Register as Doctor <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedDoctorForBooking && (
        <BookingModal
          doctor={selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onBookingSuccess={() => setSelectedDoctorForBooking(null)}
        />
      )}
    </div>
  );
};

export default Home;
