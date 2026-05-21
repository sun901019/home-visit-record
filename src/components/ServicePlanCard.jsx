import { Trash2 } from "lucide-react";
import { dayOptions, frequencyOptions } from "../data";
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
    const n = parseInt(value || "0", 10) || 0;
    const counts = { ...(plan.serviceCounts || {}) };
    if (n > 0) counts[code] = n;
    else delete counts[code];
    onUpdate({ ...plan, serviceCounts: counts });
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
        <Field label="碼別＋次數" hint="勾選碼別後，在右側填當日次數">
          <ServiceCodePicker
            selectedCodes={plan.serviceCodes || []}
            onChange={setServiceCodes}
            counts={plan.serviceCounts || {}}
            onCountChange={setCount}
            placeholder="請選擇碼別＋組合名稱"
          />
        </Field>
      </div>
    </div>
  );
}
