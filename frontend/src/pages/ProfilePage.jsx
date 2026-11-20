import { useEffect, useState } from 'react';
import { usersApi } from '../api/users';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fieldErrors } from '../utils';

const FIELDS = [
  { name: 'firstName', label: 'Ism', autoComplete: 'given-name', pattern: "[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳʻʼ’' -]+", title: 'Ism faqat harflardan iborat bo‘lsin.', maxLength: 50 },
  { name: 'lastName', label: 'Familiya', autoComplete: 'family-name', pattern: "[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳʻʼ’' -]+", title: 'Familiya faqat harflardan iborat bo‘lsin.', maxLength: 50 },
  { name: 'username', label: 'Username', autoComplete: 'username', pattern: '[A-Za-z0-9_]+', title: 'Username faqat harf, raqam va _ belgisidan iborat bo‘lsin.', minLength: 3, maxLength: 50 },
  { name: 'phone', label: 'Telefon raqami', type: 'tel', autoComplete: 'tel', pattern: '\\+998[0-9]{9}', title: 'Raqam +998901234567 ko‘rinishida bo‘lsin.', maxLength: 13 },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    username: user?.username ?? '',
    phone: user?.phone ?? '',
    verificationCode: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [telegramBotLink, setTelegramBotLink] = useState('');
  const phoneNeedsVerification = form.phone !== (user?.phone ?? '') || !user?.phoneVerified;

  useEffect(() => {
    authApi.getTelegramBotLink().then((link) => setTelegramBotLink(link ?? '')).catch(() => {});
  }, []);

  const change = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    if (name === 'phone') value = value.replace(/[^0-9+]/g, '').slice(0, 13);
    if (name === 'verificationCode') value = value.replace(/\D/g, '').slice(0, 6);
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setErrors({});
    setSaving(true);

    try {
      const updatedUser = await usersApi.updateProfile(form);
      updateUser(updatedUser);
      setForm({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        phone: updatedUser.phone ?? '',
        verificationCode: '',
      });
      toast('Profil ma’lumotlari saqlandi.');
    } catch (err) {
      setError(err.message || 'Profilni saqlab bo‘lmadi.');
      setErrors(fieldErrors(err.detail));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-10 md:py-16">
      <div className="border border-dark-3 bg-dark-2 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Akkaunt</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-cream">Profil sozlamalari</h1>
        <p className="mt-3 text-sm text-gray-400">
          Ism, familiya va username profilingizda ko‘rinadi. Buyurtmalar telefon raqamingiz bilan rasmiylashtiriladi.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          {FIELDS.map((field) => (
            <div key={field.name}>
              <label htmlFor={`profile-${field.name}`} className="mb-2 block text-sm text-gray-300">
                {field.label}
              </label>
              <input
                id={`profile-${field.name}`}
                name={field.name}
                type={field.type ?? 'text'}
                inputMode={field.name === 'phone' ? 'tel' : undefined}
                autoComplete={field.autoComplete}
                value={form[field.name]}
                onChange={change}
                placeholder={field.name === 'phone' ? '+998901234567' : field.label}
                required
                pattern={field.pattern}
                title={field.title}
                minLength={field.minLength}
                maxLength={field.maxLength}
                className="store-input"
              />
              {errors[field.name] && <p className="mt-1 text-xs text-red-400">{errors[field.name]}</p>}
              {field.name === 'phone' && phoneNeedsVerification && (
                <div className="mt-3 rounded border border-dark-3 px-3 py-3 text-sm text-gray-400">
                  {telegramBotLink ? (
                    <a href={telegramBotLink} target="_blank" rel="noreferrer" className="text-gold underline underline-offset-4">
                      Telegram botni oching
                    </a>
                  ) : (
                    <span>Telegram bot hali sozlanmagan.</span>
                  )}
                  <p className="mt-2">Botda Start bosing, yangi raqamingizni ulashing va kelgan kodni kiriting.</p>
                  <input
                    name="verificationCode"
                    value={form.verificationCode}
                    onChange={change}
                    placeholder="6 xonali tasdiqlash kodi"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    className="store-input mt-3"
                  />
                  {errors.verificationCode && <p className="mt-1 text-xs text-red-400">{errors.verificationCode}</p>}
                </div>
              )}
            </div>
          ))}

          {error && !Object.keys(errors).length && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={saving} className="store-btn">
            {saving ? 'Saqlanmoqda...' : 'O‘zgarishlarni saqlash'}
          </button>
        </form>
      </div>
    </section>
  );
}
