import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { addToCart } from "../services/cartService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  
  // 🔥 Filtreler için tek bir state kullanmak daha sağlıklı
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    sort: "",
    page: 1,
    pageSize: 8
  });

  useEffect(() => {
    loadProducts();
  }, [filters]); // Filtrelerden herhangi biri değişince ürünleri çek

  useEffect(() => {
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const result = await getProducts(filters);
      setProducts(result.items || result);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      setMessage("Ürün sepete eklendi!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Giriş yapmanız gerekebilir.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      {/* 1. HERO SECTION */}
      <section className="relative h-[450px] w-full overflow-hidden">
        <img src="/images/traktor2.jpg" className="h-full w-full object-cover" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex items-center">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl font-black leading-tight">Manavgat Tarım</h1>
            <p className="mt-4 text-white/80">Toprağınız için en modern çözümler burada.</p>
            <div className="mt-6 flex gap-3">
              <a href="#urunler" className="bg-green-600 px-6 py-3 rounded-xl font-bold">Alışverişe Başla</a>
              <button className="bg-white/10 backdrop-blur px-6 py-3 rounded-xl font-bold border border-white/20">Fırsatlar</button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DİNAMİK KATEGORİ HAPLARI - 🔥 Düzeltildi */}
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

      {/* 3. FIRSAT KARTLARI */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative h-52 overflow-hidden rounded-[32px] group text-white">
            <img src="/images/budama1.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Kampanya" />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
              <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase">Kampanya</span>
              <h2 className="text-2xl font-black">Profesyonel Ekipmanlar</h2>
            </div>
          </div>
          <div className="relative h-52 overflow-hidden rounded-[32px] group text-white">
            <img src="/images/tohum2.jpg" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Fırsat" />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
              <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase">Öne Çıkan</span>
              <h2 className="text-2xl font-black">Tohum Fırsatları</h2>
            </div>
          </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-[32px] p-3 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="relative overflow-hidden rounded-[24px] h-44">
                <img src={`/images/${product.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" onError={e => e.target.src="/images/budama1.jpg"} />
              </div>
              <div className="pt-4 px-2 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs h-8 line-clamp-2 leading-tight">{product.name}</h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-black text-green-700">{product.price.toLocaleString()} ₺</p>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-[11px] font-bold hover:bg-green-600 transition-all duration-300 shadow-md active:scale-95"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {message && <div className="fixed bottom-10 right-10 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl z-50 animate-bounce text-sm font-bold">{message}</div>}
    </div>
  );
}