import axios from 'axios';

export const AUTH_KALIT = 'watchshop_auth';

// "/api" — Vite proxy uni backendga uzatadi (vite.config.js)
const client = axios.create({
  baseURL: '/api',
});

// Har bir so'rovga tokenni qo'shamiz
client.interceptors.request.use((config) => {
  const saqlangan = localStorage.getItem(AUTH_KALIT);

  if (saqlangan) {
    const { token } = JSON.parse(saqlangan);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Barcha xatolarni bir xil shaklga keltiramiz: { status, message, detail }
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // Token muddati tugagan: saqlangan kirishni o'chirib, kirish sahifasiga yuboramiz
    if (status === 401 && localStorage.getItem(AUTH_KALIT)) {
      localStorage.removeItem(AUTH_KALIT);
      window.location.assign('/kirish');
    }

    let message = data?.message || data?.title || "Noma'lum xatolik yuz berdi";

    if (!error.response) {
      message = "Server bilan bog'lanib bo'lmadi. Backend ishga tushirilganmi?";
    } else if (status === 401 && !data?.message) {
      message = 'Tizimga kiring.';
    } else if (status === 403) {
      message = "Bu amal uchun ruxsatingiz yo'q.";
    }

    return Promise.reject({
      status,
      message,
      detail: data?.detail ?? data?.errors,
    });
  }
);

export default client;
