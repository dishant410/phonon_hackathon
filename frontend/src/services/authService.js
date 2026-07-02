import api from '../api/axios';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  getUsers: (params) => api.get('/auth/users', { params }),
  updateUserRole: (id, role) => api.patch(`/auth/users/${id}/role`, { role }),
  updateUserStatus: (id, isActive) => api.patch(`/auth/users/${id}/status`, { isActive }),
};

export default authService;
