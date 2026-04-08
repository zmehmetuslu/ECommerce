import { useEffect, useState } from "react";
import { addToCart } from "../services/cartService";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";

export default function Products() {

  
const [selectedCategory, setSelectedCategory] = useState(null);

useEffect(() => {
  let url = "http://localhost:5207/api/products";

  if (selectedCategory) {
    url += `?categoryId=${selectedCategory}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => setProducts(data.items || data));
}, [selectedCategory]);


  const [data, setData] = useState({
    items: [],
    page: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
    page: 1,
    pageSize: 8,
  });

  const loadProducts = async () => {
    try {
      const result = await getProducts(filters);
      setData(result);
    } catch (error) {
      console.error(error);
      setMessage("Ürünler yüklenemedi.");
    }
  };

  const loadCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      setMessage("Ürün sepete eklendi.");
    } catch (error) {
      console.error(error);
      setMessage("Sepete eklemek için giriş yapman gerekebilir.");
    }
  };

  const products = data.items || [];

  return (
    <div className="min-h-screen bg-[#f6f8f6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Ürünler</h1>
          <p className="mt-2 text-sm text-slate-500">
            Filtreleme, sıralama ve sayfalama ile ürünleri incele.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* SOL FİLTRE */}
          <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Filtrele</h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ürün Ara
                </label>
                <input
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                      page: 1,
                    }))
                  }
                  placeholder="Ürün adı..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Kategori
                </label>
                <select
                  value={filters.categoryId}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                >
                  <option value="">Tümü</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Min Fiyat
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value,
                        page: 1,
                      }))
                    }
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Max Fiyat
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value,
                        page: 1,
                      }))
                    }
                    placeholder="10000"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Sıralama
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sort: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-green-500"
                >
                  <option value="">Varsayılan</option>
                  <option value="price_asc">Fiyat artan</option>
                  <option value="price_desc">Fiyat azalan</option>
                </select>
              </div>

              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    categoryId: "",
                    minPrice: "",
                    maxPrice: "",
                    sort: "",
                    page: 1,
                    pageSize: 8,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Filtreleri Temizle
              </button>
            </div>
          </aside>

          {/* ÜRÜNLER */}
          <section>
            <div className="mb-5 flex items-center justify-between rounded-3xl bg-white p-5 shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Ürün Listesi</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Toplam {data.totalCount || 0} ürün bulundu
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <p className="text-slate-500">Ürün bulunamadı.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="group rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative overflow-hidden rounded-2xl">
                        <img
                          src={
                            product.imageUrl ||
                            [
                              "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=900&q=80",
                              "https://images.unsplash.com/photo-1592982537447-6f2a6a0f0f9b?auto=format&fit=crop&w=900&q=80",
                              "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80",
                              "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80",
                            ][index % 4]
                          }
                          alt={product.name}
                          className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <div className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow">
                          Avantajlı
                        </div>
                      </div>

                      <div className="pt-4">
                        <h4 className="line-clamp-2 min-h-[48px] text-sm font-semibold text-slate-800 md:text-base">
                          {product.name}
                        </h4>

                        <p className="mt-2 text-xs text-slate-400">
                          Stok: {product.stock}
                        </p>

                        <div className="mt-3 flex items-end justify-between">
                          <p className="text-xl font-extrabold text-slate-900">
                            {product.price} ₺
                          </p>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="mt-4 w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                        >
                          Sepete Ekle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    disabled={filters.page <= 1}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                  >
                    Önceki
                  </button>

                  <span className="text-sm font-semibold text-slate-700">
                    Sayfa {data.page || 1} / {data.totalPages || 1}
                  </span>

                  <button
                    disabled={(data.page || 1) >= (data.totalPages || 1)}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                  >
                    Sonraki
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}