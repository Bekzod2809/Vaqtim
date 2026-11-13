import client from './client';

export const usersApi = {
  getAll: async () => {
    const { data } = await client.get('/users');
    return data;
  },

  changeRole: async (id, role) => {
    await client.put(`/users/${id}/role`, { role });
  },
};
