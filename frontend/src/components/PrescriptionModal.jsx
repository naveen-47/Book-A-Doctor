import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { appointmentAPI } from '../services/api';
import { FileEdit, X, Pill, Stethoscope, CheckCircle2 } from 'lucide-react';

const PrescriptionModal = ({ appointment, onClose, onPrescriptionSaved }) => {
  const { showToast } = useToast();
  const [diagnosis, setDiagnosis] = useState(appointment.prescription?.diagnosis || '');
  const [medicines, setMedicines] = useState(appointment.prescription?.medicines || '');
  const [advice, setAdvice] = useState(appointment.prescription?.advice || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!diagnosis.trim()) {
      showToast('Please provide a medical diagnosis', 'warning');
      return;
    }

    setSaving(true);
    try {
      const res = await appointmentAPI.addPrescription(appointment._id, {
        diagnosis,
        medicines,
        advice,
      });

      if (res.data && res.data.success) {
        showToast('Prescription saved and appointment completed!', 'success');
        if (onPrescriptionSaved) {
          onPrescriptionSaved(res.data.appointment);
        }
        onClose();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save prescription', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog" style={{ maxWidth: '640px' }}>
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
              <FileEdit size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Issue Digital Prescription</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                Patient: <strong>{appointment.patient?.name}</strong> • Date: {appointment.appointmentDate}
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
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Patient Symptoms Reference */}
            {appointment.symptoms && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--neutral-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.85rem',
                  color: 'var(--neutral-700)',
                  marginBottom: '1.25rem',
                }}
              >
                <strong>Patient Reported Symptoms:</strong> {appointment.symptoms}
              </div>
            )}

            {/* 1. Diagnosis */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Stethoscope size={16} color="var(--primary-500)" />
                Clinical Diagnosis & Observations
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Acute Pharyngitis / Hypertension Grade 1"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>

            {/* 2. Medicines */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Pill size={16} color="var(--primary-500)" />
                Prescribed Medicines & Dosage Instructions
              </label>
              <textarea
                rows="4"
                className="form-control"
                placeholder={`1. Tab Amoxicillin 500mg - 1 tablet 3 times a day after meals (5 days)\n2. Tab Paracetamol 650mg - SOS for fever/pain\n3. Antacid syrup - 10ml before bedtime`}
                value={medicines}
                onChange={(e) => setMedicines(e.target.value)}
                required
              />
            </div>

            {/* 3. Dietary & General Advice */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Lifestyle / Dietary Advice & Follow-up Plan</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="e.g. Drink warm fluids, avoid cold beverages, follow up after 1 week if symptoms persist."
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <CheckCircle2 size={16} />
              {saving ? 'Issuing Prescription...' : 'Issue Prescription & Complete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;
