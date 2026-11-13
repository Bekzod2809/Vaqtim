import client from './client';

export const ordersApi = {
  // Xaridor uchun
  place: async (payload) => {
    const { data } = await client.post('/orders', payload);
    return data; // yangi buyurtma id
  },

  getMine: async () => {
    const { data } = await client.get('/orders/mine');
    return data;
  },

  cancel: async (id) => {
    await client.put(`/orders/${id}/cancel`);
  },

  // Admin uchun
  getAll: async () => {
    const { data } = await client.get('/orders');
    return data;
  },

  changeStatus: async (id, status) => {
    await client.put(`/orders/${id}/status`, { status });
  },
};
