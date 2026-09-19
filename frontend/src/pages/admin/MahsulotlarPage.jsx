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
        <h1 className="text-2xl font-semibold">Mahsulotlar</h1>
        <Link to="/admin/mahsulotlar/yangi" className="admin-btn">
          + Yangi mahsulot
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <KategoriyaTugmasi faol={kategoriya === null} onClick={() => setKategoriya(null)}>
          Barchasi
        </KategoriyaTugmasi>
        {Object.entries(KATEGORIYA).map(([kod, k]) => (
          <KategoriyaTugmasi key={kod} faol={kategoriya === Number(kod)} onClick={() => setKategoriya(Number(kod))}>
            {k.nomi}
          </KategoriyaTugmasi>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
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
    </div>
  );
}

function KategoriyaTugmasi({ faol, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm ${
        faol ? 'bg-gray-900 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}
