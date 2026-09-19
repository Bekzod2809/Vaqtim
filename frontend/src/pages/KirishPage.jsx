import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoBelgi } from '../components/Logo';
import { maydonXatolari } from '../utils';

export default function KirishPage() {
  const { kirish } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [forma, setForma] = useState({ usernameYokiEmail: '', parol: '' });
  const [xato, setXato] = useState('');
  const [xatolar, setXatolar] = useState({});
  const [yuklanmoqda, setYuklanmoqda] = useState(false);

  const ozgartirish = (e) => setForma({ ...forma, [e.target.name]: e.target.value });

  const yuborish = async (e) => {
    e.preventDefault();
    setXato('');
    setXatolar({});
    setYuklanmoqda(true);

    try {
      const foydalanuvchi = await kirish(forma.usernameYokiEmail, forma.parol);
      // Admin panelga kirmoqchi bo'lib bu yerga yo'naltirilgan bo'lsa, o'sha sahifaga qaytaramiz
      const qaytish = location.state?.qaytish;
      navigate(qaytish ?? (foydalanuvchi.rol === 2 ? '/admin' : '/'), { replace: true });
    } catch (err) {
      setXato(err.message);
      setXatolar(maydonXatolari(err.detail));
    } finally {
      setYuklanmoqda(false);
    }
  };

  return (
    <section className="relative px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(199,165,96,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-md animate-paydo border border-qora-3 bg-qora-2/60 p-8 backdrop-blur-sm md:p-10">
        <LogoBelgi jonli className="mx-auto mb-6 h-16 w-16" />
        <h1 className="mb-2 text-center font-serif text-4xl font-semibold text-krem">Kirish</h1>
        <p className="mb-10 text-center text-sm text-gray-500">Hisobingizga kiring</p>

        <form onSubmit={yuborish} className="space-y-5">
          <div>
            <input
              name="usernameYokiEmail"
              value={forma.usernameYokiEmail}
              onChange={ozgartirish}
              placeholder="Username yoki email"
              autoComplete="username"
              className="dokon-input"
            />
            {xatolar.usernameYokiEmail && <p className="mt-1 text-xs text-red-400">{xatolar.usernameYokiEmail}</p>}
          </div>

          <div>
            <input
              name="parol"
              type="password"
              value={forma.parol}
              onChange={ozgartirish}
              placeholder="Parol"
              autoComplete="current-password"
              className="dokon-input"
            />
            {xatolar.parol && <p className="mt-1 text-xs text-red-400">{xatolar.parol}</p>}
          </div>

          {xato && !Object.keys(xatolar).length && <p className="text-sm text-red-400">{xato}</p>}

          <button type="submit" disabled={yuklanmoqda} className="dokon-btn">
            {yuklanmoqda ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Hisobingiz yo'qmi?{' '}
          <Link to="/royxatdan-otish" className="text-oltin hover:text-oltin-och">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </section>
  );
}
