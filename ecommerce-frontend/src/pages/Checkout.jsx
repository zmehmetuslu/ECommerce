import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../services/cartService";
import { createOrder } from "../services/orderService";
import { validateCoupon } from "../services/couponService";

export default function Checkout() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponResult, setCouponResult] = useState({
    discountAmount: 0,
    shippingDiscount: 0,
  });
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [mockPaymentOutcome, setMockPaymentOutcome] = useState("success");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponMessageType, setCouponMessageType] = useState("success");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    addressLine: "",
    paymentMethod: "Kapida Odeme",
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const data = await getCart();
        setCartData(data);
      } catch {
        setCartData(null);
        setMessage("Checkout için önce giriş yapman gerekiyor.");
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const items = useMemo(() => {
    if (!cartData) return [];
    return cartData.items || [];
  }, [cartData]);

  const totalPrice = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
  }, [items]);

  const shippingFee = totalPrice >= 1000 ? 0 : 89;
  const grandTotal =
    totalPrice + shippingFee - couponResult.discountAmount - couponResult.shippingDiscount;

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ["fullName", "phone", "city", "district", "addressLine"];
    const hasMissing = required.some((key) => !form[key]?.trim());
    if (hasMissing) {
      setMessage("Lütfen teslimat bilgilerini eksiksiz doldur.");
      return;
    }

    try {
      setSubmitting(true);
      await createOrder({
        couponCode: appliedCouponCode,
        paymentMethod: form.paymentMethod,
        mockPaymentOutcome,
      });
      setMessage("Siparişin oluşturuldu. Siparişlerim sayfasına yönlendiriliyorsun.");
      setTimeout(() => navigate("/orders"), 1200);
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Sipariş oluşturulamadı. Bilgileri kontrol edip tekrar dene."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const result = await validateCoupon({
        code: couponInput,
        subTotal: totalPrice,
        shippingFee,
      });
      setCouponResult({
        discountAmount: Number(result?.discountAmount || 0),
        shippingDiscount: Number(result?.shippingDiscount || 0),
      });
      setAppliedCouponCode(couponInput.trim().toUpperCase());
      setCouponMessage(result?.message || "Kupon uygulandı.");
      setCouponMessageType("success");
    } catch (error) {
      setCouponResult({ discountAmount: 0, shippingDiscount: 0 });
      setAppliedCouponCode("");
      setCouponMessage(
        error?.response?.data?.message || "Kupon uygulanamadı. Kod geçersiz olabilir."
      );
      setCouponMessageType("error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f6f8f6] px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-slate-500">Checkout yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#f6f8f6] px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>
          <p className="mt-2 text-sm text-slate-500">
            Teslimat ve ödeme bilgilerini tamamlayarak siparişini onayla.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-slate-600">Sepetinde ürün bulunmuyor.</p>
            <Link
              to="/products"
              className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
            >
              Ürünlere Git
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-black text-slate-900">Teslimat Bilgileri</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  placeholder="Ad Soyad"
                  value={form.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-600"
                />
                <input
                  placeholder="Telefon"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-600"
                />
                <input
                  placeholder="Şehir"
                  value={form.city}
                  onChange={(e) => onChange("city", e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-600"
                />
                <input
                  placeholder="İlçe"
                  value={form.district}
                  onChange={(e) => onChange("district", e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-600"
                />
              </div>
              <textarea
                placeholder="Açık Adres"
                value={form.addressLine}
                onChange={(e) => onChange("addressLine", e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-600"
              />

              <div>
                <h3 className="mb-3 text-base font-bold text-slate-900">Ödeme Yöntemi</h3>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => onChange("paymentMethod", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-600"
                >
                  <option>Kapida Odeme</option>
                  <option>Kredi Karti (Mock)</option>
                  <option>Havale/EFT</option>
                </select>
                {form.paymentMethod !== "Kapida Odeme" && (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMockPaymentOutcome("success")}
                      className={`rounded-xl px-3 py-2 text-[11px] font-bold ${
                        mockPaymentOutcome === "success"
                          ? "bg-green-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      Mock Başarılı
                    </button>
                    <button
                      type="button"
                      onClick={() => setMockPaymentOutcome("fail")}
                      className={`rounded-xl px-3 py-2 text-[11px] font-bold ${
                        mockPaymentOutcome === "fail"
                          ? "bg-red-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      Mock Başarısız
                    </button>
                  </div>
                )}
              </div>

              <button
                disabled={submitting}
                className="w-full rounded-2xl bg-green-600 py-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                {submitting ? "Sipariş Oluşturuluyor..." : "Siparişi Onayla"}
              </button>

              <p className="text-xs text-slate-400">
                Test kuponları: <span className="font-semibold">HOSGELDIN10</span>,{" "}
                <span className="font-semibold">TARIM50</span>,{" "}
                <span className="font-semibold">KARGO0</span>
              </p>
            </form>

            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">Sipariş Özeti</h2>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                {items.map((item, idx) => (
                  <div key={`${item.productId}-${idx}`} className="flex justify-between gap-3">
                    <span className="line-clamp-1">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      {(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString("tr-TR")} ₺
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex gap-2 pb-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Kupon kodu"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-green-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Uygula
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-xs font-medium ${
                      couponMessageType === "error" ? "text-red-600" : "text-green-700"
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
                {appliedCouponCode && (
                  <p className="text-xs text-slate-500">
                    Aktif kupon: <span className="font-semibold">{appliedCouponCode}</span>
                  </p>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Ara Toplam</span>
                  <span>{totalPrice.toLocaleString("tr-TR")} ₺</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Kargo</span>
                  <span>
                    {(shippingFee - couponResult.shippingDiscount).toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                {couponResult.discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Kupon İndirimi</span>
                    <span>-{couponResult.discountAmount.toLocaleString("tr-TR")} ₺</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900">
                  <span>Genel Toplam</span>
                  <span>{grandTotal.toLocaleString("tr-TR")} ₺</span>
                </div>
              </div>
            </aside>
          </div>
        )}

        {message && (
          <div className="fixed bottom-8 right-8 z-50 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-xl">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
