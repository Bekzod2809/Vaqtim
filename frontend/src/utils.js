// Brauzerlar 'uz-UZ' formatini har xil ko'rsatadi (ba'zisi vergul qo'yadi), shuning uchun o'zimiz formatlaymiz:
// 3900000 -> "3 900 000 so'm" (regex har 3 xonadan oldin bo'shliq qo'yadi)
export function formatNarx(narx) {
  const butun = Math.round(Number(narx));
  return butun.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
}

// "2026-09-19T08:05:00Z" -> "19.09.2026 13:05" (foydalanuvchi kompyuterining vaqt zonasida)
export function formatSana(sana) {
  const d = new Date(sana);
  const ikki = (son) => String(son).padStart(2, '0');

  return `${ikki(d.getDate())}.${ikki(d.getMonth() + 1)}.${d.getFullYear()} ${ikki(d.getHours())}:${ikki(d.getMinutes())}`;
}

// Backend validatsiya xatosi: { "Nomi": ["..."] } -> { nomi: "..." }, forma maydonlari tagida ko'rsatish uchun
export function maydonXatolari(detail) {
  if (!detail || typeof detail !== 'object' || Array.isArray(detail)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(detail).map(([kalit, xatolar]) => [
      kalit.charAt(0).toLowerCase() + kalit.slice(1),
      Array.isArray(xatolar) ? xatolar[0] : String(xatolar),
    ])
  );
}
