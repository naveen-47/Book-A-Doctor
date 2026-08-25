import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Award, ArrowRight } from 'lucide-react';

const DoctorCard = ({ doctor, onBookClick }) => {
  return (
    <div
      className="card-elevated"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top Banner / Image Section */}
      <div style={{ position: 'relative', height: '200px', backgroundColor: '#e2e8f0' }}>
        <img
          src={doctor.profileImage || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600`}
          alt={doctor.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: '#b45309',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          {doctor.rating ? doctor.rating.toFixed(1) : '4.8'}
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
            ({doctor.reviewsCount || 24})
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'var(--primary-800)',
            color: '#ffffff',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {doctor.specialization}
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--neutral-900)',
            marginBottom: '0.35rem',
          }}
        >
          {doctor.name}
        </h3>

        <div
          style={{
            fontSize: '0.82rem',
            color: 'var(--neutral-500)',
            marginBottom: '0.75rem',
            fontWeight: 500,
          }}
        >
          {doctor.qualifications}
        </div>

        {/* Info Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
            <Award size={16} color="var(--primary-500)" style={{ flexShrink: 0 }} />
            <span>{doctor.experienceYears}+ Years Clinical Experience</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--neutral-600)' }}>
            <MapPin size={16} color="var(--primary-500)" style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {doctor.hospitalName}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--neutral-200)', margin: '0.5rem 0 1rem 0' }} />

        {/* Price and Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>
              Consultation Fee
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-600)' }}>
              ${doctor.fees}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/doctors/${doctor._id}`}
              className="btn btn-sm btn-secondary"
              title="View Profile Details"
            >
              Profile
            </Link>
            <button
              onClick={() => onBookClick(doctor)}
              className="btn btn-sm btn-primary"
            >
              <Calendar size={15} /> Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
