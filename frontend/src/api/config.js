// frontend/src/api/config.js
import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const USE_MOCK = false;

// Single axios instance — withCredentials sends cookies on every request
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const formatUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  me: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
// PATCH /:id  expects { status: "confirmed" | "rejected" | "pending" }
export const bookingsAPI = {
  getAll: () => api.get('/api/bookings'),
  create: (data) => api.post('/api/bookings', data),
  updateStatus: (id, status) => api.patch(`/api/bookings/${id}`, { status }),
  delete: (id) => api.delete(`/api/bookings/${id}`),
};

// ─── Enquiries ────────────────────────────────────────────────────────────────
// PATCH /:id  expects { status: "read" | "unread" }
export const enquiryAPI = {
  getAll: () => api.get('/api/enquiry'),
  create: (data) => api.post('/api/enquiry', data),
  update: (id, data) => api.patch(`/api/enquiry/${id}`, data),
  delete: (id) => api.delete(`/api/enquiry/${id}`),
};

// ─── Projects (legacy MongoDB route — kept for compatibility) ─────────────────
export const projectsAPI = {
  getAll: () => api.get('/api/projects'),
  create: (data) => api.post('/api/projects', data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

// ─── Houses (projects.config.json via /api/houses) ───────────────────────────
export const housesAPI = {
  getAll: () => api.get('/api/houses'),
  create: (data) => api.post('/api/houses', data),
  update: (id, d) => api.put(`/api/houses/${id}`, d),
  delete: (id) => api.delete(`/api/houses/${id}`),
  gallery: () => api.get('/api/houses/gallery'),
  upload: (fd) => api.post('/api/houses/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ─── Media upload (general gallery) ──────────────────────────────────────────
export const uploadAPI = {
  getAll: () => api.get('/api/upload'),
  upload: (fd) => api.post('/api/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (name) => api.delete(`/api/upload/${name}`),
};

export default api;