export const serviceGoalOptions = [
  { code: "BA01", name: "基本身體清潔", goal: "提供身體清潔舒適" },
  { code: "BA02", name: "基本日常照顧", goal: "提供基本生理需求照顧" },
  { code: "BA03", name: "測量生命徵象", goal: "監測生理指標、了解健康狀況" },
  { code: "BA04", name: "協助進食或管灌餵食", goal: "協助安全進食" },
  { code: "BA05", name: "餐食照顧", goal: "提供安全餐食" },
  { code: "BA07", name: "協助沐浴及洗頭", goal: "提供身體清潔舒適" },
  { code: "BA08", name: "足部照護", goal: "足部照顧，維持足部皮膚完整" },
  { code: "BA10", name: "翻身拍背", goal: "更換姿勢、避免壓傷、促進痰液咳出" },
  { code: "BA11", name: "肢體關節活動", goal: "預防或減少肢體關節攣縮" },
  { code: "BA12", name: "協助上(下)樓梯", goal: "維護上下樓安全" },
  { code: "BA13", name: "陪同外出", goal: "維護外出時安全、增加社會參與" },
  { code: "BA14", name: "陪同就醫", goal: "陪同就診、聽取及轉知醫囑與注意事項" },
  { code: "BA15", name: "家務協助", goal: "維持居家生活空間乾淨、安全" },
  { code: "BA16", name: "代購或代領或代送服務", goal: "提供採買基本生理需求物品" },
  { code: "BA17a", name: "人工氣道管內分泌物抽吸", goal: "維持呼吸道通暢" },
  { code: "BA17b", name: "口腔內分泌物抽吸", goal: "維持呼吸道通暢" },
  { code: "BA17c", name: "尿管及鼻胃管之清潔與固定", goal: "維持管路清潔、預防滑脫" },
  { code: "BA17d1", name: "血糖機驗血糖", goal: "監測血糖控制情形" },
  { code: "BA17d2", name: "甘油球通便", goal: "維持排便順暢、預防便秘" },
  { code: "BA17e", name: "依指示置入藥盒", goal: "正確服用藥物" },
  { code: "BA18", name: "安全看視", goal: "維護個案居家活動安全" },
  { code: "BA20", name: "陪伴服務", goal: "維護個案居家活動安全" },
  { code: "BA22", name: "巡視服務", goal: "探視、簡易日常協助" },
  { code: "BA23", name: "協助洗頭", goal: "提供身體清潔舒適" },
  { code: "BA24", name: "協助排泄", goal: "處理排泄、維持身體清潔" },
  { code: "GA09", name: "居家喘息服務", goal: "減輕主要照顧者照顧負荷" },
  { code: "SC09", name: "居家短照服務", goal: "減輕外籍看護工照顧負荷" },
];

export const defaultForm = {
  visitType: "初訪",
  contractFamily: "",
  reason: "",
  consciousness: "清楚",
  vision: "清楚",
  visionNote: "",
  hearing: "清楚",
  hearingSide: "",
  hearingNote: "",
  expression: "清楚",
  expressionNote: "",
  cognition: "清楚",
  skin: "完整",
  skinNote: "",
  sleep: "正常",
  sleepNote: "",
  diseaseControl: [],
  healthOther: "",
  weight: "維持",
  weightNote: "",
  swallow: "正常",
  swallowNote: "",
  tubes: [],
  tubeOther: "",
  foodTexture: "一般",
  foodTextureNote: "",
  emotion: [],
  emotionOther: "",
  responseStatus: "正常",
  responseStatusOther: "",
  transfer: "正常",
  toileting: "正常",
  bathing: "正常",
  dressing: "正常",
  phone: "正常",
  shopping: "正常",
  medicationUse: "正常",
  incontinence: "正常",
  incontinenceNote: "",
  falls: "無",
  fallsNote: "",
  assistiveDevices: [],
  assistiveDeviceOther: "",
  homeSafety: "安全",
  homeSafetyNote: "",
  welfare: "無",
  welfareNote: "",
  familyContext: "",
  supervisorEducation: "",
  specialNote: "",
  serviceNeed: "",
  selectedGoalCodes: [],
  firstServiceDate: "",
  rainyPlan: "",
  asNeededCodes: [],
  asNeededNotes: {},
  asNeededOtherNotes: {},
  servicePlans: [
    { frequency: "每週", days: [], time: "", serviceCodes: [], serviceCounts: {} },
  ],
};

export const STORAGE_KEY = "homeVisitRecordGeneratorFormV3";
export const HISTORY_KEY = "homeVisitRecordGeneratorHistoryV3";

export const visitTypeOptions = ["初訪", "三個月例行家訪"];

