import axios from 'axios';

/**
 * API Configuration
 * Backend API base URL - defaults to port 5400 (matches docker-compose.yml)
 * Override with NEXT_PUBLIC_API_URL environment variable
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5400/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('pcea-token') || sessionStorage.getItem('pcea-token')
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pcea-token');
        sessionStorage.removeItem('pcea-token');
        sessionStorage.removeItem('pcea-user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiClient = {
  // Auth
  auth: {
    login: (credentials) => {
      // Backend expects { username, password } but accepts email as username
      const payload = credentials.username 
        ? credentials 
        : { username: credentials.email || credentials.username, password: credentials.password };
      return api.post('/auth/login', payload);
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pcea-token');
        sessionStorage.removeItem('pcea-token');
        sessionStorage.removeItem('pcea-user');
      }
    },
  },

  // Districts (formerly Regions)
  districts: {
    getAll: () => api.get('/districts'),
    getById: (id) => api.get(`/districts/${id}`),
    create: (data) => api.post('/districts', data),
    update: (id, data) => api.put(`/districts/${id}`, data),
    delete: (id) => api.delete(`/districts/${id}`),
    assignLeaders: (id, userIds) => api.post(`/districts/${id}/assign-leaders`, { userIds }),
    getLeaders: (id) => api.get(`/districts/${id}/leaders`),
    removeLeader: (id, userId) => api.post(`/districts/${id}/remove-leader/${userId}`),
    getMembers: (id) => api.get(`/districts/${id}/members`),
  },

  // Users
  users: {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
  },

  // Sermons
  sermons: {
    getAll: (params) => api.get('/sermons', { params }),
    getById: (id) => api.get(`/sermons/${id}`),
    create: (data) => api.post('/sermons', data),
    update: (id, data) => api.put(`/sermons/${id}`, data),
    delete: (id) => api.delete(`/sermons/${id}`),
    publish: (id) => api.post(`/sermons/${id}/publish`),
    unpublish: (id) => api.post(`/sermons/${id}/unpublish`),
  },

  // Announcements
  announcements: {
    getAll: (params) => api.get('/announcements', { params }),
    getById: (id) => api.get(`/announcements/${id}`),
    getActive: () => api.get('/announcements/active'),
    getMobile: () => api.get('/announcements/mobile'),
    create: (data) => api.post('/announcements', data),
    update: (id, data) => api.put(`/announcements/${id}`, data),
    delete: (id) => api.delete(`/announcements/${id}`),
    publish: (id) => api.post(`/announcements/${id}/publish`),
    expire: (id) => api.post(`/announcements/${id}/expire`),
  },
};

export default apiClient;

