// "−  2  +" ko'rinishidagi son tanlagich. Oddiy <input type="number"> o'rniga ishlatiladi:
// unda "1" ni o'chirib bo'lmasdi, "3" yozsa "13" bo'lardi va ombordan ko'p son kiritsa bo'lardi.
export default function QuantityPicker({ quantity, decrease, increase, min = 1, max = Infinity, disabled = false, large = false }) {
  const button = `text-gray-400 transition hover:bg-dark-3 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 ${
    large ? 'px-5 text-xl sm:px-4 sm:text-lg' : 'px-3.5 py-2.5 text-base sm:px-3 sm:py-1.5 sm:text-sm'
  }`;

  return (
    <div className={`inline-flex items-stretch overflow-hidden rounded-md border border-dark-3 bg-dark-2 ${large ? 'min-h-[3.25rem] shrink-0' : ''}`}>
      <button type="button" onClick={decrease} disabled={disabled || quantity <= min} className={button} aria-label="Kamaytirish">
        −
      </button>
      <span
        className={`flex select-none items-center justify-center tabular-nums text-cream ${large ? 'w-12 text-base' : 'w-9 text-sm'}`}
        aria-live="polite"
      >
        {quantity}
      </span>
      <button type="button" onClick={increase} disabled={disabled || quantity >= max} className={button} aria-label="Oshirish">
        +
      </button>
    </div>
  );
}
