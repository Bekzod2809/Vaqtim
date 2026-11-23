import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../api/cart';
import { ordersApi } from '../api/orders';
import { LogoMark } from '../components/Logo';
import QuantityPicker from '../components/QuantityPicker';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { BTS_REGIONS } from '../data/btsBranches';
import { formatPrice, fieldErrors } from '../utils';

function SelectChevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/80"
    >
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [showAdditionalPhone, setShowAdditionalPhone] = useState(false);
  const [additionalPhone, setAdditionalPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const selectedRegion = BTS_REGIONS.find((r) => r.region === region);
  const districts = selectedRegion?.districts ?? [];
  const selectedDistrict = districts.find((d) => d.district === district);
  const branches = selectedDistrict?.branches ?? [];
  const selectedBranch = branches.find((b) => b.code === branchCode);

  const load = async () => {
    try {
      setCart(await cartApi.get());
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setDistrict('');
    setBranchCode('');
    setErrors({});
  };

  const handleDistrictChange = (e) => {
    const nextDistrict = e.target.value;
    setDistrict(nextDistrict);
    const nextBranches = districts.find((d) => d.district === nextDistrict)?.branches ?? [];
    setBranchCode(nextBranches.length === 1 ? nextBranches[0].code : '');
    setErrors({});
  };

  const handleBranchChange = (e) => {
    setBranchCode(e.target.value);
    setErrors({});
  };

  const changeQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      await cartApi.changeQuantity(item.cartItemId, newQuantity);
      load();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  const remove = async (item) => {
    try {
      await cartApi.remove(item.cartItemId);
      load();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!selectedRegion || !selectedDistrict || !selectedBranch) {
      setErrors({ deliveryAddress: 'Viloyat, tuman va BTS pochta filialini tanlang.' });
      return;
    }

    const deliveryAddress = `BTS #${selectedBranch.code} ${selectedBranch.name} — ${selectedRegion.region}, ${selectedDistrict.district} (${selectedBranch.address})`.slice(0, 300);
    const trimmedExtraPhone = additionalPhone.trim();

    setErrors({});
    setSubmitting(true);

    try {
      const id = await ordersApi.place({
        deliveryAddress,
        additionalPhone: showAdditionalPhone && trimmedExtraPhone ? trimmedExtraPhone : null,
      });
      toast(`#${id} buyurtma qabul qilindi`);
      navigate('/myOrders');
    } catch (err) {
      setErrors(fieldErrors(err.detail));
      toast(err.message, 'xato');
      load(); // ombor o'zgargan bo'lishi mumkin
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart) {
    return (
      <section className="mx-auto max-w-6xl space-y-4 px-4 py-8 md:py-12">
        <div className="skeleton h-12 w-48" />
        <div className="skeleton h-28 w-full" />
        <div className="skeleton h-28 w-full" />
      </section>
    );
  }

  if (cart.products.length === 0) {
    return (
      <section className="animate-appear px-4 py-20 text-center md:py-28">
        <LogoMark className="mx-auto h-20 w-20 opacity-30" />
        <h1 className="mt-6 font-serif text-3xl text-cream sm:text-4xl">Savat bo'sh</h1>
        <p className="mt-3 text-gray-500">Katalogdan o'zingizga yoqqan mahsulotni tanlang.</p>
        <Link to="/" className="store-btn-outline mt-10">
          Katalogga o'tish
        </Link>
      </section>
    );
  }

  // Savatda ombordagidan ko'p mahsulot bo'lsa (boshqa xaridor olib qo'ygan), buyurtma berib bo'lmaydi
  const notEnough = cart.products.some((q) => !q.hasEnoughStock);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="mb-7 animate-appear font-serif text-3xl font-semibold text-cream sm:text-4xl md:mb-10 md:text-5xl">Savat</h1>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        <ul className="divide-y divide-dark-3 border-y border-dark-3 lg:col-span-2">
          {cart.products.map((q, i) => (
            <li key={q.cartItemId} className="flex animate-appear gap-4 py-5 sm:gap-5 sm:py-6" style={{ animationDelay: `${i * 80}ms` }}>
              <Link to={`/product/${q.productId}`} className="group h-24 w-24 shrink-0 overflow-hidden bg-dark-2 ring-1 ring-dark-3 sm:h-28 sm:w-28">
                {q.mainImageUrl && (
                  <img
                    src={q.mainImageUrl}
                    alt={q.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div className="flex justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <Link to={`/product/${q.productId}`} className="font-serif text-lg leading-snug text-cream transition hover:text-gold sm:text-2xl">
                      {q.name}
                    </Link>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">{formatPrice(q.price)}</p>
                    {!q.hasEnoughStock && <p className="mt-1 text-xs text-red-400 sm:text-sm">Omborda yetarli emas</p>}
                  </div>
                  <p className="whitespace-nowrap text-sm text-cream sm:text-base">{formatPrice(q.amount)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <QuantityPicker
                    quantity={q.quantity}
                    decrease={() => changeQuantity(q, q.quantity - 1)}
                    increase={() => changeQuantity(q, q.quantity + 1)}
                  />
                  <button onClick={() => remove(q)} className="-mr-2 px-2 py-2 text-sm text-gray-500 transition hover:text-red-400">
                    O'chirish
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <form
          onSubmit={placeOrder}
          className="h-fit animate-appear space-y-5 border border-dark-3 bg-dark-2 p-5 sm:p-7 lg:sticky lg:top-28"
          style={{ animationDelay: '150ms' }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Buyurtma</p>

          <div className="flex items-baseline justify-between border-b border-dark-3 pb-5">
            <span className="text-gray-400">Jami</span>
            <span className="font-serif text-2xl text-gold sm:text-3xl">{formatPrice(cart.totalAmount)}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-400">Yetkazish manzili (BTS pochta)</span>
            </div>

            <div className="relative">
              <select
                aria-label="Viloyat yoki hudud"
                value={region}
                onChange={handleRegionChange}
                required
                className={`store-select ${region ? 'text-cream' : 'text-gray-500'}`}
              >
                <option value="">Viloyat / hududni tanlang</option>
                {BTS_REGIONS.map((r) => (
                  <option key={r.region} value={r.region}>
                    {r.region}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>

            <div className="relative">
              <select
                aria-label="Tuman yoki shahar"
                value={district}
                onChange={handleDistrictChange}
                disabled={!region}
                required
                className={`store-select ${district ? 'text-cream' : 'text-gray-500'}`}
              >
                <option value="">{region ? 'Tuman yoki shaharni tanlang' : 'Avval viloyatni tanlang'}</option>
                {districts.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district} ({d.branches.length} ta filial)
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>

            <div className="relative">
              <select
                aria-label="BTS pochta filiali"
                value={branchCode}
                onChange={handleBranchChange}
                disabled={!district}
                required
                className={`store-select ${branchCode ? 'text-cream' : 'text-gray-500'}`}
              >
                <option value="">{district ? 'BTS pochta filialini tanlang' : 'Avval tumanni tanlang'}</option>
                {branches.map((b) => (
                  <option key={b.code} value={b.code}>
                    #{b.code} — {b.name} ({b.landmark || b.address})
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>

            {selectedBranch && (
              <div className="rounded-md border border-gold/25 bg-dark/60 px-3.5 py-2.5 text-xs leading-relaxed">
                <p className="font-medium text-gold">
                  BTS #{selectedBranch.code} — {selectedBranch.name}
                </p>
                <p className="mt-0.5 text-gray-300">{selectedBranch.address}</p>
                {selectedBranch.landmark && (
                  <p className="mt-0.5 text-gray-500">Mo'ljal: {selectedBranch.landmark}</p>
                )}
              </div>
            )}

            <p className="text-xs text-gold/85">
              Mahsulot BTS Express pochta filiali orqali yetkazib beriladi.
            </p>

            {errors.deliveryAddress && <p className="mt-1 text-xs text-red-400">{errors.deliveryAddress}</p>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div>
                <p className="text-gray-500">Telefon raqami</p>
                <p className="mt-1 text-cream">{user?.phone || 'Hali kiritilmagan'}</p>
              </div>
              {user?.phone ? (
                <button
                  type="button"
                  onClick={() => {
                    if (showAdditionalPhone) {
                      setShowAdditionalPhone(false);
                      setAdditionalPhone('');
                      setErrors((curr) => ({ ...curr, additionalPhone: undefined }));
                    } else {
                      setShowAdditionalPhone(true);
                    }
                  }}
                  className="shrink-0 text-gold underline underline-offset-4 transition hover:text-gold-light"
                >
                  {showAdditionalPhone ? 'Olib tashlash' : "+ Qo'shimcha raqam"}
                </button>
              ) : (
                <Link to="/profile" className="shrink-0 text-gold underline underline-offset-4">
                  Raqam kiritish
                </Link>
              )}
            </div>

            {showAdditionalPhone && (
              <div>
                <input
                  type="tel"
                  inputMode="tel"
                  value={additionalPhone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9+]/g, '').slice(0, 13);
                    setAdditionalPhone(val);
                    setErrors((curr) => ({ ...curr, additionalPhone: undefined }));
                  }}
                  placeholder="Qo'shimcha raqam (+998901234567)"
                  pattern="\+998[0-9]{9}"
                  maxLength={13}
                  title="Raqam +998901234567 ko'rinishida bo'lsin (ixtiyoriy)."
                  className="store-input"
                />
                {errors.additionalPhone && <p className="mt-1 text-xs text-red-400">{errors.additionalPhone}</p>}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500">To'lov yetkazib berilganda naqd amalga oshiriladi.</p>

          {notEnough && <p className="text-sm text-red-400">Avval omborda yetarli bo'lmagan mahsulotlar sonini kamaytiring.</p>}

          <button
            type="submit"
            disabled={submitting || notEnough || !user?.phone || !user?.phoneVerified || !selectedBranch}
            className="store-btn"
          >
            {submitting ? 'Yuborilmoqda...' : 'Buyurtma berish'}
          </button>
        </form>
      </div>
    </section>
  );
}
