import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { appointmentAPI } from '../services/api';
import DocumentUploadModal from '../components/DocumentUploadModal';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Upload,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Pill,
  File,
  Eye,
  User,
  Shield,
} from 'lucide-react';

const PatientDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'

  // Document Upload Modal state
  const [activeUploadAppointment, setActiveUploadAppointment] = useState(null);

  // Prescription View Modal state
  const [viewingPrescriptionAppt, setViewingPrescriptionAppt] = useState(null);

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    gender: user?.gender || 'unspecified',
    dob: user?.dob || '',
    address: user?.address || '',
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentAPI.getPatientAppointments();
      if (res.data && res.data.success) {
        setAppointments(res.data.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (apptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await appointmentAPI.cancel(apptId, { reason: 'Cancelled by patient' });
      if (res.data && res.data.success) {
        showToast('Appointment cancelled successfully', 'info');
        fetchAppointments();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to cancel appointment', 'error');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(profileForm);
      showToast('Profile updated successfully', 'success');
      setEditingProfile(false);
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
    }
  };

  // Filtered list
  const filteredAppointments = appointments.filter((appt) => {
    if (filterTab === 'upcoming') {
      return appt.status === 'confirmed' || appt.status === 'pending';
    }
    if (filterTab === 'completed') {
      return appt.status === 'completed';
    }
    if (filterTab === 'cancelled') {
      return appt.status === 'cancelled';
    }
    return true;
  });

  const upcomingCount = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  ).length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container-custom">
        {/* Patient Profile Card */}
        <div
          className="card-elevated"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #0b3b60 0%, #056676 100%)',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    user?.name || 'Patient'
                  )}`
                }
                alt={user?.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #00a896',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h1 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>
                    {user?.name}
                  </h1>
                  <span className="badge badge-success">Patient</span>
                </div>
                <p style={{ color: '#cceeed', fontSize: '0.9rem', marginTop: '2px' }}>
                  {user?.email} • {user?.phone || 'No phone added'}
                </p>
                {user?.address && (
                  <p style={{ color: '#99deda', fontSize: '0.82rem', marginTop: '2px' }}>
                    <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> {user.address}
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="btn btn-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <User size={15} /> Edit Profile
              </button>
              <Link
                to="/doctors"
                className="btn btn-sm"
                style={{
                  background: '#02c39a',
                  color: '#082842',
                  fontWeight: 700,
                }}
              >
                <Plus size={16} /> Book Appointment
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              marginTop: '1.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              paddingTop: '1.25rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#99deda', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Bookings
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{appointments.length}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#99deda', textTransform: 'uppercase', fontWeight: 600 }}>
                Upcoming Consultations
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fef08a' }}>{upcomingCount}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#99deda', textTransform: 'uppercase', fontWeight: 600 }}>
                Completed Visits
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#bbf7d0' }}>{completedCount}</div>
            </div>
          </div>
        </div>

        {/* Profile Edit Inline Panel */}
        {editingProfile && (
          <div
            className="card-elevated"
            style={{
              padding: '1.75rem',
              marginBottom: '2rem',
              background: '#ffffff',
              border: '2px solid var(--primary-200)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Update Patient Information</h3>
            <form onSubmit={handleSaveProfile}>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                  >
                    <option value="unspecified">Unspecified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={profileForm.dob}
                    onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Residential Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123 Health Way, NY"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--neutral-200)',
            paddingBottom: '0.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                style={{
                  padding: '0.5rem 1.1rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  background: filterTab === tab ? 'var(--primary-500)' : 'transparent',
                  color: filterTab === tab ? '#ffffff' : 'var(--neutral-600)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <Link to="/doctors" className="btn btn-outline btn-sm">
            <Plus size={15} /> Find Another Doctor
          </Link>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--neutral-500)' }}>
            Loading your appointments...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div
            className="card-elevated"
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '2rem auto',
            }}
          >
            <Calendar size={48} color="var(--neutral-400)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Appointments Found</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You don't have any appointments under the '{filterTab}' filter.
            </p>
            <Link to="/doctors" className="btn btn-primary">
              Book Doctor Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredAppointments.map((appt) => {
              const doc = appt.doctor || {};
              const isPast = appt.status === 'completed' || appt.status === 'cancelled';

              return (
                <div
                  key={appt._id}
                  className="card-elevated"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}
                >
                  {/* Top Bar: Doctor info + Status Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={
                          doc.profileImage ||
                          'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
                        }
                        alt={doc.name || 'Doctor'}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                        }}
                      />
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--neutral-900)' }}>
                          {doc.name || 'Specialist Doctor'}
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                          {doc.specialization} • {doc.hospitalName}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        className={`badge ${
                          appt.status === 'completed'
                            ? 'badge-success'
                            : appt.status === 'cancelled'
                            ? 'badge-danger'
                            : 'badge-primary'
                        }`}
                        style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}
                      >
                        {appt.status === 'confirmed' && '● Confirmed'}
                        {appt.status === 'completed' && '✓ Completed'}
                        {appt.status === 'cancelled' && '✕ Cancelled'}
                        {appt.status === 'pending' && '⏳ Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Middle Bar: Date, Slot, Reason */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      background: 'var(--neutral-50)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={18} color="var(--primary-500)" />
                      <div>
                        <span style={{ color: 'var(--neutral-500)', display: 'block', fontSize: '0.75rem' }}>
                          Appointment Date
                        </span>
                        <strong>{appt.appointmentDate}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={18} color="var(--primary-500)" />
                      <div>
                        <span style={{ color: 'var(--neutral-500)', display: 'block', fontSize: '0.75rem' }}>
                          Time Slot
                        </span>
                        <strong>{appt.timeSlot}</strong>
                      </div>
                    </div>

                    <div>
                      <span style={{ color: 'var(--neutral-500)', display: 'block', fontSize: '0.75rem' }}>
                        Symptoms / Notes
                      </span>
                      <span style={{ color: 'var(--neutral-800)' }}>
                        {appt.symptoms || 'General Consultation'}
                      </span>
                    </div>
                  </div>

                  {/* Documents Section */}
                  {appt.documents && appt.documents.length > 0 && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#166534' }}>
                        <FileText size={16} />
                        <strong>{appt.documents.length} Medical Document(s) Attached:</strong>
                        <span>
                          {appt.documents.map((d) => d.fileName).join(', ')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {appt.documents.map((d, dIdx) => (
                          <a
                            key={dIdx}
                            href={d.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                          >
                            <Eye size={12} /> View {d.fileName.slice(0, 15)}...
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      borderTop: '1px solid var(--neutral-200)',
                      paddingTop: '0.75rem',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', color: 'var(--neutral-500)' }}>
                      Fee: <strong>${appt.paymentAmount}</strong> ({appt.paymentStatus})
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {/* Document Upload Button */}
                      <button
                        onClick={() => setActiveUploadAppointment(appt)}
                        className="btn btn-sm btn-secondary"
                        title="Upload medical records / tests"
                      >
                        <Upload size={14} /> Upload Lab Report
                      </button>

                      {/* Prescription view button if doctor has issued one */}
                      {appt.prescription && appt.prescription.diagnosis && (
                        <button
                          onClick={() => setViewingPrescriptionAppt(appt)}
                          className="btn btn-sm btn-success"
                        >
                          <Pill size={14} /> View Prescription
                        </button>
                      )}

                      {/* Cancel Button */}
                      {!isPast && (
                        <button
                          onClick={() => handleCancelAppointment(appt._id)}
                          className="btn btn-sm btn-danger"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Document Upload Modal */}
      {activeUploadAppointment && (
        <DocumentUploadModal
          appointment={activeUploadAppointment}
          onClose={() => setActiveUploadAppointment(null)}
          onUploadSuccess={() => {
            fetchAppointments();
            setActiveUploadAppointment(null);
          }}
        />
      )}

      {/* Prescription Viewer Modal */}
      {viewingPrescriptionAppt && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Pill size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Medical Prescription</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                    Doctor: {viewingPrescriptionAppt.doctor?.name} ({viewingPrescriptionAppt.doctor?.specialization})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingPrescriptionAppt(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div
                style={{
                  background: '#f8fafc',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  border: '1px solid var(--neutral-200)',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Diagnosis
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--neutral-900)', marginTop: '2px' }}>
                  {viewingPrescriptionAppt.prescription.diagnosis}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-700)', marginBottom: '0.4rem' }}>
                  Prescribed Medicines
                </div>
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    whiteSpace: 'pre-line',
                    fontSize: '0.92rem',
                    color: 'var(--neutral-800)',
                  }}
                >
                  {viewingPrescriptionAppt.prescription.medicines}
                </div>
              </div>

              {viewingPrescriptionAppt.prescription.advice && (
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--neutral-700)', marginBottom: '0.4rem' }}>
                    Dietary & Lifestyle Advice
                  </div>
                  <div
                    style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      fontSize: '0.88rem',
                      color: '#92400e',
                    }}
                  >
                    {viewingPrescriptionAppt.prescription.advice}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => window.print()}
                className="btn btn-secondary btn-sm"
              >
                🖨️ Print Prescription
              </button>
              <button
                onClick={() => setViewingPrescriptionAppt(null)}
                className="btn btn-primary btn-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
