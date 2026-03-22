import axios from 'axios';
import { mockProjects } from '../data/projectsData';

// Hardcoded for local debugging to ensure no environment mismatches
export const API_URL = 'http://localhost:5000';

export const formatUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/800x600?text=Media+Path+Missing';
  // Pass through absolute URLs (Google Drive, http, data URIs, blob, gallery paths)
  if (
    url.startsWith('http') ||
    url.startsWith('data:') ||
    url.startsWith('/gallery/') ||
    url.startsWith('blob:') ||
    url.startsWith('https://drive.google.com') ||
    url.startsWith('https://lh3.googleusercontent.com')
  ) return url;

  // If no leading slash, add it
  const path = url.startsWith('/') ? url : `/${url}`;

  // For standard mock/public assets that aren't in /gallery/ but are local to frontend
  if (path.startsWith('/assets/')) return path;

  return `${API_URL}${path}`;
};

// Set to true to use mock data for local development if backend is not ready
// Set to false in production so the real backend API is used
export const USE_MOCK = false;

const api = axios.create({ 
  baseURL: `${API_URL}/api`,
  withCredentials: true 
});

// Remove JWT Request Interceptor - We rely on HttpOnly cookies now

// JWT Response Interceptor (Handle 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we are on admin page and lose auth, reload to show login
      if (window.location.pathname === '/admin') {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

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
  create: (data) => USE_MOCK ? Promise.resolve({ data: { message: 'Project created (Mock)' } }) : api.post('/projects', data),
  update: (id, data) => USE_MOCK ? Promise.resolve({ data: { message: 'Project updated (Mock)' } }) : api.put(`/projects/${id}`, data),
  delete: (id) => USE_MOCK ? Promise.resolve({ data: { message: 'Project deleted (Mock)' } }) : api.delete(`/projects/${id}`),
};

export const bookingsAPI = {
  create: (data) => USE_MOCK ? Promise.resolve({ data: { message: 'Booking created (Mock)' } }) : api.post('/bookings', data),
  getAll: () => USE_MOCK
    ? Promise.resolve({
      data: [
        { _id: '1', clientName: 'Amit Sharma', email: 'amit@example.com', phone: '9876543210', serviceType: 'Living Room Design', message: 'Looking for a premium modern look.', bookingDate: '2026-03-15', bookingTime: '10:00 AM', status: 'pending' },
        { _id: '2', clientName: 'Priya Verma', email: 'priya@example.com', phone: '9988776655', serviceType: 'Full Villa Interior', message: 'Want to redesign my new villa in Jubilee Hills.', bookingDate: '2026-03-20', bookingTime: '2:00 PM', status: 'confirmed' }
      ]
    })
    : api.get('/bookings'),
  updateStatus: (id, status) => USE_MOCK ? Promise.resolve() : api.patch(`/bookings/${id}`, { status }),
  delete: (id) => USE_MOCK ? Promise.resolve() : api.delete(`/bookings/${id}`),
};

export const testimonialsAPI = {
  create: (data) => USE_MOCK ? Promise.resolve({ data: { message: 'Testimonial submitted (Mock)' } }) : api.post('/testimonials', data),
  getAllPublic: () => USE_MOCK ? Promise.resolve({ data: [] }) : api.get('/testimonials'),
  getAllAdmin: () => USE_MOCK ? Promise.resolve({ data: [] }) : api.get('/testimonials/all'),
  approve: (id, approved) => USE_MOCK ? Promise.resolve() : api.patch(`/testimonials/${id}`, { approved }),
  delete: (id) => USE_MOCK ? Promise.resolve() : api.delete(`/testimonials/${id}`),
};

// Visitor Tracking APIs
export const visitorAPI = {
  track: (data) => USE_MOCK ? Promise.resolve() : api.post('/visitor', data),
  getStats: () => USE_MOCK ? Promise.resolve({ data: [{ count: 1250 }] }) : api.get('/visitor/stats'),
  getSources: () => USE_MOCK ? Promise.resolve({ data: [{ _id: 'Organic Search', count: 450 }, { _id: 'Direct', count: 300 }, { _id: 'Social Media', count: 500 }] }) : api.get('/visitor/sources'),
  getBrowsers: () => USE_MOCK ? Promise.resolve({ data: [] }) : api.get('/visitor/browsers'),
  getDevices: () => USE_MOCK ? Promise.resolve({ data: [{ _id: 'Desktop', count: 800 }, { _id: 'Mobile', count: 400 }, { _id: 'Tablet', count: 50 }] }) : api.get('/visitor/devices'),
};

export const uploadAPI = {
  // Upload single file → returns { fileId, fileUrl, thumbnailUrl, viewUrl, name }
  upload: (formData) => USE_MOCK 
    ? Promise.resolve({ data: { fileUrl: '/gallery/bg.jpg' } }) 
    : api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  // Upload multiple files at once → returns { files: [...], count }
  uploadMultiple: (formData) => USE_MOCK 
    ? Promise.resolve({ data: { files: [], count: 0 } }) 
    : api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  // List all files in Google Drive folder
  getAll: () => USE_MOCK ? Promise.resolve({ data: [] }) : api.get('/upload'),
  // Test Google Drive connection
  testConnection: () => USE_MOCK ? Promise.resolve({ data: { connected: true } }) : api.get('/upload/test'),
  // Delete by Google Drive file ID (not filename anymore)
  delete: (fileId) => USE_MOCK ? Promise.resolve() : api.delete(`/upload/${fileId}`),
  // Update metadata (rename, category)
  updateMetadata: (fileId, data) => USE_MOCK ? Promise.resolve() : api.patch(`/upload/${fileId}`, data),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me')
};
