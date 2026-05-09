import api from './axios';

export const getAccountsApi = () => api.get('/accounts');
export const createAccountApi = (data) => api.post('/accounts', data);
export const updateAccountApi = (id, data) => api.put(`/accounts/${id}`, data);
export const deleteAccountApi = (id) => api.delete(`/accounts/${id}`);