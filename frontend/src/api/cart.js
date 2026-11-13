import client from './client';

export const cartApi = {
  get: async () => {
    const { data } = await client.get('/cart');
    return data; // { mahsulotlar: [...], jamiSumma }
  },

  add: async (productId, quantity) => {
    await client.post('/cart', { productId, quantity });
  },

  changeQuantity: async (cartItemId, quantity) => {
    await client.put(`/cart/${cartItemId}`, { quantity });
  },

  remove: async (cartItemId) => {
    await client.delete(`/cart/${cartItemId}`);
  },
};
