import client from './client';

export const paymentSettingsApi = {
  get: async () => {
    const { data } = await client.get('/payment-settings');
    return data;
  },

  update: async (payload) => {
    const { data } = await client.put('/payment-settings', payload);
    return data;
  },
};
