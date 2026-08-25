import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { adminAPI } from '../services/api';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Activity,
  Award,
  Building,
  UserCheck,
  UserX,
  Clock,
  Eye,
} from 'lucide-react';

const AdminDashboard = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors', 'users', 'appointments'
  const [loading, setLoading] = useState(true);

  // Doctors management state
  const [doctorsList, setDoctorsList] = useState([]);
  const [doctorStatusFilter, setDoctorStatusFilter] = useState('all');

  // Users management state
  const [usersList, setUsersList] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  // Appointments management state
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');

  const fetchAdminStats = async () => {
    try {
      const res = await adminAPI.getStats();
      if (res.data && res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await adminAPI.getDoctors({ status: doctorStatusFilter });
      if (res.data && res.data.success) {
        setDoctorsList(res.data.doctors || []);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers({ role: userRoleFilter, search: userSearch });
      if (res.data && res.data.success) {
        setUsersList(res.data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await adminAPI.getAppointments({ status: appointmentStatusFilter });
      if (res.data && res.data.success) {
        setAppointmentsList(res.data.appointments || []);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await fetchAdminStats();
      await fetchDoctors();
      setLoading(false);
    };
    loadInitial();
  }, []);

  useEffect(() => {
    if (activeTab === 'doctors') fetchDoctors();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'appointments') fetchAppointments();
  }, [activeTab, doctorStatusFilter, userRoleFilter, appointmentStatusFilter]);

  // Actions: Doctor approve/reject
  const handleApproveDoctor = async (docId) => {
    try {
      const res = await adminAPI.approveDoctor(docId);
      if (res.data && res.data.success) {
        showToast(res.data.message, 'success');
        fetchDoctors();
        fetchAdminStats();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Approval failed', 'error');
    }
  };

  const handleRejectDoctor = async (docId) => {
    try {
      const res = await adminAPI.rejectDoctor(docId);
      if (res.data && res.data.success) {
        showToast(res.data.message, 'info');
        fetchDoctors();
        fetchAdminStats();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Action failed', 'error');
    }
  };

  // Actions: User status toggle
  const handleToggleUser = async (userId) => {
    try {
      const res = await adminAPI.toggleUserStatus(userId);
      if (res.data && res.data.success) {
        showToast(res.data.message, 'success');
        fetchUsers();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container-custom">
        {/* Admin Header */}
        <div
          className="card-elevated"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0b3b60 100%)',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>
                  Administration Control Center
                </h1>
                <span className="badge badge-primary" style={{ background: '#6366f1', color: '#ffffff', border: 'none' }}>
                  Super Admin
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '2px' }}>
                Platform management, doctor verification pipeline, user governance, and appointment metrics
              </p>
            </div>
          </div>

          {/* Metric Tiles */}
          {stats && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                paddingTop: '1.25rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total Patients
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalPatients}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total Doctors
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                  {stats.totalDoctors}{' '}
                  <span style={{ fontSize: '0.85rem', color: '#02c39a' }}>({stats.approvedDoctors} active)</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                  Pending Verifications
                </div>
                <div
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: stats.pendingDoctors > 0 ? '#f87171' : '#cbd5e1',
                  }}
                >
                  {stats.pendingDoctors} {stats.pendingDoctors > 0 ? '⚠️' : ''}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                  Platform Appointments
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#67e8f9' }}>
                  {stats.totalAppointments}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                  Gross Platform Revenue
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
                  ${stats.totalRevenue}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.75rem',
            borderBottom: '1px solid var(--neutral-200)',
            paddingBottom: '0.5rem',
          }}
        >
          <button
            onClick={() => setActiveTab('doctors')}
            style={{
              padding: '0.65rem 1.25rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: activeTab === 'doctors' ? 'var(--primary-500)' : 'transparent',
              color: activeTab === 'doctors' ? '#ffffff' : 'var(--neutral-600)',
            }}
          >
            <Stethoscope size={16} /> Doctor Approvals & Registry
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.65rem 1.25rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: activeTab === 'users' ? 'var(--primary-500)' : 'transparent',
              color: activeTab === 'users' ? '#ffffff' : 'var(--neutral-600)',
            }}
          >
            <Users size={16} /> User Management
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            style={{
              padding: '0.65rem 1.25rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: activeTab === 'appointments' ? 'var(--primary-500)' : 'transparent',
              color: activeTab === 'appointments' ? '#ffffff' : 'var(--neutral-600)',
            }}
          >
            <Calendar size={16} /> Platform Appointments
          </button>
        </div>

        {/* TAB 1: DOCTORS VERIFICATION & MANAGEMENT */}
        {activeTab === 'doctors' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['all', 'pending', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setDoctorStatusFilter(st)}
                    className={`btn btn-sm ${doctorStatusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {st === 'pending' && '⏳ '}
                    {st} Doctors
                  </button>
                ))}
              </div>

              <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)' }}>
                Found {doctorsList.length} doctor profile{doctorsList.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {doctorsList.map((doc) => (
                <div
                  key={doc._id}
                  className="card-elevated"
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                    borderLeft:
                      doc.isApproved === 'pending'
                        ? '4px solid #f59e0b'
                        : doc.isApproved === 'approved'
                        ? '4px solid #10b981'
                        : '4px solid #f43f5e',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={
                        doc.profileImage ||
                        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
                      }
                      alt={doc.name}
                      style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{doc.name}</h3>
                        <span
                          className={`badge ${
                            doc.isApproved === 'approved'
                              ? 'badge-success'
                              : doc.isApproved === 'pending'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {doc.isApproved}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                        {doc.specialization} • {doc.qualifications} • {doc.experienceYears} Yrs Exp
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                        {doc.email} • {doc.hospitalName} • Fee: ${doc.fees}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {doc.isApproved !== 'approved' && (
                      <button
                        onClick={() => handleApproveDoctor(doc._id)}
                        className="btn btn-sm btn-success"
                      >
                        <CheckCircle2 size={14} /> Approve Doctor
                      </button>
                    )}
                    {doc.isApproved !== 'rejected' && (
                      <button
                        onClick={() => handleRejectDoctor(doc._id)}
                        className="btn btn-sm btn-danger"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            {/* Filter Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['all', 'patient', 'doctor', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`btn btn-sm ${userRoleFilter === role ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {role}s
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: '260px' }}>
                <Search
                  size={16}
                  color="var(--neutral-400)"
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '10px' }}
                />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && fetchUsers()}
                  className="form-control"
                  style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={
                              u.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`
                            }
                            alt={u.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--neutral-900)' }}>{u.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === 'admin'
                              ? 'badge-danger'
                              : u.role === 'doctor'
                              ? 'badge-primary'
                              : 'badge-success'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>{u.phone || 'N/A'}</td>
                      <td>
                        <span
                          className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUser(u._id)}
                            className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                          >
                            {u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PLATFORM APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['all', 'confirmed', 'completed', 'pending', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setAppointmentStatusFilter(st)}
                    className={`btn btn-sm ${appointmentStatusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)' }}>
                Total: {appointmentsList.length} Appointments
              </span>
            </div>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th>Documents</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsList.map((a) => (
                    <tr key={a._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{a.patient?.name || 'Patient'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{a.patient?.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{a.doctor?.name || 'Doctor'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>
                          {a.doctor?.specialization}
                        </div>
                      </td>
                      <td>
                        <div>{a.appointmentDate}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{a.timeSlot}</div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--primary-600)' }}>${a.paymentAmount}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            a.status === 'completed'
                              ? 'badge-success'
                              : a.status === 'cancelled'
                              ? 'badge-danger'
                              : 'badge-primary'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {a.documents && a.documents.length > 0 ? (
                          <span className="badge badge-info">{a.documents.length} File(s)</span>
                        ) : (
                          <span style={{ color: 'var(--neutral-400)', fontSize: '0.8rem' }}>None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
