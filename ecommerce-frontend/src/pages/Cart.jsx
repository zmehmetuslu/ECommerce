import { useEffect, useMemo, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../services/cartService";
import api from "../services/api";

export default function Cart() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCartData(data);
    } catch (error) {
      console.error("Sepet alınamadı:", error);
      setMessage("Sepet yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const items = useMemo(() => {
    if (!cartData) return [];
    return cartData.items || cartData.cartItems || cartData.data || [];
  }, [cartData]);

  const totalPrice = useMemo(() => {
    if (cartData?.totalPrice != null) return cartData.totalPrice;

    return items.reduce((sum, item) => {
      const price = Number(item.price || item.productPrice || 0);
      const quantity = Number(item.quantity || 1);
      return sum + price * quantity;
    }, 0);
  }, [cartData, items]);

  const handleRemove = async (productId) => {
    try {
      setWorkingId(productId);
      await removeFromCart(productId);
      await loadCart();
    } catch (error) {
      console.error("Ürün silinemedi:", error);
      setMessage("Ürün sepetten silinemedi.");
    } finally {
      setWorkingId(null);
    }
  };

  const handleQuantityChange = async (productId, currentQuantity, type) => {
    const newQuantity =
      type === "increase" ? currentQuantity + 1 : currentQuantity - 1;

    if (newQuantity < 1) return;

    try {
      setWorkingId(productId);
      await updateCartQuantity(productId, newQuantity);
      await loadCart();
    } catch (error) {
      console.error("Adet güncellenemedi:", error);
      setMessage("Ürün adedi güncellenemedi.");
    } finally {
      setWorkingId(null);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setMessage("");
      await api.post("/Order/create");
      setMessage("Sipariş başarıyla oluşturuldu.");
      await loadCart();
    } catch (error) {
      console.error("Sipariş oluşturulamadı:", error);
      setMessage("Sipariş oluşturulamadı.");
    }
  };

  return (
    <div className="min-h-[70vh] bg-[#f6f8f6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Sepetim</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sepetindeki ürünleri düzenleyebilir ve siparişini tamamlayabilirsin.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">Sepet yükleniyor...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Sepetin boş</h2>
            <p className="mt-3 text-slate-500">
              Ürünler sayfasından ürün ekleyerek alışverişe başlayabilirsin.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
            {/* SOL TARAF - ÜRÜNLER */}
            <div className="space-y-4">
              {items.map((item, index) => {
                const productId = item.productId || item.id;
                const productName =
                  item.productName || item.name || `Ürün ${index + 1}`;
                const quantity = Number(item.quantity || 1);
                const price = Number(item.price || item.productPrice || 0);
                const imageList = [
                  "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1592982537447-6f2a6a0f0f9b?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80",
                  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80",
                ];

                return (
                  <div
                    key={productId}
                    className="grid gap-4 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-[140px_1fr]"
                  >
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={imageList[index % imageList.length]}
                        alt={productName}
                        className="h-32 w-full object-cover sm:h-full"
                      />
                    </div>

                    <div className="flex flex-col justify-between gap-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                            Sepet Ürünü
                          </p>
                          <h3 className="mt-1 text-lg font-bold text-slate-900">
                            {productName}
                          </h3>
                          <p className="mt-2 text-sm text-slate-500">
                            Tarım ve bahçe ekipmanları kategorisi
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-2xl font-extrabold text-slate-900">
                            {price} ₺
                          </p>
                          <p className="text-xs text-green-700">
                            Hızlı teslimat uygun
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex w-fit items-center rounded-2xl border border-slate-200 bg-slate-50">
                          <button
                            onClick={() =>
                              handleQuantityChange(productId, quantity, "decrease")
                            }
                            disabled={workingId === productId}
                            className="px-4 py-2 text-lg font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                          >
                            -
                          </button>

                          <span className="min-w-[48px] text-center font-bold text-slate-900">
                            {quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(productId, quantity, "increase")
                            }
                            disabled={workingId === productId}
                            className="px-4 py-2 text-lg font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(productId)}
                          disabled={workingId === productId}
                          className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          {workingId === productId ? "İşleniyor..." : "Sepetten Sil"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SAĞ TARAF - ÖZET */}
            <div className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Sipariş Özeti
              </h2>

              <div className="mt-6 space-y-4 border-b border-slate-100 pb-6">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Ürün Sayısı</span>
                  <span>{items.length}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Ara Toplam</span>
                  <span>{totalPrice.toFixed(2)} ₺</span>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Kargo</span>
                  <span className="font-semibold text-green-700">Ücretsiz</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-base font-semibold text-slate-700">
                  Toplam
                </span>
                <span className="text-3xl font-extrabold text-slate-900">
                  {totalPrice.toFixed(2)} ₺
                </span>
              </div>

              <button
                onClick={handleCreateOrder}
                className="mt-6 w-full rounded-2xl bg-green-600 py-4 text-sm font-bold text-white transition hover:bg-green-700"
              >
                Siparişi Tamamla
              </button>

              <p className="mt-4 text-center text-xs text-slate-400">
                Sipariş oluşturulduktan sonra siparişler alanından görüntüleyebilirsin.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}