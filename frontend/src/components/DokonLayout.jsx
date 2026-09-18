import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DOKON_NOMI } from '../constants';

export default function DokonLayout() {
  const { foydalanuvchi, adminmi, chiqish } = useAuth();
  const navigate = useNavigate();

  const chiqishniBosish = () => {
    chiqish();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-qora font-sans text-gray-200">
      <header className="border-b border-qora-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link to="/" className="font-serif text-3xl font-semibold tracking-wide text-oltin">
            {DOKON_NOMI}
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            {foydalanuvchi ? (
              <>
                <span className="hidden text-gray-400 sm:inline">{foydalanuvchi.ism}</span>
                {adminmi && (
                  <Link to="/admin" className="text-oltin hover:text-oltin-och">
                    Admin panel
                  </Link>
                )}
                <button onClick={chiqishniBosish} className="text-gray-400 hover:text-white">
                  Chiqish
                </button>
              </>
            ) : (
              <>
                <Link to="/kirish" className="text-gray-300 hover:text-white">
                  Kirish
                </Link>
                <Link
                  to="/royxatdan-otish"
                  className="border border-oltin px-4 py-2 text-oltin transition hover:bg-oltin hover:text-qora"
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-qora-3 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {DOKON_NOMI}
      </footer>
    </div>
  );
}
