import api from '../api/axios';

const riskService = {
  getAll: (params) => api.get('/risks', { params }),
  getById: (id) => api.get(`/risks/${id}`),
  create: (data) => api.post('/risks', data),
  update: (id, data) => api.put(`/risks/${id}`, data),
  remove: (id) => api.delete(`/risks/${id}`),
  getComments: (id) => api.get(`/risks/${id}/comments`),
  addComment: (id, text) => api.post(`/risks/${id}/comments`, { text }),
  getTimeline: (id) => api.get(`/risks/${id}/timeline`),
};

export default riskService;
