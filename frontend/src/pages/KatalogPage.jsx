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

        <div className="relative mx-auto max-w-3xl px-4 pb-20 pt-10 text-center md:pb-28 md:pt-16">
          <JonliSoat className="h-28 w-28 md:h-36 md:w-36" />

          <p className="mt-10 animate-paydo text-xs uppercase tracking-[0.45em] text-oltin" style={{ animationDelay: '1.3s' }}>
            {SHIOR}
          </p>
          <h1
            className="mt-5 animate-paydo font-serif text-5xl font-semibold leading-[1.05] text-krem md:text-7xl"
            style={{ animationDelay: '1.45s' }}
          >
            Vaqtingizga munosib tanlov
          </h1>
          <p className="mx-auto mt-6 max-w-md animate-paydo text-gray-400" style={{ animationDelay: '1.6s' }}>
            Soatlar, ko'zoynaklar, kepkalar, bilaguzuk va uzuklar.
          </p>

          <button
            onClick={() => katalogRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="dokon-btn-chiziqli mt-10 animate-paydo"
            style={{ animationDelay: '1.75s' }}
          >
            Katalogni ko'rish
          </button>
        </div>
      </section>

      <section ref={katalogRef} className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14">
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {BOLIMLAR.map((b) => {
            const faol = (bolim ?? null) === b.kod;

            return (
              <button
                key={b.nomi}
                onClick={() => bolimniTanlash(b.kod)}
                className={`rounded-md border px-5 py-2 text-sm tracking-wide transition-all duration-300 ${
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
        <div key={bolim ?? 'barchasi'} className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {yuklanmoqda && Array.from({ length: 8 }, (_, i) => <KartaSkelet key={i} />)}
          {!yuklanmoqda && mahsulotlar.map((m, i) => <MahsulotKarta key={m.mahsulotId} mahsulot={m} tartib={i} />)}
        </div>
      </section>
    </>
  );
}
