export default function AppToast({ message = "", type = "success" }) {
  if (!message) return null;

  const toneClass =
    type === "error"
      ? "bg-red-600 text-white"
      : type === "info"
        ? "bg-slate-800 text-white"
        : "bg-green-700 text-white";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-2xl px-6 py-3 text-sm font-bold shadow-xl ${toneClass}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
