export const STORE_NAME = 'Vaqtim';
export const TAGLINE = "Soat do'koni";

// Backenddagi Kategoriya enum bilan mos keladi. "yol" — admin endpointidagi qism: /api/mahsulotlar/soatlar
export const CATEGORY = {
  1: { name: 'Soatlar', singular: 'Soat', path: 'watches' },
  2: { name: "Ko'zoynaklar", singular: "Ko'zoynak", path: 'glasses' },
  3: { name: 'Kepkalar', singular: 'Kepka', path: 'caps' },
  4: { name: 'Bilaguzuklar', singular: 'Bilaguzuk', path: 'bracelets' },
  5: { name: 'Uzuklar', singular: 'Uzuk', path: 'rings' },
};

// Backenddagi MexanizmTuri, KepkaTuri, Rol enumlari
export const MOVEMENT = { 1: 'Mexanik', 2: 'Batareyka' };
export const CAP_TYPE = { 1: 'Kundalik', 2: 'Sport' };
export const ROLE = { 1: 'User', 2: 'Admin' };

// Backenddagi BuyurtmaHolati enum
export const ORDER_STATUS = {
  1: { name: 'Yangi', color: 'bg-blue-100 text-blue-800' },
  2: { name: 'Tasdiqlangan', color: 'bg-amber-100 text-amber-800' },
  3: { name: 'Yetkazilgan', color: 'bg-green-100 text-green-800' },
  4: { name: 'Bekor qilingan', color: 'bg-gray-200 text-gray-700' },
};
