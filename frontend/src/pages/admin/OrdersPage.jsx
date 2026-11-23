import { useEffect, useState } from 'react';
import { ordersApi } from '../../api/orders';
import { useToast } from '../../context/ToastContext';
import { ORDER_STATUS } from '../../constants';
import { formatPrice, formatDate } from '../../utils';

// Har bir holatdan qaysi holatlarga o'tish mumkin (backenddagi qoida bilan bir xil)
const NEXT_STATUSES = {
  1: [
    { status: 2, text: 'Tasdiqlash' },
    { status: 4, text: 'Bekor qilish' },
  ],
  2: [
    { status: 3, text: 'Yetkazildi' },
    { status: 4, text: 'Bekor qilish' },
  ],
};

export default function OrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setOrders(await ordersApi.getAll());
    } catch (err) {
      toast(err.message, 'xato');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (order, status) => {
    if (status === 4 && !window.confirm(`#${order.orderId} buyurtma bekor qilinsinmi? Mahsulotlar omborga qaytadi.`)) {
      return;
    }

    try {
      await ordersApi.changeStatus(order.orderId, status);
      toast(`#${order.orderId}: ${ORDER_STATUS[status].name}`);
      load();
    } catch (err) {
      toast(err.message, 'xato');
    }
  };

  return (
    <div>
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
                <p className="font-medium">
                  {b.phone}
                  {b.additionalPhone && <span className="text-gray-500"> · {b.additionalPhone}</span>}
                </p>
                <p className="text-gray-500">{b.deliveryAddress}</p>
              </div>
            </div>

            <ul className="my-4 divide-y divide-gray-100 border-y border-gray-100 text-sm">
              {b.items.map((m, i) => (
                <li key={i} className="flex justify-between gap-3 py-2">
                  <span>
                    {m.productName} <span className="text-gray-500">× {m.quantity}</span>
                  </span>
                  <span className="whitespace-nowrap">{formatPrice(m.amount)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold">Jami: {formatPrice(b.totalAmount)}</p>

              <div className="flex w-full gap-2 sm:w-auto">
                {(NEXT_STATUSES[b.status] ?? []).map((k) => (
                  <button
                    key={k.status}
                    onClick={() => changeStatus(b, k.status)}
                    className={`flex-1 sm:flex-none ${k.status === 4 ? 'admin-btn-xavfli' : 'admin-btn px-3 py-1.5'}`}
                  >
                    {k.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
