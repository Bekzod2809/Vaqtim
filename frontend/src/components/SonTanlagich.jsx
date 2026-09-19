// "−  2  +" ko'rinishidagi son tanlagich. Oddiy <input type="number"> o'rniga ishlatiladi:
// unda "1" ni o'chirib bo'lmasdi, "3" yozsa "13" bo'lardi va ombordan ko'p son kiritsa bo'lardi.
export default function SonTanlagich({ soni, kamaytirish, oshirish, min = 1, max = Infinity, disabled = false, katta = false }) {
  const tugma = `text-gray-400 transition hover:bg-qora-3 hover:text-oltin disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 ${
    katta ? 'px-4 text-lg' : 'px-3 py-1.5'
  }`;

  return (
    <div className={`inline-flex items-stretch overflow-hidden rounded-md border border-qora-3 bg-qora-2 ${katta ? 'min-h-[3.25rem] shrink-0' : ''}`}>
      <button type="button" onClick={kamaytirish} disabled={disabled || soni <= min} className={tugma} aria-label="Kamaytirish">
        −
      </button>
      <span
        className={`flex items-center justify-center tabular-nums text-krem ${katta ? 'w-12 text-base' : 'w-9 text-sm'}`}
        aria-live="polite"
      >
        {soni}
      </span>
      <button type="button" onClick={oshirish} disabled={disabled || soni >= max} className={tugma} aria-label="Oshirish">
        +
      </button>
    </div>
  );
}
