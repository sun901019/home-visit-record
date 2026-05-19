import { serviceGoalOptions } from "./data";

export function endSentence(text) {
  if (!text) return "";
  const trimmed = String(text).trim();
  if (!trimmed) return "";
  return /[。！？!?]$/.test(trimmed) ? trimmed : `${trimmed}。`;
}

export function joinClean(items, separator = "，") {
  return items.filter(Boolean).join(separator);
}

export function serviceLabel(item) {
  return item ? `${item.code} ${item.name}` : "";
}

export function lookupService(code) {
  return serviceGoalOptions.find((opt) => opt.code === code);
}

function joinSentences(parts) {
  return parts
    .map((p) => p && p.trim())
    .filter(Boolean)
    .map((p) => endSentence(p))
    .join("");
}

function buildBasicSection(form) {
  const parts = [];
  if (form.visitType) parts.push(`本次為${form.visitType}`);
  if (form.contractFamily) parts.push(`簽約家屬為${form.contractFamily}`);
  if (form.reason) parts.push(`訪視原因：${form.reason}`);
  return joinSentences(parts);
}

function buildPhysicalSection(form) {
  const sentences = [];

  const sensoryParts = [];
  if (form.consciousness) sensoryParts.push(`意識${form.consciousness}`);
  if (form.vision) {
    const note = form.visionNote ? `（${form.visionNote}）` : "";
    sensoryParts.push(`視覺${form.vision}${note}`);
  }
  if (form.hearing) {
    const notes = [form.hearingSide, form.hearingNote].filter(Boolean).join("，");
    const suffix = notes ? `（${notes}）` : "";
    sensoryParts.push(`聽覺${form.hearing}${suffix}`);
  }
  if (form.expression) {
    const note = form.expressionNote ? `（${form.expressionNote}）` : "";
    sensoryParts.push(`表達${form.expression}${note}`);
  }
  if (form.cognition) sensoryParts.push(`認知${form.cognition}`);
  if (sensoryParts.length) sentences.push(joinClean(sensoryParts));

  const skinSleepParts = [];
  if (form.skin) {
    const note = form.skinNote ? `（${form.skinNote}）` : "";
    skinSleepParts.push(`皮膚${form.skin}${note}`);
  }
  if (form.sleep) {
    const note = form.sleepNote ? `（${form.sleepNote}）` : "";
    skinSleepParts.push(`睡眠${form.sleep}${note}`);
  }
  if (skinSleepParts.length) sentences.push(joinClean(skinSleepParts));

  return joinSentences(sentences);
}

function buildHealthSection(form) {
  const sentences = [];

  if (form.diseaseControl && form.diseaseControl.length) {
    sentences.push(`慢性病控制：${joinClean(form.diseaseControl, "、")}`);
  }
  if (form.healthOther) sentences.push(form.healthOther);

  const nutritionParts = [];
  if (form.weight) {
    const note = form.weightNote ? `（${form.weightNote}）` : "";
    nutritionParts.push(`體重${form.weight}${note}`);
  }
  if (form.swallow) {
    const note = form.swallowNote ? `（${form.swallowNote}）` : "";
    nutritionParts.push(`吞嚥${form.swallow}${note}`);
  }
  if (form.foodTexture) {
    const note = form.foodTextureNote ? `（${form.foodTextureNote}）` : "";
    nutritionParts.push(`飲食質地${form.foodTexture}${note}`);
  }
  if (nutritionParts.length) sentences.push(joinClean(nutritionParts));

  const tubes = (form.tubes || []).map((t) => {
    if (t === "其他" && form.tubeOther) return form.tubeOther;
    return t;
  });
  if (tubes.length) sentences.push(`身上管路：${joinClean(tubes, "、")}`);

  return joinSentences(sentences);
}

function buildPsychSection(form) {
  const sentences = [];
  const emotions = (form.emotion || []).map((e) => {
    if (e === "其他" && form.emotionOther) return form.emotionOther;
    return e;
  });
  if (emotions.length) sentences.push(`情緒：${joinClean(emotions, "、")}`);

  if (form.responseStatus) {
    const other =
      form.responseStatus === "其他" && form.responseStatusOther
        ? `（${form.responseStatusOther}）`
        : "";
    sentences.push(`反應狀態：${form.responseStatus}${other}`);
  }
  return joinSentences(sentences);
}

function buildAdlSection(form) {
  const labels = [
    ["transfer", "移位"],
    ["toileting", "如廁"],
    ["bathing", "沐浴"],
    ["dressing", "穿脫衣物"],
    ["phone", "使用電話"],
    ["shopping", "購物"],
    ["medicationUse", "用藥"],
  ];
  const parts = labels
    .map(([key, label]) => (form[key] ? `${label}${form[key]}` : ""))
    .filter(Boolean);

  const sentences = [];
  if (parts.length) sentences.push(joinClean(parts));

  if (form.incontinence) {
    const note = form.incontinenceNote ? `（${form.incontinenceNote}）` : "";
    sentences.push(`失禁狀況：${form.incontinence}${note}`);
  }

  if (form.falls) {
    const note = form.fallsNote ? `（${form.fallsNote}）` : "";
    sentences.push(`近三個月跌倒：${form.falls}${note}`);
  }

  return joinSentences(sentences);
}

