import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoMark, FullLogo } from './Logo';
import { STORE_NAME, CATEGORY, TAGLINE } from '../constants';

const menuStyle = (extra) => ({ isActive }) => `menu-link ${extra} ${isActive ? 'active' : ''}`;

export default function StoreLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sahifa pastga aylantirilganda sarlavha xira shisha fonga o'tadi
  useEffect(() => {
    const validate = () => setScrolled(window.scrollY > 20);
    validate();
    window.addEventListener('scroll', validate, { passive: true });
    return () => window.removeEventListener('scroll', validate);
  }, []);

  // Boshqa sahifaga o'tganda telefon menyusi yopiladi
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // telefonda = true bo'lsa havolalar butun kenglikni egallaydi (barmoq uchun qulay)
  const links = (onPhone = false) => {
    const q = onPhone ? 'menu-link-mobile' : '';

    return (
      <>
        <NavLink to="/" end className={menuStyle(q)}>
          Katalog
        </NavLink>

        {user ? (
          <>
            <NavLink to="/cart" className={menuStyle(q)}>
              Savat
            </NavLink>
            <NavLink to="/myOrders" className={menuStyle(q)}>
              Buyurtmalarim
            </NavLink>
            <NavLink to="/profile" className={menuStyle(q)}>
              Profil
            </NavLink>
            {isAdmin && (
              <Link to="/admin" className={`menu-link text-gold ${q}`}>
                Admin panel
              </Link>
            )}
            <button onClick={handleLogout} className={`menu-link text-left ${q}`}>
              Chiqish
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={menuStyle(q)}>
              Kirish
            </NavLink>
            <Link
              to="/register"
              className={`store-btn-outline text-xs ${onPhone ? 'mt-2 w-full' : 'min-h-0 px-5 py-2'}`}
            >
              Ro'yxatdan o'tish
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-dark font-sans text-gray-300">
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          scrolled || menuOpen ? 'border-dark-3 bg-dark/85 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 transition-all duration-500 ${
            scrolled ? 'py-3' : 'py-4 md:py-5'
          }`}
        >
          <Link to="/" aria-label={STORE_NAME} className="min-w-0">
            <FullLogo tagline />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {user && <span className="text-sm text-gray-500">{user.firstName}</span>}
            {links()}
          </nav>

          {/* Telefon menyusi tugmasi: uch chiziq ochilganda "X" ga aylanadi */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative -mr-2 h-11 w-11 shrink-0 md:hidden"
            aria-label="Menyu"
            aria-expanded={menuOpen}
          >
            <span className={`absolute left-3 right-3 h-px bg-cream transition-all duration-300 ${menuOpen ? 'top-[1.375rem] rotate-45' : 'top-4'}`} />
            <span className={`absolute left-3 right-3 top-[1.375rem] h-px bg-cream transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`absolute left-3 right-3 h-px bg-cream transition-all duration-300 ${menuOpen ? 'top-[1.375rem] -rotate-45' : 'top-[1.75rem]'}`} />
          </button>
        </div>

        {menuOpen && (
          <nav className="flex max-h-[70dvh] animate-drop flex-col items-start gap-1 overflow-y-auto border-t border-dark-3 px-4 py-4 md:hidden">
            {user && <span className="py-2 text-sm text-gray-500">{user.firstName}</span>}
            {links(true)}
          </nav>
        )}
      </header>

      {/* key — har bir sahifaga o'tishda yumshoq paydo bo'lish animatsiyasi qayta ishlaydi */}
      <main key={location.pathname} className="flex-1 animate-page">
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-dark-3">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-3 md:py-14">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="h-12 w-12" />
              <div>
                <p className="font-serif text-2xl font-semibold text-cream">{STORE_NAME}</p>
                <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gold">{TAGLINE}</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-500">
              Soatlar va aksessuarlar. Karta orqali xavfsiz to'lov va O'zbekiston bo'ylab BTS Express orqali yetkazib berish.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Katalog</p>
            <ul className="space-y-2 text-sm">
              {Object.entries(CATEGORY).map(([code, k]) => (
                <li key={code}>
                  <Link to={`/?section=${code}`} className="inline-block py-1 text-gray-400 transition hover:text-cream">
                    {k.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Xaridorlar uchun</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/?section=sales" className="inline-block py-1 text-gray-400 transition hover:text-cream">
                  Chegirmalar
                </Link>
              </li>
              <li>
                <Link to="/cart" className="inline-block py-1 text-gray-400 transition hover:text-cream">
                  Savat
                </Link>
              </li>
              <li>
                <Link to="/myOrders" className="inline-block py-1 text-gray-400 transition hover:text-cream">
                  Buyurtmalarim
                </Link>
              </li>
              <li>
                <a
                  href="https://t.me/bekzodxasanovv"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 py-1 text-gray-400 transition hover:text-gold"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-gold">
                    <path d="M21.94 2.34a1.25 1.25 0 0 0-1.33-.19L2.37 9.5a1.22 1.22 0 0 0-.08 2.24l4.66 1.79 1.82 5.71a1.2 1.2 0 0 0 2.02.45l2.63-2.7 4.77 3.53a1.23 1.23 0 0 0 1.93-.74l2.24-16.1a1.25 1.25 0 0 0-.42-1.34ZM9.18 13.3l8.63-6.43-6.9 7.6-.3 3.13-1.43-4.3Z" />
                  </svg>
                  <span>Telegram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/xasanovbekzod1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 py-1 text-gray-400 transition hover:text-gold"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0 text-gold"
                  >
                    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-3 py-6 text-center text-xs tracking-wide text-gray-600">
          © {new Date().getFullYear()} {STORE_NAME}
        </div>
      </footer>
    </div>
  );
}
