import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/products';
import { useToast } from '../../context/ToastContext';
import { CATEGORY } from '../../constants';
import { formatPrice } from '../../utils';

export default function ProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // Admin tokeni bilan so'ralgani uchun tugagan mahsulotlar ham keladi
      setProducts(await productsApi.getAll(category));
    } catch (err) {
      toast(err.message, 'xato');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [category]);

  const remove = async (m) => {
    if (!window.confirm(`"${m.name}" o'chirilsinmi? Rasmlari ham o'chadi.`)) {
      return;
    }

    try {
      await productsApi.remove(m.productId);
      toast("Mahsulot o'chirildi");
      load();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold sm:text-2xl">Mahsulotlar</h1>
        <Link to="/admin/products/new" className="admin-btn">
          + Yangi mahsulot
        </Link>
      </div>

      <div className="scroll-row -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <CategoryButton active={category === null} onClick={() => setCategory(null)}>
          Barchasi
        </CategoryButton>
        {Object.entries(CATEGORY).map(([code, k]) => (
          <CategoryButton key={code} active={category === Number(code)} onClick={() => setCategory(Number(code))}>
            {k.name}
          </CategoryButton>
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
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  Yuklanmoqda...
                </td>
              </tr>
            )}

            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  Mahsulot yo'q.
                </td>
              </tr>
            )}

            {!loading &&
              products.map((m) => (
                <tr key={m.productId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-gray-100">
                        {m.mainImageUrl && (
                          <img src={m.mainImageUrl} alt={m.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-gray-500">
                          {m.brand} · {m.color}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{CATEGORY[m.category]?.singular}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {m.salePrice ? (
                      <>
                        <p className="font-medium text-red-600">{formatPrice(m.salePrice)}</p>
                        <p className="text-xs text-gray-400 line-through">{formatPrice(m.price)}</p>
                      </>
                    ) : (
                      <p className="font-medium">{formatPrice(m.price)}</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {m.stockQuantity > 0 ? (
                      <span>{m.stockQuantity} ta</span>
                    ) : (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Tugagan</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/products/${m.productId}`} className="admin-btn-secondary px-3 py-1.5">
                        Tahrirlash
                      </Link>
                      <button onClick={() => remove(m)} className="admin-btn-danger">
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
        {loading && <p className="py-8 text-center text-gray-500">Yuklanmoqda...</p>}
        {!loading && products.length === 0 && <p className="py-8 text-center text-gray-500">Mahsulot yo'q.</p>}

        {!loading &&
          products.map((m) => (
            <div key={m.productId} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                  {m.mainImageUrl && <img src={m.mainImageUrl} alt={m.name} className="h-full w-full object-cover" />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{m.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {m.brand} · {m.color} · {CATEGORY[m.category]?.singular}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    {m.salePrice ? (
                      <>
                        <span className="font-medium text-red-600">{formatPrice(m.salePrice)}</span>
                        <span className="text-xs text-gray-400 line-through">{formatPrice(m.price)}</span>
                      </>
                    ) : (
                      <span className="font-medium">{formatPrice(m.price)}</span>
                    )}

                    {m.stockQuantity > 0 ? (
                      <span className="text-gray-500">{m.stockQuantity} ta</span>
                    ) : (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Tugagan</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                <Link to={`/admin/products/${m.productId}`} className="admin-btn-secondary">
                  Tahrirlash
                </Link>
                <button onClick={() => remove(m)} className="admin-btn-danger">
                  O'chirish
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function CategoryButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm sm:py-1.5 ${
        active ? 'bg-gray-900 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}
