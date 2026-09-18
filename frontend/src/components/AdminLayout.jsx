import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DOKON_NOMI } from '../constants';

const BOLIMLAR = [
  { yol: '/admin/mahsulotlar', nomi: 'Mahsulotlar' },
  { yol: '/admin/buyurtmalar', nomi: 'Buyurtmalar' },
  { yol: '/admin/foydalanuvchilar', nomi: 'Foydalanuvchilar' },
];

export default function AdminLayout() {
  const { foydalanuvchi, chiqish } = useAuth();
  const navigate = useNavigate();

  const chiqishniBosish = () => {
    chiqish();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 md:flex">
      <aside className="border-b border-gray-200 bg-white md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="px-5 py-4 md:py-6">
          <Link to="/" className="font-serif text-2xl font-semibold">
            {DOKON_NOMI}
          </Link>
          <p className="text-xs text-gray-500">Admin panel</p>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {BOLIMLAR.map((b) => (
            <NavLink
              key={b.yol}
              to={b.yol}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {b.nomi}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-end gap-4 border-b border-gray-200 bg-white px-6 py-3 text-sm">
          <span className="text-gray-600">
            {foydalanuvchi.ism} {foydalanuvchi.familiya}
          </span>
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Do'konga o'tish
          </Link>
          <button onClick={chiqishniBosish} className="text-gray-600 hover:text-gray-900">
            Chiqish
          </button>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
