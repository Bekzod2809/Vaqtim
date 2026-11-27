import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { paymentSettingsApi } from '../../api/paymentSettings';
import { useToast } from '../../context/ToastContext';
import { ORDER_STATUS } from '../../constants';
import { formatPrice, formatDate } from '../../utils';

// Har bir holatdan qaysi holatlarga o'tish mumkin (backenddagi qoida bilan bir xil)
const NEXT_STATUSES = {
  1: [
    { status: 2, text: "Chekni tasdiqlash" },
    { status: 4, text: 'Bekor qilish' },
  ],
  2: [
    { status: 3, text: 'Yetkazildi' },
    { status: 4, text: 'Bekor qilish' },
  ],
};

function formatCardInput(value) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export default function OrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardForm, setCardForm] = useState({ cardNumber: '', cardHolder: '' });
  const [savingCard, setSavingCard] = useState(false);
  const [previewOrder, setPreviewOrder] = useState(null);

  const load = async () => {
    try {
      const [ordersData, cardData] = await Promise.all([
        ordersApi.getAll(),
        paymentSettingsApi.get().catch(() => null),
      ]);
      setOrders(ordersData);
      if (cardData) {
        setCardForm({
          cardNumber: formatCardInput(cardData.cardNumber),
          cardHolder: cardData.cardHolder ?? '',
        });
      }
    } catch (err) {
      toast(err.message, 'xato');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveCard = async (e) => {
    e.preventDefault();
    setSavingCard(true);
    try {
      const updated = await paymentSettingsApi.update(cardForm);
      setCardForm({
        cardNumber: formatCardInput(updated.cardNumber),
        cardHolder: updated.cardHolder ?? '',
      });
      toast("To'lov kartasi saqlandi");
    } catch (err) {
      toast(err.message, 'xato');
    } finally {
      setSavingCard(false);
    }
  };

  const changeStatus = async (order, status) => {
    if (status === 4 && !window.confirm(`#${order.orderId} buyurtma bekor qilinsinmi? Mahsulotlar omborga qaytadi.`)) {
      return;
    }

    try {
      await ordersApi.changeStatus(order.orderId, status);
      toast(`#${order.orderId}: ${ORDER_STATUS[status].name}`);
      if (previewOrder?.orderId === order.orderId) {
        setPreviewOrder(null);
      }
      load();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  return (
    <div>
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
        <h2 className="text-base font-semibold text-gray-900">To'lov kartasi sozlamalari</h2>
        <p className="mt-1 text-xs text-gray-500">
          Savatda xaridorlarga ko'rinadigan karta raqami va karta egasi.
        </p>

        <form onSubmit={saveCard} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_auto]">
          <div>
            <label className="admin-label">Karta raqami (16 raqam)</label>
            <input
              type="text"
              inputMode="numeric"
              value={cardForm.cardNumber}
              onChange={(e) => setCardForm({ ...cardForm, cardNumber: formatCardInput(e.target.value) })}
              placeholder="8600 0000 0000 0000"
              maxLength={19}
              required
              className="admin-input font-mono"
            />
          </div>

          <div>
            <label className="admin-label">Karta egasi (ixtiyoriy)</label>
            <input
              type="text"
              value={cardForm.cardHolder}
              onChange={(e) => setCardForm({ ...cardForm, cardHolder: e.target.value })}
              placeholder="Ism Familiya"
              maxLength={100}
              className="admin-input"
            />
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button type="submit" disabled={savingCard} className="admin-btn w-full lg:w-auto">
              {savingCard ? 'Saqlanmoqda...' : 'Kartani saqlash'}
            </button>
          </div>
        </form>
      </div>

      <h1 className="mb-6 text-xl font-semibold sm:text-2xl">Buyurtmalar</h1>

      {loading && <p className="text-gray-500">Yuklanmoqda...</p>}
      {!loading && orders.length === 0 && <p className="text-gray-500">Hali buyurtma yo'q.</p>}

      <div className="space-y-4">
        {orders.map((b) => (
          <div key={b.orderId} className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">#{b.orderId}</span>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${ORDER_STATUS[b.status].color}`}>
                    {ORDER_STATUS[b.status].name}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{formatDate(b.createdAt)}</p>
              </div>

              <div className="min-w-0 break-words text-sm sm:text-right">
                {b.customerName && (
                  <p className="font-semibold text-gray-900">
                    {b.customerName}
                    {b.customerUsername && <span className="ml-1 font-normal text-gray-500">(@{b.customerUsername})</span>}
                  </p>
                )}
                <p className="font-medium text-gray-800">
                  {b.phone}
                  {b.additionalPhone && <span className="text-gray-500"> · {b.additionalPhone}</span>}
                </p>
                <p className="text-gray-500">{b.deliveryAddress}</p>
              </div>
            </div>

            <ul className="my-4 divide-y divide-gray-100 border-y border-gray-100 text-sm">
              {b.items.map((m, i) => (
                <li key={i} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-3">
                    {m.mainImageUrl && (
                      <img src={m.mainImageUrl} alt={m.productName} className="h-10 w-10 shrink-0 rounded border border-gray-200 object-cover" />
                    )}
                    {m.productId ? (
                      <Link to={`/product/${m.productId}`} className="font-medium text-gray-900 hover:underline">
                        {m.productName} <span className="font-normal text-gray-500">× {m.quantity}</span>
                      </Link>
                    ) : (
                      <span>
                        {m.productName} <span className="text-gray-500">× {m.quantity}</span>
                      </span>
                    )}
                  </div>
                  <span className="whitespace-nowrap">{formatPrice(m.amount)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <p className="font-semibold">Jami: {formatPrice(b.totalAmount)}</p>

                {b.receiptImageUrl ? (
                  <button
                    type="button"
                    onClick={() => setPreviewOrder(b)}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-800 transition hover:bg-gray-100"
                  >
                    <img
                      src={b.receiptImageUrl}
                      alt="To'lov cheki"
                      className="h-7 w-7 rounded object-cover ring-1 ring-gray-200"
                    />
                    <span>To'lov chekini ko'rish</span>
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">Chek yuklanmagan</span>
                )}
              </div>

              <div className="flex w-full gap-2 sm:w-auto">
                {(NEXT_STATUSES[b.status] ?? []).map((k) => (
                  <button
                    key={k.status}
                    onClick={() => changeStatus(b, k.status)}
                    className={`flex-1 sm:flex-none ${k.status === 4 ? 'admin-btn-danger' : 'admin-btn px-3 py-1.5'}`}
                  >
                    {k.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewOrder && (
        <div
          onClick={() => setPreviewOrder(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-4 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  #{previewOrder.orderId} — To'lov cheki ({formatPrice(previewOrder.totalAmount)})
                </h3>
                <p className="text-xs text-gray-500">
                  {previewOrder.customerName ? `${previewOrder.customerName} · ` : ''}
                  {previewOrder.phone}
                  {previewOrder.additionalPhone ? `, ${previewOrder.additionalPhone}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOrder(null)}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Yopish ✕
              </button>
            </div>

            <div className="flex justify-center rounded border border-gray-200 bg-gray-50 p-2">
              <img
                src={previewOrder.receiptImageUrl}
                alt="To'lov cheki"
                className="max-h-[68vh] w-auto rounded object-contain"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <a
                href={previewOrder.receiptImageUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-blue-600 underline"
              >
                Rasmni yangi oynada ochish
              </a>

              <div className="flex gap-2">
                {(NEXT_STATUSES[previewOrder.status] ?? []).map((k) => (
                  <button
                    key={k.status}
                    onClick={() => changeStatus(previewOrder, k.status)}
                    className={k.status === 4 ? 'admin-btn-danger' : 'admin-btn px-3 py-1.5'}
                  >
                    {k.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
