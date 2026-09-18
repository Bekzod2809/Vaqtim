import client from './client';

export const foydalanuvchilarApi = {
  getAll: async () => {
    const { data } = await client.get('/foydalanuvchilar');
    return data;
  },

  rolniOzgartirish: async (id, rol) => {
    await client.put(`/foydalanuvchilar/${id}/rol`, { rol });
  },
};
