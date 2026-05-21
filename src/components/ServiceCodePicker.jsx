import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import clsx from "clsx";
import { serviceGoalOptions } from "../data";
import { TextInput } from "./Inputs";

export function ServiceCodePicker({
  selectedCodes,
  onChange,
  placeholder = "選擇服務代碼",
  counts,
  onCountChange,
  showGoalHint = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const perRow = typeof onCountChange === "function";

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return serviceGoalOptions;
    return serviceGoalOptions.filter(
      (opt) =>
        opt.code.toLowerCase().includes(q) ||
        opt.name.toLowerCase().includes(q) ||
        opt.goal.toLowerCase().includes(q),
    );
  }, [query]);

  const toggleCode = (code) => {
    if (selectedCodes.includes(code)) {
      onChange(selectedCodes.filter((c) => c !== code));
      if (perRow && counts && counts[code]) onCountChange(code, 0);
    } else {
      onChange([...selectedCodes, code]);
    }
  };

  const getCount = (code) => (counts && counts[code]) || "";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2.5 text-left text-sm shadow-sm transition hover:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100",
          open && "border-brand-400 ring-4 ring-brand-100",
        )}
      >
        <span
          className={clsx(
            "flex-1 truncate font-mono text-[13px]",
            !selectedCodes.length && "font-sans text-slate-400",
          )}
        >
          {selectedCodes.length ? selectedCodes.join("、") : placeholder}
        </span>
        <ChevronDown
          className={clsx(
            "h-4 w-4 shrink-0 text-slate-500 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 animate-fade-in">
          <div className="border-b border-slate-100 bg-slate-50/60 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋代碼或服務名稱..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
          <div className="scroll-soft max-h-72 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <div className="px-3 py-6 text-center text-sm text-slate-400">無相符項目</div>
            )}
            {filtered.map((opt) => {
              const checked = selectedCodes.includes(opt.code);
              return (
                <div
                  key={opt.code}
                  className={clsx(
                    "rounded-lg px-2 py-1.5 transition",
                    checked ? "bg-brand-50" : "hover:bg-slate-50",
                  )}
                >
                  <div
                    className={clsx(
                      "grid items-center gap-2",
                      perRow ? "grid-cols-[1fr_92px]" : "grid-cols-1",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleCode(opt.code)}
                      className="flex w-full items-start gap-3 rounded-md px-1 py-1 text-left text-sm"
                    >
                      <span
                        className={clsx(
                          "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border transition",
                          checked
                            ? "border-brand-500 bg-brand-500 text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-brand-700">
                            {opt.code}
                          </span>
                          <span className="font-medium text-slate-800">{opt.name}</span>
                        </span>
                        {showGoalHint && (
                          <span className="mt-0.5 block text-xs text-slate-500">
                            生成：{opt.goal}
                          </span>
                        )}
                      </span>
                    </button>

                    {perRow && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <TextInput
                          value={getCount(opt.code)}
                          onCommit={(v) => onCountChange(opt.code, v)}
                          placeholder="次數"
                          inputMode="numeric"
                          disabled={!checked}
                          className="h-9 px-2 py-1 text-center text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-3 py-2">
            <span className="text-xs text-slate-500">已選 {selectedCodes.length} 項</span>
            <div className="flex gap-2">
              {selectedCodes.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                >
                  全部清除
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-brand-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-brand-600"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
