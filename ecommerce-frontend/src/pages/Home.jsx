import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [wishlistIds, setWishlistIds] = useState([]);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [reviewSummaryMap, setReviewSummaryMap] = useState({});
  const showToast = (message, type = "success", duration = 2500) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), duration);
  };
  
  // Filtreler için tek bir state kullanmak daha sağlıklı
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    sort: "",
    page: 1,
    pageSize: 8
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await getProducts(filters);
        const items = result.items || result;
        setProducts(items);
        const summaries = await getReviewSummaries((items || []).map((p) => p.id));
        const map = summaries.reduce((acc, item) => {
          acc[item.productId] = item;
          return acc;
        }, {});
        setReviewSummaryMap(map);
      } catch (err) {
        console.error(err);
      }
    };

    loadProducts();
  }, [filters]); // Filtrelerden herhangi biri değişince ürünleri çek

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result);
      } catch (err) {
        console.error(err);
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
      showToast("Giriş yapmanız gerekebilir.", "error");
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

  const highlightedProducts = products.filter((product) => product.isFeatured).slice(0, 2);
  const showcaseProducts =
    highlightedProducts.length > 0 ? highlightedProducts : products.slice(0, 2);

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
    <div className="min-h-screen bg-[#f6f8f6]">
      {/* 1. HERO SECTION */}
      <section className="relative h-[450px] w-full overflow-hidden">
        <img src="/images/traktor2.jpg" className="h-full w-full object-cover" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex items-center">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl font-black leading-tight">Gök Tarım</h1>
            <p className="mt-4 text-white/80">Toprağınız için en modern çözümler burada.</p>
            <div className="mt-6 flex gap-3">
              <a href="#urunler" className="bg-green-600 px-6 py-3 rounded-xl font-bold">Alışverişe Başla</a>
              <Link to="/products?sort=price_desc" className="bg-white/10 backdrop-blur px-6 py-3 rounded-xl font-bold border border-white/20">
                Fırsatlar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dinamik kategori hapları */}
      <section className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto px-6 py-4 scrollbar-hide">
          <button 
            onClick={() => setFilters({...filters, categoryId: "", search: "", page: 1})}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition ${!filters.categoryId ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters({...filters, categoryId: cat.id, search: "", page: 1})}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition ${filters.categoryId === cat.id ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* 3. FIRSAT / ÖNE ÇIKAN / HAKKIMIZDA */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {showcaseProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="relative h-52 overflow-hidden rounded-[32px] group text-white block"
            >
              <img
                src={resolveImageSrc(product.imageUrl)}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                alt={product.name}
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE_URL;
                }}
              />
              <div className="absolute inset-0 bg-black/45 flex flex-col justify-center px-8">
                <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase">
                  {index === 0 ? "Kampanya" : "Öne Çıkan Ürün"}
                </span>
                <h2 className="text-2xl font-black line-clamp-2">{product.name}</h2>
              </div>
            </Link>
          ))}

          <a
            href="https://www.linkedin.com/in/evren-g%C3%B6k-31a276212/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-52 overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 text-slate-800 shadow-sm hover:shadow-md transition"
          >
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Hakkımızda</span>
            <h2 className="mt-3 text-2xl font-black text-slate-900">Gök Tarım Kimdir?</h2>
            <p className="mt-3 text-sm text-slate-500">
              Tarımda kalite, güven ve sürdürülebilirlik odağıyla çalışan ekibimizi incelemek için profili ziyaret et.
            </p>
            <p className="mt-4 text-xs font-bold text-green-700">Profili Aç</p>
          </a>
        </div>
      </section>

      {/* 4. ARAMA VE SIRALAMA BARı */}
      <section id="urunler" className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white p-4 rounded-[28px] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col">
             <h3 className="text-xl font-black text-slate-900">Popüler Ürünler</h3>
             <p className="text-xs text-slate-400">En çok tercih edilenler listeleniyor.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
                placeholder="Ürün ara..." 
                className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-2xl text-xs outline-none focus:ring-2 ring-green-100"
              />
            </div>
            <select 
              value={filters.sort}
              onChange={(e) => setFilters({...filters, sort: e.target.value, page: 1})}
              className="bg-slate-50 px-4 py-3 rounded-2xl text-xs font-bold outline-none border-none"
            >
              <option value="">Sıralama</option>
              <option value="price_asc">Fiyat Artan</option>
              <option value="price_desc">Fiyat Azalan</option>
            </select>
          </div>
        </div>
      </section>

      {/* 5. ÜRÜN LİSTESİ */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const stockBadge = getStockBadge(product);
            return (
            <div
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="group cursor-pointer rounded-[32px] border border-slate-100 bg-white p-3 transition-all hover:shadow-xl"
            >
              <div className="relative overflow-hidden rounded-[24px] h-44">
                <img
                  src={resolveImageSrc(product.imageUrl)}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE_URL;
                  }}
                />
              </div>
              <div className="pt-4 px-2 space-y-3">
                <Link to={`/products/${product.id}`}>
                  <h4 className="font-bold text-slate-800 text-xs h-8 line-clamp-2 leading-tight hover:text-green-700">
                    {product.name}
                  </h4>
                </Link>
                <div className="flex flex-col gap-2">
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
                    className={`w-full rounded-xl py-2.5 text-[11px] font-bold transition ${
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
                    className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-[11px] font-bold hover:bg-green-600 transition-all duration-300 shadow-md active:scale-95"
                  >
                    Sepete Ekle
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewProduct(product);
                    }}
                    className="w-full rounded-xl border border-slate-200 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Hızlı İncele
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </section>

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