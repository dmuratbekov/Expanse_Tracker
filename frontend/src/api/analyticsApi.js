import api from './axios';

export const getSummaryApi = (params) => api.get('/analytics/summary', { params });
export const getByCategoryApi = (params) => api.get('/analytics/by-category', { params });
export const getByMonthApi = (params) => api.get('/analytics/by-month', { params });
