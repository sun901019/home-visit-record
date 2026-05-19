import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Brain,
  ClipboardList,
  Footprints,
  HeartPulse,
  Home,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Stethoscope,
  Target,
  Users,
} from "lucide-react";

import {
  STORAGE_KEY,
  HISTORY_KEY,
  defaultForm,
  visitTypeOptions,
  consciousnessOptions,
  sensoryOptions,
  hearingSideOptions,
  cognitionOptions,
  skinOptions,
  sleepOptions,
  diseaseOptions,
  weightOptions,
  swallowOptions,
  tubeOptions,
  foodTextureOptions,
  emotionOptions,
  responseStatusOptions,
  dailyOptions,
  assistiveDeviceOptions,
  fallsOptions,
  homeSafetyOptions,
  welfareOptions,
} from "./data";

import { Section, SubGrid } from "./components/Section";
import { ChipGroup, Field, Select, TextArea, TextInput } from "./components/Inputs";
import { ServiceCodePicker } from "./components/ServiceCodePicker";
import { ServicePlanCard } from "./components/ServicePlanCard";
import { AsNeededEditor } from "./components/AsNeededEditor";
import { OutputPanel } from "./components/OutputPanel";
import { HistoryDrawer } from "./components/HistoryDrawer";

function getInitialForm() {
  if (typeof window === "undefined") return defaultForm;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultForm;
    const parsed = JSON.parse(saved);
    return {
      ...defaultForm,
      ...parsed,
      servicePlans:
        parsed.servicePlans && parsed.servicePlans.length
          ? parsed.servicePlans
          : defaultForm.servicePlans,
    };
  } catch (_error) {
    return defaultForm;
  }
}

