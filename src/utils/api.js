import axios from 'axios';

// Set production API base URL dynamically or fallback to local Express server
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor automatically appending authorization JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tapqr_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
