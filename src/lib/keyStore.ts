// src/lib/keyStore.ts
export type ApiKeys = {
  openaiApiKey?: string;
  openaiBaseUrl?: string; // 可选，默认 https://api.openai.com/v1
  openaiModel?: string;   // 可选，默认 gpt-4o-mini
  serperApiKey?: string;
};

const STORAGE_KEY = 'openresearch.keys.v1';

export function loadKeys(): ApiKeys {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as ApiKeys : {};
  } catch {
    return {};
  }
}

export function saveKeys(partial: ApiKeys) {
  const current = loadKeys();
  const next = { ...current, ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearKeys() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getRequiredKeysOrThrow(source: string) {
  const { openaiApiKey, openaiBaseUrl, openaiModel, serperApiKey } = loadKeys();
  const baseUrl = openaiBaseUrl?.trim() || 'https://api.openai.com/v1';
  const model = openaiModel?.trim() || 'gpt-4o-mini';

  if (!openaiApiKey) {
    throw new Error('Missing OpenAI API Key. 请在右上角设置里填写 OpenAI API Key。');
  }
  if (!serperApiKey) {
    // 只有搜索相关的 source 需要
    const needsSerper = ['search', 'images', 'videos', 'places', 'news', 'shopping', 'scholar', 'patents'].includes(source);
    if (needsSerper) {
      throw new Error('Missing Serper API Key. 请在右上角设置里填写 Serper API Key。');
    }
  }
  return { openaiApiKey, baseUrl, model, serperApiKey };
}
