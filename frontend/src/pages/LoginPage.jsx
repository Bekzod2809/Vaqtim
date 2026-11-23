import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogoMark } from '../components/Logo';
import { fieldErrors } from '../utils';

export default function LoginPage() {
  const { login, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [resetMode, setResetMode] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [resetForm, setResetForm] = useState({ phone: '', verificationCode: '', newPassword: '' });
  const [telegramBotLink, setTelegramBotLink] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authApi
      .getTelegramBotLink()
      .then((link) => setTelegramBotLink(link ?? ''))
      .catch(() => {});
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const changeReset = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'phone') value = value.replace(/[^0-9+]/g, '').slice(0, 13);
    if (name === 'verificationCode') value = value.replace(/\D/g, '').slice(0, 6);
    setResetForm((curr) => ({ ...curr, [name]: value }));
  };

  const switchMode = (toReset) => {
    setResetMode(toReset);
    setError('');
    setErrors({});
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      const user = await login(form.username, form.password);
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

  const submitReset = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      const user = await resetPassword(resetForm);
      toast(`Parol yangilandi! Username: ${user.username}`);
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
        <h1 className="mb-2 text-center font-serif text-3xl font-semibold text-cream sm:text-4xl">
          {resetMode ? 'Parolni tiklash' : 'Kirish'}
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500 sm:mb-10">
          {resetMode ? 'Telegram bot orqali yangi parol o‘rnating' : 'Hisobingizga kiring'}
        </p>

        {!resetMode ? (
          <form onSubmit={submitLogin} className="space-y-5">
            <div>
              <input
                name="username"
                value={form.username}
                onChange={change}
                placeholder="Username"
                autoComplete="username"
                required
                className="store-input"
              />
              {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
            </div>

            <div>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={change}
                placeholder="Parol"
                autoComplete="current-password"
                required
                className="store-input"
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className="text-xs text-gold underline underline-offset-4 transition hover:text-gold-light"
                >
                  Parolni unutdingizmi?
                </button>
              </div>
            </div>

            {error && !Object.keys(errors).length && <p className="text-sm text-red-400">{error}</p>}

            <button type="submit" disabled={loading} className="store-btn">
              {loading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitReset} className="space-y-5">
            <div className="rounded border border-dark-3 bg-dark px-3 py-3 text-sm text-gray-400">
              {telegramBotLink ? (
                <a
                  href={telegramBotLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold underline underline-offset-4"
                >
                  Telegram botni oching
                </a>
              ) : (
                <span>Telegram bot hali sozlanmagan.</span>
              )}
              <p className="mt-2">
                Botda Start bosing, ro'yxatdan o'tgan telefon raqamingizni ulashing va kelgan 6 xonali kodni kiriting.
              </p>
            </div>

            <div>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={resetForm.phone}
                onChange={changeReset}
                placeholder="Telefon (+998901234567)"
                pattern="\+998[0-9]{9}"
                maxLength={13}
                title="Raqam +998901234567 ko‘rinishida bo‘lsin."
                required
                className="store-input"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
            </div>

            <div>
              <input
                name="verificationCode"
                inputMode="numeric"
                value={resetForm.verificationCode}
                onChange={changeReset}
                placeholder="Telegram tasdiqlash kodi (6 raqam)"
                pattern="[0-9]{6}"
                maxLength={6}
                title="Telegram botdan olingan 6 xonali kodni kiriting."
                required
                className="store-input"
              />
              {errors.verificationCode && <p className="mt-1 text-xs text-red-400">{errors.verificationCode}</p>}
            </div>

            <div>
              <input
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={resetForm.newPassword}
                onChange={changeReset}
                placeholder="Yangi parol (kamida 6 belgi)"
                minLength={6}
                maxLength={100}
                required
                className="store-input"
              />
              {errors.newPassword && <p className="mt-1 text-xs text-red-400">{errors.newPassword}</p>}
            </div>

            {error && !Object.keys(errors).length && <p className="text-sm text-red-400">{error}</p>}

            <button type="submit" disabled={loading} className="store-btn">
              {loading ? 'Yangilanmoqda...' : 'Parolni yangilash va kirish'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => switchMode(false)}
                className="text-xs text-gray-400 underline underline-offset-4 transition hover:text-gold"
              >
                ← Oddiy kirishga qaytish
              </button>
            </div>
          </form>
        )}

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
