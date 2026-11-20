import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { LogoMark } from '../components/Logo';
import { fieldErrors } from '../utils';

const FIELDS = [
  { name: 'firstName', placeholder: 'Ism', autoComplete: 'given-name', pattern: "[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳʻʼ’' -]+", title: 'Ism faqat harflardan iborat bo‘lsin.' },
  { name: 'lastName', placeholder: 'Familiya', autoComplete: 'family-name', pattern: "[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳʻʼ’' -]+", title: 'Familiya faqat harflardan iborat bo‘lsin.' },
  { name: 'phone', placeholder: 'Telefon (+998901234567)', type: 'tel', autoComplete: 'tel', pattern: '\\+998[0-9]{9}', maxLength: 13, inputMode: 'tel', title: 'Raqam +998901234567 ko‘rinishida bo‘lsin.' },
  { name: 'verificationCode', placeholder: 'Telegram tasdiqlash kodi (6 raqam)', inputMode: 'numeric', pattern: '[0-9]{6}', maxLength: 6, title: 'Telegram botdan olingan 6 xonali kodni kiriting.' },
  { name: 'username', placeholder: 'Username', autoComplete: 'username', minLength: 3, maxLength: 50, pattern: '[A-Za-z0-9_]+', title: 'Username faqat harf, raqam va _ belgisidan iborat bo‘lsin.' },
  { name: 'password', placeholder: 'Parol (kamida 6 belgi)', type: 'password', autoComplete: 'new-password', minLength: 6, maxLength: 100 },
];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', verificationCode: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [telegramBotLink, setTelegramBotLink] = useState('');

  useEffect(() => {
    authApi.getTelegramBotLink().then((link) => setTelegramBotLink(link ?? '')).catch(() => {});
  }, []);

  const change = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'phone') value = value.replace(/[^0-9+]/g, '').slice(0, 13);
    if (name === 'verificationCode') value = value.replace(/\D/g, '').slice(0, 6);
    setForm((current) => ({ ...current, [name]: value }));
  };

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
              {m.name === 'verificationCode' && (
                <div className="mb-3 rounded border border-dark-3 bg-dark px-3 py-3 text-sm text-gray-400">
                  {telegramBotLink ? (
                    <a href={telegramBotLink} target="_blank" rel="noreferrer" className="text-gold underline underline-offset-4">
                      Telegram botni oching
                    </a>
                  ) : (
                    <span>Telegram bot hali sozlanmagan.</span>
                  )}
                  <p className="mt-2">Botda Start bosing, telefoningizni ulashing va kelgan kodni kiriting.</p>
                </div>
              )}
              <input
                name={m.name}
                type={m.type ?? 'text'}
                value={form[m.name]}
                onChange={change}
                required
                placeholder={m.placeholder}
                autoComplete={m.autoComplete}
                pattern={m.pattern}
                title={m.title}
                minLength={m.minLength}
                maxLength={m.maxLength}
                inputMode={m.inputMode}
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
