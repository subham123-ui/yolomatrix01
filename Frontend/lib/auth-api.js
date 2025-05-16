import apiClient from './api-client';

const authAPI = {
  login: async (credentials) => {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      const response = await apiClient.post('/auth/login', credentials);
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      return response;
    } catch (error) {
      // Format the error message
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.error('Login API error:', {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(errorMessage);
    }
  },

  register: async (userData) => {
    try {
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Name, email and password are required');
      }
      const response = await apiClient.post('/auth/register', userData);
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      return response;
    } catch (error) {
      // Format the error message
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      console.error('Register API error:', {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authAPI; 