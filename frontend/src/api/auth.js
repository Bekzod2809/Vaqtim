import client from './client';

export const authApi = {
  register: async (payload) => {
    const { data } = await client.post('/auth/register', payload);
    return data; // yangi foydalanuvchi id
  },

  login: async (payload) => {
    const { data } = await client.post('/auth/login', payload);
    return data; // { token, foydalanuvchi }
  },

  resetPassword: async (payload) => {
    const { data } = await client.post('/auth/reset-password', payload);
    return data; // { token, user }
  },

  getTelegramBotLink: async () => {
    const { data } = await client.get('/auth/telegram-bot');
    return data;
  },
};
