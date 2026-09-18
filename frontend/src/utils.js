export function formatNarx(narx) {
  return new Intl.NumberFormat('uz-UZ').format(narx) + " so'm";
}

export function formatSana(sana) {
  return new Date(sana).toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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
