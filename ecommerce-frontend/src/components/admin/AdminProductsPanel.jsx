import { FALLBACK_IMAGE_URL, resolveImageSrc } from "../../utils/image";
import { useMemo, useState } from "react";

export default function AdminProductsPanel({
  form,
  categories,
  products,
  getCategoryName,
  onFormChange,
  onAddProduct,
  onUpdateStock,
  onToggleFeatured = () => {},
  onDeleteProduct,
}) {
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const visibleProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      if (featuredOnly && !product.isFeatured) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const nameMatch = (product.name || "").toLowerCase().includes(normalizedQuery);
      const idMatch = String(product.id || "").includes(normalizedQuery);
      return nameMatch || idMatch;
    });
  }, [products, featuredOnly, searchQuery]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
      <section className="sticky top-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 border-b pb-2 text-md font-black text-slate-800">
          Hızlı Ürün Tanımla
        </h2>
        <form onSubmit={onAddProduct} className="space-y-3">
          <input
            value={form.name}
            placeholder="Ürün Adı"
            className="w-full rounded-xl bg-slate-50 p-3 text-xs outline-none"
            onChange={(e) => onFormChange("name", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.price}
              placeholder="Fiyat"
              type="number"
              className="rounded-xl bg-slate-50 p-3 text-xs outline-none"
              onChange={(e) => onFormChange("price", e.target.value)}
            />
            <input
              value={form.stock}
              placeholder="Stok"
              type="number"
              className="rounded-xl bg-slate-50 p-3 text-xs outline-none"
              onChange={(e) => onFormChange("stock", e.target.value)}
            />
          </div>
          <input
            value={form.imageUrl}
            placeholder="Görsel Adı (örn: traktor.jpg)"
            className="w-full rounded-xl border border-green-200 bg-slate-50 p-3 text-xs outline-none"
            onChange={(e) => onFormChange("imageUrl", e.target.value)}
          />
          <textarea
            value={form.shortDescription}
            placeholder="Kısa açıklama"
            className="w-full rounded-xl bg-slate-50 p-3 text-xs outline-none"
            rows={2}
            onChange={(e) => onFormChange("shortDescription", e.target.value)}
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              value={form.unit}
              placeholder="Birim (Adet/kg/L)"
              className="rounded-xl bg-slate-50 p-3 text-xs outline-none"
              onChange={(e) => onFormChange("unit", e.target.value)}
            />
            <input
              value={form.lowStockThreshold}
              placeholder="Az stok eşiği"
              type="number"
              className="rounded-xl bg-slate-50 p-3 text-xs outline-none"
              onChange={(e) => onFormChange("lowStockThreshold", e.target.value)}
            />
            <input
              value={form.badge}
              placeholder="Etiket (Yeni vb.)"
              className="rounded-xl bg-slate-50 p-3 text-xs outline-none"
              onChange={(e) => onFormChange("badge", e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(form.isFeatured)}
              onChange={(e) => onFormChange("isFeatured", e.target.checked)}
            />
            Ana sayfada Öne Çıkan olarak göster
          </label>
          <select
            value={form.categoryId}
            className="w-full rounded-xl bg-slate-50 p-3 text-xs outline-none"
            onChange={(e) => onFormChange("categoryId", e.target.value)}
          >
            <option value="">Kategori Seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button className="w-full rounded-xl bg-green-600 p-3.5 text-xs font-black text-white transition hover:bg-green-700">
            KAYDET
          </button>
        </form>
      </section>

      <section className="flex max-h-[550px] flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 border-b pb-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-center text-md font-black text-slate-800 sm:text-left">
            Ürün Listesi ({visibleProducts.length})
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ID veya ürün adı ara"
              className="rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-700 outline-none focus:border-green-500"
            />
            <button
              onClick={() => setFeaturedOnly((prev) => !prev)}
              className={`rounded-xl px-3 py-2 text-[11px] font-bold transition ${
                featuredOnly
                  ? "bg-green-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {featuredOnly ? "Tümünü Göster" : "Sadece Öne Çıkanlar"}
            </button>
          </div>
        </div>
        <div className="custom-scrollbar flex-1 overflow-x-auto overflow-y-auto">
          <table className="min-w-[600px] w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-white shadow-sm font-black">
              <tr className="border-b text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <th className="px-1 py-3">ID</th>
                <th className="px-1 py-3">Görsel</th>
                <th className="px-1 py-3 text-center">Ürün Adı</th>
                <th className="px-1 py-3">Kategori</th>
                <th className="px-1 py-3 text-center">Birim</th>
                <th className="px-1 py-3 text-center">Öne Çıkan</th>
                <th className="px-1 py-3 text-center">Stok</th>
                <th className="px-1 py-3 pr-4 text-right">Fiyat</th>
                <th className="px-1 py-3 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visibleProducts.map((product) => (
                <tr key={product.id} className="group font-bold transition hover:bg-slate-50">
                  <td className="px-1 py-3 text-[11px] font-bold text-slate-400">#{product.id}</td>
                  <td className="px-1 py-3">
                    <img
                      src={resolveImageSrc(product.imageUrl)}
                      className="h-8 w-8 rounded-lg border bg-white object-cover shadow-sm"
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE_URL;
                      }}
                    />
                  </td>
                  <td className="max-w-[120px] truncate px-1 py-3 text-center text-[11px] font-bold text-slate-800">
                    {product.name}
                  </td>
                  <td className="px-1 py-3 text-[10px] uppercase text-slate-500">
                    {getCategoryName(product.categoryId)}
                  </td>
                  <td className="px-1 py-3 text-center text-[10px] font-bold text-slate-500">
                    {product.unit || "Adet"}
                  </td>
                  <td className="px-1 py-3 text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        product.isFeatured
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {product.isFeatured ? "Evet" : "Hayır"}
                    </span>
                  </td>
                  <td className="px-1 py-3 text-center font-black">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        product.stock < (product.lowStockThreshold || 5)
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-1 py-3 pr-4 text-right text-[11px] font-black text-slate-900">
                    {product.price} ₺
                  </td>
                  <td className="px-1 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onUpdateStock(product)}
                        className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-600"
                      >
                        STOK
                      </button>
                      <button
                        onClick={() => onToggleFeatured(product)}
                        className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700"
                      >
                        ÖNE ÇIKAN
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="rounded-md bg-red-50 px-2 py-1 text-[9px] font-bold text-red-500"
                      >
                        SİL
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleProducts.length === 0 && (
            <div className="py-4 text-center text-xs font-semibold text-slate-400">
              Filtreye uygun ürün bulunamadı.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
