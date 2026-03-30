/** Safely extract a string from a plain string or {en,ar,bn} object */
export function safeStr(val: any, lang = 'en'): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val[lang] || val['en'] || (Object.values(val).find(v => typeof v === 'string') as string) || '';
  }
  return String(val);
}

/** Safely extract a string array from an array or {en,ar,bn} object of arrays */
export function safeArr(val: any, lang = 'en'): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'object') {
    const arr = val[lang] || val['en'] || Object.values(val)[0];
    return Array.isArray(arr) ? arr.map(String) : [];
  }
  return [];
}
