import api from '../api/axios';

const privacyService = {
  getAll: (params) => api.get('/privacy', { params }),
  getById: (id) => api.get(`/privacy/${id}`),
  create: (data) => api.post('/privacy', data),
  update: (id, data) => api.put(`/privacy/${id}`, data),
  remove: (id) => api.delete(`/privacy/${id}`),
};

export default privacyService;
