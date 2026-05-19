import { serviceGoalOptions } from "./data";

export function lookupService(code) {
  return serviceGoalOptions.find((opt) => opt.code === code);
}

function endSentence(text) {
  if (!text) return "";
  const trimmed = String(text).trim();
  if (!trimmed) return "";
  return /[。！？!?]$/.test(trimmed) ? trimmed : `${trimmed}。`;
}

function rocDate(iso) {
  if (!iso) return "";
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const rocYear = parseInt(m[1], 10) - 1911;
  return `${rocYear}/${m[2]}/${m[3]}`;
}

function joinComma(items, sep = "，") {
  return items.filter(Boolean).join(sep);
}

function explainAdl(level) {
  if (level === "正常") return "正常";
  if (level === "需協助") return "需他人部分協助";
  if (level === "完全依賴") return "完全依賴他人協助";
  return level;
}

function buildSensoryClause(form) {
  const fields = [
    { value: form.consciousness, label: "意識" },
    { value: form.vision, label: "視力", note: form.visionNote },
    {
      value: form.hearing,
      label: "聽力",
      side: form.hearingSide,
      note: form.hearingNote,
    },
    { value: form.expression, label: "表達", note: form.expressionNote },
    { value: form.cognition, label: "認知" },
  ].filter((f) => f.value);

  if (!fields.length) return "";

  const isClear = (f) => f.value === "清楚" && !f.side && !f.note;
  const clearItems = fields.filter(isClear);
  const otherItems = fields.filter((f) => !isClear(f));

  if (clearItems.length === fields.length) {
    return `個案${fields.map((f) => f.label).join("、")}皆清楚`;
  }

  if (clearItems.length >= 2) {
    const clearText = `個案${clearItems.map((f) => f.label).join("、")}皆清楚`;
    const otherText = otherItems
      .map((f) => {
        let s = `${f.label}${f.value}`;
        if (f.side) s += `（${f.side}）`;
        if (f.note) s += `，${f.note}`;
        return s;
      })
      .join("，");
    return `${clearText}，${otherText}`;
  }

  const out = [];
  fields.forEach((f, idx) => {
    let s = `${f.label}${f.value}`;
    if (f.side) s += `（${f.side}）`;
    if (f.note) s += `，${f.note}`;
    if (idx === 0) s = `個案${s}`;
    out.push(s);
  });
  return joinComma(out);
}

function buildPhysicalParts(form) {
  const parts = [];

  // 皮膚
  if (form.skin) {
    const note = form.skinNote ? `，${form.skinNote}` : "";
    parts.push(`皮膚${form.skin}${note}`);
  }

  // 睡眠
  if (form.sleep) {
    const note = form.sleepNote ? `，${form.sleepNote}` : "";
    parts.push(`睡眠${form.sleep}${note}`);
  }

  // 慢性病
  if (form.diseaseControl && form.diseaseControl.length) {
    parts.push(`慢性病以${form.diseaseControl.join("、")}方式控制`);
  }
  if (form.healthOther) parts.push(form.healthOther);

  // 體重
  if (form.weightNote) {
    parts.push(`體重${form.weightNote}`);
  } else if (form.weight) {
    parts.push(`體重${form.weight}`);
  }

  // 吞嚥
  if (form.swallow) {
    const note = form.swallowNote ? `，${form.swallowNote}` : "";
    parts.push(`吞嚥功能${form.swallow}${note}`);
  }

  // 食物質地
  if (form.foodTexture) {
    parts.push(`食物質地為${form.foodTexture}`);
  }

  // 管路
  const tubes = (form.tubes || [])
    .filter((t) => t && t !== "無")
    .map((t) => (t === "其他" && form.tubeOther ? form.tubeOther : t));
  if (tubes.length) parts.push(`身上裝有${tubes.join("、")}`);

  return parts;
}

