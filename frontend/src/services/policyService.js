import api from '../api/axios';

const policyService = {
  getAll: (params) => api.get('/policies', { params }),
  getById: (id) => api.get(`/policies/${id}`),
  create: (formData) => api.post('/policies', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/policies/${id}`, data),
  remove: (id) => api.delete(`/policies/${id}`),
  uploadVersion: (id, formData) => api.post(`/policies/${id}/version`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  review: (id, action, rejectionReason) =>
    api.post(`/policies/${id}/review`, { action, rejectionReason }),
  getHistory: (id) => api.get(`/policies/${id}/history`),
};

export default policyService;
