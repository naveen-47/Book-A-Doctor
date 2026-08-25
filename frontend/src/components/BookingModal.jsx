import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { doctorAPI, appointmentAPI } from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Building,
} from 'lucide-react';

const BookingModal = ({ doctor, onClose, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Get tomorrow's date formatted as YYYY-MM-DD by default
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [appointmentDate, setAppointmentDate] = useState(getTomorrowDate());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online Card Payment');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedAppointmentData, setBookedAppointmentData] = useState(null);

  // Fetch slot availability whenever date or doctor changes
  useEffect(() => {
    if (!doctor || !appointmentDate) return;

    const fetchAvailability = async () => {
      setLoadingSlots(true);
      setSelectedSlot('');
      try {
        const res = await doctorAPI.getAvailability(doctor._id, appointmentDate);
        if (res.data && res.data.success) {
          setAvailableSlots(res.data.availableSlots || []);
        }
      } catch (error) {
        console.error('Failed to fetch availability:', error);
        // Fallback to default doctor slots
        const defaultSlots = (doctor.availableTimeSlots || []).map((s) => ({
          slot: s,
          isAvailable: true,
        }));
        setAvailableSlots(defaultSlots);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [doctor, appointmentDate]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please sign in to complete your appointment booking', 'warning');
      navigate('/login', { state: { returnToDoctor: doctor._id } });
      return;
    }

    if (user.role !== 'patient' && user.role !== 'admin') {
      showToast('Only patients can schedule appointments', 'error');
      return;
    }

    if (!appointmentDate) {
      showToast('Please select a valid date', 'warning');
      return;
    }

    if (!selectedSlot) {
      showToast('Please select an available time slot', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      const res = await appointmentAPI.create({
        doctorId: doctor._id,
        appointmentDate,
        timeSlot: selectedSlot,
        symptoms: symptoms || 'General Consultation',
        paymentMethod,
      });

      if (res.data && res.data.success) {
        setBookedAppointmentData(res.data.appointment);
        setIsSuccess(true);

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        showToast('Appointment successfully scheduled!', 'success');
        if (onBookingSuccess) {
          onBookingSuccess(res.data.appointment);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to book appointment';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-600)',
              }}
            >
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {isSuccess ? 'Booking Confirmed!' : 'Book Appointment'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                {isSuccess ? 'Your healthcare appointment is reserved' : `Schedule visit with ${doctor.name}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--neutral-400)',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--neutral-900)', marginBottom: '0.5rem' }}>
                Appointment Confirmed!
              </h3>
              <p style={{ color: 'var(--neutral-600)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                You are scheduled to meet with <strong>{doctor.name}</strong> ({doctor.specialization}) on{' '}
                <strong>{appointmentDate}</strong> at <strong>{selectedSlot}</strong>.
              </p>

              <div
                style={{
                  background: 'var(--neutral-50)',
                  border: '1px solid var(--neutral-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                  fontSize: '0.88rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--neutral-500)' }}>Hospital / Clinic:</span>
                  <span style={{ fontWeight: 600 }}>{doctor.hospitalName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--neutral-500)' }}>Consultation Fee:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>${doctor.fees} (Paid)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--neutral-500)' }}>Status:</span>
                  <span className="badge badge-success">Confirmed</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/dashboard');
                  }}
                  className="btn btn-primary"
                >
                  View My Appointments
                </button>
                <button onClick={onClose} className="btn btn-secondary">
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBooking}>
              {/* Doctor Quick Summary Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-100)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                }}
              >
                <img
                  src={
                    doctor.profileImage ||
                    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
                  }
                  alt={doctor.name}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--neutral-900)', fontSize: '1.05rem' }}>
                    {doctor.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                    {doctor.specialization} • {doctor.experienceYears} Yrs Exp
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                    <Building size={12} /> {doctor.hospitalName}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Fee
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                    ${doctor.fees}
                  </div>
                </div>
              </div>

              {/* 1. Date Selector */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} color="var(--primary-500)" />
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              {/* 2. Slot Selector with live real-time availability */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} color="var(--primary-500)" />
                    Select Available Time Slot
                  </span>
                  {loadingSlots && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)' }}>Checking slots...</span>
                  )}
                </label>

                {availableSlots.length === 0 && !loadingSlots ? (
                  <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: 'var(--radius-sm)', color: '#b45309', fontSize: '0.85rem' }}>
                    No slots scheduled for this doctor on this day.
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                      gap: '0.6rem',
                    }}
                  >
                    {availableSlots.map((item, idx) => {
                      const isSelected = selectedSlot === item.slot;
                      const isAvail = item.isAvailable;

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!isAvail}
                          onClick={() => isAvail && setSelectedSlot(item.slot)}
                          style={{
                            padding: '0.65rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            textAlign: 'center',
                            border: isSelected
                              ? '2px solid var(--primary-500)'
                              : isAvail
                              ? '1px solid var(--neutral-300)'
                              : '1px dashed var(--neutral-300)',
                            background: isSelected
                              ? 'var(--primary-50)'
                              : isAvail
                              ? '#ffffff'
                              : '#f1f5f9',
                            color: isSelected
                              ? 'var(--primary-800)'
                              : isAvail
                              ? 'var(--neutral-800)'
                              : 'var(--neutral-400)',
                            cursor: isAvail ? 'pointer' : 'not-allowed',
                            transition: 'all var(--transition-fast)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                          }}
                        >
                          <span>{item.slot}</span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              color: isAvail ? '#10b981' : '#94a3b8',
                            }}
                          >
                            {isAvail ? '● Available' : '✕ Booked'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Reason for visit / Symptoms */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} color="var(--primary-500)" />
                  Symptoms or Reason for Consultation (Optional)
                </label>
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="e.g. Mild headache and chest tightness for 3 days, requesting routine checkup..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>

              {/* 4. Payment Method */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={16} color="var(--primary-500)" />
                  Payment Option
                </label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Online Card Payment">Instant Online Card (Visa / MasterCard / Amex)</option>
                  <option value="UPI / Digital Wallet">Digital Wallet / UPI (Zero fees)</option>
                  <option value="Pay at Hospital Desk">Pay upon arrival at Hospital Desk</option>
                  <option value="Health Insurance Covered">Health Insurance / Corporate Health Plan</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  marginTop: '1.75rem',
                  borderTop: '1px solid var(--neutral-200)',
                  paddingTop: '1.25rem',
                }}
              >
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedSlot}
                  className="btn btn-primary"
                  style={{ minWidth: '160px' }}
                >
                  {submitting ? 'Confirming...' : `Confirm & Pay $${doctor.fees}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
