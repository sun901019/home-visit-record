import { Trash2, Plus, Minus } from "lucide-react";
import { dayOptions, frequencyOptions, serviceGoalOptions } from "../data";
import { ChipGroup, Field, Select, TextInput } from "./Inputs";
import { ServiceCodePicker } from "./ServiceCodePicker";

export function ServicePlanCard({ plan, index, onUpdate, onRemove, removable }) {
  const setKey = (key, value) => onUpdate({ ...plan, [key]: value });

  const setServiceCodes = (codes) => {
    const counts = { ...(plan.serviceCounts || {}) };
    Object.keys(counts).forEach((c) => {
      if (!codes.includes(c)) delete counts[c];
    });
    onUpdate({ ...plan, serviceCodes: codes, serviceCounts: counts });
  };

  const setCount = (code, value) => {
    const n = Math.max(0, parseInt(value || "0", 10) || 0);
    const counts = { ...(plan.serviceCounts || {}) };
    if (n > 0) counts[code] = n;
    else delete counts[code];
    onUpdate({ ...plan, serviceCounts: counts });
  };

  const adjustCount = (code, delta) => {
    const current = (plan.serviceCounts || {})[code] || 0;
    setCount(code, String(Math.max(0, current + delta)));
  };

  return (
    <div className="relative rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm transition hover:border-brand-200">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
          排程 {index + 1}
        </span>
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            移除
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="頻率">
          <Select
            value={plan.frequency}
            onChange={(v) => setKey("frequency", v)}
            options={frequencyOptions}
          />
        </Field>
        <Field label="時段" hint="例：早上 08:30-09:30">
          <TextInput
            value={plan.time}
            onCommit={(v) => setKey("time", v)}
            placeholder="例：早上 08:30-09:30"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="服務日">
          <ChipGroup
            value={plan.days || []}
            onChange={(v) => setKey("days", v)}
            options={dayOptions}
            allowMultiple
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="服務項目" hint="多選">
          <ServiceCodePicker
            selectedCodes={plan.serviceCodes || []}
            onChange={setServiceCodes}
            placeholder="點此挑選服務代碼"
            buttonLabel="本排程已選"
          />
        </Field>
      </div>

      {plan.serviceCodes && plan.serviceCodes.length > 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3">
          <p className="mb-2 text-xs font-semibold text-slate-600">每日服務次數</p>
          <div className="grid gap-2 md:grid-cols-2">
            {plan.serviceCodes.map((code) => {
              const item = serviceGoalOptions.find((o) => o.code === code);
              if (!item) return null;
              const count = (plan.serviceCounts || {})[code] || "";
              return (
                <div
                  key={code}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-1.5 text-sm shadow-sm"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-mono text-xs font-semibold text-brand-700">
                      {item.code}
                    </span>{" "}
                    <span className="text-slate-700">{item.name}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustCount(code, -1)}
                      className="grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) => setCount(code, e.target.value)}
                      className="w-12 rounded-md border border-slate-200 px-1.5 py-1 text-center text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    <button
                      type="button"
                      onClick={() => adjustCount(code, 1)}
                      className="grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
