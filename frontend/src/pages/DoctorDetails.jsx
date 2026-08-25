import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doctorAPI } from '../services/api';
import BookingModal from '../components/BookingModal';
import {
  Star,
  Award,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  Building,
  GraduationCap,
  DollarSign,
  ChevronLeft,
} from 'lucide-react';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const res = await doctorAPI.getById(id);
        if (res.data && res.data.success) {
          setDoctor(res.data.doctor);
        }
      } catch (error) {
        console.error('Failed to load doctor profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--neutral-500)' }}>
        Loading doctor profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container-custom" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Doctor Not Found</h2>
        <p style={{ color: 'var(--neutral-500)', marginBottom: '1.5rem' }}>
          The requested doctor profile does not exist or has been removed.
        </p>
        <Link to="/doctors" className="btn btn-primary">
          Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container-custom">
        {/* Back navigation */}
        <Link
          to="/doctors"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--neutral-500)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <ChevronLeft size={18} /> Back to Doctor Directory
        </Link>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)',
            gap: '2rem',
          }}
          className="doctor-details-layout"
        >
          {/* Left Column: Doctor Profile & Biography */}
          <div>
            {/* Header Hero Card */}
            <div
              className="card-elevated"
              style={{
                padding: '2rem',
                display: 'flex',
                gap: '1.75rem',
                alignItems: 'flex-start',
                marginBottom: '1.75rem',
                flexWrap: 'wrap',
              }}
            >
              <img
                src={
                  doctor.profileImage ||
                  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
                }
                alt={doctor.name}
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'cover',
                  border: '3px solid var(--primary-100)',
                }}
              />

              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary">{doctor.specialization}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b45309', fontWeight: 700, fontSize: '0.88rem' }}>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    {doctor.rating ? doctor.rating.toFixed(1) : '4.8'}
                    <span style={{ color: 'var(--neutral-400)', fontWeight: 400 }}>({doctor.reviewsCount || 24} patient reviews)</span>
                  </div>
                </div>

                <h1 style={{ fontSize: '1.85rem', color: 'var(--neutral-900)', marginBottom: '0.4rem' }}>
                  {doctor.name}
                </h1>

                <p style={{ color: 'var(--neutral-600)', fontSize: '0.92rem', marginBottom: '0.75rem', fontWeight: 500 }}>
                  {doctor.qualifications}
                </p>

                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award size={16} color="var(--primary-500)" />
                    <strong>{doctor.experienceYears}+ Years</strong> Experience
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building size={16} color="var(--primary-500)" />
                    {doctor.hospitalName}
                  </div>
                </div>
              </div>
            </div>

            {/* About & Biography Card */}
            <div className="card-elevated" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--neutral-900)' }}>
                About {doctor.name}
              </h3>
              <p style={{ color: 'var(--neutral-700)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {doctor.bio}
              </p>

              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--neutral-800)' }}>
                Clinical Qualifications & Accreditations
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--neutral-700)', fontSize: '0.92rem' }}>
                <GraduationCap size={20} color="var(--primary-500)" />
                <span>{doctor.qualifications}</span>
              </div>
            </div>

            {/* Hospital & Practice Location */}
            <div className="card-elevated" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--neutral-900)' }}>
                Clinic Location & Timings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <MapPin size={20} color="var(--primary-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--neutral-800)' }}>{doctor.hospitalName}</strong>
                    <div style={{ color: 'var(--neutral-600)' }}>{doctor.hospitalAddress}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.5rem' }}>
                  <Clock size={20} color="var(--primary-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--neutral-800)' }}>Consultation Days</strong>
                    <div style={{ color: 'var(--neutral-600)' }}>
                      {(doctor.availableDays || []).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Booking Widget */}
          <div>
            <div
              className="card-elevated"
              style={{
                padding: '1.75rem',
                position: 'sticky',
                top: '95px',
                border: '2px solid var(--primary-100)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--neutral-200)',
                  paddingBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Consultation Fee
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                    ${doctor.fees}
                  </div>
                </div>
                <span className="badge badge-success">Accepting Appointments</span>
              </div>

              <div style={{ marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--neutral-600)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" /> Instant confirmation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" /> Free cancellation up to 2 hours prior
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" /> Digital prescription & reports included
                </div>
              </div>

              <button
                onClick={() => setBookingModalOpen(true)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem 1rem', fontSize: '1rem' }}
              >
                <Calendar size={18} /> Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          doctor={doctor}
          onClose={() => setBookingModalOpen(false)}
          onBookingSuccess={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DoctorDetails;
