import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoBelgi } from './Logo';
import { DOKON_NOMI } from '../constants';

const BOLIMLAR = [
  { yol: '/admin/mahsulotlar', nomi: 'Mahsulotlar' },
  { yol: '/admin/buyurtmalar', nomi: 'Buyurtmalar' },
  { yol: '/admin/foydalanuvchilar', nomi: 'Foydalanuvchilar' },
];

export default function AdminLayout() {
  const { foydalanuvchi, chiqish } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const chiqishniBosish = () => {
    chiqish();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-sans text-gray-900 md:flex">
      <aside className="border-b border-gray-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        {/* Och fon uchun logo varianti: to'q chiziqlar, tilla millar */}
        <Link to="/" className="group flex items-center gap-3 px-5 py-4 md:py-7">
          <LogoBelgi och={false} className="h-10 w-10" />
          <span className="leading-none">
            <span className="block font-serif text-2xl font-semibold text-qora-2">{DOKON_NOMI}</span>
            <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.3em] text-oltin-toq">Admin panel</span>
          </span>
        </Link>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {BOLIMLAR.map((b) => (
            <NavLink
              key={b.yol}
              to={b.yol}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-qora-2 text-krem' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {b.nomi}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-end gap-5 border-b border-gray-200 bg-white px-6 py-3 text-sm">
          <span className="text-gray-600">
            {foydalanuvchi.ism} {foydalanuvchi.familiya}
          </span>
          <Link to="/" className="text-gray-600 transition hover:text-gray-900">
            Do'konga o'tish
          </Link>
          <button onClick={chiqishniBosish} className="text-gray-600 transition hover:text-gray-900">
            Chiqish
          </button>
        </header>

        {/* key — bo'lim almashganda sahifa yumshoq paydo bo'ladi */}
        <main key={location.pathname} className="animate-sahifa p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
