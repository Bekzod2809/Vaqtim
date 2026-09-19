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
      <section className="mx-auto max-w-3xl space-y-5 px-4 py-12">
        <div className="skelet h-12 w-64" />
        <div className="skelet h-48 w-full" />
      </section>
    );
  }

  if (buyurtmalar.length === 0) {
    return (
      <section className="animate-paydo py-28 text-center">
        <LogoBelgi className="mx-auto h-20 w-20 opacity-30" />
        <h1 className="mt-6 font-serif text-4xl text-krem">Hali buyurtma yo'q</h1>
        <Link to="/" className="dokon-btn-chiziqli mt-10">
          Katalogga o'tish
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-10 animate-paydo font-serif text-5xl font-semibold text-krem">Buyurtmalarim</h1>

      <div className="space-y-6">
        {buyurtmalar.map((b, i) => (
          <article
            key={b.buyurtmaId}
            className="animate-paydo border border-qora-3 bg-qora-2 p-7 transition duration-300 hover:border-oltin/40"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-serif text-2xl text-krem">#{b.buyurtmaId}</span>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${BUYURTMA_HOLATI[b.holati].rang}`}>
                  {BUYURTMA_HOLATI[b.holati].nomi}
                </span>
              </div>
              <span className="text-sm text-gray-500">{formatSana(b.yaratilganVaqt)}</span>
            </div>

            {b.holati !== 4 && (
              <div className="mt-6 flex gap-2">
                {BOSQICHLAR.map((bosqich) => (
                  <div key={bosqich} className="flex-1">
                    <div className={`h-0.5 transition-colors duration-700 ${b.holati >= bosqich ? 'bg-oltin' : 'bg-qora-3'}`} />
                    <p className={`mt-2 text-[0.7rem] uppercase tracking-wider ${b.holati >= bosqich ? 'text-oltin' : 'text-gray-600'}`}>
                      {BUYURTMA_HOLATI[bosqich].nomi}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <ul className="my-6 space-y-2 border-y border-qora-3 py-5 text-sm">
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
              <div className="text-sm text-gray-500">
                {b.yetkazishManzili} · {b.telefon}
              </div>
              <div className="flex items-center gap-5">
                <span className="font-serif text-2xl text-oltin">{formatNarx(b.jamiSumma)}</span>
                {b.holati === 1 && (
                  <button onClick={() => bekorQilish(b)} className="text-sm text-gray-500 transition hover:text-red-400">
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
