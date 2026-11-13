import { useEffect, useState } from 'react';
import { usersApi } from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLE } from '../../constants';

export default function UsersPage() {
  const { user: self } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setUsers(await usersApi.getAll());
    } catch (err) {
      toast(err.message, 'xato');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (f) => {
    const newRole = f.role === 2 ? 1 : 2;

    if (!window.confirm(`${f.username} endi ${ROLE[newRole]} bo'lsinmi?`)) {
      return;
    }

    try {
      await usersApi.changeRole(f.userId, newRole);
      toast(`${f.username}: ${ROLE[newRole]}`);
      load();
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
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  Yuklanmoqda...
                </td>
              </tr>
            )}

            {users.map((f) => {
              const self = f.userId === self.userId;

              return (
                <tr key={f.userId}>
                  <td className="px-4 py-3 font-medium">
                    {f.firstName} {f.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{f.username}</td>
                  <td className="px-4 py-3 text-gray-600">{f.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        f.role === 2 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ROLE[f.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {/* O'zini User qilib qo'ysa, admin panelga kira olmay qoladi */}
                    <button
                      onClick={() => changeRole(f)}
                      disabled={self}
                      title={self ? "O'z rolingizni o'zgartira olmaysiz" : ''}
                      className="admin-btn-secondary px-3 py-1.5"
                    >
                      {f.role === 2 ? 'User qilish' : 'Admin qilish'}
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
        {loading && <p className="py-8 text-center text-gray-500">Yuklanmoqda...</p>}

        {users.map((f) => {
          const self = f.userId === self.userId;

          return (
            <div key={f.userId} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {f.firstName} {f.lastName}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-gray-600">{f.username}</p>
                  <p className="truncate text-sm text-gray-500">{f.email}</p>
                </div>

                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
                    f.role === 2 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {ROLE[f.role]}
                </span>
              </div>

              <button
                onClick={() => changeRole(f)}
                disabled={self}
                className="admin-btn-secondary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {self ? "O'z rolingizni o'zgartira olmaysiz" : f.role === 2 ? 'User qilish' : 'Admin qilish'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
