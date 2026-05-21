import { asNeededNoteOptions, serviceGoalOptions } from "../data";
import { ChipGroup, TextInput } from "./Inputs";
import { ServiceCodePicker } from "./ServiceCodePicker";

export function AsNeededEditor({
  selectedCodes,
  notes,
  otherNotes,
  onCodesChange,
  onNotesChange,
  onOtherNotesChange,
}) {
  const getNoteList = (code) => {
    const v = notes[code];
    return Array.isArray(v) ? v : v ? [v] : [];
  };

  const setNoteList = (code, nextList) => {
    onNotesChange({ ...notes, [code]: nextList });
  };

  const setOther = (code, value) => {
    onOtherNotesChange({ ...otherNotes, [code]: value });
  };

  return (
    <div className="space-y-4">
      <ServiceCodePicker
        selectedCodes={selectedCodes}
        onChange={onCodesChange}
        placeholder="挑選按需服務項目"
      />

      {selectedCodes.length > 0 && (
        <div className="space-y-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3">
          <p className="text-xs font-semibold text-slate-600">每項服務的使用時機（可複選）</p>
          <div className="space-y-3">
            {selectedCodes.map((code) => {
              const item = serviceGoalOptions.find((o) => o.code === code);
              if (!item) return null;
              const noteList = getNoteList(code);
              const showOther = noteList.includes("其他");
              return (
                <div
                  key={code}
                  className="space-y-2 rounded-lg bg-white px-3 py-2 shadow-sm"
                >
                  <div className="text-sm">
                    <span className="font-mono text-xs font-semibold text-brand-700">
                      {item.code}
                    </span>{" "}
                    <span className="text-slate-700">{item.name}</span>
                  </div>
                  <ChipGroup
                    value={noteList}
                    onChange={(next) => setNoteList(code, next)}
                    options={asNeededNoteOptions}
                    allowMultiple
                  />
                  {showOther && (
                    <TextInput
                      value={otherNotes[code] || ""}
                      onCommit={(v) => setOther(code, v)}
                      placeholder="請填寫其他使用時機"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
