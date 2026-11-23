// "−  2  +" ko'rinishidagi son tanlagich. Oddiy <input type="number"> o'rniga ishlatiladi:
// unda "1" ni o'chirib bo'lmasdi, "3" yozsa "13" bo'lardi va ombordan ko'p son kiritsa bo'lardi.
export default function QuantityPicker({ quantity, decrease, increase, min = 1, max = Infinity, disabled = false, large = false }) {
  const button = `text-gray-400 transition hover:bg-dark-3 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 ${
    large ? 'px-3.5 text-lg sm:px-4' : 'px-3 py-2 text-base sm:px-3 sm:py-1.5 sm:text-sm'
  }`;

  return (
    <div className={`inline-flex items-stretch justify-between overflow-hidden rounded-md border border-dark-3 bg-dark-2 ${large ? 'min-h-[3rem] shrink-0 sm:min-h-[3.25rem]' : ''}`}>
      <button type="button" onClick={decrease} disabled={disabled || quantity <= min} className={button} aria-label="Kamaytirish">
        −
      </button>
      <span
        className={`flex select-none items-center justify-center tabular-nums text-cream ${large ? 'w-10 text-base sm:w-12' : 'w-8 text-sm sm:w-9'}`}
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
