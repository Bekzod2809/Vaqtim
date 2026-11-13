import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { LogoMark } from '../components/Logo';
import { fieldErrors } from '../utils';

const FIELDS = [
  { name: 'firstName', placeholder: 'Ism', autoComplete: 'given-name' },
  { name: 'lastName', placeholder: 'Familiya', autoComplete: 'family-name' },
  { name: 'email', placeholder: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'username', placeholder: 'Username', autoComplete: 'username' },
  { name: 'password', placeholder: 'Parol (kamida 6 belgi)', type: 'password', autoComplete: 'new-password' },
];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      await authApi.register(form);
      // Ro'yxatdan o'tgach darrov kiritib yuboramiz, qayta parol yozish shart emas
      await login(form.username, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setErrors(fieldErrors(err.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative px-4 py-10 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(199,165,96,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-md animate-appear border border-dark-3 bg-dark-2/60 p-6 backdrop-blur-sm sm:p-8 md:p-10">
        <LogoMark animated className="mx-auto mb-5 h-14 w-14 sm:mb-6 sm:h-16 sm:w-16" />
        <h1 className="mb-2 text-center font-serif text-3xl font-semibold text-cream sm:text-4xl">Ro'yxatdan o'tish</h1>
        <p className="mb-8 text-center text-sm text-gray-500 sm:mb-10">Yangi hisob yarating</p>

        <form onSubmit={submit} className="space-y-5">
          {FIELDS.map((m) => (
            <div key={m.name}>
              <input
                name={m.name}
                type={m.type ?? 'text'}
                value={form[m.name]}
                onChange={change}
                placeholder={m.placeholder}
                autoComplete={m.autoComplete}
                className="store-input"
              />
              {errors[m.name] && <p className="mt-1 text-xs text-red-400">{errors[m.name]}</p>}
            </div>
          ))}

          {error && !Object.keys(errors).length && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={loading} className="store-btn">
            {loading ? 'Yuborilmoqda...' : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-500 sm:mt-8">
          Hisobingiz bormi?{' '}
          <Link to="/login" className="text-gold hover:text-gold-light">
            Kirish
          </Link>
        </p>
      </div>
    </section>
  );
}
