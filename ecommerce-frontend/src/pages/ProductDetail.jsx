import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import { FALLBACK_IMAGE_URL, resolveImageSrc } from "../utils/image";
import {
  addToWishlist,
  getWishlistProductIds,
  removeFromWishlist,
} from "../services/wishlistService";
import { getUserFromToken } from "../utils/auth";
import {
  createProductReview,
  deleteProductReview,
  getProductReviews,
  markReviewHelpful,
  updateProductReview,
} from "../services/productReviewService";
import AppToast from "../components/ui/AppToast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [wishlistIds, setWishlistIds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewSort, setReviewSort] = useState("newest");
  const [helpfulLoadingId, setHelpfulLoadingId] = useState(null);
  const user = getUserFromToken();
  const showToast = (message, type = "success", duration = 2500) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), duration);
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const result = await getProductById(id);
        setProduct(result);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const ids = await getWishlistProductIds();
        setWishlistIds(ids);
      } catch {
        setWishlistIds([]);
      }
    };
    loadWishlist();
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;
      try {
        setReviewsLoading(true);
        const list = await getProductReviews(id);
        setReviews(list);
      } catch {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    loadReviews();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product?.id) return;
    try {
      await addToCart(product.id, 1);
      showToast("Ürün sepete eklendi.");
    } catch {
      showToast("Sepete eklemek için giriş yapman gerekebilir.", "error");
    }
  };

  const handleToggleWishlist = async () => {
    if (!product?.id) return;
    try {
      const exists = wishlistIds.includes(Number(product.id));
      if (exists) {
        await removeFromWishlist(product.id);
        setWishlistIds((prev) => prev.filter((itemId) => itemId !== Number(product.id)));
        showToast("Favorilerden çıkarıldı.");
      } else {
        await addToWishlist(product.id);
        setWishlistIds((prev) => [...prev, Number(product.id)]);
        showToast("Favorilere eklendi.");
      }
    } catch {
      showToast("Favori işlemi için giriş yapman gerekebilir.", "error");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!product?.id) return;

    const trimmedComment = reviewForm.comment.trim();
    if (!trimmedComment) {
      showToast("Yorum metni boş olamaz.", "error");
      return;
    }

    try {
      if (editingReviewId) {
        await updateProductReview(product.id, editingReviewId, {
          rating: Number(reviewForm.rating),
          comment: trimmedComment,
        });
      } else {
        await createProductReview(product.id, {
          rating: Number(reviewForm.rating),
          comment: trimmedComment,
        });
      }
      setReviewForm({ rating: 5, comment: "" });
      setEditingReviewId(null);
      const list = await getProductReviews(product.id);
      setReviews(list);
      showToast(editingReviewId ? "Yorumun güncellendi." : "Yorumun başarıyla eklendi.");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Yorum eklenemedi. Lütfen tekrar dene.";
      showToast(errorMessage, "error");
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setReviewForm({ rating: Number(review.rating || 5), comment: review.comment || "" });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setReviewForm({ rating: 5, comment: "" });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!product?.id) return;
    if (!window.confirm("Yorumunu silmek istiyor musun?")) return;
    try {
      await deleteProductReview(product.id, reviewId);
      const list = await getProductReviews(product.id);
      setReviews(list);
      if (editingReviewId === reviewId) {
        handleCancelEdit();
      }
      showToast("Yorumun silindi.");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Yorum silinemedi. Lütfen tekrar dene.";
      showToast(errorMessage, "error");
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    if (!product?.id) return;
    try {
      setHelpfulLoadingId(reviewId);
      await markReviewHelpful(product.id, reviewId);
      const list = await getProductReviews(product.id);
      setReviews(list);
      showToast("Yorum faydalı olarak işaretlendi.");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Faydalı işaretleme yapılamadı. Lütfen tekrar dene.";
      showToast(errorMessage, "error");
    } finally {
      setHelpfulLoadingId(null);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
      : 0;
  const sortedReviews = [...reviews].sort((a, b) => {
    const aMine = user?.username && a.username === user.username ? 1 : 0;
    const bMine = user?.username && b.username === user.username ? 1 : 0;
    if (aMine !== bMine) return bMine - aMine;

    if (reviewSort === "helpful") {
      if (Number(b.helpfulCount || 0) !== Number(a.helpfulCount || 0)) {
        return Number(b.helpfulCount || 0) - Number(a.helpfulCount || 0);
      }
      if (Number(b.rating || 0) !== Number(a.rating || 0)) {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (reviewSort === "negative") {
      if (Number(a.rating || 0) !== Number(b.rating || 0)) {
        return Number(a.rating || 0) - Number(b.rating || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f6f8f6] px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-slate-500">Ürün detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#f6f8f6] px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Ürün bulunamadı</h1>
          <p className="mt-2 text-sm text-slate-500">
            Aradığın ürün silinmiş olabilir.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#f6f8f6] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Geri Dön
        </button>

        <div className="grid gap-8 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-[1fr_1fr]">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={resolveImageSrc(product.imageUrl)}
              alt={product.name}
              className="h-full min-h-[320px] w-full object-cover"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE_URL;
              }}
            />
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                Ürün Detayı
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
                {product.name}
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                {product.shortDescription ||
                  "Tarım üretim süreçlerinde güvenle kullanabileceğin kaliteli ürün. Stok ve teslimat bilgileri anlık güncellenir."}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Kategori ID</p>
                  <p className="font-bold text-slate-800">{product.categoryId}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Stok</p>
                  <p className="font-bold text-slate-800">{product.stock}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Birim</p>
                  <p className="font-bold text-slate-800">{product.unit || "Adet"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Etiket</p>
                  <p className="font-bold text-slate-800">{product.badge || "-"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-3xl font-black text-green-700">
                {Number(product.price || 0).toLocaleString("tr-TR")} ₺
              </p>
              <button
                onClick={handleAddToCart}
                className="w-full rounded-2xl bg-green-600 py-4 text-sm font-bold text-white transition hover:bg-green-700"
              >
                Sepete Ekle
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`w-full rounded-2xl py-4 text-sm font-bold transition ${
                  wishlistIds.includes(Number(product.id))
                    ? "border border-pink-200 bg-pink-50 text-pink-700"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {wishlistIds.includes(Number(product.id))
                  ? "Favoriden Çıkar"
                  : "Favorilere Ekle"}
              </button>
              <Link
                to="/checkout"
                className="block w-full rounded-2xl border border-slate-200 py-4 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Hemen Satın Al
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">Yorumlar ve Puanlar</h2>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-600">
                Ortalama:{" "}
                <span className="text-base font-extrabold text-amber-500">
                  {averageRating > 0 ? averageRating.toFixed(1) : "0.0"} / 5
                </span>{" "}
                ({reviews.length} yorum)
              </p>
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 outline-none"
              >
                <option value="newest">En yeni</option>
                <option value="helpful">En faydalı</option>
                <option value="negative">En olumsuz</option>
              </select>
            </div>
          </div>

          {user ? (
            <form onSubmit={handleReviewSubmit} className="mt-5 grid gap-3 rounded-2xl border border-slate-200 p-4">
              <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                <label className="text-sm font-semibold text-slate-700">Puan</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))
                  }
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} Yıldız
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                <label className="text-sm font-semibold text-slate-700">Yorum</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  rows={4}
                  maxLength={600}
                  placeholder="Ürün hakkındaki deneyimini paylaşabilirsin..."
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-green-600 px-5 py-2 text-sm font-bold text-white hover:bg-green-700"
                >
                  {editingReviewId ? "Güncellemeyi Kaydet" : "Yorumu Gönder"}
                </button>
                {editingReviewId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="ml-2 rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Vazgeç
                  </button>
                )}
              </div>
            </form>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Yorum bırakmak için giriş yapmalısın.
            </p>
          )}

          <div className="mt-5 space-y-3">
            {reviewsLoading ? (
              <p className="text-sm text-slate-500">Yorumlar yükleniyor...</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-slate-500">
                Henüz yorum yok. İlk yorumu sen yapabilirsin.
              </p>
            ) : (
              sortedReviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800">{review.username}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-amber-500">
                    {"★".repeat(Number(review.rating || 0))}
                    {"☆".repeat(5 - Number(review.rating || 0))}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p>
                  <div className="mt-3">
                    <button
                      onClick={() => handleMarkHelpful(review.id)}
                      disabled={!user || user?.username === review.username || helpfulLoadingId === review.id}
                      className="rounded-md border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {helpfulLoadingId === review.id
                        ? "İşleniyor..."
                        : `Faydalı (${Number(review.helpfulCount || 0)})`}
                    </button>
                  </div>
                  {user?.username === review.username && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="rounded-md bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="rounded-md bg-red-50 px-3 py-1 text-[11px] font-bold text-red-600"
                      >
                        Sil
                      </button>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </div>

        <AppToast message={toast.message} type={toast.type} />
      </div>
    </div>
  );
}
