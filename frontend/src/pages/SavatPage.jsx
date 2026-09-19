import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { savatApi } from '../api/savat';
import { buyurtmalarApi } from '../api/buyurtmalar';
import { LogoBelgi } from '../components/Logo';
import SonTanlagich from '../components/SonTanlagich';
import { useToast } from '../context/ToastContext';
import { formatNarx, maydonXatolari } from '../utils';

export default function SavatPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [savat, setSavat] = useState(null);
  const [forma, setForma] = useState({ yetkazishManzili: '', telefon: '+998' });
  const [xatolar, setXatolar] = useState({});
  const [yuborilmoqda, setYuborilmoqda] = useState(false);

  const yuklash = async () => {
    try {
      setSavat(await savatApi.get());
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  useEffect(() => {
    yuklash();
  }, []);

  const soniniOzgartirish = async (qator, yangiSoni) => {
    if (yangiSoni < 1) {
      return;
    }

    try {
      await savatApi.soniniOzgartirish(qator.savatMahsulotiId, yangiSoni);
      yuklash();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  const ochirish = async (qator) => {
    try {
      await savatApi.ochirish(qator.savatMahsulotiId);
      yuklash();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  const buyurtmaBerish = async (e) => {
    e.preventDefault();
    setXatolar({});
    setYuborilmoqda(true);

    try {
      const id = await buyurtmalarApi.berish(forma);
      toast(`#${id} buyurtma qabul qilindi`);
      navigate('/buyurtmalarim');
    } catch (err) {
      setXatolar(maydonXatolari(err.detail));
      toast(err.message, 'xato');
      yuklash(); // ombor o'zgargan bo'lishi mumkin
    } finally {
      setYuborilmoqda(false);
    }
  };

  if (!savat) {
    return (
      <section className="mx-auto max-w-6xl space-y-4 px-4 py-12">
        <div className="skelet h-12 w-48" />
        <div className="skelet h-28 w-full" />
        <div className="skelet h-28 w-full" />
      </section>
    );
  }

  if (savat.mahsulotlar.length === 0) {
    return (
      <section className="animate-paydo py-28 text-center">
        <LogoBelgi className="mx-auto h-20 w-20 opacity-30" />
        <h1 className="mt-6 font-serif text-4xl text-krem">Savat bo'sh</h1>
        <p className="mt-3 text-gray-500">Katalogdan o'zingizga yoqqan mahsulotni tanlang.</p>
        <Link to="/" className="dokon-btn-chiziqli mt-10">
          Katalogga o'tish
        </Link>
      </section>
    );
  }

  // Savatda ombordagidan ko'p mahsulot bo'lsa (boshqa xaridor olib qo'ygan), buyurtma berib bo'lmaydi
  const yetarliEmas = savat.mahsulotlar.some((q) => !q.ombordaYetarli);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-10 animate-paydo font-serif text-5xl font-semibold text-krem">Savat</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        <ul className="divide-y divide-qora-3 border-y border-qora-3 lg:col-span-2">
          {savat.mahsulotlar.map((q, i) => (
            <li key={q.savatMahsulotiId} className="flex animate-paydo gap-5 py-6" style={{ animationDelay: `${i * 80}ms` }}>
              <Link to={`/mahsulot/${q.mahsulotId}`} className="group h-28 w-28 shrink-0 overflow-hidden bg-qora-2 ring-1 ring-qora-3">
                {q.asosiyRasmHavolasi && (
                  <img
                    src={q.asosiyRasmHavolasi}
                    alt={q.nomi}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                )}
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link to={`/mahsulot/${q.mahsulotId}`} className="font-serif text-2xl text-krem transition hover:text-oltin">
                      {q.nomi}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">{formatNarx(q.narxi)}</p>
                    {!q.ombordaYetarli && <p className="mt-1 text-sm text-red-400">Omborda yetarli emas</p>}
                  </div>
                  <p className="whitespace-nowrap text-krem">{formatNarx(q.summa)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <SonTanlagich
                    soni={q.soni}
                    kamaytirish={() => soniniOzgartirish(q, q.soni - 1)}
                    oshirish={() => soniniOzgartirish(q, q.soni + 1)}
                  />
                  <button onClick={() => ochirish(q)} className="text-sm text-gray-500 transition hover:text-red-400">
                    O'chirish
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <form
          onSubmit={buyurtmaBerish}
          className="h-fit animate-paydo space-y-5 border border-qora-3 bg-qora-2 p-7 lg:sticky lg:top-28"
          style={{ animationDelay: '150ms' }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-oltin">Buyurtma</p>

          <div className="flex items-baseline justify-between border-b border-qora-3 pb-5">
            <span className="text-gray-400">Jami</span>
            <span className="font-serif text-3xl text-oltin">{formatNarx(savat.jamiSumma)}</span>
          </div>

          <div>
            <textarea
              value={forma.yetkazishManzili}
              onChange={(e) => setForma({ ...forma, yetkazishManzili: e.target.value })}
              placeholder="Yetkazish manzili"
              rows={3}
              className="dokon-input"
            />
            {xatolar.yetkazishManzili && <p className="mt-1 text-xs text-red-400">{xatolar.yetkazishManzili}</p>}
          </div>

          <div>
            <input
              value={forma.telefon}
              onChange={(e) => setForma({ ...forma, telefon: e.target.value })}
              placeholder="+998901234567"
              className="dokon-input"
            />
            {xatolar.telefon && <p className="mt-1 text-xs text-red-400">{xatolar.telefon}</p>}
          </div>

          <p className="text-xs text-gray-500">To'lov yetkazib berilganda naqd amalga oshiriladi.</p>

          {yetarliEmas && <p className="text-sm text-red-400">Avval omborda yetarli bo'lmagan mahsulotlar sonini kamaytiring.</p>}

          <button type="submit" disabled={yuborilmoqda || yetarliEmas} className="dokon-btn">
            {yuborilmoqda ? 'Yuborilmoqda...' : 'Buyurtma berish'}
          </button>
        </form>
      </div>
    </section>
  );
}
