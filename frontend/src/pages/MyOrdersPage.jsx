import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../api/orders';
import { LogoMark } from '../components/Logo';
import { useToast } from '../context/ToastContext';
import { ORDER_STATUS } from '../constants';
import { formatPrice, formatDate } from '../utils';

// Buyurtma qaysi bosqichda ekanini ko'rsatuvchi chiziq (bekor qilinganda ko'rsatilmaydi)
const STEPS = [1, 2, 3];

export default function MyOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState(null);
  const [previewReceipt, setPreviewReceipt] = useState(null);

  const load = async () => {
    try {
      setOrders(await ordersApi.getMine());
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (b) => {
    if (!window.confirm(`#${b.orderId} buyurtma bekor qilinsinmi?`)) {
      return;
    }

    try {
      await ordersApi.cancel(b.orderId);
      toast('Buyurtma bekor qilindi');
      load();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  if (!orders) {
    return (
      <section className="mx-auto max-w-3xl space-y-5 px-4 py-8 md:py-12">
        <div className="skeleton h-12 w-64" />
        <div className="skeleton h-48 w-full" />
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="animate-appear px-4 py-20 text-center md:py-28">
        <LogoMark className="mx-auto h-20 w-20 opacity-30" />
        <h1 className="mt-6 font-serif text-3xl text-cream sm:text-4xl">Hali buyurtma yo'q</h1>
        <Link to="/" className="store-btn-outline mt-10">
          Katalogga o'tish
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="mb-7 animate-appear font-serif text-3xl font-semibold text-cream sm:text-4xl md:mb-10 md:text-5xl">Buyurtmalarim</h1>

      <div className="space-y-5 md:space-y-6">
        {orders.map((b, i) => (
          <article
            key={b.orderId}
            className="animate-appear border border-dark-3 bg-dark-2 p-5 transition duration-300 hover:border-gold/40 sm:p-7"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-serif text-xl text-cream sm:text-2xl">#{b.orderId}</span>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${ORDER_STATUS[b.status].color}`}>
                  {ORDER_STATUS[b.status].name}
                </span>
              </div>
              <span className="text-sm text-gray-500">{formatDate(b.createdAt)}</span>
            </div>

            {b.status !== 4 && (
              <div className="mt-5 flex gap-2 sm:mt-6">
                {STEPS.map((step) => (
                  <div key={step} className="flex-1">
                    <div className={`h-0.5 transition-colors duration-700 ${b.status >= step ? 'bg-gold' : 'bg-dark-3'}`} />
                    <p className={`mt-2 text-[0.65rem] uppercase tracking-wide sm:text-[0.7rem] sm:tracking-wider ${b.status >= step ? 'text-gold' : 'text-gray-600'}`}>
                      {ORDER_STATUS[step].name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <ul className="my-5 space-y-2 border-y border-dark-3 py-4 text-sm sm:my-6 sm:py-5">
              {b.items.map((m, j) => (
                <li key={j} className="flex justify-between gap-4 text-gray-300">
                  <span>
                    {m.productName} <span className="text-gray-500">× {m.quantity}</span>
                  </span>
                  <span className="whitespace-nowrap">{formatPrice(m.amount)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1 break-words text-sm text-gray-500">
                <p>
                  {b.deliveryAddress} · {b.phone}
                  {b.additionalPhone ? `, ${b.additionalPhone}` : ''}
                </p>
                {b.receiptImageUrl && (
                  <button
                    type="button"
                    onClick={() => setPreviewReceipt(b.receiptImageUrl)}
                    className="text-xs text-gold underline underline-offset-4 hover:text-gold-light"
                  >
                    Yuklangan to'lov chekini ko'rish
                  </button>
                )}
              </div>
              <div className="flex w-full items-center justify-between gap-5 sm:w-auto sm:justify-end">
                <span className="font-serif text-xl text-gold sm:text-2xl">{formatPrice(b.totalAmount)}</span>
                {b.status === 1 && (
                  <button onClick={() => cancel(b)} className="-mr-2 px-2 py-2 text-sm text-gray-500 transition hover:text-red-400">
                    Bekor qilish
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {previewReceipt && (
        <div
          onClick={() => setPreviewReceipt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-lg overflow-auto rounded-md border border-dark-3 bg-dark-2 p-3"
          >
            <img src={previewReceipt} alt="To'lov cheki" className="max-h-[78vh] w-auto rounded object-contain" />
            <div className="mt-3 flex justify-end gap-3">
              <a
                href={previewReceipt}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gold underline underline-offset-4"
              >
                Yangi oynada ochish
              </a>
              <button
                type="button"
                onClick={() => setPreviewReceipt(null)}
                className="text-xs text-gray-400 hover:text-cream"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
