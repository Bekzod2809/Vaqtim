import client from './client';

export const authApi = {
  royxatdanOtish: async (payload) => {
    const { data } = await client.post('/auth/royxatdan-otish', payload);
    return data; // yangi foydalanuvchi id
  },

  kirish: async (payload) => {
    const { data } = await client.post('/auth/kirish', payload);
    return data; // { token, foydalanuvchi }
  },
};
