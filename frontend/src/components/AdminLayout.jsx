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
    <div className="min-h-[100dvh] bg-[#F7F5F0] font-sans text-gray-900 md:flex">
      <aside className="border-b border-gray-200 bg-white md:sticky md:top-0 md:h-[100dvh] md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        {/* Och fon uchun logo varianti: to'q chiziqlar, tilla millar */}
        <Link to="/" className="group flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 md:py-7">
          <LogoBelgi och={false} className="h-9 w-9 shrink-0 md:h-10 md:w-10" />
          <span className="leading-none">
            <span className="block font-serif text-xl font-semibold text-qora-2 sm:text-2xl">{DOKON_NOMI}</span>
            <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.3em] text-oltin-toq">Admin panel</span>
          </span>
        </Link>

        <nav className="yon-lenta flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
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
        <header className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 border-b border-gray-200 bg-white px-4 py-3 text-sm sm:px-6">
          <span className="mr-auto truncate text-gray-600 sm:mr-0">
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
        <main key={location.pathname} className="animate-sahifa p-4 sm:p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
