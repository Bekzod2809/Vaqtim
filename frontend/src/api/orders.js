import client from './client';

export const ordersApi = {
  // Xaridor uchun (multipart/form-data: manzil, ixtiyoriy qo'shimcha raqam va to'lov cheki rasmi)
  place: async ({ deliveryAddress, additionalPhone, receiptImage }) => {
    const form = new FormData();
    form.append('DeliveryAddress', deliveryAddress);
    if (additionalPhone) {
      form.append('AdditionalPhone', additionalPhone);
    }
    if (receiptImage) {
      form.append('ReceiptImage', receiptImage);
    }

    const { data } = await client.post('/orders', form);
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
