export const DOKON_NOMI = 'Vaqtim';
export const SHIOR = "Soat do'koni";

// Backenddagi Kategoriya enum bilan mos keladi. "yol" — admin endpointidagi qism: /api/mahsulotlar/soatlar
export const KATEGORIYA = {
  1: { nomi: 'Soatlar', birlik: 'Soat', yol: 'soatlar' },
  2: { nomi: "Ko'zoynaklar", birlik: "Ko'zoynak", yol: 'kozoynaklar' },
  3: { nomi: 'Kepkalar', birlik: 'Kepka', yol: 'kepkalar' },
  4: { nomi: 'Bilaguzuklar', birlik: 'Bilaguzuk', yol: 'bilaguzuklar' },
  5: { nomi: 'Uzuklar', birlik: 'Uzuk', yol: 'uzuklar' },
};

// Backenddagi MexanizmTuri, KepkaTuri, Rol enumlari
export const MEXANIZM = { 1: 'Mexanik', 2: 'Batareyka' };
export const KEPKA_TURI = { 1: 'Kundalik', 2: 'Sport' };
export const ROL = { 1: 'User', 2: 'Admin' };

// Backenddagi BuyurtmaHolati enum
export const BUYURTMA_HOLATI = {
  1: { nomi: 'Yangi', rang: 'bg-blue-100 text-blue-800' },
  2: { nomi: 'Tasdiqlangan', rang: 'bg-amber-100 text-amber-800' },
  3: { nomi: 'Yetkazilgan', rang: 'bg-green-100 text-green-800' },
  4: { nomi: 'Bekor qilingan', rang: 'bg-gray-200 text-gray-700' },
};
