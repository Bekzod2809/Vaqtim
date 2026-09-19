import client from './client';

export const savatApi = {
  get: async () => {
    const { data } = await client.get('/savat');
    return data; // { mahsulotlar: [...], jamiSumma }
  },

  qoshish: async (mahsulotId, soni) => {
    await client.post('/savat', { mahsulotId, soni });
  },

  soniniOzgartirish: async (savatMahsulotiId, soni) => {
    await client.put(`/savat/${savatMahsulotiId}`, { soni });
  },

  ochirish: async (savatMahsulotiId) => {
    await client.delete(`/savat/${savatMahsulotiId}`);
  },
};
