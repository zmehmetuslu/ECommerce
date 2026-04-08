import { useEffect, useState } from "react";
import { getUserFromToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    const user = getUserFromToken();

    if (!user || user.role !== "Admin") {
      navigate("/");
    }

    loadData();
  }, []);

  const loadData = async () => {
    const p = await fetch("http://localhost:5207/api/products");
    const c = await fetch("http://localhost:5207/api/category");
    const o = await fetch("http://localhost:5207/api/order", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const pdata = await p.json();
    const cdata = await c.json();
    const odata = await o.json();

    setProducts(pdata.items || pdata);
    setCategories(cdata.items || cdata);
    setOrders(odata.items || odata);
  };

  // 🔥 PRODUCT EKLE
 const addProduct = async (e) => {
  e.preventDefault();

  const payload = {
    name: form.name,
    price: Number(form.price),
    stock: Number(form.stock),
    imageUrl: form.imageUrl,
    categoryId: Number(form.categoryId),
  };

  const res = await fetch("http://localhost:5207/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  console.log(await res.text());

  loadData();
};

  // 🔥 CATEGORY EKLE
  const addCategory = async () => {
    const name = prompt("Kategori adı:");

    await fetch("http://localhost:5207/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name }),
    });

    loadData();
  };

  // 🔥 ORDER STATUS
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5207/api/order/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(status),
    });

    loadData();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ADMIN PANEL</h1>

      {/* PRODUCT EKLE */}
      <form onSubmit={addProduct}>
        <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Price" onChange={e => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Stock" onChange={e => setForm({ ...form, stock: e.target.value })} />
        <input placeholder="Image" onChange={e => setForm({ ...form, imageUrl: e.target.value })} />

        <select onChange={e => setForm({ ...form, categoryId: e.target.value })}>
          <option>Seç</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button type="submit">ÜRÜN EKLE</button>
      </form>

      {/* CATEGORY */}
      <button onClick={addCategory}>Kategori Ekle</button>

      {/* PRODUCTS */}
      <h2>Ürünler</h2>
      {products.map(p => (
        <div key={p.id}>
          {p.name} - {p.price}
        </div>
      ))}

      {/* ORDERS */}
      <h2>Siparişler</h2>
      {orders.map(o => (
        <div key={o.orderId}>
          <p>Toplam: {o.totalPrice}</p>
          <p>Status: {o.status}</p>

          <button onClick={() => updateStatus(o.orderId, "Shipped")}>
            Kargoya Ver
          </button>

          <button onClick={() => updateStatus(o.orderId, "Cancelled")}>
            İptal
          </button>
        </div>
      ))}
    </div>
  );
}