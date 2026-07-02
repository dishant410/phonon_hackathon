import api from '../api/axios';

const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRiskMatrix: () => api.get('/dashboard/risk-matrix'),
  getComplianceScore: () => api.get('/dashboard/compliance-score'),
};

export default dashboardService;
