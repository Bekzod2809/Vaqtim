import client from './client';

export const buyurtmalarApi = {
  getAll: async () => {
    const { data } = await client.get('/buyurtmalar');
    return data;
  },

  holatniOzgartirish: async (id, holati) => {
    await client.put(`/buyurtmalar/${id}/holat`, { holati });
  },
};
