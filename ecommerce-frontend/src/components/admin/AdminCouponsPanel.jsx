import { useMemo, useState } from "react";

export default function AdminCouponsPanel({
  coupons,
  couponForm,
  onCouponFormChange,
  onCreateCoupon,
  onToggleCouponActive,
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentTime] = useState(() => Date.now());
  const filteredCoupons = useMemo(() => {
    const withFlags = coupons.map((coupon) => {
      const isExpired = coupon.expireAt
        ? new Date(coupon.expireAt).getTime() < currentTime
        : false;
      const isLimitReached =
        coupon.usageLimit != null && Number(coupon.usedCount) >= Number(coupon.usageLimit);
      return { ...coupon, isExpired, isLimitReached };
    });

    let result = withFlags;
    if (statusFilter === "active") {
      result = result.filter((c) => c.isActive && !c.isExpired && !c.isLimitReached);
    } else if (statusFilter === "expired") {
      result = result.filter((c) => c.isExpired);
    } else if (statusFilter === "limit") {
      result = result.filter((c) => c.isLimitReached);
    } else if (statusFilter === "passive") {
      result = result.filter((c) => !c.isActive);
    }

    if (sortBy === "newest") {
      result = [...result].sort((a, b) => b.id - a.id);
    } else if (sortBy === "used_desc") {
      result = [...result].sort((a, b) => b.usedCount - a.usedCount);
    } else if (sortBy === "expire_asc") {
      result = [...result].sort((a, b) => {
        const aVal = a.expireAt ? new Date(a.expireAt).getTime() : Number.MAX_SAFE_INTEGER;
        const bVal = b.expireAt ? new Date(b.expireAt).getTime() : Number.MAX_SAFE_INTEGER;
        return aVal - bVal;
      });
    }

    return result;
  }, [coupons, statusFilter, sortBy, currentTime]);

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <h2 className="text-md font-black text-slate-800">Kupon Yönetimi</h2>
        <span className="text-[10px] font-bold uppercase text-slate-400">
          Toplam {coupons.length} Kupon
        </span>
      </div>

      <form onSubmit={onCreateCoupon} className="mb-5 grid gap-3 md:grid-cols-6">
        <input
          value={couponForm.code}
          onChange={(e) => onCouponFormChange("code", e.target.value)}
          placeholder="Kod (örn HOSGELDIN15)"
          className="rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none md:col-span-2"
        />
        <select
          value={couponForm.type}
          onChange={(e) => onCouponFormChange("type", e.target.value)}
          className="rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none"
        >
          <option value="rate">Yüzde</option>
          <option value="fixed">Sabit</option>
          <option value="free_shipping">Ücretsiz Kargo</option>
        </select>
        <input
          type="number"
          value={couponForm.value}
          onChange={(e) => onCouponFormChange("value", e.target.value)}
          placeholder="Değer"
          className="rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none"
        />
        <input
          type="number"
          value={couponForm.minTotal}
          onChange={(e) => onCouponFormChange("minTotal", e.target.value)}
          placeholder="Min sepet"
          className="rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none"
        />
        <input
          type="number"
          value={couponForm.usageLimit}
          onChange={(e) => onCouponFormChange("usageLimit", e.target.value)}
          placeholder="Toplam limit"
          className="rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none"
        />
        <input
          type="number"
          value={couponForm.perUserLimit}
          onChange={(e) => onCouponFormChange("perUserLimit", e.target.value)}
          placeholder="Kullanıcı limiti"
          className="rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none"
        />
        <input
          type="date"
          value={couponForm.expireAt}
          onChange={(e) => onCouponFormChange("expireAt", e.target.value)}
          className="rounded-xl bg-slate-50 px-3 py-2 text-xs outline-none"
        />
        <button className="rounded-xl bg-green-600 px-4 py-2 text-xs font-black text-white hover:bg-green-700 md:col-span-1">
          Kupon Ekle
        </button>
      </form>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
        >
          <option value="all">Tümü</option>
          <option value="active">Aktif</option>
          <option value="passive">Pasif</option>
          <option value="expired">Süresi Dolan</option>
          <option value="limit">Limiti Dolan</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
        >
          <option value="newest">En Yeni</option>
          <option value="used_desc">En Çok Kullanılan</option>
          <option value="expire_asc">Süresi Yaklaşan</option>
        </select>

        <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
          Gösterilen: {filteredCoupons.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-left text-xs">
          <thead>
            <tr className="border-b text-[10px] uppercase tracking-widest text-slate-400">
              <th className="py-2">Kod</th>
              <th className="py-2">Tip</th>
              <th className="py-2">Değer</th>
              <th className="py-2">Min Sepet</th>
              <th className="py-2">Kullanım</th>
              <th className="py-2">Kişi Limiti</th>
              <th className="py-2">Bitiş</th>
              <th className="py-2">Durum</th>
              <th className="py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-slate-100">
                <td className="py-2 font-bold text-slate-800">{coupon.code}</td>
                <td className="py-2 text-slate-600">{coupon.type}</td>
                <td className="py-2 text-slate-600">{Number(coupon.value).toLocaleString("tr-TR")}</td>
                <td className="py-2 text-slate-600">{Number(coupon.minTotal).toLocaleString("tr-TR")} ₺</td>
                <td className="py-2 text-slate-600">
                  {coupon.usedCount}/{coupon.usageLimit ?? "Sınırsız"}
                </td>
                <td className="py-2 text-slate-600">{coupon.perUserLimit}</td>
                <td className="py-2 text-slate-600">
                  {coupon.expireAt ? new Date(coupon.expireAt).toLocaleDateString("tr-TR") : "-"}
                </td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-1">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                        coupon.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {coupon.isActive ? "Aktif" : "Pasif"}
                    </span>
                    {coupon.isExpired && (
                      <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">
                        Süresi Doldu
                      </span>
                    )}
                    {coupon.isLimitReached && (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                        Limit Doldu
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => onToggleCouponActive(coupon.id)}
                    className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-50"
                  >
                    {coupon.isActive ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCoupons.length === 0 && (
          <div className="py-4 text-center text-xs font-semibold text-slate-400">
            Seçili filtreye uygun kupon bulunamadı.
          </div>
        )}
      </div>
    </section>
  );
}
