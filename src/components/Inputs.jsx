import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const baseInputClass =
  "w-full rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:bg-slate-100 disabled:text-slate-400";

export function TextInput({
  value,
  onCommit,
  placeholder,
  disabled,
  inputMode,
  type = "text",
  className,
}) {
  const [draft, setDraft] = useState(value || "");
  const composingRef = useRef(false);
  const focusedRef = useRef(false);

  useEffect(() => {
    if (!focusedRef.current && !composingRef.current) {
      setDraft(value || "");
    }
  }, [value]);

  return (
    <input
      type={type}
      inputMode={inputMode}
      disabled={disabled}
      className={clsx(baseInputClass, className)}
      value={draft}
      placeholder={placeholder}
      onFocus={() => {
        focusedRef.current = true;
      }}
      onBlur={(e) => {
        focusedRef.current = false;
        onCommit(e.currentTarget.value);
      }}
      onCompositionStart={() => {
        composingRef.current = true;
      }}
      onCompositionEnd={(e) => {
        composingRef.current = false;
        setDraft(e.currentTarget.value);
      }}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && type !== "textarea") {
          e.currentTarget.blur();
        }
      }}
    />
  );
}

export function TextArea({ value, onCommit, placeholder, rows = 3 }) {
  const [draft, setDraft] = useState(value || "");
  const composingRef = useRef(false);
  const focusedRef = useRef(false);

  useEffect(() => {
    if (!focusedRef.current && !composingRef.current) {
      setDraft(value || "");
    }
  }, [value]);

  return (
    <textarea
      rows={rows}
      className={clsx(baseInputClass, "min-h-[96px] resize-y leading-relaxed")}
      value={draft}
      placeholder={placeholder}
      onFocus={() => {
        focusedRef.current = true;
      }}
      onBlur={(e) => {
        focusedRef.current = false;
        onCommit(e.currentTarget.value);
      }}
      onCompositionStart={() => {
        composingRef.current = true;
      }}
      onCompositionEnd={(e) => {
        composingRef.current = false;
        setDraft(e.currentTarget.value);
      }}
      onChange={(e) => setDraft(e.target.value)}
    />
  );
}

export function Select({ value, onChange, options, placeholder, disabled }) {
  return (
    <select
      disabled={disabled}
      className={clsx(baseInputClass, "appearance-none pr-10 cursor-pointer")}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.75rem center",
        backgroundSize: "1.1rem",
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const val = typeof opt === "string" ? opt : opt.value;
        return (
          <option key={val} value={val}>
            {label || "（未選）"}
          </option>
        );
      })}
    </select>
  );
}

export function ChipGroup({ value, onChange, options, allowMultiple = true }) {
  const selected = allowMultiple ? value || [] : value;

  const toggle = (opt) => {
    if (allowMultiple) {
      const next = selected.includes(opt)
        ? selected.filter((v) => v !== opt)
        : [...selected, opt];
      onChange(next);
    } else {
      onChange(opt);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = allowMultiple ? selected.includes(opt) : selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={clsx(
              "select-none rounded-full border px-3.5 py-1.5 text-sm font-medium transition active:scale-[0.98]",
              active
                ? "border-brand-500 bg-brand-500 text-white shadow-sm shadow-brand-200"
                : "border-slate-200 bg-white/70 text-slate-700 hover:border-brand-300 hover:bg-brand-50/60",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function FieldLabel({ children, hint }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="text-sm font-semibold tracking-wide text-slate-700">{children}</span>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      {children}
    </div>
  );
}
