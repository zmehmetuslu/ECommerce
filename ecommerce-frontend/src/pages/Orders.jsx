import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

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
    const init = async () => {
      await loadOrders();
    };

    init();
  }, []);

  const statusLabelMap = {
    Pending: "Beklemede",
    Preparing: "Hazırlanıyor",
    Shipped: "Kargoda",
    Delivered: "Teslim Edildi",
    Cancelled: "İptal",
  };

  const statusColorMap = {
    Pending: "bg-amber-50 text-amber-700",
    Preparing: "bg-blue-50 text-blue-700",
    Shipped: "bg-purple-50 text-purple-700",
    Delivered: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-700",
  };
  const paymentStatusLabelMap = {
    Pending: "Ödeme Bekliyor",
    Paid: "Ödendi",
    Failed: "Ödeme Başarısız",
  };
  const paymentStatusColorMap = {
    Pending: "bg-amber-50 text-amber-700",
    Paid: "bg-green-50 text-green-700",
    Failed: "bg-red-50 text-red-700",
  };

  const statusSteps = ["Pending", "Preparing", "Shipped", "Delivered"];

  const filteredOrders =
    activeStatus === "All"
      ? orders
      : orders.filter((order) => order.status === activeStatus);

  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || "Pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-[70vh] bg-[#f6f8f6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900">Siparişlerim</h1>
        <p className="mt-2 text-sm text-slate-500">Siparişlerinin güncel durumunu ve detaylarını buradan takip edebilirsin.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {["All", "Pending", "Preparing", "Shipped", "Delivered", "Cancelled"].map(
            (status) => {
              const isActive = activeStatus === status;
              const label = status === "All" ? "Tümü" : statusLabelMap[status];
              const count =
                status === "All"
                  ? orders.length
                  : statusCounts[status] || 0;

              return (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {label} ({count})
                </button>
              );
            }
          )}
        </div>

        {message && (
          <div className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            {message}
          </div>
        )}

        <div className="mt-8 space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">Henüz sipariş bulunmuyor.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.orderId} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                      Sipariş #{order.orderId}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {new Date(order.orderDate).toLocaleString("tr-TR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        statusColorMap[order.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {statusLabelMap[order.status] || "Beklemede"}
                    </span>
                    <p className="text-2xl font-extrabold text-green-700">
                      {Number(order.totalPrice || 0).toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      paymentStatusColorMap[order.paymentStatus] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {paymentStatusLabelMap[order.paymentStatus] || "Ödeme Durumu Yok"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                    {order.paymentMethod || "Yöntem Yok"}
                  </span>
                </div>

                {order.status !== "Cancelled" && (
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {statusSteps.map((step, index) => {
                      const currentIndex = statusSteps.indexOf(order.status);
                      const isDone = currentIndex >= index;
                      return (
                        <div
                          key={step}
                          className={`rounded-xl px-3 py-2 text-center text-[11px] font-bold ${
                            isDone
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {statusLabelMap[step]}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 space-y-3">
                  {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex flex-col gap-2 rounded-2xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-slate-500">
                          Adet: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold text-slate-900 sm:text-right">
                        {Number(item.lineTotal || 0).toLocaleString("tr-TR")} ₺
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