import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Activity,
  User,
  Stethoscope,
  Mail,
  Lock,
  Phone,
  Building,
  GraduationCap,
  DollarSign,
  Award,
  ArrowRight,
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [submitting, setSubmitting] = useState(false);

  // Common form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('unspecified');

  // Doctor specific fields
  const [specialization, setSpecialization] = useState('General Physician');
  const [qualifications, setQualifications] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [fees, setFees] = useState('60');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        email,
        password,
        role,
        phone,
        gender,
      };

      if (role === 'doctor') {
        payload.specialization = specialization;
        payload.qualifications = qualifications || 'MBBS, MD';
        payload.experienceYears = Number(experienceYears);
        payload.fees = Number(fees);
        payload.hospitalName = hospitalName || 'General Health Hospital';
        payload.hospitalAddress = hospitalAddress || '100 Medical Center Way, NY';
      }

      const user = await register(payload);
      showToast(`Welcome, ${user.name}! Your account is created.`, 'success');

      if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
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
          maxWidth: role === 'doctor' ? '680px' : '480px',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-xl)',
          transition: 'max-width var(--transition-normal)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-800))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 0.75rem auto',
            }}
          >
            <Activity size={26} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--neutral-900)' }}>
            Create Your Account
          </h2>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginTop: '2px' }}>
            Join Book a Doctor for modern, hassle-free healthcare
          </p>
        </div>

        {/* Role Toggle */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--neutral-100)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem',
          }}
        >
          <button
            type="button"
            onClick={() => setRole('patient')}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              background: role === 'patient' ? '#ffffff' : 'transparent',
              color: role === 'patient' ? 'var(--primary-700)' : 'var(--neutral-600)',
              boxShadow: role === 'patient' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            <User size={16} /> I am a Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              background: role === 'doctor' ? '#ffffff' : 'transparent',
              color: role === 'doctor' ? 'var(--primary-700)' : 'var(--neutral-600)',
              boxShadow: role === 'doctor' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Stethoscope size={16} /> I am a Doctor
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className={role === 'doctor' ? 'grid-2' : ''}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder={role === 'doctor' ? 'Dr. John Doe' : 'Jane Smith'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={role === 'doctor' ? 'grid-2' : ''}>
            <div className="form-group">
              <label className="form-label">Password (min 6 characters)</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Additional Doctor Fields */}
          {role === 'doctor' && (
            <div
              style={{
                borderTop: '1px solid var(--neutral-200)',
                paddingTop: '1.25rem',
                marginTop: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-800)', marginBottom: '1rem' }}>
                Professional Medical Credentials
              </h4>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Medical Specialization</label>
                  <select
                    className="form-select"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  >
                    <option value="Cardiologist">Cardiologist (Heart)</option>
                    <option value="Dermatologist">Dermatologist (Skin)</option>
                    <option value="Neurologist">Neurologist (Brain/Nerves)</option>
                    <option value="Pediatrician">Pediatrician (Children)</option>
                    <option value="Orthopedic Surgeon">Orthopedic Surgeon (Bones/Joints)</option>
                    <option value="General Physician">General Physician (Family Care)</option>
                    <option value="Psychiatrist">Psychiatrist (Mental Health)</option>
                    <option value="Ophthalmologist">Ophthalmologist (Eye Care)</option>
                    <option value="Dentist">Dentist (Oral Care)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Qualifications</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. MBBS, MD, FACC"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Fee ($)</label>
                  <input
                    type="number"
                    min="10"
                    className="form-control"
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hospital / Clinic Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. City Specialty Hospital, Suite 400"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.75rem', marginBottom: '1.25rem' }}
          >
            {submitting ? 'Creating Account...' : `Register as ${role === 'doctor' ? 'Doctor' : 'Patient'}`} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
