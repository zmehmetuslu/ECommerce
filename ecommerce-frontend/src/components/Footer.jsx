export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto grid gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-xl font-extrabold text-green-700">
            Manavgat Tarım
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Tarım ekipmanları, gübre, ilaç ve bahçe ürünlerinde modern alışveriş
            deneyimi.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">Kurumsal</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>Hakkımızda</li>
            <li>İletişim</li>
            <li>Kampanyalar</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">Müşteri Hizmetleri</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>Sipariş Takibi</li>
            <li>İade ve Değişim</li>
            <li>Sık Sorulan Sorular</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900">Hesap</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>Giriş Yap</li>
            <li>Kayıt Ol</li>
            <li>Sepetim</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-sm text-slate-400">
        © 2026 Manavgat Tarım. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}