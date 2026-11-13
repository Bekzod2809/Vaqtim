import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi } from '../api/products';
import ProductCard, { CardSkeleton } from '../components/ProductCard';
import { LogoMark } from '../components/Logo';
import LiveClock from '../components/LiveClock';
import { CATEGORY, TAGLINE } from '../constants';

// "bolim" URL'da saqlanadi (?bolim=1), shunda tugma bosilgan holat sahifa yangilansa ham qoladi
const SECTIONS = [
  { code: null, name: 'Barchasi' },
  ...Object.entries(CATEGORY).map(([code, k]) => ({ code, name: k.name })),
  { code: 'sales', name: 'Chegirmalar' },
];

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const section = params.get('section');
  const catalogRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const result =
          section === 'sales'
            ? await productsApi.getSales()
            : await productsApi.getAll(section ? Number(section) : null);
        setProducts(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [section]);

  // Footer'dagi "Soatlar" kabi havoladan kelinsa, darrov katalog qismiga tushiramiz
  useEffect(() => {
    if (section) {
      catalogRef.current?.scrollIntoView();
    }
  }, []);

  const selectSection = (code) => setParams(code ? { section: code } : {});

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Tepadan tushayotgan xira tilla nur */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(199,165,96,0.16),transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-8 text-center sm:pb-20 sm:pt-10 md:pb-28 md:pt-16">
          <LiveClock className="h-24 w-24 sm:h-28 sm:w-28 md:h-36 md:w-36" />

          <p
            className="mt-8 animate-appear text-[0.65rem] uppercase tracking-[0.3em] text-gold sm:mt-10 sm:text-xs sm:tracking-[0.45em]"
            style={{ animationDelay: '1.3s' }}
          >
            {TAGLINE}
          </p>
          <h1
            className="mt-4 animate-appear font-serif text-4xl font-semibold leading-[1.08] text-cream sm:mt-5 sm:text-5xl md:text-7xl"
            style={{ animationDelay: '1.45s' }}
          >
            Vaqtingizga munosib tanlov
          </h1>
          <p className="mx-auto mt-5 max-w-md animate-appear text-sm text-gray-400 sm:mt-6 sm:text-base" style={{ animationDelay: '1.6s' }}>
            Soatlar, ko'zoynaklar, kepkalar, bilaguzuk va uzuklar.
          </p>

          <button
            onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="store-btn-outline mt-8 animate-appear sm:mt-10"
            style={{ animationDelay: '1.75s' }}
          >
            Katalogni ko'rish
          </button>
        </div>
      </section>

      <section ref={catalogRef} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-14">
        <div className="scroll-row -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mb-12 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
          {SECTIONS.map((b) => {
            const active = (section ?? null) === b.code;

            return (
              <button
                key={b.name}
                onClick={() => selectSection(b.code)}
                className={`shrink-0 whitespace-nowrap rounded-md border px-4 py-2.5 text-sm tracking-wide transition-all duration-300 sm:px-5 sm:py-2 ${
                  active
                    ? 'border-gold bg-gold text-dark shadow-[0_6px_24px_-8px_rgba(199,165,96,0.7)]'
                    : 'border-dark-3 text-gray-400 hover:-translate-y-0.5 hover:border-gold/70 hover:text-gold'
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>

        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <div className="animate-appear py-16 text-center">
            <LogoMark className="mx-auto h-16 w-16 opacity-30" />
            <p className="mt-5 font-serif text-2xl text-cream">Bu bo'limda hozircha mahsulot yo'q</p>
            <p className="mt-2 text-sm text-gray-500">Tez orada yangi mahsulotlar qo'shiladi.</p>
          </div>
        )}

        {/* key — bo'lim almashganda kartalar qaytadan navbat bilan paydo bo'ladi */}
        <div key={section ?? 'barchasi'} className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {loading && Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)}
          {!loading && products.map((m, i) => <ProductCard key={m.productId} product={m} index={i} />)}
        </div>
      </section>
    </>
  );
}
