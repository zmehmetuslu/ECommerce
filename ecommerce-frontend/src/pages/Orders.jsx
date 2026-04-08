import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error(error);
      setMessage("Siparişler yüklenemedi. Önce giriş yapman gerekebilir.");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="min-h-[70vh] bg-[#f6f8f6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900">Siparişlerim</h1>
        <p className="mt-2 text-sm text-slate-500">
          Oluşturduğun siparişleri burada görebilirsin.
        </p>

        {message && (
          <div className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            {message}
          </div>
        )}

        <div className="mt-8 space-y-6">
          {orders.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">Henüz sipariş bulunmuyor.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.orderId} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Sipariş #{order.orderId}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {new Date(order.orderDate).toLocaleString("tr-TR")}
                    </p>
                  </div>

                  <p className="text-2xl font-extrabold text-green-700">
                    {order.totalPrice} ₺
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-slate-500">
                          Adet: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold text-slate-900">
                        {item.lineTotal} ₺
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}