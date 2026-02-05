/**
 * Department / Category → Emoji Icon
 * Use lowercase keys for safe matching
 */

export const CATEGORY_EMOJI_MAP = {
  // ===============================
  // COMPUTING / IT / CS (SPECIAL)
  // ===============================
  computer: "💻",
  computing: "💻",
  "computer science": "💻",
  "computer engineering": "🖥️",
  software: "🧑‍💻",
  "software engineering": "🧑‍💻",
  programming: "👨‍💻",
  coding: "👨‍💻",
  developer: "👨‍💻",

  it: "🖥️",
  "information technology": "🖥️",
  ict: "🌐",

  data: "📊",
  "data science": "📊",
  database: "🗄️",
  analytics: "📈",

  ai: "🤖",
  "artificial intelligence": "🤖",
  ml: "🤖",
  "machine learning": "🤖",

  cyber: "🔐",
  cybersecurity: "🔐",
  security: "🔐",
  hacking: "🛡️",

  network: "🌐",
  networking: "🌐",
  telecom: "📡",
  cloud: "☁️",

  web: "🌍",
  frontend: "🎨",
  backend: "🧠",
  fullstack: "🧩",

  mobile: "📱",
  android: "🤖",
  ios: "📱",

  // ===============================
  // ENGINEERING
  // ===============================
  engineering: "⚙️",
  electrical: "⚡",
  electronics: "🔌",
  mechanical: "🛠️",
  civil: "🏗️",
  chemical: "🧪",
  biomedical: "🩺",
  mechatronics: "🤖",
  industrial: "🏭",
  automotive: "🚗",

  // ===============================
  // SCIENCE
  // ===============================
  physics: "🧲",
  chemistry: "🧫",
  mathematics: "➗",
  statistics: "📐",
  biology: "🧬",

  // ===============================
  // BUSINESS / MANAGEMENT
  // ===============================
  business: "💼",
  management: "📊",
  accounting: "📒",
  finance: "💰",
  economics: "📉",
  marketing: "📣",

  // ===============================
  // GENERAL / EDUCATION
  // ===============================
  education: "🎓",
  research: "🔬",
};


export const DEFAULT_CATEGORY_EMOJI = "📘";


export const getCategoryEmoji = (name = "") => {
  const lower = name.toLowerCase();

  for (const key in CATEGORY_EMOJI_MAP) {
    if (lower.includes(key)) {
      return CATEGORY_EMOJI_MAP[key];
    }
  }

  return DEFAULT_CATEGORY_EMOJI;
};
