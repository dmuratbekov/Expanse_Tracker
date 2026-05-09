import api from './axios';

export const getTransactionsApi = (params) =>
    api.get('/transactions', { params });

export const createTransactionApi = (data) =>
    api.post('/transactions', data);

export const updateTransactionApi = (id, data) =>
    api.put(`/transactions/${id}`, data);

export const deleteTransactionApi = (id) =>
    api.delete(`/transactions/${id}`);