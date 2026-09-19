import client from './client';

export const buyurtmalarApi = {
  // Xaridor uchun
  berish: async (payload) => {
    const { data } = await client.post('/buyurtmalar', payload);
    return data; // yangi buyurtma id
  },

  getMening: async () => {
    const { data } = await client.get('/buyurtmalar/mening');
    return data;
  },

  bekorQilish: async (id) => {
    await client.put(`/buyurtmalar/${id}/bekor-qilish`);
  },

  // Admin uchun
  getAll: async () => {
    const { data } = await client.get('/buyurtmalar');
    return data;
  },

  holatniOzgartirish: async (id, holati) => {
    await client.put(`/buyurtmalar/${id}/holat`, { holati });
  },
};