function buildMentalAdlParts(form) {
  const parts = [];

  // 情緒（無勾選時預設帶出穩定）
  const emotions = (form.emotion || [])
    .filter((e) => e && e !== "其他")
    .concat(
      (form.emotion || []).includes("其他") && form.emotionOther
        ? [form.emotionOther]
        : [],
    );
  if (emotions.length) {
    parts.push(`情緒${emotions.join("、")}`);
  } else {
    parts.push("情緒穩定");
  }

  // 反應
  if (form.responseStatus) {
    if (form.responseStatus === "正常") parts.push("對答正常");
    else if (form.responseStatus === "其他" && form.responseStatusOther) {
      parts.push(form.responseStatusOther);
    } else {
      parts.push(`對答${form.responseStatus}`);
    }
  }

  // ADL 分組
  const adlItems = [
    { label: "移位", value: form.transfer },
    { label: "如廁", value: form.toileting },
    { label: "洗澡", value: form.bathing },
    { label: "穿脫衣物", value: form.dressing },
    { label: "使用電話", value: form.phone },
    { label: "外出購物", value: form.shopping },
  ].filter((i) => i.value);

  const groups = { 正常: [], 需協助: [], 完全依賴: [] };
  adlItems.forEach((i) => {
    if (groups[i.value]) groups[i.value].push(i.label);
  });
  ["正常", "需協助", "完全依賴"].forEach((k) => {
    if (groups[k].length) {
      parts.push(`${groups[k].join("、")}${explainAdl(k)}`);
    }
  });

  // 服藥獨立描述
  if (form.medicationUse === "正常") {
    parts.push("可自行服藥");
  } else if (form.medicationUse === "需協助") {
    parts.push("需他人協助服藥");
  } else if (form.medicationUse === "完全依賴") {
    parts.push("服藥完全依賴他人");
  }

  // 失禁／排泄
  if (form.incontinenceNote) {
    parts.push(`主要為${form.incontinenceNote}`);
  } else if (form.incontinence === "正常") {
    parts.push("大小便控制正常");
  } else if (form.incontinence === "需協助") {
    parts.push("排泄需他人協助");
  } else if (form.incontinence === "完全依賴") {
    parts.push("排泄完全依賴他人");
  }

  // 跌倒
  if (form.falls && form.falls !== "無") {
    const note = form.fallsNote ? `，${form.fallsNote}` : "";
    parts.push(`三個月內有跌倒狀況${note}`);
  } else if (form.falls === "無") {
    parts.push("三個月內無跌倒狀況");
  }

  // 輔具
  const devices = (form.assistiveDevices || [])
    .filter((d) => d && d !== "無")
    .map((d) => (d === "其他" && form.assistiveDeviceOther ? form.assistiveDeviceOther : d));
  if (devices.length) {
    parts.push(`家中備有${devices.join("、")}`);
  } else if ((form.assistiveDevices || []).includes("無")) {
    parts.push("未使用輔具");
  }

  // 居家安全
  if (form.homeSafety === "安全") {
    parts.push("居家環境安全");
  } else if (form.homeSafety === "需改善") {
    const note = form.homeSafetyNote ? `，${form.homeSafetyNote}` : "";
    parts.push(`居家環境需改善${note}`);
  } else if (form.homeSafety === "其他" && form.homeSafetyNote) {
    parts.push(`居家環境：${form.homeSafetyNote}`);
  }

  // 福利身份（只在非「無」時帶出）
  if (form.welfare && form.welfare !== "無") {
    const note = form.welfareNote ? `，${form.welfareNote}` : "";
    parts.push(`福利身份為${form.welfare}${note}`);
  }

  return parts;
}

function buildCaseStatus(form) {
  const paragraphs = [];

  // 段一：訪視原因 + 家庭脈絡
  const intro = [];
  if (form.reason) intro.push(form.reason);
  if (form.familyContext) intro.push(form.familyContext);
  if (intro.length) paragraphs.push(endSentence(intro.join("，")));

  // 段二：體況 + 心理/ADL + 衛教（合併成一段、多句連續）
  const sentences = [];
  const physical = [buildSensoryClause(form), ...buildPhysicalParts(form)].filter(Boolean);
  if (physical.length) sentences.push(`${joinComma(physical)}。`);
  const mental = buildMentalAdlParts(form);
  if (mental.length) sentences.push(`訪視期間${joinComma(mental)}。`);
  if (form.supervisorEducation) {
    sentences.push(endSentence(`居督亦有衛教說明${form.supervisorEducation}`));
  }
  if (sentences.length) paragraphs.push(sentences.join(""));

  // 段三：特別事項
  if (form.specialNote) paragraphs.push(endSentence(form.specialNote));

  return paragraphs.join("\n");
}

