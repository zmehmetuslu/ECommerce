import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { addToCart } from "../services/cartService";
import {
  addToWishlist,
  getWishlistProductIds,
  removeFromWishlist,
} from "../services/wishlistService";
import { FALLBACK_IMAGE_URL, resolveImageSrc } from "../utils/image";
import { getReviewSummaries } from "../services/productReviewService";
import AppToast from "../components/ui/AppToast";

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId") || "";
  const initialSort = searchParams.get("sort") || "";
  const [data, setData] = useState({
    items: [],
    page: 1,
    pageSize: 8,
    totalCount: 0,
    totalPages: 1
  });

  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [wishlistIds, setWishlistIds] = useState([]);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [reviewSummaryMap, setReviewSummaryMap] = useState({});
  const showToast = (message, type = "success", duration = 2500) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), duration);
  };

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 8,
    search: "",
    categoryId: initialCategoryId,
    minPrice: "",
    maxPrice: "",
    sort: initialSort
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await getProducts(filters);
        setData(result);
        const items = result?.items || [];
        const summaries = await getReviewSummaries(items.map((p) => p.id));
        const map = summaries.reduce((acc, item) => {
          acc[item.productId] = item;
          return acc;
        }, {});
        setReviewSummaryMap(map);
      } catch (error) {
        console.error("Ürünler yüklenemedi:", error);
      }
    };

    loadProducts();
  }, [filters]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result);
      } catch (err) {
        console.error("Kategoriler alınamadı:", err);
      }
    };

    loadCategories();
  }, []);

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

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      showToast("Ürün sepete eklendi!");
    } catch {
      showToast("Sepete eklenemedi.", "error");
    }
  };

  const handleToggleWishlist = async (productId) => {
    try {
      const exists = wishlistIds.includes(Number(productId));
      if (exists) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => prev.filter((id) => id !== Number(productId)));
        showToast("Favorilerden çıkarıldı.");
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => [...prev, Number(productId)]);
        showToast("Favorilere eklendi.");
      }
    } catch {
      showToast("Favori işlemi için giriş yapman gerekebilir.", "error");
    }
  };

  const getStockBadge = (product) => {
    const threshold = Number(product.lowStockThreshold || 5);
    const stock = Number(product.stock || 0);
    if (stock <= 0) return { label: "Tükendi", className: "text-red-500" };
    if (stock <= threshold) return { label: "Az Kaldı", className: "text-amber-600" };
    return { label: "Stokta", className: "text-green-700" };
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setPreviewProduct(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f8f6] p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[300px_1fr] gap-8">
        
        {/* SOL PANEL: FİLTRELER */}
        <aside className="h-fit space-y-6 lg:sticky lg:top-24">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h2 className="text-xl font-black mb-8 text-slate-900">Filtrele</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Ürün İsmi</label>
                <input 
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value, page: 1})}
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm focus:ring-2 ring-green-100" 
                  placeholder="Ara..."
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Kategori</label>
                <select 
                  value={filters.categoryId}
                  onChange={e => setFilters({...filters, categoryId: e.target.value, page: 1})}
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Fiyat Aralığı (₺)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    placeholder="Min" type="number" 
                    value={filters.minPrice}
                    onChange={e => setFilters({...filters, minPrice: e.target.value, page: 1})}
                    className="p-4 bg-slate-50 rounded-2xl text-xs outline-none w-full" 
                  />
                  <input 
                    placeholder="Max" type="number" 
                    value={filters.maxPrice}
                    onChange={e => setFilters({...filters, maxPrice: e.target.value, page: 1})}
                    className="p-4 bg-slate-50 rounded-2xl text-xs outline-none w-full" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Sıralama</label>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setFilters({...filters, sort: "price_asc"})}
                    className={`text-left p-3 rounded-xl text-xs font-bold transition ${filters.sort === 'price_asc' ? 'bg-green-600 text-white' : 'bg-slate-50 text-slate-600'}`}
                  >
                    ↑ En Düşük Fiyat
                  </button>
                  <button 
                    onClick={() => setFilters({...filters, sort: "price_desc"})}
                    className={`text-left p-3 rounded-xl text-xs font-bold transition ${filters.sort === 'price_desc' ? 'bg-green-600 text-white' : 'bg-slate-50 text-slate-600'}`}
                  >
                    ↓ En Yüksek Fiyat
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setFilters({search: "", categoryId: "", minPrice: "", maxPrice: "", sort: "", page: 1, pageSize: 8})}
                className="w-full py-4 text-xs font-bold text-red-400 hover:bg-red-50 rounded-2xl transition"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </aside>

        {/* SAĞ PANEL: ÜRÜN LİSTESİ */}
        <main className="space-y-8">
          <div className="flex flex-col gap-2 bg-white p-6 rounded-[28px] shadow-sm border border-slate-100 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-black text-slate-800 text-lg">Ürün Listesi <span className="ml-2 text-sm font-normal text-slate-400">({data.totalCount} ürün)</span></h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest sm:text-right">Sayfa {data.page} / {data.totalPages}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map((product) => {
              const stockBadge = getStockBadge(product);
              return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group cursor-pointer rounded-[32px] border border-slate-100 bg-white p-3 transition-all duration-300 hover:shadow-2xl"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <div className="relative overflow-hidden rounded-2xl h-44">
                    <img
                      src={resolveImageSrc(product.imageUrl)}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE_URL;
                      }}
                    />
                  </div>
                </Link>
                <div className="pt-4 px-2 space-y-4">
                  <Link to={`/products/${product.id}`}>
                    <h4 className="font-bold text-slate-800 text-xs h-8 line-clamp-2 leading-tight hover:text-green-700">
                      {product.name}
                    </h4>
                  </Link>
                  <p className="line-clamp-2 text-[11px] text-slate-500 min-h-[34px]">
                    {product.shortDescription || "Ürün detayını inceleyerek kullanım bilgilerini görebilirsin."}
                  </p>
                  
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-black text-green-700">{product.price.toLocaleString()} ₺</p>
                      <span className={`text-[9px] font-bold uppercase ${stockBadge.className}`}>{stockBadge.label}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Birim: {product.unit || "Adet"}</span>
                      {product.badge && (
                        <span className="rounded-full bg-green-50 px-2 py-1 font-bold text-green-700">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      {(reviewSummaryMap[product.id]?.reviewCount || 0) > 0 ? (
                        <>
                          <span className="font-bold text-amber-500">
                            {(reviewSummaryMap[product.id]?.averageRating || 0).toFixed(1)} ★
                          </span>
                          <span className="text-slate-400">
                            ({reviewSummaryMap[product.id]?.reviewCount || 0} yorum)
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-slate-400">Henüz puanlanmadı</span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(product.id);
                      }}
                      className={`w-full rounded-xl py-2 text-[11px] font-bold transition ${
                        wishlistIds.includes(Number(product.id))
                          ? "border border-pink-200 bg-pink-50 text-pink-700"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {wishlistIds.includes(Number(product.id))
                        ? "Favoride"
                        : "Favorilere Ekle"}
                    </button>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl text-[11px] font-bold hover:bg-green-600 transition-all shadow-md active:scale-95"
                    >
                      Sepete Ekle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewProduct(product);
                      }}
                      className="w-full rounded-xl border border-slate-200 py-2 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Hızlı İncele
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* SAYFALAMA */}
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(data.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setFilters({...filters, page: i + 1})}
                className={`w-12 h-12 rounded-2xl font-bold text-xs transition ${filters.page === i + 1 ? 'bg-green-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>

      <AppToast message={toast.message} type={toast.type} />

      {previewProduct && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4"
          onClick={() => setPreviewProduct(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <img
                src={resolveImageSrc(previewProduct.imageUrl)}
                alt={previewProduct.name}
                className="h-48 w-full rounded-2xl object-cover md:h-full"
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE_URL;
                }}
              />
              <div className="space-y-3">
                <h3 className="text-xl font-black text-slate-900">{previewProduct.name}</h3>
                <p className="text-sm text-slate-500">
                  {previewProduct.shortDescription || "Ürün detayına giderek daha fazla bilgi görebilirsin."}
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                    Birim: {previewProduct.unit || "Adet"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                    Stok: {previewProduct.stock}
                  </span>
                  {previewProduct.badge && (
                    <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">
                      {previewProduct.badge}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-black text-green-700">
                  {Number(previewProduct.price || 0).toLocaleString("tr-TR")} ₺
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => handleAddToCart(previewProduct.id)}
                    className="rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-green-600"
                  >
                    Sepete Ekle
                  </button>
                  <Link
                    to={`/products/${previewProduct.id}`}
                    className="rounded-xl border border-slate-200 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Detaya Git
                  </Link>
                </div>
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="w-full rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}