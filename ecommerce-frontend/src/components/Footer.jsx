import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-xl font-extrabold text-green-700">
            Gök Tarım
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Tarım ekipmanları, gübre, ilaç ve bahçe ürünlerinde modern alışveriş
            deneyimi.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">Kurumsal</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link to="/" className="hover:text-green-700">Hakkımızda</Link></li>
            <li><Link to="/login" className="hover:text-green-700">İletişim</Link></li>
            <li><Link to="/products?sort=price_desc" className="hover:text-green-700">Kampanyalar</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">Müşteri Hizmetleri</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link to="/orders" className="hover:text-green-700">Sipariş Takibi</Link></li>
            <li><Link to="/orders" className="hover:text-green-700">İade ve Değişim</Link></li>
            <li><Link to="/products" className="hover:text-green-700">Sık Sorulan Sorular</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">Hesap</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link to="/login" className="hover:text-green-700">Giriş Yap</Link></li>
            <li><Link to="/login?mode=register" className="hover:text-green-700">Kayıt Ol</Link></li>
            <li><Link to="/cart" className="hover:text-green-700">Sepetim</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-sm text-slate-400">
        © 2026 Gök Tarım. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}