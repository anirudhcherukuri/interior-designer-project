// frontend/src/api/config.js
import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const USE_MOCK = false;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

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
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/api/auth/reset-password', { token, newPassword }),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  getAll: () => api.get('/api/bookings'),
  create: (data) => api.post('/api/bookings', data),
  updateStatus: (id, status) => api.patch(`/api/bookings/${id}`, { status }),
  delete: (id) => api.delete(`/api/bookings/${id}`),
};

// ─── Enquiries ────────────────────────────────────────────────────────────────
export const enquiryAPI = {
  getAll: () => api.get('/api/enquiry'),
  create: (data) => api.post('/api/enquiry', data),
  update: (id, data) => api.patch(`/api/enquiry/${id}`, data),
  delete: (id) => api.delete(`/api/enquiry/${id}`),
};

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll: () => api.get('/api/projects'),
  create: (data) => api.post('/api/projects', data),
  update: (id, data) => api.put(`/api/projects/${id}`, data),
  delete: (id) => api.delete(`/api/projects/${id}`),
};

// ─── Houses (projects.config.json) ───────────────────────────────────────────
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

// ─── Media (Cloudinary / local uploads) ──────────────────────────────────────
// DELETE uses fileId (full Cloudinary public_id e.g. "interior-designer-portfolio/abc123")
// The route is DELETE /api/upload/:fileId(*) — the (*) means it accepts slashes
export const uploadAPI = {
  getAll: () => api.get('/api/upload'),

  upload: (fd) => api.post('/api/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // fileId is the full public_id — encode each segment so slashes survive in the URL
  delete: (fileId) => api.delete(
    `/api/upload/${fileId.split('/').map(encodeURIComponent).join('/')}`
  ),

  updateMetadata: (fileId, data) => api.patch(
    `/api/upload/${fileId.split('/').map(encodeURIComponent).join('/')}`,
    data
  ),
};

export default api;