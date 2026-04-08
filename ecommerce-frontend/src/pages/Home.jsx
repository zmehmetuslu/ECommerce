import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

const categories = [
  "Gübre",
  "İlaç",
  "Budama",
  "Motorlu Aletler",
  "Sulama",
  "Tohum",
];

const productImages = [
  "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1592982537447-6f2a6a0f0f9b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    loadProducts();
  }, [search, sort]);

  const loadProducts = async () => {
    try {
      const result = await getProducts({
        page: 1,
        pageSize: 8,
        search,
        sort,
      });

      const items = Array.isArray(result) ? result : result.items || [];
      setProducts(items);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
      setProducts([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      {/* HERO */}
      <section className="relative h-[420px] md:h-[520px] w-full overflow-hidden">
        <img
          src="/images/traktor2.jpg"
          alt="Manavgat Tarım Hero"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl text-white">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              Tarımda güvenilir alışveriş
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              Manavgat Tarım
            </h1>

            <p className="mt-4 text-base leading-7 text-white/90 md:text-lg">
              Gübre, ilaç, tohum, fidan, sulama ürünleri ve ekipmanlarda
              modern, hızlı ve güvenilir alışveriş deneyimi.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#urunler"
                className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Alışverişe Başla
              </a>
              <a
                href="#firsatlar"
                className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Fırsatları Gör
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto px-4 py-4 text-sm font-semibold sm:px-6 lg:px-8">
          {categories.map((category) => (
            <button
              key={category}
              className="whitespace-nowrap rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-green-100 hover:text-green-700"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* FIRSAT BANNERLARI */}
      <section
        id="firsatlar"
        className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative h-52 overflow-hidden rounded-3xl shadow-lg">
            <img
              src="/images/budama1.jpg "
              alt="Profesyonel Ekipmanlar"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/20" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
              <span className="text-sm font-medium uppercase tracking-[0.25em] text-white/80">
                Kampanya
              </span>
              <h2 className="mt-2 text-3xl font-extrabold">
                Profesyonel Ekipmanlar
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/85">
              Bahçe ve tarla işlerinde güçlü, dayanıklı ve verimli çözümler.
              </p>
            </div>
          </div>

          <div className="relative h-52 overflow-hidden rounded-3xl shadow-lg">
            <img
              src="/images/tohum2.jpg "
              alt="Fırsatlar"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/20" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
              <span className="text-sm font-medium uppercase tracking-[0.25em] text-white/80">
                Öne Çıkan
              </span>
              <h2 className="mt-2 text-3xl font-extrabold">
                Tohum Fırsatları
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/85">
                Sezonluk ihtiyaçlara özel avantajlı fiyatlarla profesyonel ürünler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ARAMA + SIRALAMA + ÜRÜNLER */}
      <section
        id="urunler"
        className="max-w-7xl mx-auto px-4 pb-12 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Popüler Ürünler</h3>
            <p className="mt-1 text-sm text-slate-500">
              Tarım ihtiyaçların için öne çıkan ürünleri incele.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ürün ara..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-green-500 md:w-72"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Ara
              </button>
            </form>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-green-500"
            >
              <option value="">Sıralama</option>
              <option value="price_asc">Fiyat artan</option>
              <option value="price_desc">Fiyat azalan</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={product.imageUrl || productImages[index % productImages.length]}
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
                  <div>
                    <p className="text-xl font-extrabold text-slate-900">
                      {product.price} ₺
                    </p>
                    <p className="text-xs text-green-700">Hızlı teslimat uygun</p>
                  </div>
                </div>

                <button className="mt-4 w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition hover:bg-green-700">
                  Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="mt-6 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">Ürün bulunamadı.</p>
          </div>
        )}
      </section>
    </div>
  );
}