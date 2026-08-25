import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bad_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauthenticated globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: auto-clear stale token if unauthorized on a protected call
      // Only clear if on protected pages to avoid auth loop
    }
    return Promise.reject(error);
  }
);

// ================= Auth API =================
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ================= Doctor API =================
export const doctorAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getTop: () => api.get('/doctors/top'),
  getSpecialties: () => api.get('/doctors/specialties'),
  getById: (id) => api.get(`/doctors/${id}`),
  getAvailability: (id, date) => api.get(`/doctors/${id}/availability`, { params: { date } }),
  updateProfile: (data) => api.put('/doctors/profile', data),
};

// ================= Appointment API =================
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getPatientAppointments: () => api.get('/appointments/my'),
  getDoctorAppointments: () => api.get('/appointments/doctor'),
  getById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
  cancel: (id, data) => api.put(`/appointments/${id}/cancel`, data),
  uploadDocument: (id, formData) =>
    api.post(`/appointments/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  addPrescription: (id, data) => api.post(`/appointments/${id}/prescription`, data),
};

// ================= Admin API =================
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getDoctors: (params) => api.get('/admin/doctors', { params }),
  approveDoctor: (id) => api.put(`/admin/doctors/${id}/approve`),
  rejectDoctor: (id) => api.put(`/admin/doctors/${id}/reject`),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  getAppointments: (params) => api.get('/admin/appointments', { params }),
};

export default api;
