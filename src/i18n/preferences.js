/**
 * Préférences UI (langue, fuseau, format date).
 * Source de vérité : localStorage `settings-preferences` (Settings → Préférences).
 */

export const PREFERENCES_STORAGE_KEY = "settings-preferences";

export const SUPPORTED_LOCALES = ["fr", "en"];

export const DEFAULT_PREFERENCES = {
  language: "fr",
  timezone: "Europe/Paris",
  dateFormat: "DD/MM/YYYY",
};

/**
 * @returns {{ language: string, timezone: string, dateFormat: string }}
 */
export function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      language: normalizeLocale(parsed?.language),
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

/**
 * @param {Partial<{ language: string, timezone: string, dateFormat: string }>} partial
 */
export function savePreferences(partial) {
  const next = {
    ...loadPreferences(),
    ...partial,
  };
  next.language = normalizeLocale(next.language);
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(next));
  return next;
}

/** @param {unknown} value */
export function normalizeLocale(value) {
  const code = String(value || "fr")
    .toLowerCase()
    .slice(0, 2);
  return SUPPORTED_LOCALES.includes(code) ? code : "fr";
}

export function localeToBcp47(locale) {
  return normalizeLocale(locale) === "en" ? "en-US" : "fr-FR";
}