export const consciousnessOptions = ["清楚", "嗜睡", "混亂", "昏迷"];
export const sensoryOptions = ["清楚", "輕度退化", "中度退化", "重度退化"];
export const hearingSideOptions = ["", "左耳", "右耳", "雙耳"];
export const cognitionOptions = ["清楚", "輕度退化", "中度退化", "重度退化"];
export const skinOptions = ["完整", "破損", "壓傷風險", "其他"];
export const sleepOptions = ["正常", "失眠", "日夜顛倒", "服用安眠藥"];
export const weightOptions = ["維持", "增加", "減輕"];
export const swallowOptions = ["正常", "偶爾嗆咳", "經常嗆咳", "管灌"];
export const foodTextureOptions = ["一般", "軟質", "細碎", "流質", "管灌"];
export const dailyOptions = ["正常", "需協助", "完全依賴"];
export const diseaseOptions = ["服藥", "定期門診", "無追蹤"];
export const tubeOptions = ["鼻胃管", "尿管", "尿袋", "氣切", "無", "其他"];
export const emotionOptions = ["穩定", "焦慮", "憂鬱", "攻擊行為", "其他"];
export const responseStatusOptions = ["正常", "反應慢", "無法正常對答", "其他"];
export const assistiveDeviceOptions = ["無", "單拐", "四腳拐", "助行器", "輪椅", "其他"];
export const fallsOptions = ["無", "1次", "2次以上"];
export const homeSafetyOptions = ["安全", "需改善", "其他"];
export const welfareOptions = ["無", "中低收", "低收入戶", "身心障礙手冊", "其他"];
export const frequencyOptions = ["每週", "隔週", "單次"];
export const dayOptions = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
export const asNeededNoteOptions = ["需要時使用", "雨天時使用", "體況不佳時使用", "其他"];

export const formExamples = {
  outing: {
    ...defaultForm,
    visitType: "初訪",
    contractFamily: "案女",
    reason: "因個案較憂鬱，長時間待在家，家屬希望可請居服員陪伴外出至附近公園、市場等地方走走，因此申請長照服務",
    sleep: "失眠",
    sleepNote: "有使用安眠藥，原有日夜顛倒狀況，經作息調整後已有改善",
    diseaseControl: ["服藥", "定期門診"],
    weight: "減輕",
    weightNote: "三個月內瘦2公斤",
    swallow: "偶爾嗆咳",
    emotion: ["穩定"],
    transfer: "需協助",
    shopping: "需協助",
    medicationUse: "需協助",
    incontinence: "需協助",
    incontinenceNote: "主要為小便來不及",
    falls: "1次",
    fallsNote: "約半年前曾跌倒",
    assistiveDevices: ["單拐"],
    supervisorEducation:
      "吞嚥時避免頭抬高，頭部可稍微偏低，並可於平時進行吞嚥訓練；另可做下肢運動，協助維持肌力",
    serviceNeed:
      "案女希望陪同個案外出散步，若遇到鄰居可和鄰居聊聊天，增加活動量及社交，期望減少憂鬱情緒及維持肌力",
    selectedGoalCodes: ["BA13"],
    firstServiceDate: "115/04/22",
    servicePlans: [
      {
        frequency: "每週",
        days: ["週一", "週二", "週三", "週四", "週五"],
        time: "早上約08:00-09:00",
        serviceCodes: ["BA13"],
        serviceCounts: { BA13: 2 },
      },
    ],
    asNeededCodes: ["BA20"],
    asNeededNotes: { BA20: ["雨天時使用", "體況不佳時使用"] },
    asNeededOtherNotes: {},
    rainyPlan: "",
  },
  bathing: {
    ...defaultForm,
    visitType: "初訪",
    contractFamily: "案女、案夫",
    sleep: "失眠",
    sleepNote: "晚上易醒",
    diseaseControl: ["服藥", "定期門診"],
    transfer: "需協助",
    toileting: "需協助",
    bathing: "需協助",
    dressing: "需協助",
    shopping: "需協助",
    medicationUse: "需協助",
    incontinence: "需協助",
    incontinenceNote: "小便失禁無感",
    falls: "1次",
    fallsNote: "上個月跨越浴室門檻時跌倒",
    assistiveDevices: ["四腳拐", "助行器", "輪椅"],
    homeSafety: "需改善",
    homeSafetyNote: "客廳雜物多、浴室門檻高",
    serviceNeed: "白天子女上班，案夫年齡已大，藉由居服員陪伴減輕案夫照顧壓力",
    selectedGoalCodes: ["BA07", "BA20", "BA13"],
    firstServiceDate: "115/01/19",
    servicePlans: [
      {
        frequency: "每週",
        days: ["週一", "週三", "週四", "週五"],
        time: "早上約08:30-09:30",
        serviceCodes: ["BA20"],
        serviceCounts: { BA20: 2 },
      },
      {
        frequency: "每週",
        days: ["週二"],
        time: "早上約08:30-09:30",
        serviceCodes: ["BA13", "BA07"],
        serviceCounts: { BA13: 2, BA07: 1 },
      },
      {
        frequency: "每週",
        days: ["週四"],
        time: "下午約15:40-16:40",
        serviceCodes: ["BA07"],
        serviceCounts: { BA07: 1 },
      },
    ],
    asNeededCodes: [],
    asNeededNotes: {},
    asNeededOtherNotes: {},
    rainyPlan: "",
  },
};
