import api from './axios';

export const getCategoriesApi = (type) =>
    api.get('/categories', { params: type ? { type } : {} });

export const createCategoryApi = (data) =>
    api.post('/categories', data);

export const updateCategoryApi = (id, data) =>
    api.put(`/categories/${id}`, data);

export const deleteCategoryApi = (id) =>
    api.delete(`/categories/${id}`);