import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { addToCart } from "../services/cartService";

export default function Products() {
  const [data, setData] = useState({
    items: [],
    page: 1,
    pageSize: 8,
    totalCount: 0,
    totalPages: 1
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 8,
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    sort: ""
  });

  useEffect(() => { loadProducts(); }, [filters]);
  useEffect(() => { loadCategories(); }, []);

  const loadProducts = async () => {
    try {
      const result = await getProducts(filters);
      setData(result);
    } catch (error) { console.error("Ürünler yüklenemedi:", error); }
  };

  const loadCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (err) { console.error("Kategoriler alınamadı:", err); }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      setMessage("Ürün sepete eklendi!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { setMessage("Sepete eklenemedi."); }
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[300px_1fr] gap-8">
        
        {/* SOL PANEL: FİLTRELER */}
        <aside className="space-y-6 sticky top-24 h-fit">
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
          <div className="flex justify-between items-center bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-lg">Ürün Listesi <span className="ml-2 text-sm font-normal text-slate-400">({data.totalCount} ürün)</span></h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sayfa {data.page} / {data.totalPages}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map(product => (
              <div key={product.id} className="group rounded-[32px] border border-slate-100 bg-white p-3 hover:shadow-2xl transition-all duration-300">
                <div className="relative overflow-hidden rounded-2xl h-44">
                  <img src={`/images/${product.imageUrl}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" onError={e => e.target.src="/images/budama1.jpg"} />
                </div>
                <div className="pt-4 px-2 space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs h-8 line-clamp-2 leading-tight">{product.name}</h4>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-black text-green-700">{product.price.toLocaleString()} ₺</p>
                      <span className="text-[9px] text-slate-300 font-bold uppercase">Stokta</span>
                    </div>
                    
                    {/* 🔥 GÜNCELLENEN BUTON */}
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl text-[11px] font-bold hover:bg-green-600 transition-all shadow-md active:scale-95"
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

      {message && (
        <div className="fixed bottom-10 right-10 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl z-50 animate-bounce font-bold text-sm">
          {message}
        </div>
      )}
    </div>
  );
}