import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { appointmentAPI } from '../services/api';
import { Upload, X, File, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const DocumentUploadModal = ({ appointment, onClose, onUploadSuccess }) => {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        showToast('File size must be under 10MB', 'warning');
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a file to upload', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    setUploading(true);
    try {
      const res = await appointmentAPI.uploadDocument(appointment._id, formData);
      if (res.data && res.data.success) {
        showToast('Medical record uploaded successfully!', 'success');
        if (onUploadSuccess) {
          onUploadSuccess(res.data.documents);
        }
        onClose();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to upload document', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-dialog" style={{ maxWidth: '500px' }}>
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
              <Upload size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Upload Medical Document</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                Attach lab tests, blood reports, scans, or previous prescriptions
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

        <form onSubmit={handleUpload}>
          <div className="modal-body">
            {/* File Dropzone / Selector */}
            <div
              style={{
                border: '2px dashed var(--neutral-300)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: file ? 'var(--primary-50)' : '#f8fafc',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all var(--transition-fast)',
              }}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: file ? 'var(--primary-500)' : 'var(--neutral-200)',
                  color: file ? '#ffffff' : 'var(--neutral-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem auto',
                }}
              >
                {file ? <FileText size={24} /> : <Upload size={24} />}
              </div>

              {file ? (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-800)', fontSize: '0.95rem' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary-600)', marginTop: '2px' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to attach
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--neutral-800)', fontSize: '0.92rem' }}>
                    Click or drag & drop files here
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', marginTop: '4px' }}>
                    Supports PDF, JPG, PNG, WEBP, DOCX (Max 10MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className="btn btn-primary"
            >
              {uploading ? 'Uploading...' : 'Save & Attach to Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
