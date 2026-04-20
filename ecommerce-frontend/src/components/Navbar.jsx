import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getUserFromToken();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <h1 className="text-xl font-extrabold text-green-700 sm:text-2xl">Gök Tarım</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <Link to="/" className="hover:text-green-700 transition">Ana Sayfa</Link>
          <Link to="/products" className="hover:text-green-700 transition">Ürünler</Link>
          <Link to="/cart" className="hover:text-green-700 transition">Sepet</Link>
          <Link to="/wishlist" className="hover:text-green-700 transition">Favoriler</Link>
          {token && (
            <Link to="/checkout" className="hover:text-green-700 transition">
              Ödeme
            </Link>
          )}

          {token && (
            <Link to="/orders" className="hover:text-green-700 transition">
              Siparişlerim
            </Link>
          )}

          {user?.role === "Admin" && (
            <Link to="/admin" className="hover:text-green-700 transition">
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {!token ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-green-600 hover:text-green-700 sm:px-4 sm:text-sm"
              >
                Giriş Yap
              </button>

              <button
                onClick={() => navigate("/login?mode=register")}
                className="rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 sm:px-4 sm:text-sm"
              >
                Kayıt Ol
              </button>
            </>
          ) : (
            <>
              {user?.role === "Admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 sm:px-4 sm:text-sm"
                >
                  Panel
                </button>
              )}

              <button
                onClick={logout}
                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:px-4 sm:text-sm"
              >
                Çıkış
              </button>
            </>
          )}
        </div>

        <nav className="order-3 flex w-full items-center gap-4 overflow-x-auto pb-1 text-xs font-semibold text-slate-700 md:hidden">
          <Link to="/" className="whitespace-nowrap hover:text-green-700 transition">Ana Sayfa</Link>
          <Link to="/products" className="whitespace-nowrap hover:text-green-700 transition">Ürünler</Link>
          <Link to="/cart" className="whitespace-nowrap hover:text-green-700 transition">Sepet</Link>
          <Link to="/wishlist" className="whitespace-nowrap hover:text-green-700 transition">Favoriler</Link>
          {token && (
            <Link to="/checkout" className="whitespace-nowrap hover:text-green-700 transition">
              Ödeme
            </Link>
          )}
          {token && (
            <Link to="/orders" className="whitespace-nowrap hover:text-green-700 transition">
              Siparişlerim
            </Link>
          )}
          {user?.role === "Admin" && (
            <Link to="/admin" className="whitespace-nowrap hover:text-green-700 transition">
              Admin Panel
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}