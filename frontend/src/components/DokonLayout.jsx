import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoBelgi, LogoToliq } from './Logo';
import { DOKON_NOMI, KATEGORIYA, SHIOR } from '../constants';

const menuUslubi = (qoshimcha) => ({ isActive }) => `menu-havola ${qoshimcha} ${isActive ? 'active' : ''}`;

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

  // telefonda = true bo'lsa havolalar butun kenglikni egallaydi (barmoq uchun qulay)
  const havolalar = (telefonda = false) => {
    const q = telefonda ? 'menu-havola-telefon' : '';

    return (
      <>
        <NavLink to="/" end className={menuUslubi(q)}>
          Katalog
        </NavLink>

        {foydalanuvchi ? (
          <>
            <NavLink to="/savat" className={menuUslubi(q)}>
              Savat
            </NavLink>
            <NavLink to="/buyurtmalarim" className={menuUslubi(q)}>
              Buyurtmalarim
            </NavLink>
            {adminmi && (
              <Link to="/admin" className={`menu-havola text-oltin ${q}`}>
                Admin panel
              </Link>
            )}
            <button onClick={chiqishniBosish} className={`menu-havola text-left ${q}`}>
              Chiqish
            </button>
          </>
        ) : (
          <>
            <NavLink to="/kirish" className={menuUslubi(q)}>
              Kirish
            </NavLink>
            <Link
              to="/royxatdan-otish"
              className={`dokon-btn-chiziqli text-xs ${telefonda ? 'mt-2 w-full' : 'min-h-0 px-5 py-2'}`}
            >
              Ro'yxatdan o'tish
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-qora font-sans text-gray-300">
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          aylantirildi || menyuOchiq ? 'border-qora-3 bg-qora/85 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 transition-all duration-500 ${
            aylantirildi ? 'py-3' : 'py-4 md:py-5'
          }`}
        >
          <Link to="/" aria-label={DOKON_NOMI} className="min-w-0">
            <LogoToliq shior />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {foydalanuvchi && <span className="text-sm text-gray-500">{foydalanuvchi.ism}</span>}
            {havolalar()}
          </nav>

          {/* Telefon menyusi tugmasi: uch chiziq ochilganda "X" ga aylanadi */}
          <button
            onClick={() => setMenyuOchiq(!menyuOchiq)}
            className="relative -mr-2 h-11 w-11 shrink-0 md:hidden"
            aria-label="Menyu"
            aria-expanded={menyuOchiq}
          >
            <span className={`absolute left-3 right-3 h-px bg-krem transition-all duration-300 ${menyuOchiq ? 'top-[1.375rem] rotate-45' : 'top-4'}`} />
            <span className={`absolute left-3 right-3 top-[1.375rem] h-px bg-krem transition-opacity duration-300 ${menyuOchiq ? 'opacity-0' : ''}`} />
            <span className={`absolute left-3 right-3 h-px bg-krem transition-all duration-300 ${menyuOchiq ? 'top-[1.375rem] -rotate-45' : 'top-[1.75rem]'}`} />
          </button>
        </div>

        {menyuOchiq && (
          <nav className="flex max-h-[70dvh] animate-tushish flex-col items-start gap-1 overflow-y-auto border-t border-qora-3 px-4 py-4 md:hidden">
            {foydalanuvchi && <span className="py-2 text-sm text-gray-500">{foydalanuvchi.ism}</span>}
            {havolalar(true)}
          </nav>
        )}
      </header>

      {/* key — har bir sahifaga o'tishda yumshoq paydo bo'lish animatsiyasi qayta ishlaydi */}
      <main key={location.pathname} className="flex-1 animate-sahifa">
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-qora-3">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-3 md:py-14">
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
                  <Link to={`/?bolim=${kod}`} className="inline-block py-1 text-gray-400 transition hover:text-krem">
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
                <Link to="/?bolim=chegirmalar" className="inline-block py-1 text-gray-400 transition hover:text-krem">
                  Chegirmalar
                </Link>
              </li>
              <li>
                <Link to="/savat" className="inline-block py-1 text-gray-400 transition hover:text-krem">
                  Savat
                </Link>
              </li>
              <li>
                <Link to="/buyurtmalarim" className="inline-block py-1 text-gray-400 transition hover:text-krem">
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
