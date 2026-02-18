import axios from 'axios';
import { mockProjects } from '../data/projectsData';

// In production, use the deployed backend URL from env variable
// In development, fall back to localhost
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const formatUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/800x600?text=Media+Path+Missing';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/gallery/') || url.startsWith('blob:')) return url;

  // If no leading slash, add it
  const path = url.startsWith('/') ? url : `/${url}`;

  // For standard mock/public assets that aren't in /gallery/ but are local to frontend
  if (path.startsWith('/assets/')) return path;

  return `${API_URL}${path}`;
};

// Set to true to use mock data for local development if backend is not ready
// Set to false in production so the real backend API is used
export const USE_MOCK = false;

const api = axios.create({ baseURL: `${API_URL}/api` });

export const projectsAPI = {
  getFeatured: () => USE_MOCK
    ? Promise.resolve({ data: mockProjects.filter(p => p.featured) })
    : api.get('/projects?featured=true'),
  getAll: () => USE_MOCK
    ? Promise.resolve({ data: mockProjects })
    : api.get('/projects'),
  getById: (id) => USE_MOCK
    ? Promise.resolve({ data: mockProjects.find(p => p._id === id) })
    : api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: () => USE_MOCK
    ? Promise.resolve({
      data: [
        { _id: '1', clientName: 'Amit Sharma', email: 'amit@example.com', phone: '9876543210', serviceType: 'Living Room Design', message: 'Looking for a premium modern look.', bookingDate: '2026-03-15', bookingTime: '10:00 AM', status: 'pending' },
        { _id: '2', clientName: 'Priya Verma', email: 'priya@example.com', phone: '9988776655', serviceType: 'Full Villa Interior', message: 'Want to redesign my new villa in Jubilee Hills.', bookingDate: '2026-03-20', bookingTime: '2:00 PM', status: 'confirmed' }
      ]
    })
    : api.get('/bookings'),
  updateStatus: (id, status) => api.patch(`/bookings/${id}`, { status }),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export const testimonialsAPI = {
  create: (data) => api.post('/testimonials', data),
  getAllPublic: () => api.get('/testimonials'),
  getAllAdmin: () => api.get('/testimonials/all'),
  approve: (id, approved) => api.patch(`/testimonials/${id}`, { approved }),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Visitor Tracking APIs
export const visitorAPI = {
  track: (data) => api.post('/visitor', data),
  getStats: () => USE_MOCK ? Promise.resolve({ data: [{ count: 1250 }] }) : api.get('/visitor/stats'),
  getSources: () => USE_MOCK ? Promise.resolve({ data: [{ _id: 'Organic Search', count: 450 }, { _id: 'Direct', count: 300 }, { _id: 'Social Media', count: 500 }] }) : api.get('/visitor/sources'),
  getBrowsers: () => api.get('/visitor/browsers'),
  getDevices: () => USE_MOCK ? Promise.resolve({ data: [{ _id: 'Desktop', count: 800 }, { _id: 'Mobile', count: 400 }, { _id: 'Tablet', count: 50 }] }) : api.get('/visitor/devices'),
};

export const uploadAPI = {
  upload: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => USE_MOCK ? Promise.resolve({ data: [] }) : api.get('/upload'),
  delete: (filename) => api.delete(`/upload/${filename}`),
};
