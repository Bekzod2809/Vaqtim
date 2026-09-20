import { Link } from 'react-router-dom';
import { KATEGORIYA } from '../constants';
import { formatNarx } from '../utils';
import { LogoBelgi } from './Logo';

// tartib — kartalar navbat bilan paydo bo'lishi uchun (har biri 70ms kechroq)
export default function MahsulotKarta({ mahsulot: m, tartib = 0 }) {
  const chegirmaFoizi = m.chegirmaNarxi ? Math.round((1 - m.chegirmaNarxi / m.narxi) * 100) : 0;

  return (
    <Link
      to={`/mahsulot/${m.mahsulotId}`}
      className="group block animate-paydo"
      style={{ animationDelay: `${Math.min(tartib, 12) * 70}ms` }}
    >
      <div className="relative aspect-square overflow-hidden bg-qora-2 ring-1 ring-qora-3 transition duration-500 group-hover:ring-oltin/50">
        {m.asosiyRasmHavolasi ? (
          <img
            src={m.asosiyRasmHavolasi}
            alt={m.nomi}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <RasmYoq kategoriya={m.kategoriya} />
        )}

        {/* Pastdan ko'tariladigan qora soya va "Batafsil" yozuvi */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-4 left-4 translate-y-3 text-xs uppercase tracking-[0.3em] text-krem opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Batafsil →
        </span>

        {chegirmaFoizi > 0 && (
          <span className="absolute left-2 top-2 bg-oltin px-2 py-0.5 text-[0.7rem] font-semibold text-qora sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
            −{chegirmaFoizi}%
          </span>
        )}

        {/* Oddiy xaridorga tugagan mahsulot umuman kelmaydi, bu belgini faqat admin ko'radi */}
        {m.ombordagiSoni === 0 && (
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/75 py-2 text-center text-xs uppercase tracking-widest text-gray-300">
            Tugagan
          </span>
        )}
      </div>

      <div className="pt-3 sm:pt-4">
        <p className="truncate text-[0.65rem] uppercase tracking-[0.2em] text-oltin sm:text-[0.7rem] sm:tracking-[0.25em]">{m.brendi}</p>
        <h3 className="mt-1 font-serif text-lg leading-snug text-krem transition-colors duration-300 group-hover:text-oltin-och sm:text-xl">
          {m.nomi}
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:gap-x-3">
          {m.chegirmaNarxi ? (
            <>
              <span className="text-sm font-medium text-oltin sm:text-base">{formatNarx(m.chegirmaNarxi)}</span>
              <span className="text-xs text-gray-500 line-through sm:text-sm">{formatNarx(m.narxi)}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-gray-200 sm:text-base">{formatNarx(m.narxi)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Rasmi yo'q mahsulot uchun: xira logo belgisi va kategoriya nomi
export function RasmYoq({ kategoriya }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-qora-2 to-qora">
      <LogoBelgi className="h-14 w-14 opacity-20" />
      <span className="font-serif text-lg text-gray-600">{KATEGORIYA[kategoriya]?.birlik}</span>
    </div>
  );
}

export function KartaSkelet() {
  return (
    <div>
      <div className="skelet aspect-square" />
      <div className="skelet mt-4 h-3 w-16" />
      <div className="skelet mt-3 h-5 w-3/4" />
      <div className="skelet mt-3 h-4 w-1/2" />
    </div>
  );
}
