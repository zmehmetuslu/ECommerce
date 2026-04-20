import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../services/cartService";
import { FALLBACK_IMAGE_URL, resolveImageSrc } from "../utils/image";
import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        const result = await getWishlist();
        setItems(result);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => Number(item.productId) !== Number(productId)));
      setMessage("Ürün favorilerden çıkarıldı.");
    } catch {
      setMessage("Favori ürünü kaldırma işlemi başarısız.");
    } finally {
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      setMessage("Ürün sepete eklendi.");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Sepete eklemek için giriş yapman gerekebilir.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f6f8f6] px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-slate-500">Favoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#f6f8f6] px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Favorilerim</h1>
          <p className="mt-2 text-sm text-slate-500">
            Beğendiğin ürünleri burada saklayabilir, sonra hızlıca sepete ekleyebilirsin.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-slate-600">Favori listende ürün bulunmuyor.</p>
            <Link
              to="/products"
              className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
            >
              Ürünleri İncele
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="rounded-[28px] border border-slate-100 bg-white p-3 shadow-sm"
              >
                <Link to={`/products/${item.productId}`} className="block">
                  <div className="relative h-44 overflow-hidden rounded-2xl">
                    <img
                      src={resolveImageSrc(item.imageUrl)}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE_URL;
                      }}
                    />
                  </div>
                </Link>

                <div className="space-y-3 px-2 pt-4">
                  <Link
                    to={`/products/${item.productId}`}
                    className="block text-xs font-bold leading-tight text-slate-800 hover:text-green-700"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-base font-black text-green-700">
                    {Number(item.price || 0).toLocaleString("tr-TR")} ₺
                  </p>
                  <div className="grid gap-2">
                    <button
                      onClick={() => handleAddToCart(item.productId)}
                      className="rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-green-600"
                    >
                      Sepete Ekle
                    </button>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="rounded-xl border border-red-200 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      Favoriden Kaldır
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
