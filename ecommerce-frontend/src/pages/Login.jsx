import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";
import { getUserFromToken } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(
    () => searchParams.get("mode") === "register"
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getErrorMessage = (err, fallback) => {
    const data = err?.response?.data;

    if (typeof data === "string" && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.title) return data.title;
    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      if (firstKey && data.errors[firstKey]?.length) {
        return data.errors[firstKey][0];
      }
    }

    return fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    if (!username || !password) {
      setError("Kullanıcı adı ve şifre zorunludur.");
      return;
    }

    try {
      if (isRegister) {
        const registerPayload = {
          username,
          password,
        };

        await registerUser(registerPayload);
        setSuccess("Kayıt başarılı. Şimdi giriş yapabilirsin.");
        setIsRegister(false);
        e.target.reset();
        return;
      }

      const loginPayload = {
        username,
        password,
      };

      const res = await loginUser(loginPayload);

      const token = res?.token || res?.accessToken || res?.jwtToken;

      if (!token) {
        setError("Giriş başarılı görünüyor ama token dönmedi.");
        return;
      }

      localStorage.setItem("token", token);

      const user = getUserFromToken();

      if (user?.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login/Register error:", err);
      setError(
        getErrorMessage(
          err,
          isRegister ? "Kayıt işlemi başarısız." : "Giriş işlemi başarısız."
        )
      );
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#f6f8f6] px-4 py-10">
      <div className="max-w-6xl mx-auto grid overflow-hidden rounded-[2rem] bg-white shadow-xl lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img
            src="/images/traktor2.jpg"
            alt="Tarım görseli"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/20" />
          <div className="absolute inset-0 flex items-end p-10">
            <div className="text-white">
              <p className="text-sm uppercase tracking-[0.35em] text-white/80">
                Gök Tarım
              </p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight">
                Modern tarım alışveriş deneyimine hoş geldin
              </h2>
              <p className="mt-4 max-w-md text-white/85">
                Gübre, ilaç, ekipman ve bahçe ürünlerinde hızlı, güvenilir ve kolay alışveriş.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="mb-8 flex rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                !isRegister ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError("");
                setSuccess("");
              }}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                isRegister ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">
            {isRegister ? "Yeni hesap oluştur" : "Hesabına giriş yap"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {isRegister
              ? "Yeni hesap oluşturarak alışverişe başlayabilirsin."
              : "Devam etmek için kullanıcı adı ve şifreni gir."}
          </p>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                name="username"
                placeholder="Kullanıcı adın"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                placeholder="Şifren"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-green-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700"
            >
              {isRegister ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}