function buildServiceNeed(form) {
  if (!form.serviceNeed) return "請填寫服務需求。";
  return endSentence(form.serviceNeed);
}

function buildServiceGoals(form) {
  if (!form.selectedGoalCodes || !form.selectedGoalCodes.length) {
    return "1.請勾選服務目標";
  }
  return form.selectedGoalCodes
    .map((code, idx) => {
      const item = lookupService(code);
      if (!item) return "";
      return `${idx + 1}.${item.goal}`;
    })
    .filter(Boolean)
    .join("\n");
}

function buildServicePlanText(plan) {
  const codes = (plan.serviceCodes || [])
    .map((code) => {
      const item = lookupService(code);
      if (!item) return "";
      const count = (plan.serviceCounts || {})[code];
      return count ? `${item.code}*${count}` : item.code;
    })
    .filter(Boolean)
    .join("、");

  if (!codes) return "";

  const days = plan.days && plan.days.length ? plan.days.join("、") : "";
  const freqDays = `${plan.frequency || ""}${days}`;
  const segments = [];
  if (freqDays) segments.push(freqDays);
  if (plan.time) segments.push(plan.time);
  const dayTime = segments.join(" ");

  return dayTime ? `${dayTime}，執行${codes}` : `執行${codes}`;
}

function buildAsNeededCodesText(form) {
  if (!form.asNeededCodes || !form.asNeededCodes.length) return "";
  return form.asNeededCodes
    .map((code) => {
      const item = lookupService(code);
      return item ? item.code : "";
    })
    .filter(Boolean)
    .join("、");
}

function buildCarePlan(form) {
  const sentences = [];

  // 第一句：今日訪視+簽約
  const verb =
    form.visitType === "初訪"
      ? "初訪"
      : form.visitType === "複訪"
        ? "複訪"
        : form.visitType === "結案訪視"
          ? "進行結案訪視"
          : form.visitType || "訪視";

  let firstSentence = `今日${verb}個案`;
  if (form.visitType === "初訪") {
    if (form.contractFamily) {
      firstSentence += `，向${form.contractFamily}解釋過合約內容後，簽立合約書`;
    } else {
      firstSentence += `，向家屬解釋過合約內容後，簽立合約書`;
    }
  }
  sentences.push(endSentence(firstSentence));

  // 第二句：首次服務日期
  if (form.firstServiceDate) {
    sentences.push(
      endSentence(`本單位預計於${rocDate(form.firstServiceDate)}提供第一次居家服務`),
    );
  }

  // 第三句：服務計畫
  const planTexts = (form.servicePlans || [])
    .map(buildServicePlanText)
    .filter(Boolean);

  if (planTexts.length) {
    let planSentence = `依服務計畫${planTexts.join("；")}`;
    const asNeeded = buildAsNeededCodesText(form);
    if (asNeeded) {
      planSentence += `，遇雨或體況不佳則調整為${asNeeded}`;
    } else if (form.rainyPlan) {
      planSentence += `，${form.rainyPlan}`;
    }
    sentences.push(endSentence(planSentence));
  } else if (form.rainyPlan) {
    sentences.push(endSentence(form.rainyPlan));
  }

  return sentences.join("");
}

export function buildRecordSections(form) {
  return [
    { key: "case", title: "一、個案現況", body: buildCaseStatus(form) },
    { key: "need", title: "二、服務需求", body: buildServiceNeed(form) },
    { key: "goal", title: "三、服務目標", body: buildServiceGoals(form) },
    { key: "plan", title: "四、照顧計畫", body: buildCarePlan(form) },
  ];
}

export function buildRecord(form) {
  const sections = buildRecordSections(form).filter((s) => s.body && s.body.trim());
  return sections.map((s) => `${s.title}：\n${s.body}`).join("\n\n");
}
