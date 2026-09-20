import { useEffect, useState } from 'react';
import { foydalanuvchilarApi } from '../../api/foydalanuvchilar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROL } from '../../constants';

export default function FoydalanuvchilarPage() {
  const { foydalanuvchi: men } = useAuth();
  const toast = useToast();
  const [foydalanuvchilar, setFoydalanuvchilar] = useState([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);

  const yuklash = async () => {
    try {
      setFoydalanuvchilar(await foydalanuvchilarApi.getAll());
    } catch (err) {
      toast(err.message, 'xato');
    } finally {
      setYuklanmoqda(false);
    }
  };

  useEffect(() => {
    yuklash();
  }, []);

  const rolniOzgartirish = async (f) => {
    const yangiRol = f.rol === 2 ? 1 : 2;

    if (!window.confirm(`${f.username} endi ${ROL[yangiRol]} bo'lsinmi?`)) {
      return;
    }

    try {
      await foydalanuvchilarApi.rolniOzgartirish(f.foydalanuvchiId, yangiRol);
      toast(`${f.username}: ${ROL[yangiRol]}`);
      yuklash();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-xl font-semibold sm:text-2xl">Foydalanuvchilar</h1>
      <p className="mb-6 text-sm text-gray-500">Rol o'zgarishi foydalanuvchi qayta kirganda kuchga kiradi.</p>

      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Ism familiya</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
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

            {foydalanuvchilar.map((f) => {
              const ozim = f.foydalanuvchiId === men.foydalanuvchiId;

              return (
                <tr key={f.foydalanuvchiId}>
                  <td className="px-4 py-3 font-medium">
                    {f.ism} {f.familiya}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{f.username}</td>
                  <td className="px-4 py-3 text-gray-600">{f.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        f.rol === 2 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ROL[f.rol]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {/* O'zini User qilib qo'ysa, admin panelga kira olmay qoladi */}
                    <button
                      onClick={() => rolniOzgartirish(f)}
                      disabled={ozim}
                      title={ozim ? "O'z rolingizni o'zgartira olmaysiz" : ''}
                      className="admin-btn-ikkinchi px-3 py-1.5"
                    >
                      {f.rol === 2 ? 'User qilish' : 'Admin qilish'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Telefon: jadval o'rniga kartalar */}
      <div className="space-y-3 md:hidden">
        {yuklanmoqda && <p className="py-8 text-center text-gray-500">Yuklanmoqda...</p>}

        {foydalanuvchilar.map((f) => {
          const ozim = f.foydalanuvchiId === men.foydalanuvchiId;

          return (
            <div key={f.foydalanuvchiId} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {f.ism} {f.familiya}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-gray-600">{f.username}</p>
                  <p className="truncate text-sm text-gray-500">{f.email}</p>
                </div>

                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
                    f.rol === 2 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {ROL[f.rol]}
                </span>
              </div>

              <button
                onClick={() => rolniOzgartirish(f)}
                disabled={ozim}
                className="admin-btn-ikkinchi mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ozim ? "O'z rolingizni o'zgartira olmaysiz" : f.rol === 2 ? 'User qilish' : 'Admin qilish'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
