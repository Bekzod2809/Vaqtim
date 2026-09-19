import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoBelgi, LogoToliq } from './Logo';
import { DOKON_NOMI, KATEGORIYA, SHIOR } from '../constants';

const menuUslubi = ({ isActive }) => `menu-havola ${isActive ? 'active' : ''}`;

export default function DokonLayout() {
  const { foydalanuvchi, adminmi, chiqish } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [aylantirildi, setAylantirildi] = useState(false);
  const [menyuOchiq, setMenyuOchiq] = useState(false);

  // Sahifa pastga aylantirilganda sarlavha xira shisha fonga o'tadi
  useEffect(() => {
    const tekshirish = () => setAylantirildi(window.scrollY > 20);
    tekshirish();
    window.addEventListener('scroll', tekshirish, { passive: true });
    return () => window.removeEventListener('scroll', tekshirish);
  }, []);

  // Boshqa sahifaga o'tganda telefon menyusi yopiladi
  useEffect(() => {
    setMenyuOchiq(false);
  }, [location.pathname]);

  const chiqishniBosish = () => {
    chiqish();
    navigate('/');
  };

  const havolalar = (
    <>
      <NavLink to="/" end className={menuUslubi}>
        Katalog
      </NavLink>

      {foydalanuvchi ? (
        <>
          <NavLink to="/savat" className={menuUslubi}>
            Savat
          </NavLink>
          <NavLink to="/buyurtmalarim" className={menuUslubi}>
            Buyurtmalarim
          </NavLink>
          {adminmi && (
            <Link to="/admin" className="menu-havola text-oltin">
              Admin panel
            </Link>
          )}
          <button onClick={chiqishniBosish} className="menu-havola text-left">
            Chiqish
          </button>
        </>
      ) : (
        <>
          <NavLink to="/kirish" className={menuUslubi}>
            Kirish
          </NavLink>
          <Link to="/royxatdan-otish" className="dokon-btn-chiziqli px-5 py-2 text-xs">
            Ro'yxatdan o'tish
          </Link>
        </>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-qora font-sans text-gray-300">
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          aylantirildi || menyuOchiq ? 'border-qora-3 bg-qora/85 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-500 ${
            aylantirildi ? 'py-3' : 'py-5'
          }`}
        >
          <Link to="/" aria-label={DOKON_NOMI}>
            <LogoToliq shior />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {foydalanuvchi && <span className="text-sm text-gray-500">{foydalanuvchi.ism}</span>}
            {havolalar}
          </nav>

          {/* Telefon menyusi tugmasi: uch chiziq ochilganda "X" ga aylanadi */}
          <button
            onClick={() => setMenyuOchiq(!menyuOchiq)}
            className="relative h-10 w-10 md:hidden"
            aria-label="Menyu"
            aria-expanded={menyuOchiq}
          >
            <span className={`absolute left-2 right-2 h-px bg-krem transition-all duration-300 ${menyuOchiq ? 'top-5 rotate-45' : 'top-3.5'}`} />
            <span className={`absolute left-2 right-2 top-5 h-px bg-krem transition-opacity duration-300 ${menyuOchiq ? 'opacity-0' : ''}`} />
            <span className={`absolute left-2 right-2 h-px bg-krem transition-all duration-300 ${menyuOchiq ? 'top-5 -rotate-45' : 'top-[1.625rem]'}`} />
          </button>
        </div>

        {menyuOchiq && (
          <nav className="flex animate-tushish flex-col items-start gap-5 border-t border-qora-3 px-4 py-6 md:hidden">
            {foydalanuvchi && <span className="text-sm text-gray-500">{foydalanuvchi.ism}</span>}
            {havolalar}
          </nav>
        )}
      </header>

      {/* key — har bir sahifaga o'tishda yumshoq paydo bo'lish animatsiyasi qayta ishlaydi */}
      <main key={location.pathname} className="flex-1 animate-sahifa">
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-qora-3">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <LogoBelgi className="h-12 w-12" />
              <div>
                <p className="font-serif text-2xl font-semibold text-krem">{DOKON_NOMI}</p>
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-oltin">{SHIOR}</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-500">
              Soatlar va aksessuarlar. To'lov yetkazib berilganda naqd amalga oshiriladi.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-oltin">Katalog</p>
            <ul className="space-y-2 text-sm">
              {Object.entries(KATEGORIYA).map(([kod, k]) => (
                <li key={kod}>
                  <Link to={`/?bolim=${kod}`} className="text-gray-400 transition hover:text-krem">
                    {k.nomi}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-oltin">Xaridorlar uchun</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/?bolim=chegirmalar" className="text-gray-400 transition hover:text-krem">
                  Chegirmalar
                </Link>
              </li>
              <li>
                <Link to="/savat" className="text-gray-400 transition hover:text-krem">
                  Savat
                </Link>
              </li>
              <li>
                <Link to="/buyurtmalarim" className="text-gray-400 transition hover:text-krem">
                  Buyurtmalarim
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-qora-3 py-6 text-center text-xs tracking-wide text-gray-600">
          © {new Date().getFullYear()} {DOKON_NOMI}
        </div>
      </footer>
    </div>
  );
}
