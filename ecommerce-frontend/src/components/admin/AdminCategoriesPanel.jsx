export default function AdminCategoriesPanel({
  categories,
  newCategoryName,
  onNewCategoryNameChange,
  onAddCategory,
  onDeleteCategory,
}) {
  return (
    <aside className="w-full shrink-0 border-r border-slate-200 bg-white p-6 md:w-64">
      <h1 className="mb-8 text-xl font-black tracking-tighter text-green-700">
        GÖK TARIM
      </h1>

      <div className="mb-8">
        <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Kategoriler
        </h2>

        <form onSubmit={onAddCategory} className="mb-4 flex gap-2">
          <input
            value={newCategoryName}
            onChange={(e) => onNewCategoryNameChange(e.target.value)}
            placeholder="Yeni..."
            className="w-full rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs outline-none"
          />
          <button className="rounded-xl bg-green-600 p-2.5 text-xs font-black text-white">
            OK
          </button>
        </form>

        <div className="custom-scrollbar max-h-80 space-y-1 overflow-y-auto font-bold">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group flex items-center justify-between rounded-lg p-2 transition hover:bg-slate-50"
            >
              <span className="text-[11px] uppercase text-slate-600">
                {category.name}
              </span>
              <button
                onClick={() => onDeleteCategory(category.id)}
                className="font-black text-slate-300 hover:text-red-500"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
