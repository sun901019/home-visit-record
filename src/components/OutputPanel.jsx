import { useEffect, useMemo, useState } from "react";
import { Check, ClipboardCopy, FileText, Printer, Sparkles } from "lucide-react";
import clsx from "clsx";
import { buildRecord, buildRecordSections } from "../recordBuilder";

export function OutputPanel({ form, onPrint }) {
  const sections = useMemo(() => buildRecordSections(form), [form]);
  const fullText = useMemo(() => buildRecord(form), [form]);
  const [copiedKey, setCopiedKey] = useState("");

  useEffect(() => {
    if (!copiedKey) return;
    const t = setTimeout(() => setCopiedKey(""), 1600);
    return () => clearTimeout(t);
  }, [copiedKey]);

  const copy = async (text, key) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
    } catch (_e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedKey(key);
    }
  };

  const filled = sections.filter((s) => s.body && s.body.trim());
  const hasContent = filled.length > 0;

  return (
    <div className="glass-strong sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-3xl print-area">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200/70 px-5 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-900">即時生成預覽</h2>
            <p className="text-xs text-slate-500">
              {hasContent ? `${filled.length} 個段落已生成` : "填寫表單後此處會即時更新"}
            </p>
          </div>
        </div>
        <div className="no-print flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => copy(fullText, "all")}
            disabled={!hasContent}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
              copiedKey === "all"
                ? "bg-emerald-500 text-white"
                : "bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-200",
            )}
          >
            {copiedKey === "all" ? (
              <>
                <Check className="h-3.5 w-3.5" /> 已複製
              </>
            ) : (
              <>
                <ClipboardCopy className="h-3.5 w-3.5" /> 複製全部
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onPrint}
            disabled={!hasContent}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            title="列印 / 存成 PDF"
          >
            <Printer className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="scroll-soft flex-1 overflow-y-auto px-5 py-4">
        {!hasContent && (
          <div className="grid place-items-center px-4 py-12 text-center">
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/40 p-8">
              <Sparkles className="mx-auto h-7 w-7 text-brand-400" />
              <p className="mt-3 text-sm font-medium text-slate-600">
                開始在左側填寫
              </p>
              <p className="mt-1 text-xs text-slate-400">
                每個欄位會即時整理成可貼上系統的訪視紀錄
              </p>
            </div>
          </div>
        )}

        {filled.map((section) => (
          <article key={section.key} className="group mb-5 last:mb-0">
            <header className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold tracking-wide text-brand-700">
                {section.title}
              </h3>
              <button
                type="button"
                onClick={() => copy(`【${section.title}】\n${section.body}`, section.key)}
                className={clsx(
                  "no-print inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition",
                  copiedKey === section.key
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-slate-400 opacity-0 hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100",
                )}
              >
                {copiedKey === section.key ? (
                  <>
                    <Check className="h-3 w-3" /> 已複製
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="h-3 w-3" /> 複製
                  </>
                )}
              </button>
            </header>
            <pre className="whitespace-pre-wrap break-words rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 font-sans text-[13px] leading-relaxed text-slate-700">
              {section.body}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}
