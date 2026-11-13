// Brauzerlar 'uz-UZ' formatini har xil ko'rsatadi (ba'zisi vergul qo'yadi), shuning uchun o'zimiz formatlaymiz:
// 3900000 -> "3 900 000 so'm" (regex har 3 xonadan oldin bo'shliq qo'yadi)
export function formatPrice(price) {
  const whole = Math.round(Number(price));
  return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
}

// "2026-09-19T08:05:00Z" -> "19.09.2026 13:05" (foydalanuvchi kompyuterining vaqt zonasida)
export function formatDate(date) {
  const d = new Date(date);
  const two = (number) => String(number).padStart(2, '0');

  return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()} ${two(d.getHours())}:${two(d.getMinutes())}`;
}

// Backend validatsiya xatosi: { "Nomi": ["..."] } -> { nomi: "..." }, forma maydonlari tagida ko'rsatish uchun
export function fieldErrors(detail) {
  if (!detail || typeof detail !== 'object' || Array.isArray(detail)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(detail).map(([key, errors]) => [
      key.charAt(0).toLowerCase() + key.slice(1),
      Array.isArray(errors) ? errors[0] : String(errors),
    ])
  );
}