function buildEnvSection(form) {
  const sentences = [];

  const devices = (form.assistiveDevices || []).map((d) => {
    if (d === "其他" && form.assistiveDeviceOther) return form.assistiveDeviceOther;
    return d;
  });
  if (devices.length) sentences.push(`輔具：${joinClean(devices, "、")}`);

  if (form.homeSafety) {
    const note = form.homeSafetyNote ? `（${form.homeSafetyNote}）` : "";
    sentences.push(`居家安全${form.homeSafety}${note}`);
  }

  if (form.welfare) {
    const note = form.welfareNote ? `（${form.welfareNote}）` : "";
    sentences.push(`福利身份：${form.welfare}${note}`);
  }

  return joinSentences(sentences);
}

function buildContextSection(form) {
  const sentences = [];
  if (form.familyContext) sentences.push(`家庭脈絡：${form.familyContext}`);
  if (form.supervisorEducation) sentences.push(`督導/衛教：${form.supervisorEducation}`);
  if (form.specialNote) sentences.push(`特別事項：${form.specialNote}`);
  if (form.serviceNeed) sentences.push(`服務需求：${form.serviceNeed}`);
  return joinSentences(sentences);
}

function buildGoalSection(form) {
  if (!form.selectedGoalCodes || !form.selectedGoalCodes.length) return "";
  const lines = form.selectedGoalCodes.map((code) => {
    const item = lookupService(code);
    if (!item) return "";
    return `・${item.code} ${item.name}：${item.goal}`;
  });
  return joinClean(lines, "\n");
}

function buildServicePlanSection(form) {
  if (!form.servicePlans || !form.servicePlans.length) return "";
  const lines = form.servicePlans
    .map((plan, idx) => {
      const days = plan.days && plan.days.length ? plan.days.join("、") : "";
      const codes = (plan.serviceCodes || [])
        .map((code) => {
          const item = lookupService(code);
          if (!item) return "";
          const count = plan.serviceCounts && plan.serviceCounts[code];
          return count ? `${item.code} ${item.name} x${count}` : `${item.code} ${item.name}`;
        })
        .filter(Boolean)
        .join("、");

      const parts = [];
      if (plan.frequency) parts.push(plan.frequency);
      if (days) parts.push(days);
      if (plan.time) parts.push(plan.time);
      if (codes) parts.push(`服務項目：${codes}`);
      if (!parts.length) return "";
      return `${idx + 1}. ${parts.join("，")}`;
    })
    .filter(Boolean);
  return lines.join("\n");
}

function buildAsNeededSection(form) {
  if (!form.asNeededCodes || !form.asNeededCodes.length) return "";
  const lines = form.asNeededCodes.map((code) => {
    const item = lookupService(code);
    if (!item) return "";
    const note = (form.asNeededNotes || {})[code];
    const other = (form.asNeededOtherNotes || {})[code];
    const noteLabel =
      note === "其他" && other ? other : note ? note : "";
    return noteLabel
      ? `・${item.code} ${item.name}（${noteLabel}）`
      : `・${item.code} ${item.name}`;
  });
  return joinClean(lines, "\n");
}

function buildScheduleSection(form) {
  const parts = [];
  if (form.firstServiceDate) parts.push(`首次服務日期：${form.firstServiceDate}`);
  if (form.rainyPlan) parts.push(`雨天備案：${form.rainyPlan}`);
  return joinSentences(parts);
}

export function buildRecord(form) {
  const sections = [
    { title: "一、基本資訊", body: buildBasicSection(form) },
    { title: "二、體況評估", body: buildPhysicalSection(form) },
    { title: "三、健康狀況", body: buildHealthSection(form) },
    { title: "四、心理與認知", body: buildPsychSection(form) },
    { title: "五、自理能力", body: buildAdlSection(form) },
    { title: "六、環境與輔具", body: buildEnvSection(form) },
    { title: "七、家庭脈絡與服務需求", body: buildContextSection(form) },
    { title: "八、服務目標", body: buildGoalSection(form) },
    { title: "九、固定服務計畫", body: buildServicePlanSection(form) },
    { title: "十、按需服務", body: buildAsNeededSection(form) },
    { title: "十一、服務排程", body: buildScheduleSection(form) },
  ];

  const filled = sections.filter((s) => s.body && s.body.trim());
  return filled.map((s) => `【${s.title}】\n${s.body}`).join("\n\n");
}

export function buildRecordSections(form) {
  return [
    { key: "basic", title: "一、基本資訊", body: buildBasicSection(form) },
    { key: "physical", title: "二、體況評估", body: buildPhysicalSection(form) },
    { key: "health", title: "三、健康狀況", body: buildHealthSection(form) },
    { key: "psych", title: "四、心理與認知", body: buildPsychSection(form) },
    { key: "adl", title: "五、自理能力", body: buildAdlSection(form) },
    { key: "env", title: "六、環境與輔具", body: buildEnvSection(form) },
    { key: "context", title: "七、家庭脈絡與服務需求", body: buildContextSection(form) },
    { key: "goal", title: "八、服務目標", body: buildGoalSection(form) },
    { key: "plan", title: "九、固定服務計畫", body: buildServicePlanSection(form) },
    { key: "asneeded", title: "十、按需服務", body: buildAsNeededSection(form) },
    { key: "schedule", title: "十一、服務排程", body: buildScheduleSection(form) },
  ];
}
