import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { appointmentAPI, doctorAPI } from '../services/api';
import PrescriptionModal from '../components/PrescriptionModal';
import {
  Stethoscope,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileEdit,
  DollarSign,
  Building,
  Eye,
  FileText,
  User,
  Settings,
  Star,
  Activity,
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'pending', 'completed'

  // Prescription Modal State
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState(null);

  // Doctor Settings Modal State
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    fees: 50,
    hospitalName: '',
    hospitalAddress: '',
    bio: '',
    specialization: '',
  });

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const res = await appointmentAPI.getDoctorAppointments();
      if (res.data && res.data.success) {
        setAppointments(res.data.appointments || []);
        if (res.data.doctor) {
          setDoctorProfile(res.data.doctor);
          setSettingsForm({
            fees: res.data.doctor.fees || 50,
            hospitalName: res.data.doctor.hospitalName || '',
            hospitalAddress: res.data.doctor.hospitalAddress || '',
            bio: res.data.doctor.bio || '',
            specialization: res.data.doctor.specialization || 'General Physician',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching doctor dashboard:', error);
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      const res = await appointmentAPI.updateStatus(apptId, { status: newStatus });
      if (res.data && res.data.success) {
        showToast(`Appointment status updated to ${newStatus}`, 'success');
        fetchDoctorData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await doctorAPI.updateProfile(settingsForm);
      if (res.data && res.data.success) {
        showToast('Doctor profile settings updated successfully', 'success');
        setDoctorProfile(res.data.doctor);
        setEditingSettings(false);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update settings', 'error');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === 'today') return appt.appointmentDate === todayStr;
    if (filter === 'pending') return appt.status === 'pending' || appt.status === 'confirmed';
    if (filter === 'completed') return appt.status === 'completed';
    return true;
  });

  const todayAppointmentsCount = appointments.filter((a) => a.appointmentDate === todayStr).length;
  const pendingCount = appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const totalRevenue = appointments
    .filter((a) => a.status === 'completed' || a.status === 'confirmed')
    .reduce((acc, curr) => acc + (curr.paymentAmount || 0), 0);

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container-custom">
        {/* Doctor Header Banner */}
        <div
          className="card-elevated"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #082842 0%, #0b3b60 60%, #028090 100%)',
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
                  doctorProfile?.profileImage ||
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
                }
                alt={doctorProfile?.name || user?.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '3px solid #00a896',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>
                    {doctorProfile?.name || user?.name}
                  </h1>
                  <span className="badge badge-primary" style={{ background: '#00a896', color: '#ffffff', border: 'none' }}>
                    {doctorProfile?.specialization || 'Doctor'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fde047', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Star size={15} fill="#fde047" color="#fde047" /> {doctorProfile?.rating || '4.9'}
                  </div>
                </div>
                <p style={{ color: '#cceeed', fontSize: '0.9rem', marginTop: '3px' }}>
                  {doctorProfile?.hospitalName} • Fee: ${doctorProfile?.fees} per consultation
                </p>
                <div style={{ color: '#99deda', fontSize: '0.82rem', marginTop: '2px' }}>
                  {user?.email} • {doctorProfile?.qualifications}
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditingSettings(!editingSettings)}
              className="btn btn-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Settings size={15} /> Clinic Settings & Fees
            </button>
          </div>

          {/* Metric Tiles */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              marginTop: '1.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              paddingTop: '1.25rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#99deda', textTransform: 'uppercase', fontWeight: 600 }}>
                Today's Patients
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fef08a' }}>
                {todayAppointmentsCount}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#99deda', textTransform: 'uppercase', fontWeight: 600 }}>
                Active / Pending
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{pendingCount}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#99deda', textTransform: 'uppercase', fontWeight: 600 }}>
                Completed Visits
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#bbf7d0' }}>
                {completedCount}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#99deda', textTransform: 'uppercase', fontWeight: 600 }}>
                Consultation Earnings
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#02c39a' }}>
                ${totalRevenue}
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Settings Editor Panel */}
        {editingSettings && (
          <div
            className="card-elevated"
            style={{
              padding: '1.75rem',
              marginBottom: '2rem',
              background: '#ffffff',
              border: '2px solid var(--primary-200)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Edit Doctor Practice Profile</h3>
            <form onSubmit={handleSaveSettings}>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settingsForm.specialization}
                    onChange={(e) => setSettingsForm({ ...settingsForm, specialization: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee ($)</label>
                  <input
                    type="number"
                    min="10"
                    className="form-control"
                    value={settingsForm.fees}
                    onChange={(e) => setSettingsForm({ ...settingsForm, fees: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hospital / Clinic Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settingsForm.hospitalName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hospitalName: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Practice Bio & Background</label>
                <textarea
                  rows="3"
                  className="form-control"
                  value={settingsForm.bio}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingSettings(false)}
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

        {/* Filter Navigation Tabs */}
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
            {[
              { key: 'all', label: 'All Patients' },
              { key: 'today', label: `Today's Queue (${todayAppointmentsCount})` },
              { key: 'pending', label: 'Active / Pending' },
              { key: 'completed', label: 'Completed Visits' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: '0.5rem 1.1rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  background: filter === tab.key ? 'var(--primary-500)' : 'transparent',
                  color: filter === tab.key ? '#ffffff' : 'var(--neutral-600)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '0.88rem', color: 'var(--neutral-500)' }}>
            Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Patient Appointment Queue List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--neutral-500)' }}>
            Loading patient schedule...
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
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Appointments in this Queue</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
              You currently have no scheduled appointments under this filter.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredAppointments.map((appt) => {
              const patient = appt.patient || {};
              const isToday = appt.appointmentDate === todayStr;

              return (
                <div
                  key={appt._id}
                  className="card-elevated"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    borderLeft: isToday ? '4px solid var(--accent-amber)' : '1px solid var(--neutral-200)',
                  }}
                >
                  {/* Top Bar: Patient Details & Status */}
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
                          patient.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                            patient.name || 'Patient'
                          )}`
                        }
                        alt={patient.name || 'Patient'}
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--neutral-900)' }}>
                            {patient.name || 'Anonymous Patient'}
                          </h3>
                          {isToday && (
                            <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                              ⚡ Today
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--neutral-500)' }}>
                          {patient.email} • {patient.phone || 'No phone'} • Gender: {patient.gender || 'N/A'}
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
                      >
                        {appt.status}
                      </span>
                    </div>
                  </div>

                  {/* Appointment Details Bar */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '1rem',
                      background: 'var(--neutral-50)',
                      padding: '0.9rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--neutral-500)', display: 'block', fontSize: '0.75rem' }}>
                        Date & Slot
                      </span>
                      <strong>{appt.appointmentDate}</strong> ({appt.timeSlot})
                    </div>

                    <div>
                      <span style={{ color: 'var(--neutral-500)', display: 'block', fontSize: '0.75rem' }}>
                        Reported Symptoms
                      </span>
                      <span style={{ color: 'var(--neutral-800)' }}>
                        {appt.symptoms || 'General Consultation'}
                      </span>
                    </div>

                    <div>
                      <span style={{ color: 'var(--neutral-500)', display: 'block', fontSize: '0.75rem' }}>
                        Fee Received
                      </span>
                      <strong style={{ color: 'var(--primary-600)' }}>${appt.paymentAmount} (Paid)</strong>
                    </div>
                  </div>

                  {/* Uploaded Documents by Patient */}
                  {appt.documents && appt.documents.length > 0 && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e40af' }}>
                        <FileText size={16} />
                        <strong>Patient Attached {appt.documents.length} Medical Document(s)</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {appt.documents.map((doc, idx) => (
                          <a
                            key={idx}
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                          >
                            <Eye size={12} /> View {doc.fileName.slice(0, 16)}...
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prescription Summary if already completed */}
                  {appt.prescription && appt.prescription.diagnosis && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#166534', marginBottom: '2px' }}>
                        ✓ Diagnosis: {appt.prescription.diagnosis}
                      </div>
                      <div style={{ color: '#15803d', whiteSpace: 'pre-line' }}>
                        {appt.prescription.medicines}
                      </div>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      borderTop: '1px solid var(--neutral-200)',
                      paddingTop: '0.75rem',
                    }}
                  >
                    {/* Write / Edit Prescription Button */}
                    <button
                      onClick={() => setSelectedAppointmentForRx(appt)}
                      className="btn btn-sm btn-primary"
                    >
                      <FileEdit size={14} />
                      {appt.prescription?.diagnosis ? 'Update Prescription' : 'Issue Prescription'}
                    </button>

                    {/* Status Modifiers */}
                    {appt.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(appt._id, 'confirmed')}
                        className="btn btn-sm btn-success"
                      >
                        <CheckCircle2 size={14} /> Confirm
                      </button>
                    )}

                    {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                        className="btn btn-sm btn-danger"
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Prescription Writing Modal */}
      {selectedAppointmentForRx && (
        <PrescriptionModal
          appointment={selectedAppointmentForRx}
          onClose={() => setSelectedAppointmentForRx(null)}
          onPrescriptionSaved={() => {
            fetchDoctorData();
            setSelectedAppointmentForRx(null);
          }}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
