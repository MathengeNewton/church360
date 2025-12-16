import axios from 'axios';

// API base URL - adjust based on your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/api';

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
    login: (credentials) => api.post('/auth/login', credentials),
    resetPassword: (data) => api.post('/auth/reset-password', data),
  },

  // Families
  families: {
    getAll: () => api.get('/families'),
    getOne: (id) => api.get(`/families/${id}`),
    create: (data) => api.post('/families', data),
    update: (id, data) => api.put(`/families/${id}`, data),
    delete: (id) => api.delete(`/families/${id}`),
  },

  // Annual Contributions
  annualContributions: {
    getAll: (familyId) => {
      const params = familyId ? { familyId } : {};
      return api.get('/annual-contributions', { params });
    },
    getOne: (id) => api.get(`/annual-contributions/${id}`),
    create: (data) => api.post('/annual-contributions', data),
    update: (id, data) => api.put(`/annual-contributions/${id}`, data),
    delete: (id) => api.delete(`/annual-contributions/${id}`),
    carryOver: (data) => api.post('/annual-contributions/carryover', data),
  },

  // Monthly Contributions
  monthlyContributions: {
    getAll: (params = {}) => api.get('/monthly-contributions', { params }),
    getOne: (id) => api.get(`/monthly-contributions/${id}`),
    getOverdue: (familyId) => {
      const params = familyId ? { familyId } : {};
      return api.get('/monthly-contributions/overdue', { params });
    },
    getPending: (familyId) => {
      const params = familyId ? { familyId } : {};
      return api.get('/monthly-contributions/pending', { params });
    },
  },

  // Payments
  payments: {
    getAll: (params = {}) => api.get('/payments', { params }),
    getOne: (id) => api.get(`/payments/${id}`),
    getUndistributed: (familyId) => {
      const params = familyId ? { familyId } : {};
      return api.get('/payments/undistributed', { params });
    },
    create: (data) => api.post('/payments', data),
    update: (id, data) => api.put(`/payments/${id}`, data),
    delete: (id) => api.delete(`/payments/${id}`),
  },

  // Campaigns
  campaigns: {
    getAll: (params = {}) => api.get('/campaigns', { params }),
    getOne: (id) => api.get(`/campaigns/${id}`),
    create: (data) => api.post('/campaigns', data),
    autoDistribute: (data) => api.post('/campaigns/auto-distribute', data),
    undo: (id) => api.post(`/campaigns/${id}/undo`),
  },

  // Notices
  notices: {
    getAll: (params = {}) => api.get('/notices', { params }),
    getActive: (familyId) => {
      const params = familyId ? { familyId } : {};
      return api.get('/notices/active', { params });
    },
    getOne: (id) => api.get(`/notices/${id}`),
    create: (data) => api.post('/notices', data),
    update: (id, data) => api.put(`/notices/${id}`, data),
    delete: (id) => api.delete(`/notices/${id}`),
    publish: (id) => api.post(`/notices/${id}/publish`),
    expire: (id) => api.post(`/notices/${id}/expire`),
  },

  // Users
  users: {
    getAll: () => api.get('/users'),
    getOne: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
  },
};

export default api;

