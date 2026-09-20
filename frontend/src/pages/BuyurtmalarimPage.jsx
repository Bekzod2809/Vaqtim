import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buyurtmalarApi } from '../api/buyurtmalar';
import { LogoBelgi } from '../components/Logo';
import { useToast } from '../context/ToastContext';
import { BUYURTMA_HOLATI } from '../constants';
import { formatNarx, formatSana } from '../utils';

// Buyurtma qaysi bosqichda ekanini ko'rsatuvchi chiziq (bekor qilinganda ko'rsatilmaydi)
const BOSQICHLAR = [1, 2, 3];

export default function BuyurtmalarimPage() {
  const toast = useToast();
  const [buyurtmalar, setBuyurtmalar] = useState(null);

  const yuklash = async () => {
    try {
      setBuyurtmalar(await buyurtmalarApi.getMening());
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  useEffect(() => {
    yuklash();
  }, []);

  const bekorQilish = async (b) => {
    if (!window.confirm(`#${b.buyurtmaId} buyurtma bekor qilinsinmi?`)) {
      return;
    }

    try {
      await buyurtmalarApi.bekorQilish(b.buyurtmaId);
      toast('Buyurtma bekor qilindi');
      yuklash();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  if (!buyurtmalar) {
    return (
      <section className="mx-auto max-w-3xl space-y-5 px-4 py-8 md:py-12">
        <div className="skelet h-12 w-64" />
        <div className="skelet h-48 w-full" />
      </section>
    );
  }

  if (buyurtmalar.length === 0) {
    return (
      <section className="animate-paydo px-4 py-20 text-center md:py-28">
        <LogoBelgi className="mx-auto h-20 w-20 opacity-30" />
        <h1 className="mt-6 font-serif text-3xl text-krem sm:text-4xl">Hali buyurtma yo'q</h1>
        <Link to="/" className="dokon-btn-chiziqli mt-10">
          Katalogga o'tish
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="mb-7 animate-paydo font-serif text-3xl font-semibold text-krem sm:text-4xl md:mb-10 md:text-5xl">Buyurtmalarim</h1>

      <div className="space-y-5 md:space-y-6">
        {buyurtmalar.map((b, i) => (
          <article
            key={b.buyurtmaId}
            className="animate-paydo border border-qora-3 bg-qora-2 p-5 transition duration-300 hover:border-oltin/40 sm:p-7"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-serif text-xl text-krem sm:text-2xl">#{b.buyurtmaId}</span>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${BUYURTMA_HOLATI[b.holati].rang}`}>
                  {BUYURTMA_HOLATI[b.holati].nomi}
                </span>
              </div>
              <span className="text-sm text-gray-500">{formatSana(b.yaratilganVaqt)}</span>
            </div>

            {b.holati !== 4 && (
              <div className="mt-5 flex gap-2 sm:mt-6">
                {BOSQICHLAR.map((bosqich) => (
                  <div key={bosqich} className="flex-1">
                    <div className={`h-0.5 transition-colors duration-700 ${b.holati >= bosqich ? 'bg-oltin' : 'bg-qora-3'}`} />
                    <p className={`mt-2 text-[0.65rem] uppercase tracking-wide sm:text-[0.7rem] sm:tracking-wider ${b.holati >= bosqich ? 'text-oltin' : 'text-gray-600'}`}>
                      {BUYURTMA_HOLATI[bosqich].nomi}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <ul className="my-5 space-y-2 border-y border-qora-3 py-4 text-sm sm:my-6 sm:py-5">
              {b.mahsulotlari.map((m, j) => (
                <li key={j} className="flex justify-between gap-4 text-gray-300">
                  <span>
                    {m.mahsulotNomi} <span className="text-gray-500">× {m.soni}</span>
                  </span>
                  <span className="whitespace-nowrap">{formatNarx(m.summa)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 break-words text-sm text-gray-500">
                {b.yetkazishManzili} · {b.telefon}
              </div>
              <div className="flex w-full items-center justify-between gap-5 sm:w-auto sm:justify-end">
                <span className="font-serif text-xl text-oltin sm:text-2xl">{formatNarx(b.jamiSumma)}</span>
                {b.holati === 1 && (
                  <button onClick={() => bekorQilish(b)} className="-mr-2 px-2 py-2 text-sm text-gray-500 transition hover:text-red-400">
                    Bekor qilish
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
