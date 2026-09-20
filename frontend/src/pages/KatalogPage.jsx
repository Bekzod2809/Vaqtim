import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mahsulotlarApi } from '../api/mahsulotlar';
import MahsulotKarta, { KartaSkelet } from '../components/MahsulotKarta';
import { LogoBelgi } from '../components/Logo';
import JonliSoat from '../components/JonliSoat';
import { KATEGORIYA, SHIOR } from '../constants';

// "bolim" URL'da saqlanadi (?bolim=1), shunda tugma bosilgan holat sahifa yangilansa ham qoladi
const BOLIMLAR = [
  { kod: null, nomi: 'Barchasi' },
  ...Object.entries(KATEGORIYA).map(([kod, k]) => ({ kod, nomi: k.nomi })),
  { kod: 'chegirmalar', nomi: 'Chegirmalar' },
];

export default function KatalogPage() {
  const [params, setParams] = useSearchParams();
  const bolim = params.get('bolim');
  const katalogRef = useRef(null);

  const [mahsulotlar, setMahsulotlar] = useState([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [xato, setXato] = useState('');

  useEffect(() => {
    const yuklash = async () => {
      setYuklanmoqda(true);
      setXato('');

      try {
        const natija =
          bolim === 'chegirmalar'
            ? await mahsulotlarApi.getChegirmalar()
            : await mahsulotlarApi.getAll(bolim ? Number(bolim) : null);
        setMahsulotlar(natija);
      } catch (err) {
        setXato(err.message);
      } finally {
        setYuklanmoqda(false);
      }
    };

    yuklash();
  }, [bolim]);

  // Footer'dagi "Soatlar" kabi havoladan kelinsa, darrov katalog qismiga tushiramiz
  useEffect(() => {
    if (bolim) {
      katalogRef.current?.scrollIntoView();
    }
  }, []);

  const bolimniTanlash = (kod) => setParams(kod ? { bolim: kod } : {});

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Tepadan tushayotgan xira tilla nur */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(199,165,96,0.16),transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-8 text-center sm:pb-20 sm:pt-10 md:pb-28 md:pt-16">
          <JonliSoat className="h-24 w-24 sm:h-28 sm:w-28 md:h-36 md:w-36" />

          <p
            className="mt-8 animate-paydo text-[0.65rem] uppercase tracking-[0.3em] text-oltin sm:mt-10 sm:text-xs sm:tracking-[0.45em]"
            style={{ animationDelay: '1.3s' }}
          >
            {SHIOR}
          </p>
          <h1
            className="mt-4 animate-paydo font-serif text-4xl font-semibold leading-[1.08] text-krem sm:mt-5 sm:text-5xl md:text-7xl"
            style={{ animationDelay: '1.45s' }}
          >
            Vaqtingizga munosib tanlov
          </h1>
          <p className="mx-auto mt-5 max-w-md animate-paydo text-sm text-gray-400 sm:mt-6 sm:text-base" style={{ animationDelay: '1.6s' }}>
            Soatlar, ko'zoynaklar, kepkalar, bilaguzuk va uzuklar.
          </p>

          <button
            onClick={() => katalogRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="dokon-btn-chiziqli mt-8 animate-paydo sm:mt-10"
            style={{ animationDelay: '1.75s' }}
          >
            Katalogni ko'rish
          </button>
        </div>
      </section>

      <section ref={katalogRef} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:py-14">
        <div className="yon-lenta -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mb-12 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
          {BOLIMLAR.map((b) => {
            const faol = (bolim ?? null) === b.kod;

            return (
              <button
                key={b.nomi}
                onClick={() => bolimniTanlash(b.kod)}
                className={`shrink-0 whitespace-nowrap rounded-md border px-4 py-2.5 text-sm tracking-wide transition-all duration-300 sm:px-5 sm:py-2 ${
                  faol
                    ? 'border-oltin bg-oltin text-qora shadow-[0_6px_24px_-8px_rgba(199,165,96,0.7)]'
                    : 'border-qora-3 text-gray-400 hover:-translate-y-0.5 hover:border-oltin/70 hover:text-oltin'
                }`}
              >
                {b.nomi}
              </button>
            );
          })}
        </div>

        {xato && <p className="text-center text-red-400">{xato}</p>}

        {!yuklanmoqda && !xato && mahsulotlar.length === 0 && (
          <div className="animate-paydo py-16 text-center">
            <LogoBelgi className="mx-auto h-16 w-16 opacity-30" />
            <p className="mt-5 font-serif text-2xl text-krem">Bu bo'limda hozircha mahsulot yo'q</p>
            <p className="mt-2 text-sm text-gray-500">Tez orada yangi mahsulotlar qo'shiladi.</p>
          </div>
        )}

        {/* key — bo'lim almashganda kartalar qaytadan navbat bilan paydo bo'ladi */}
        <div key={bolim ?? 'barchasi'} className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {yuklanmoqda && Array.from({ length: 8 }, (_, i) => <KartaSkelet key={i} />)}
          {!yuklanmoqda && mahsulotlar.map((m, i) => <MahsulotKarta key={m.mahsulotId} mahsulot={m} tartib={i} />)}
        </div>
      </section>
    </>
  );
}
