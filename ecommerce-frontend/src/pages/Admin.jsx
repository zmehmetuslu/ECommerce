import { useEffect, useState } from "react";
import { getUserFromToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: "", price: "", stock: "", imageUrl: "", categoryId: "" });
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const user = getUserFromToken();
    if (!user || user.role !== "Admin") { navigate("/"); }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const p = await fetch("http://localhost:5207/api/products");
      const pdata = await p.json();
      const items = (pdata.items || pdata).reverse(); 
      setProducts(items);

      const c = await fetch("http://localhost:5207/api/categories");
      if (c.ok) { const cdata = await c.json(); setCategories(cdata); }

      const o = await fetch("http://localhost:5207/api/order", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (o.ok) { 
        const odata = await o.json(); 
        setOrders(odata.reverse()); 
      }
    } catch (err) { console.error("Veri hatası:", err); }
    finally { setLoading(false); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    const res = await fetch("http://localhost:5207/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ name: newCategoryName }),
    });
    if (res.ok) { showMessage("Kategori eklendi!"); setNewCategoryName(""); loadData(); }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Bu kategoriyi silmek istediğine emin misin?")) return;
    await fetch(`http://localhost:5207/api/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    loadData();
  };

  const updateStock = async (product) => {
    const newStock = prompt(`${product.name} için yeni stok miktarı:`, product.stock);
    if (newStock === null || newStock === "") return;
    const updatedProduct = { ...product, stock: Number(newStock) };
    const res = await fetch(`http://localhost:5207/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(updatedProduct), 
    });
    if (res.ok) { loadData(); showMessage("Stok güncellendi."); }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!form.categoryId) { alert("Lütfen kategori seçin!"); return; }
    const res = await fetch("http://localhost:5207/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), categoryId: Number(form.categoryId) }),
    });
    if (res.ok) { 
        showMessage("Ürün eklendi!"); 
        setForm({ name: "", price: "", stock: "", imageUrl: "", categoryId: "" });
        loadData(); 
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Silinsin mi?")) return;
    await fetch(`http://localhost:5207/api/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    loadData();
  };

  const showMessage = (msg) => { setMessage(msg); setTimeout(() => setMessage(""), 3000); };

  // 🔍 Kategori adını ID'den bulan yardımcı fonksiyon
  const getCategoryName = (id) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : "Belirsiz";
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col shrink-0">
        <h1 className="text-xl font-black tracking-tighter mb-8 text-green-700">MANAVGAT TARIM</h1>
        <div className="mb-8">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Kategoriler</h2>
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
            <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Yeni..." className="bg-slate-50 text-xs p-2.5 rounded-xl border border-slate-100 outline-none w-full" />
            <button className="bg-green-600 text-white p-2.5 rounded-xl text-xs font-bold">OK</button>
          </form>
          <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg group transition">
                <span className="text-[11px] font-bold text-slate-600">{c.name}</span>
                <button onClick={() => deleteCategory(c.id)} className="text-slate-300 hover:text-red-500">×</button>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-6">
            <h2 className="text-md font-black mb-4 text-slate-800 border-b pb-2">Hızlı Ürün Tanımla</h2>
            <form onSubmit={addProduct} className="space-y-3">
              <input value={form.name} placeholder="Ürün Adı" className="w-full p-3 bg-slate-50 rounded-xl text-xs outline-none" onChange={e => setForm({ ...form, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.price} placeholder="Fiyat" type="number" className="p-3 bg-slate-50 rounded-xl text-xs outline-none" onChange={e => setForm({ ...form, price: e.target.value })} />
                <input value={form.stock} placeholder="Stok" type="number" className="p-3 bg-slate-50 rounded-xl text-xs outline-none" onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <input value={form.imageUrl} placeholder="Görsel Adı" className="w-full p-3 bg-slate-50 rounded-xl text-xs outline-none" onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
              <select value={form.categoryId} className="w-full p-3 bg-slate-50 rounded-xl text-xs outline-none" onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Kategori Seçin</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button className="w-full bg-green-600 text-white p-3.5 rounded-xl font-black text-xs hover:bg-green-700 transition">KAYDET</button>
            </form>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 max-h-[550px] flex flex-col">
            <h2 className="text-md font-black mb-4 text-slate-800 border-b pb-2">Ürünler ({products.length})</h2>
            <div className="overflow-y-auto overflow-x-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                    <th className="py-3 px-1">ID</th>
                    <th className="py-3 px-1">Görsel</th>
                    <th className="py-3 px-1">Ürün Adı</th>
                    <th className="py-3 px-1">Kategori</th> {/* 🔥 YENİ KOLON */}
                    <th className="py-3 px-1 text-center">Stok</th>
                    <th className="py-3 px-1 text-right">Fiyat</th>
                    <th className="py-3 px-1 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition group">
                      <td className="py-3 px-1 text-[11px] font-bold text-slate-400">#{p.id}</td>
                      <td className="py-3 px-1">
                        <img src={`/images/${p.imageUrl}`} className="w-8 h-8 object-cover rounded-lg border bg-white" onError={e => e.target.src="/images/budama1.jpg"} />
                      </td>
                      <td className="py-3 px-1 text-[11px] font-bold text-slate-800 truncate max-w-[120px]">{p.name}</td>
                      <td className="py-3 px-1">
                        <span className="text-[10px] font-medium bg-slate-100 px-2 py-1 rounded-md text-slate-500">
                          {getCategoryName(p.categoryId)} {/* 🔥 Kategori Adı Burada Basılıyor */}
                        </span>
                      </td>
                      <td className="py-3 px-1 text-center">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${p.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-1 text-right text-[11px] font-black text-slate-900">{p.price} ₺</td>
                      <td className="py-3 px-1">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => updateStock(p)} className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">STOK</button>
                          <button onClick={() => deleteProduct(p.id)} className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">SİL</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-md font-black mb-4 text-slate-800 border-b pb-2">Sipariş Takibi</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {orders.map(o => (
              <div key={o.orderId} className="min-w-[140px] p-3 border rounded-2xl bg-slate-50 text-center">
                <p className="text-[9px] font-bold text-slate-400 mb-1">#ORD-{o.orderId}</p>
                <p className="text-xs font-black text-green-700 mb-2">{o.totalPrice} ₺</p>
                <div className="flex gap-1">
                  <button className="flex-1 bg-slate-900 text-white py-1.5 rounded-lg text-[9px] font-bold">OK</button>
                  <button className="flex-1 bg-white border text-red-500 py-1.5 rounded-lg text-[9px] font-bold">×</button>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-slate-400 text-xs py-4">Sipariş yok.</p>}
          </div>
        </section>
      </main>

      {message && <div className="fixed bottom-6 right-6 bg-green-700 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-[11px] z-50 animate-bounce">{message}</div>}
    </div>
  );
}