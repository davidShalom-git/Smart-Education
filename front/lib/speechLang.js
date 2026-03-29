/**
 * Infer BCP-47 tag from script / characters in the string (for Web Speech API).
 */
export function inferSpeechLang(text) {
  if (!text || typeof text !== 'string') return 'en-US';
  const sample = text.slice(0, 300);
  for (const ch of sample) {
    const c = ch.codePointAt(0);
    if (c >= 0x0b80 && c <= 0x0bff) return 'ta-IN'; // Tamil
    if (c >= 0x0900 && c <= 0x097f) return 'hi-IN'; // Devanagari
    if (c >= 0x0980 && c <= 0x09ff) return 'bn-IN'; // Bengali
    if (c >= 0x0a80 && c <= 0x0aff) return 'gu-IN'; // Gujarati
    if (c >= 0x0b00 && c <= 0x0b7f) return 'pa-IN'; // Gurmukhi
    if (c >= 0x0c80 && c <= 0x0cff) return 'kn-IN'; // Kannada
    if (c >= 0x0d00 && c <= 0x0d7f) return 'ml-IN'; // Malayalam
    if (c >= 0x0d80 && c <= 0x0dff) return 'si-LK'; // Sinhala
    if (c >= 0x0c00 && c <= 0x0c7f) return 'te-IN'; // Telugu
    if (c >= 0x0600 && c <= 0x06ff) return 'ar-SA';
    if (c >= 0x3040 && c <= 0x309f) return 'ja-JP'; // Hiragana
    if (c >= 0x30a0 && c <= 0x30ff) return 'ja-JP'; // Katakana
    if (c >= 0x4e00 && c <= 0x9fff) return 'zh-CN';
    if (c >= 0xac00 && c <= 0xd7af) return 'ko-KR';
    if (c >= 0x0400 && c <= 0x04ff) return 'ru-RU';
    if (c >= 0x0370 && c <= 0x03ff) return 'el-GR';
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return 'en-US';
}

/** Windows / Chrome often put the real locale in the voice *name*, not `lang`. */
const VOICE_NAME_HINTS = {
  ta: [/tamil/i, /தமிழ்/],
  hi: [/hindi/i, /हिन्दी/i, /हिंदी/i],
  bn: [/bengali/i, /বাংলা/],
  te: [/telugu/i, /తెలుగు/],
  kn: [/kannada/i, /ಕನ್ನಡ/],
  ml: [/malayalam/i, /മലയാളം/],
  gu: [/gujarati/i, /ગુજરાતી/],
  pa: [/punjabi/i, /ਪੰਜਾਬੀ/],
  ar: [/arabic/i, /العربية/],
  ja: [/japanese/i, /日本語/],
  ko: [/korean/i, /한국어/],
  zh: [/chinese/i, /中文|汉语|國語|普通话/],
  si: [/sinhala/i, /සිංහල/]
};

function normLang(s) {
  return (s || '').replace(/_/g, '-').toLowerCase();
}

function preferLocal(voices) {
  const local = voices.filter((v) => v.localService);
  return local.length ? local : voices;
}

/**
 * Pick a SpeechSynthesisVoice. Name matching runs first — Windows often mis-reports `voice.lang`.
 */
export function selectVoiceForLang(voices, lang) {
  if (!voices?.length || !lang) return null;
  const want = normLang(lang);
  const primary = want.split('-')[0];
  const hints = VOICE_NAME_HINTS[primary];

  if (hints) {
    const byName = voices.filter((v) => hints.some((re) => re.test(v.name || '')));
    const picked = preferLocal(byName);
    if (picked[0]) return picked[0];
  }

  let v = voices.find((x) => x.lang && normLang(x.lang) === want);
  if (v) return v;

  v = voices.find((x) => x.lang && normLang(x.lang).startsWith(`${primary}-`));
  if (v) return v;

  v = voices.find((x) => x.lang && normLang(x.lang).startsWith(primary));
  if (v) return v;

  v = voices.find((x) => normLang(x.lang).includes(primary));
  return v || null;
}

/** Warm up the voice list (Chrome loads it async). Call on mount + after mic click. */
export function primeSpeechVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
}
