import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../api/cart';
import { ordersApi } from '../api/orders';
import { LogoMark } from '../components/Logo';
import QuantityPicker from '../components/QuantityPicker';
import { useToast } from '../context/ToastContext';
import { formatPrice, fieldErrors } from '../utils';

export default function CartPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [cart, setCart] = useState(null);
  const [form, setForm] = useState({ deliveryAddress: '', phone: '+998' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    setErrors({});
    setSubmitting(true);

    try {
      const id = await ordersApi.place(form);
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

          <div>
            <textarea
              value={form.deliveryAddress}
              onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
              placeholder="Yetkazish manzili"
              rows={3}
              className="store-input"
            />
            {errors.deliveryAddress && <p className="mt-1 text-xs text-red-400">{errors.deliveryAddress}</p>}
          </div>

          <div>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+998901234567"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="store-input"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
          </div>

          <p className="text-xs text-gray-500">To'lov yetkazib berilganda naqd amalga oshiriladi.</p>

          {notEnough && <p className="text-sm text-red-400">Avval omborda yetarli bo'lmagan mahsulotlar sonini kamaytiring.</p>}

          <button type="submit" disabled={submitting || notEnough} className="store-btn">
            {submitting ? 'Yuborilmoqda...' : 'Buyurtma berish'}
          </button>
        </form>
      </div>
    </section>
  );
}
