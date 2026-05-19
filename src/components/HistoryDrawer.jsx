import { useEffect, useRef, useState } from "react";
import { History, Trash2, Upload, X } from "lucide-react";

export function HistoryDrawer({ records, onLoad, onDelete }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 backdrop-blur transition hover:border-brand-300 hover:text-brand-700"
      >
        <History className="h-3.5 w-3.5" />
        歷史紀錄
        {records.length > 0 && (
          <span className="ml-0.5 rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">
            {records.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex" role="dialog">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            ref={drawerRef}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-fade-in"
          >
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">歷史紀錄</h2>
                <p className="text-xs text-slate-500">點選任一筆可載入回表單</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
            </header>
            <div className="scroll-soft flex-1 overflow-y-auto p-3">
              {records.length === 0 && (
                <div className="grid place-items-center py-16 text-center">
                  <p className="text-sm text-slate-400">尚未儲存任何紀錄</p>
                </div>
              )}
              {records.map((r) => (
                <div
                  key={r.id}
                  className="group mb-2 flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-brand-300 hover:shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                        {r.form.visitType || "訪視"}
                      </span>
                      <span className="truncate text-sm font-medium text-slate-800">
                        {r.form.contractFamily || "未填家屬"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{r.savedAt}</p>
                    {r.form.reason && (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-600">{r.form.reason}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onLoad(r.form);
                        setOpen(false);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-brand-600"
                    >
                      <Upload className="h-3 w-3" />
                      載入
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(r.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
