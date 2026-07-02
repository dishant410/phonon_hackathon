import api from '../api/axios';

const controlService = {
  getAll: (params) => api.get('/controls', { params }),
  getById: (id) => api.get(`/controls/${id}`),
  create: (data) => api.post('/controls', data),
  update: (id, data) => api.put(`/controls/${id}`, data),
  remove: (id) => api.delete(`/controls/${id}`),
  assignOwner: (id, owner) => api.patch(`/controls/${id}/owner`, { owner }),
  updateStatus: (id, status, nextReviewDate) =>
    api.patch(`/controls/${id}/status`, { status, nextReviewDate }),
};

export default controlService;