function getInitialHistory() {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem(HISTORY_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function HomeVisitRecordGenerator() {
  const [form, setForm] = useState(getInitialForm);
  const [history, setHistory] = useState(getInitialHistory);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch (_e) {
      // ignore
    }
  }, [form]);

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (_e) {
      // ignore
    }
  }, [history]);

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateServicePlan = useCallback((idx, nextPlan) => {
    setForm((prev) => {
      const next = [...prev.servicePlans];
      next[idx] = nextPlan;
      return { ...prev, servicePlans: next };
    });
  }, []);

  const addServicePlan = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      servicePlans: [
        ...prev.servicePlans,
        { frequency: "每週", days: [], time: "", serviceCodes: [], serviceCounts: {} },
      ],
    }));
  }, []);

  const removeServicePlan = useCallback((idx) => {
    setForm((prev) => {
      const next = prev.servicePlans.filter((_, i) => i !== idx);
      return {
        ...prev,
        servicePlans: next.length
          ? next
          : [{ frequency: "每週", days: [], time: "", serviceCodes: [], serviceCounts: {} }],
      };
    });
  }, []);

  const resetForm = () => {
    if (window.confirm("確定要清空目前所有欄位嗎？此操作無法復原。")) {
      setForm(defaultForm);
    }
  };

  const saveToHistory = () => {
    const id = `${Date.now()}`;
    const entry = {
      id,
      savedAt: timestamp(),
      form: JSON.parse(JSON.stringify(form)),
    };
    setHistory((prev) => [entry, ...prev].slice(0, 50));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  const loadHistory = (savedForm) => {
    setForm({ ...defaultForm, ...savedForm });
  };

  const deleteHistory = (id) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const hasContent = useMemo(() => {
    return (
      form.contractFamily ||
      form.reason ||
      form.servicePlans.some((p) => p.serviceCodes && p.serviceCodes.length) ||
      form.selectedGoalCodes.length > 0 ||
      form.asNeededCodes.length > 0
    );
  }, [form]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-6 lg:px-8">
      <Header
        onReset={resetForm}
        onSave={saveToHistory}
        savedFlash={savedFlash}
        history={history}
        onLoad={loadHistory}
        onDelete={deleteHistory}
        hasContent={!!hasContent}
      />

      <main className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] lg:items-start">
        <div className="space-y-6 no-print">
          <Section
            icon={ClipboardList}
            title="基本資訊"
            description="本次訪視的基本背景"
            accent="brand"
          >
            <SubGrid cols={2}>
              <Field label="訪視類型">
                <ChipGroup
                  value={form.visitType}
                  onChange={(v) => setField("visitType", v)}
                  options={visitTypeOptions}
                  allowMultiple={false}
                />
              </Field>
              <Field label="簽約家屬">
                <TextInput
                  value={form.contractFamily}
                  onCommit={(v) => setField("contractFamily", v)}
                  placeholder="例：王太太（媳婦）"
                />
              </Field>
            </SubGrid>
            <Field label="訪視原因 / 主要議題">
              <TextArea
                value={form.reason}
                onCommit={(v) => setField("reason", v)}
                placeholder="說明本次訪視原因，例：複評體況、加單需求…"
              />
            </Field>
          </Section>

          <Section
            icon={Stethoscope}
            title="體況評估"
            description="意識、感官、皮膚與睡眠"
            accent="emerald"
          >
            <SubGrid cols={2}>
              <Field label="意識">
                <ChipGroup
                  value={form.consciousness}
                  onChange={(v) => setField("consciousness", v)}
                  options={consciousnessOptions}
                  allowMultiple={false}
                />
              </Field>
              <Field label="認知">
                <ChipGroup
                  value={form.cognition}
                  onChange={(v) => setField("cognition", v)}
                  options={cognitionOptions}
                  allowMultiple={false}
                />
              </Field>
            </SubGrid>

            <SubGrid cols={2}>
              <div className="space-y-2">
                <Field label="視覺">
                  <ChipGroup
                    value={form.vision}
                    onChange={(v) => setField("vision", v)}
                    options={sensoryOptions}
                    allowMultiple={false}
                  />
                </Field>
                <TextInput
                  value={form.visionNote}
                  onCommit={(v) => setField("visionNote", v)}
                  placeholder="補充說明（如：戴老花眼鏡）"
                />
              </div>
              <div className="space-y-2">
                <Field label="聽覺">
                  <ChipGroup
                    value={form.hearing}
                    onChange={(v) => setField("hearing", v)}
                    options={sensoryOptions}
                    allowMultiple={false}
                  />
                </Field>
                <Select
                  value={form.hearingSide}
                  onChange={(v) => setField("hearingSide", v)}
                  options={hearingSideOptions}
                  placeholder="（無註記）"
                />
              </div>
            </SubGrid>

            <div className="space-y-2">
              <Field label="表達">
                <ChipGroup
                  value={form.expression}
                  onChange={(v) => setField("expression", v)}
                  options={sensoryOptions}
                  allowMultiple={false}
                />
              </Field>
              <TextInput
                value={form.expressionNote}
                onCommit={(v) => setField("expressionNote", v)}
                placeholder="補充說明（如：口齒不清、構音障礙）"
              />
            </div>

            <SubGrid cols={2}>
              <div className="space-y-2">
                <Field label="皮膚">
                  <ChipGroup
                    value={form.skin}
                    onChange={(v) => setField("skin", v)}
                    options={skinOptions}
                    allowMultiple={false}
                  />
                </Field>
                <TextInput
                  value={form.skinNote}
                  onCommit={(v) => setField("skinNote", v)}
                  placeholder="補充說明（部位、程度）"
                />
              </div>
              <div className="space-y-2">
                <Field label="睡眠">
                  <ChipGroup
                    value={form.sleep}
                    onChange={(v) => setField("sleep", v)}
                    options={sleepOptions}
                    allowMultiple={false}
                  />
                </Field>
                <TextInput
                  value={form.sleepNote}
                  onCommit={(v) => setField("sleepNote", v)}
                  placeholder="補充說明（藥物、時間長度）"
                />
              </div>
            </SubGrid>
          </Section>

          <Section icon={HeartPulse} title="健康狀況" description="慢性病、營養與管路" accent="rose">
            <Field label="慢性病控制" hint="可複選">
              <ChipGroup
                value={form.diseaseControl}
                onChange={(v) => setField("diseaseControl", v)}
                options={diseaseOptions}
                allowMultiple
              />
            </Field>
            <Field label="其他健康相關資訊">
              <TextInput
                value={form.healthOther}
                onCommit={(v) => setField("healthOther", v)}
                placeholder="例：糖尿病、高血壓、定期回診神經內科"
              />
            </Field>

            <SubGrid cols={3}>
              <div className="space-y-2">
                <Field label="體重變化">
                  <ChipGroup
                    value={form.weight}
                    onChange={(v) => setField("weight", v)}
                    options={weightOptions}
                    allowMultiple={false}
                  />
                </Field>
                <TextInput
                  value={form.weightNote}
                  onCommit={(v) => setField("weightNote", v)}
                  placeholder="補充說明（公斤數）"
                />
              </div>
              <div className="space-y-2">
                <Field label="吞嚥">
                  <ChipGroup
                    value={form.swallow}
                    onChange={(v) => setField("swallow", v)}
                    options={swallowOptions}
                    allowMultiple={false}
                  />
                </Field>
                <TextInput
                  value={form.swallowNote}
                  onCommit={(v) => setField("swallowNote", v)}
                  placeholder="補充說明"
                />
              </div>
              <div className="space-y-2">
                <Field label="飲食質地">
                  <ChipGroup
                    value={form.foodTexture}
                    onChange={(v) => setField("foodTexture", v)}
                    options={foodTextureOptions}
                    allowMultiple={false}
                  />
                </Field>
                <TextInput
                  value={form.foodTextureNote}
                  onCommit={(v) => setField("foodTextureNote", v)}
                  placeholder="補充說明"
                />
              </div>
            </SubGrid>

            <Field label="管路" hint="可複選">
              <ChipGroup
                value={form.tubes}
                onChange={(v) => setField("tubes", v)}
                options={tubeOptions}
                allowMultiple
              />
            </Field>
            {form.tubes && form.tubes.includes("其他") && (
              <TextInput
                value={form.tubeOther}
                onCommit={(v) => setField("tubeOther", v)}
                placeholder="其他管路說明"
              />
            )}
          </Section>

          <Section icon={Brain} title="心理與認知" description="情緒、反應與溝通" accent="violet">
            <Field label="情緒" hint="可複選">
              <ChipGroup
                value={form.emotion}
                onChange={(v) => setField("emotion", v)}
                options={emotionOptions}
                allowMultiple
              />
            </Field>
            {form.emotion && form.emotion.includes("其他") && (
              <TextInput
                value={form.emotionOther}
                onCommit={(v) => setField("emotionOther", v)}
                placeholder="其他情緒說明"
              />
            )}

            <Field label="反應狀態">
              <ChipGroup
                value={form.responseStatus}
                onChange={(v) => setField("responseStatus", v)}
                options={responseStatusOptions}
                allowMultiple={false}
              />
            </Field>
            {form.responseStatus === "其他" && (
              <TextInput
                value={form.responseStatusOther}
                onCommit={(v) => setField("responseStatusOther", v)}
                placeholder="其他反應狀態說明"
              />
            )}
          </Section>

          <Section icon={Footprints} title="自理能力" description="ADL/IADL 與安全議題" accent="amber">
            <SubGrid cols={3}>
              <Field label="移位">
                <ChipGroup
                  value={form.transfer}
                  onChange={(v) => setField("transfer", v)}
                  options={dailyOptions}
                  allowMultiple={false}
                />
              </Field>
              <Field label="如廁">
                <ChipGroup
                  value={form.toileting}
                  onChange={(v) => setField("toileting", v)}
                  options={dailyOptions}
                  allowMultiple={false}
                />
              </Field>
              <Field label="沐浴">
                <ChipGroup
                  value={form.bathing}
                  onChange={(v) => setField("bathing", v)}
                  options={dailyOptions}
                  allowMultiple={false}
                />
              </Field>
              <Field label="穿脫衣物">
                <ChipGroup
                  value={form.dressing}
                  onChange={(v) => setField("dressing", v)}
                  options={dailyOptions}
                  allowMultiple={false}
                />
              </Field>
              <Field label="使用電話">
                <ChipGroup
                  value={form.phone}
                  onChange={(v) => setField("phone", v)}
                  options={dailyOptions}
                  allowMultiple={false}
                />
              </Field>
              <Field label="購物">
                <ChipGroup
                  value={form.shopping}
                  onChange={(v) => setField("shopping", v)}
                  options={dailyOptions}
                  allowMultiple={false}
                />
              </Field>
              <Field label="用藥">
                <ChipGroup
                  value={form.medicationUse}
                  onChange={(v) => setField("medicationUse", v)}
                  options={dailyOptions}
                  allowMultiple={false}
                />
              </Field>
            </SubGrid>

            <SubGrid cols={2}>
              <div className="space-y-2">
                <Field label="失禁">
                  <ChipGroup
                    value={form.incontinence}
                    onChange={(v) => setField("incontinence", v)}
                    options={dailyOptions}
                    allowMultiple={false}
                  />
                </Field>
                <TextInput
                  value={form.incontinenceNote}
                  onCommit={(v) => setField("incontinenceNote", v)}
                  placeholder="尿便失禁說明（如：使用紙尿褲）"
                />
              </div>
              <div className="space-y-2">
                <Field label="近三個月跌倒">
                  <ChipGroup
                    value={form.falls}
                    onChange={(v) => setField("falls", v)}
                    options={fallsOptions}
                    allowMultiple={false}
                  />
                </Field>
                <TextInput
                  value={form.fallsNote}
                  onCommit={(v) => setField("fallsNote", v)}
                  placeholder="跌倒情境、傷勢"
                />
              </div>
            </SubGrid>
          </Section>

          <Section icon={Home} title="環境與輔具" description="生活環境、福利身份" accent="slate">
            <Field label="輔具使用" hint="可複選">
              <ChipGroup
                value={form.assistiveDevices}
                onChange={(v) => setField("assistiveDevices", v)}
                options={assistiveDeviceOptions}
                allowMultiple
              />
            </Field>
            {form.assistiveDevices && form.assistiveDevices.includes("其他") && (
              <TextInput
                value={form.assistiveDeviceOther}
                onCommit={(v) => setField("assistiveDeviceOther", v)}
                placeholder="其他輔具說明"
              />
            )}

            <SubGrid cols={2}>
              <div className="space-y-2">
                <Field label="居家安全">
                  <ChipGroup
                    value={form.homeSafety}
                    onChange={(v) => setField("homeSafety", v)}
                    options={homeSafetyOptions}
                    allowMultiple={false}
                  />
                </Field>
                <TextInput
                  value={form.homeSafetyNote}
                  onCommit={(v) => setField("homeSafetyNote", v)}
                  placeholder="補充說明（如：浴室加裝防滑墊）"
                />
              </div>
              <div className="space-y-2">
                <Field label="福利身份">
                  <ChipGroup
                    value={form.welfare}
                    onChange={(v) => setField("welfare", v)}
                    options={welfareOptions}
                    allowMultiple={false}
                  />
                </Field>
                <TextInput
                  value={form.welfareNote}
                  onCommit={(v) => setField("welfareNote", v)}
                  placeholder="補充說明（如：身障手冊重度）"
                />
              </div>
            </SubGrid>
          </Section>

          <Section
            icon={Users}
            title="家庭脈絡與服務需求"
            description="家屬狀況、督導內容與訴求"
            accent="brand"
          >
            <Field label="家庭脈絡">
              <TextArea
                value={form.familyContext}
                onCommit={(v) => setField("familyContext", v)}
                placeholder="主要照顧者、家屬支持系統、互動模式"
              />
            </Field>
            <Field label="督導 / 衛教重點">
              <TextArea
                value={form.supervisorEducation}
                onCommit={(v) => setField("supervisorEducation", v)}
                placeholder="本次督導與衛教內容"
              />
            </Field>
            <Field label="特別事項">
              <TextArea
                value={form.specialNote}
                onCommit={(v) => setField("specialNote", v)}
                placeholder="鑰匙、寵物、特殊禁忌等"
              />
            </Field>
            <Field label="服務需求">
              <TextArea
                value={form.serviceNeed}
                onCommit={(v) => setField("serviceNeed", v)}
                placeholder="家屬主訴需求"
              />
            </Field>
          </Section>

          <Section icon={Target} title="服務目標" description="本期照顧計畫的目標代碼" accent="violet">
            <Field label="目標代碼" hint="可多選，輸出會帶出對應目標說明">
              <ServiceCodePicker
                selectedCodes={form.selectedGoalCodes}
                onChange={(v) => setField("selectedGoalCodes", v)}
                placeholder="點此挑選服務目標"
                buttonLabel="目標代碼已選"
              />
            </Field>
            <SubGrid cols={2}>
              <Field label="首次服務日期">
                <TextInput
                  type="date"
                  value={form.firstServiceDate}
                  onCommit={(v) => setField("firstServiceDate", v)}
                  placeholder="YYYY-MM-DD"
                />
              </Field>
              <Field label="雨天備案">
                <TextInput
                  value={form.rainyPlan}
                  onCommit={(v) => setField("rainyPlan", v)}
                  placeholder="例：雨天改為室內活動"
                />
              </Field>
            </SubGrid>
          </Section>

          <Section
            icon={Activity}
            title="固定服務計畫"
            description="可建立多筆排程，例：每週一三五早上 BA01"
            accent="emerald"
          >
            <div className="space-y-3">
              {form.servicePlans.map((plan, idx) => (
                <ServicePlanCard
                  key={idx}
                  plan={plan}
                  index={idx}
                  onUpdate={(next) => updateServicePlan(idx, next)}
                  onRemove={() => removeServicePlan(idx)}
                  removable={form.servicePlans.length > 1}
                />
              ))}
              <button
                type="button"
                onClick={addServicePlan}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/40 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-brand-50"
              >
                <Plus className="h-4 w-4" />
                新增一組服務排程
              </button>
            </div>
          </Section>

          <Section icon={Sparkles} title="按需服務" description="非固定排程，依需求啟動" accent="amber">
            <AsNeededEditor
              selectedCodes={form.asNeededCodes}
              notes={form.asNeededNotes || {}}
              otherNotes={form.asNeededOtherNotes || {}}
              onCodesChange={(v) => {
                setField("asNeededCodes", v);
                const notes = { ...(form.asNeededNotes || {}) };
                const otherNotes = { ...(form.asNeededOtherNotes || {}) };
                Object.keys(notes).forEach((c) => {
                  if (!v.includes(c)) delete notes[c];
                });
                Object.keys(otherNotes).forEach((c) => {
                  if (!v.includes(c)) delete otherNotes[c];
                });
                setField("asNeededNotes", notes);
                setField("asNeededOtherNotes", otherNotes);
              }}
              onNotesChange={(v) => setField("asNeededNotes", v)}
              onOtherNotesChange={(v) => setField("asNeededOtherNotes", v)}
            />
          </Section>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <OutputPanel form={form} onPrint={handlePrint} />
        </aside>
      </main>
    </div>
  );
}

function Header({ onReset, onSave, savedFlash, history, onLoad, onDelete, hasContent }) {
  return (
    <header className="glass-strong sticky top-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-3xl px-4 py-3 md:px-6 no-print">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white shadow-md shadow-brand-200">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            居家服務訪視紀錄產生器
          </h1>
          <p className="text-xs text-slate-500 md:text-sm">
            填寫表單 → 即時生成 → 一鍵複製貼上系統
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <HistoryDrawer records={history} onLoad={onLoad} onDelete={onDelete} />
        <button
          type="button"
          onClick={onSave}
          disabled={!hasContent}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
            savedFlash
              ? "bg-emerald-500 text-white"
              : "bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-200"
          }`}
        >
          <Save className="h-3.5 w-3.5" />
          {savedFlash ? "已存到歷史" : "儲存到歷史"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          清空
        </button>
      </div>
    </header>
  );
}
