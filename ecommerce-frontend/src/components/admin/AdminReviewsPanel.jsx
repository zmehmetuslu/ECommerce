import { useMemo, useState } from "react";

export default function AdminReviewsPanel({
  reviews = [],
  onToggleVisibility = () => {},
  onDeleteReview = () => {},
}) {
  const [productQuery, setProductQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  const visibleReviews = useMemo(() => {
    return reviews.filter((review) => {
      const productMatch = (review.productName || "")
        .toLowerCase()
        .includes(productQuery.toLowerCase());
      const userMatch = (review.username || "")
        .toLowerCase()
        .includes(userQuery.toLowerCase());
      const visibilityMatch =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" && review.isVisible) ||
        (visibilityFilter === "hidden" && !review.isVisible);

      return productMatch && userMatch && visibilityMatch;
    });
  }, [reviews, productQuery, userQuery, visibilityFilter]);

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <h2 className="text-md font-black text-slate-800">Yorum Moderasyonu</h2>
        <span className="text-xs font-semibold text-slate-500">{reviews.length} yorum</span>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <input
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
          placeholder="Ürün adına göre filtrele"
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
        />
        <input
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Kullanıcıya göre filtrele"
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
        />
        <select
          value={visibilityFilter}
          onChange={(e) => setVisibilityFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none"
        >
          <option value="all">Tüm durumlar</option>
          <option value="visible">Sadece görünür</option>
          <option value="hidden">Sadece gizli</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <th className="px-2 py-3">Ürün</th>
              <th className="px-2 py-3">Kullanıcı</th>
              <th className="px-2 py-3 text-center">Puan</th>
              <th className="px-2 py-3">Yorum</th>
              <th className="px-2 py-3 text-center">Durum</th>
              <th className="px-2 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {visibleReviews.map((review) => (
              <tr key={review.id} className="text-xs">
                <td className="px-2 py-3 font-semibold text-slate-700">{review.productName}</td>
                <td className="px-2 py-3 text-slate-600">{review.username}</td>
                <td className="px-2 py-3 text-center font-bold text-amber-500">{review.rating}/5</td>
                <td className="max-w-[260px] px-2 py-3 text-slate-600">{review.comment}</td>
                <td className="px-2 py-3 text-center">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                      review.isVisible
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {review.isVisible ? "Görünür" : "Gizli"}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onToggleVisibility(review.id)}
                      className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700"
                    >
                      {review.isVisible ? "Gizle" : "Göster"}
                    </button>
                    <button
                      onClick={() => onDeleteReview(review.id)}
                      className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleReviews.length === 0 && (
        <p className="py-4 text-center text-xs font-semibold text-slate-400">
          Henüz yorum bulunmuyor.
        </p>
      )}
    </section>
  );
}
