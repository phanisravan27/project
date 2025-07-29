import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, fullName) => 
    api.post('/auth/register', { email, password, full_name: fullName }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/profile'),
};

export const entriesAPI = {
  getEntries: (skip = 0, limit = 10) => 
    api.get(`/entries?skip=${skip}&limit=${limit}`),
  getEntry: (id) => api.get(`/entries/${id}`),
  createEntry: (entry) => api.post('/entries', entry),
  generateStory: (entryId, style = 'journal') => 
    api.post('/generate/story', { entry_id: entryId, style }),
};

export const uploadsAPI = {
  uploadAudio: (file, entryId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (entryId) {
      formData.append('entry_id', entryId);
    }
    return api.post('/upload/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadImage: (file, entryId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (entryId) {
      formData.append('entry_id', entryId);
    }
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const timelineAPI = {
  getTimeline: (startDate = null, endDate = null) => {
    let url = '/timeline';
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },
};

export const recapAPI = {
  generateRecap: (startDate, endDate, recapType = 'weekly') =>
    api.post('/generate/recap', {
      start_date: startDate,
      end_date: endDate,
      recap_type: recapType,
    }),
};

export default api;