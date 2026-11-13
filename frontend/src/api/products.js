import client from './client';
import { CATEGORY } from '../constants';

export const productsApi = {
  getAll: async (category) => {
    const { data } = await client.get('/products', {
      params: category ? { category } : {},
    });
    return data;
  },

  getSales: async () => {
    const { data } = await client.get('/products/sales');
    return data;
  },

  getById: async (id) => {
    const { data } = await client.get(`/products/${id}`);
    return data;
  },

  // Har kategoriyaning o'z endpointi bor: /mahsulotlar/soatlar, /mahsulotlar/kepkalar ...
  create: async (category, payload) => {
    const { data } = await client.post(`/products/${CATEGORY[category].path}`, payload);
    return data; // yangi mahsulot id
  },

  update: async (category, id, payload) => {
    await client.put(`/products/${CATEGORY[category].path}/${id}`, payload);
  },

  remove: async (id) => {
    await client.delete(`/products/${id}`);
  },

  uploadImage: async (productId, file, isMain) => {
    const form = new FormData();
    form.append('Image', file);
    form.append('IsMainImage', isMain);

    const { data } = await client.post(`/products/${productId}/images`, form);
    return data;
  },

  removeImage: async (imageId) => {
    await client.delete(`/products/images/${imageId}`);
  },
};
