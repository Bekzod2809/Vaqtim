import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { maydonXatolari } from '../utils';

const MAYDONLAR = [
  { nomi: 'ism', placeholder: 'Ism', autoComplete: 'given-name' },
  { nomi: 'familiya', placeholder: 'Familiya', autoComplete: 'family-name' },
  { nomi: 'email', placeholder: 'Email', type: 'email', autoComplete: 'email' },
  { nomi: 'username', placeholder: 'Username', autoComplete: 'username' },
  { nomi: 'parol', placeholder: 'Parol (kamida 6 belgi)', type: 'password', autoComplete: 'new-password' },
];

export default function RoyxatdanOtishPage() {
  const { kirish } = useAuth();
  const navigate = useNavigate();

  const [forma, setForma] = useState({ ism: '', familiya: '', email: '', username: '', parol: '' });
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
      await authApi.royxatdanOtish(forma);
      // Ro'yxatdan o'tgach darrov kiritib yuboramiz, qayta parol yozish shart emas
      await kirish(forma.username, forma.parol);
      navigate('/', { replace: true });
    } catch (err) {
      setXato(err.message);
      setXatolar(maydonXatolari(err.detail));
    } finally {
      setYuklanmoqda(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-center font-serif text-4xl font-semibold text-white">Ro'yxatdan o'tish</h1>
      <p className="mb-10 text-center text-sm text-gray-500">Yangi hisob yarating</p>

      <form onSubmit={yuborish} className="space-y-5">
        {MAYDONLAR.map((m) => (
          <div key={m.nomi}>
            <input
              name={m.nomi}
              type={m.type ?? 'text'}
              value={forma[m.nomi]}
              onChange={ozgartirish}
              placeholder={m.placeholder}
              autoComplete={m.autoComplete}
              className="dokon-input"
            />
            {xatolar[m.nomi] && <p className="mt-1 text-xs text-red-400">{xatolar[m.nomi]}</p>}
          </div>
        ))}

        {xato && !Object.keys(xatolar).length && <p className="text-sm text-red-400">{xato}</p>}

        <button type="submit" disabled={yuklanmoqda} className="dokon-btn">
          {yuklanmoqda ? 'Yuborilmoqda...' : "Ro'yxatdan o'tish"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Hisobingiz bormi?{' '}
        <Link to="/kirish" className="text-oltin hover:text-oltin-och">
          Kirish
        </Link>
      </p>
    </section>
  );
}
