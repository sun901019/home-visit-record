import { asNeededNoteOptions, serviceGoalOptions } from "../data";
import { Select, TextInput } from "./Inputs";
import { ServiceCodePicker } from "./ServiceCodePicker";

export function AsNeededEditor({
  selectedCodes,
  notes,
  otherNotes,
  onCodesChange,
  onNotesChange,
  onOtherNotesChange,
}) {
  const setNote = (code, value) => {
    const next = { ...notes, [code]: value };
    onNotesChange(next);
  };

  const setOther = (code, value) => {
    const next = { ...otherNotes, [code]: value };
    onOtherNotesChange(next);
  };

  return (
    <div className="space-y-4">
      <ServiceCodePicker
        selectedCodes={selectedCodes}
        onChange={onCodesChange}
        placeholder="挑選按需服務項目"
        buttonLabel="按需服務已選"
      />

      {selectedCodes.length > 0 && (
        <div className="space-y-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3">
          <p className="text-xs font-semibold text-slate-600">每項服務的使用時機</p>
          <div className="space-y-2">
            {selectedCodes.map((code) => {
              const item = serviceGoalOptions.find((o) => o.code === code);
              if (!item) return null;
              const note = notes[code] || "";
              const showOther = note === "其他";
              return (
                <div
                  key={code}
                  className="grid items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm md:grid-cols-[1fr_180px_1fr]"
                >
                  <span className="text-sm">
                    <span className="font-mono text-xs font-semibold text-brand-700">
                      {item.code}
                    </span>{" "}
                    <span className="text-slate-700">{item.name}</span>
                  </span>
                  <Select
                    value={note}
                    onChange={(v) => setNote(code, v)}
                    options={asNeededNoteOptions}
                    placeholder="選擇使用時機"
                  />
                  <div>
                    {showOther && (
                      <TextInput
                        value={otherNotes[code] || ""}
                        onCommit={(v) => setOther(code, v)}
                        placeholder="請填寫其他使用時機"
                      />
                    )}
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
