import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoMark } from '../components/Logo';
import { fieldErrors } from '../utils';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
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
      const user = await login(form.usernameOrEmail, form.password);
      // Admin panelga kirmoqchi bo'lib bu yerga yo'naltirilgan bo'lsa, o'sha sahifaga qaytaramiz
      const goBack = location.state?.goBack;
      navigate(goBack ?? (user.role === 2 ? '/admin' : '/'), { replace: true });
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
        <h1 className="mb-2 text-center font-serif text-3xl font-semibold text-cream sm:text-4xl">Kirish</h1>
        <p className="mb-8 text-center text-sm text-gray-500 sm:mb-10">Hisobingizga kiring</p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <input
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              onChange={change}
              placeholder="Username yoki email"
              autoComplete="username"
              className="store-input"
            />
            {errors.usernameOrEmail && <p className="mt-1 text-xs text-red-400">{errors.usernameOrEmail}</p>}
          </div>

          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={change}
              placeholder="Parol"
              autoComplete="current-password"
              className="store-input"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          {error && !Object.keys(errors).length && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={loading} className="store-btn">
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-500 sm:mt-8">
          Hisobingiz yo'qmi?{' '}
          <Link to="/register" className="text-gold hover:text-gold-light">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </section>
  );
}
