import { useEffect, useState } from 'react';
import { buyurtmalarApi } from '../../api/buyurtmalar';
import { useToast } from '../../context/ToastContext';
import { BUYURTMA_HOLATI } from '../../constants';
import { formatNarx, formatSana } from '../../utils';

// Har bir holatdan qaysi holatlarga o'tish mumkin (backenddagi qoida bilan bir xil)
const KEYINGI_HOLATLAR = {
  1: [
    { holat: 2, matn: 'Tasdiqlash' },
    { holat: 4, matn: 'Bekor qilish' },
  ],
  2: [
    { holat: 3, matn: 'Yetkazildi' },
    { holat: 4, matn: 'Bekor qilish' },
  ],
};

export default function BuyurtmalarPage() {
  const toast = useToast();
  const [buyurtmalar, setBuyurtmalar] = useState([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);

  const yuklash = async () => {
    try {
      setBuyurtmalar(await buyurtmalarApi.getAll());
    } catch (err) {
      toast(err.message, 'xato');
    } finally {
      setYuklanmoqda(false);
    }
  };

  useEffect(() => {
    yuklash();
  }, []);

  const holatniOzgartirish = async (buyurtma, holat) => {
    if (holat === 4 && !window.confirm(`#${buyurtma.buyurtmaId} buyurtma bekor qilinsinmi? Mahsulotlar omborga qaytadi.`)) {
      return;
    }

    try {
      await buyurtmalarApi.holatniOzgartirish(buyurtma.buyurtmaId, holat);
      toast(`#${buyurtma.buyurtmaId}: ${BUYURTMA_HOLATI[holat].nomi}`);
      yuklash();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold sm:text-2xl">Buyurtmalar</h1>

      {yuklanmoqda && <p className="text-gray-500">Yuklanmoqda...</p>}
      {!yuklanmoqda && buyurtmalar.length === 0 && <p className="text-gray-500">Hali buyurtma yo'q.</p>}

      <div className="space-y-4">
        {buyurtmalar.map((b) => (
          <div key={b.buyurtmaId} className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">#{b.buyurtmaId}</span>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${BUYURTMA_HOLATI[b.holati].rang}`}>
                    {BUYURTMA_HOLATI[b.holati].nomi}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{formatSana(b.yaratilganVaqt)}</p>
              </div>

              <div className="min-w-0 break-words text-sm sm:text-right">
                <p className="font-medium">{b.telefon}</p>
                <p className="text-gray-500">{b.yetkazishManzili}</p>
              </div>
            </div>

            <ul className="my-4 divide-y divide-gray-100 border-y border-gray-100 text-sm">
              {b.mahsulotlari.map((m, i) => (
                <li key={i} className="flex justify-between gap-3 py-2">
                  <span>
                    {m.mahsulotNomi} <span className="text-gray-500">× {m.soni}</span>
                  </span>
                  <span className="whitespace-nowrap">{formatNarx(m.summa)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold">Jami: {formatNarx(b.jamiSumma)}</p>

              <div className="flex w-full gap-2 sm:w-auto">
                {(KEYINGI_HOLATLAR[b.holati] ?? []).map((k) => (
                  <button
                    key={k.holat}
                    onClick={() => holatniOzgartirish(b, k.holat)}
                    className={`flex-1 sm:flex-none ${k.holat === 4 ? 'admin-btn-xavfli' : 'admin-btn px-3 py-1.5'}`}
                  >
                    {k.matn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
