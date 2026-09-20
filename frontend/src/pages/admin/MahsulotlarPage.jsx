import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mahsulotlarApi } from '../../api/mahsulotlar';
import { useToast } from '../../context/ToastContext';
import { KATEGORIYA } from '../../constants';
import { formatNarx } from '../../utils';

export default function MahsulotlarPage() {
  const toast = useToast();
  const [mahsulotlar, setMahsulotlar] = useState([]);
  const [kategoriya, setKategoriya] = useState(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);

  const yuklash = async () => {
    setYuklanmoqda(true);
    try {
      // Admin tokeni bilan so'ralgani uchun tugagan mahsulotlar ham keladi
      setMahsulotlar(await mahsulotlarApi.getAll(kategoriya));
    } catch (err) {
      toast(err.message, 'xato');
    } finally {
      setYuklanmoqda(false);
    }
  };

  useEffect(() => {
    yuklash();
  }, [kategoriya]);

  const ochirish = async (m) => {
    if (!window.confirm(`"${m.nomi}" o'chirilsinmi? Rasmlari ham o'chadi.`)) {
      return;
    }

    try {
      await mahsulotlarApi.remove(m.mahsulotId);
      toast("Mahsulot o'chirildi");
      yuklash();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold sm:text-2xl">Mahsulotlar</h1>
        <Link to="/admin/mahsulotlar/yangi" className="admin-btn">
          + Yangi mahsulot
        </Link>
      </div>

      <div className="yon-lenta -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <KategoriyaTugmasi faol={kategoriya === null} onClick={() => setKategoriya(null)}>
          Barchasi
        </KategoriyaTugmasi>
        {Object.entries(KATEGORIYA).map(([kod, k]) => (
          <KategoriyaTugmasi key={kod} faol={kategoriya === Number(kod)} onClick={() => setKategoriya(Number(kod))}>
            {k.nomi}
          </KategoriyaTugmasi>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Mahsulot</th>
              <th className="px-4 py-3">Kategoriya</th>
              <th className="px-4 py-3">Narx</th>
              <th className="px-4 py-3">Ombor</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {yuklanmoqda && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  Yuklanmoqda...
                </td>
              </tr>
            )}

            {!yuklanmoqda && mahsulotlar.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  Mahsulot yo'q.
                </td>
              </tr>
            )}

            {!yuklanmoqda &&
              mahsulotlar.map((m) => (
                <tr key={m.mahsulotId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-gray-100">
                        {m.asosiyRasmHavolasi && (
                          <img src={m.asosiyRasmHavolasi} alt={m.nomi} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{m.nomi}</p>
                        <p className="text-xs text-gray-500">
                          {m.brendi} · {m.rangi}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{KATEGORIYA[m.kategoriya]?.birlik}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {m.chegirmaNarxi ? (
                      <>
                        <p className="font-medium text-red-600">{formatNarx(m.chegirmaNarxi)}</p>
                        <p className="text-xs text-gray-400 line-through">{formatNarx(m.narxi)}</p>
                      </>
                    ) : (
                      <p className="font-medium">{formatNarx(m.narxi)}</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {m.ombordagiSoni > 0 ? (
                      <span>{m.ombordagiSoni} ta</span>
                    ) : (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Tugagan</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/mahsulotlar/${m.mahsulotId}`} className="admin-btn-ikkinchi px-3 py-1.5">
                        Tahrirlash
                      </Link>
                      <button onClick={() => ochirish(m)} className="admin-btn-xavfli">
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Telefon: jadval o'rniga kartalar */}
      <div className="space-y-3 md:hidden">
        {yuklanmoqda && <p className="py-8 text-center text-gray-500">Yuklanmoqda...</p>}
        {!yuklanmoqda && mahsulotlar.length === 0 && <p className="py-8 text-center text-gray-500">Mahsulot yo'q.</p>}

        {!yuklanmoqda &&
          mahsulotlar.map((m) => (
            <div key={m.mahsulotId} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                  {m.asosiyRasmHavolasi && <img src={m.asosiyRasmHavolasi} alt={m.nomi} className="h-full w-full object-cover" />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{m.nomi}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {m.brendi} · {m.rangi} · {KATEGORIYA[m.kategoriya]?.birlik}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    {m.chegirmaNarxi ? (
                      <>
                        <span className="font-medium text-red-600">{formatNarx(m.chegirmaNarxi)}</span>
                        <span className="text-xs text-gray-400 line-through">{formatNarx(m.narxi)}</span>
                      </>
                    ) : (
                      <span className="font-medium">{formatNarx(m.narxi)}</span>
                    )}

                    {m.ombordagiSoni > 0 ? (
                      <span className="text-gray-500">{m.ombordagiSoni} ta</span>
                    ) : (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Tugagan</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                <Link to={`/admin/mahsulotlar/${m.mahsulotId}`} className="admin-btn-ikkinchi">
                  Tahrirlash
                </Link>
                <button onClick={() => ochirish(m)} className="admin-btn-xavfli">
                  O'chirish
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function KategoriyaTugmasi({ faol, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm sm:py-1.5 ${
        faol ? 'bg-gray-900 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}
