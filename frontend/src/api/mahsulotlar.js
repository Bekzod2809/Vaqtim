import client from './client';
import { KATEGORIYA } from '../constants';

export const mahsulotlarApi = {
  getAll: async (kategoriya) => {
    const { data } = await client.get('/mahsulotlar', {
      params: kategoriya ? { kategoriya } : {},
    });
    return data;
  },

  getChegirmalar: async () => {
    const { data } = await client.get('/mahsulotlar/chegirmalar');
    return data;
  },

  getById: async (id) => {
    const { data } = await client.get(`/mahsulotlar/${id}`);
    return data;
  },

  // Har kategoriyaning o'z endpointi bor: /mahsulotlar/soatlar, /mahsulotlar/kepkalar ...
  create: async (kategoriya, payload) => {
    const { data } = await client.post(`/mahsulotlar/${KATEGORIYA[kategoriya].yol}`, payload);
    return data; // yangi mahsulot id
  },

  update: async (kategoriya, id, payload) => {
    await client.put(`/mahsulotlar/${KATEGORIYA[kategoriya].yol}/${id}`, payload);
  },

  remove: async (id) => {
    await client.delete(`/mahsulotlar/${id}`);
  },

  rasmYuklash: async (mahsulotId, fayl, asosiymi) => {
    const forma = new FormData();
    forma.append('Rasm', fayl);
    forma.append('AsosiyRasmmi', asosiymi);

    const { data } = await client.post(`/mahsulotlar/${mahsulotId}/rasmlar`, forma);
    return data;
  },

  rasmOchirish: async (rasmId) => {
    await client.delete(`/mahsulotlar/rasmlar/${rasmId}`);
  },
};
