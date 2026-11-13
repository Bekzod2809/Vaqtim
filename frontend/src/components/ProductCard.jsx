import { Link } from 'react-router-dom';
import { CATEGORY } from '../constants';
import { formatPrice } from '../utils';
import { LogoMark } from './Logo';

// tartib — kartalar navbat bilan paydo bo'lishi uchun (har biri 70ms kechroq)
export default function ProductCard({ product: m, index = 0 }) {
  const discountPercent = m.salePrice ? Math.round((1 - m.salePrice / m.price) * 100) : 0;

  return (
    <Link
      to={`/product/${m.productId}`}
      className="group block animate-appear"
      style={{ animationDelay: `${Math.min(index, 12) * 70}ms` }}
    >
      <div className="relative aspect-square overflow-hidden bg-dark-2 ring-1 ring-dark-3 transition duration-500 group-hover:ring-gold/50">
        {m.mainImageUrl ? (
          <img
            src={m.mainImageUrl}
            alt={m.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <NoImage category={m.category} />
        )}

        {/* Pastdan ko'tariladigan qora soya va "Batafsil" yozuvi */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-4 left-4 translate-y-3 text-xs uppercase tracking-[0.3em] text-cream opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Batafsil →
        </span>

        {discountPercent > 0 && (
          <span className="absolute left-2 top-2 bg-gold px-2 py-0.5 text-[0.7rem] font-semibold text-dark sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
            −{discountPercent}%
          </span>
        )}

        {/* Oddiy xaridorga tugagan mahsulot umuman kelmaydi, bu belgini faqat admin ko'radi */}
        {m.stockQuantity === 0 && (
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/75 py-2 text-center text-xs uppercase tracking-widest text-gray-300">
            Tugagan
          </span>
        )}
      </div>

      <div className="pt-3 sm:pt-4">
        <p className="truncate text-[0.65rem] uppercase tracking-[0.2em] text-gold sm:text-[0.7rem] sm:tracking-[0.25em]">{m.brand}</p>
        <h3 className="mt-1 font-serif text-lg leading-snug text-cream transition-colors duration-300 group-hover:text-gold-light sm:text-xl">
          {m.name}
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 sm:gap-x-3">
          {m.salePrice ? (
            <>
              <span className="text-sm font-medium text-gold sm:text-base">{formatPrice(m.salePrice)}</span>
              <span className="text-xs text-gray-500 line-through sm:text-sm">{formatPrice(m.price)}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-gray-200 sm:text-base">{formatPrice(m.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Rasmi yo'q mahsulot uchun: xira logo belgisi va kategoriya nomi
export function NoImage({ category }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-dark-2 to-dark">
      <LogoMark className="h-14 w-14 opacity-20" />
      <span className="font-serif text-lg text-gray-600">{CATEGORY[category]?.singular}</span>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-square" />
      <div className="skeleton mt-4 h-3 w-16" />
      <div className="skeleton mt-3 h-5 w-3/4" />
      <div className="skeleton mt-3 h-4 w-1/2" />
    </div>
  );
}
