import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling cookies
  timeout: 10000, // 10 second timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  loginAdmin: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login/admin', credentials),
  register: (userData: any) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),
};

export const apartmentsAPI = {
  getAll: () => apiClient.get('/appartments'),
  getById: (id: string) => apiClient.get(`/appartments/${id}`),
  create: (data: any) => apiClient.post('/appartments/create', data),
  update: (id: string, data: any) => apiClient.put(`/appartments/update/${id}`, data),
  delete: (id: string) => apiClient.delete(`/appartments/delete/${id}`),
};

export const mansionsAPI = {
  getAll: () => apiClient.get('/mansions'),
  getById: (id: string) => apiClient.get(`/mansions/${id}`),
  create: (data: any) => apiClient.post('/mansions/create', data),
  update: (id: string, data: any) => apiClient.put(`/mansions/update/${id}`, data),
  delete: (id: string) => apiClient.delete(`/mansions/delete/${id}`),
};

export const jetsAPI = {
  getAll: () => apiClient.get('/jets'),
  getById: (id: string) => apiClient.get(`/jets/${id}`),
  create: (data: any) => apiClient.post('/jets/create', data),
  update: (id: string, data: any) => apiClient.put(`/jets/update/${id}`, data),
  delete: (id: string) => apiClient.delete(`/jets/delete/${id}`),
};

export const yachtsAPI = {
  getAll: () => apiClient.get('/yachts'),
  getById: (id: string) => apiClient.get(`/yachts/${id}`),
  create: (data: any) => apiClient.post('/yachts/create', data),
  update: (id: string, data: any) => apiClient.put(`/yachts/update/${id}`, data),
  delete: (id: string) => apiClient.delete(`/yachts/delete/${id}`),
};

export const conciergeAPI = {
  getAll: () => apiClient.get('/concierge'),
  getById: (id: string) => apiClient.get(`/concierge/${id}`),
  create: (data: any) => apiClient.post('/concierge/create', data),
  update: (id: string, data: any) => apiClient.put(`/concierge/update/${id}`, data),
  delete: (id: string) => apiClient.delete(`/concierge/delete/${id}`),
};

export const dashboardAPI = {
  getStats: () => apiClient.get('/dashboard'),
  getRecentActivity: () => apiClient.get('/dashboard/recent-activity'),
};

export default apiClient; 