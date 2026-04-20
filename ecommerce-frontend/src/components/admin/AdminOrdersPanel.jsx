import { ORDER_STATUSES } from "../../services/orderService";

export default function AdminOrdersPanel({
  orders,
  statusHistories,
  loadingHistoryOrderId,
  statusUpdates,
  paymentUpdates = {},
  orderLoading,
  statusLabelMap,
  statusColorMap,
  onStatusChange,
  onSaveStatus,
  onPaymentChange = () => {},
  onSavePaymentStatus = () => {},
  onLoadHistory,
}) {
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

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <h2 className="text-md font-black text-slate-800">Sipariş Takibi</h2>
        <span className="text-[10px] font-bold uppercase text-slate-400">
          Tüm Siparişler
        </span>
      </div>

      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.orderId}
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    #ORD-{order.orderId}
                  </p>
                  <p className="text-sm font-black text-slate-800">
                    {order.username || "Bilinmeyen Kullanıcı"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(order.orderDate).toLocaleString("tr-TR")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      statusColorMap[order.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {statusLabelMap[order.status] || order.status}
                  </span>

                  <span className="text-sm font-black text-green-700">
                    {Number(order.totalPrice || 0).toLocaleString("tr-TR")} ₺
                  </span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
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
                {order.paymentReference && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">
                    {order.paymentReference}
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
                <select
                  value={statusUpdates[order.orderId] || order.status}
                  onChange={(e) => onStatusChange(order.orderId, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none md:w-52"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {statusLabelMap[status] || status}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => onSaveStatus(order.orderId)}
                  disabled={orderLoading}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {orderLoading ? "Kaydediliyor..." : "Durumu Kaydet"}
                </button>

                <select
                  value={paymentUpdates[order.orderId] || order.paymentStatus || "Pending"}
                  onChange={(e) => onPaymentChange(order.orderId, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none md:w-52"
                >
                  <option value="Pending">Ödeme Bekliyor</option>
                  <option value="Paid">Ödendi</option>
                  <option value="Failed">Ödeme Başarısız</option>
                </select>

                <button
                  onClick={() => onSavePaymentStatus(order.orderId)}
                  disabled={orderLoading}
                  className="rounded-xl bg-slate-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {orderLoading ? "Kaydediliyor..." : "Ödemeyi Kaydet"}
                </button>

                <button
                  onClick={() => onLoadHistory(order.orderId)}
                  disabled={loadingHistoryOrderId === order.orderId}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingHistoryOrderId === order.orderId
                    ? "Yukleniyor..."
                    : "Gecmisi Goster"}
                </button>
              </div>

              {statusHistories?.[order.orderId]?.length > 0 && (
                <div className="mt-3 space-y-1 rounded-xl bg-white p-3 text-[11px] text-slate-600">
                  {statusHistories[order.orderId].map((log, idx) => (
                    <p key={`${order.orderId}-${idx}`}>
                      {new Date(log.changedAt).toLocaleString("tr-TR")} -{" "}
                      <span className="font-semibold">{log.changedBy}</span>:{" "}
                      {statusLabelMap[log.oldStatus] || log.oldStatus}
                      {" -> "}
                      {statusLabelMap[log.newStatus] || log.newStatus}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="w-full py-4 text-center text-xs font-medium italic text-slate-400">
            Henüz aktif sipariş bulunmuyor.
          </div>
        )}
      </div>
    </section>
  );
}
