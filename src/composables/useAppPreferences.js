import { computed, ref, watch } from "vue";
import { setLocale, useI18n } from "../i18n/index.js";
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
} from "../i18n/preferences.js";

/**
 * Préférences admin (langue, timezone, dateFormat) liées à l'i18n.
 */
export function useAppPreferences() {
  const { locale, t } = useI18n();
  const preferenceSettings = ref({ ...loadPreferences() });
  const feedback = ref("");

  // Sync si la langue a été changée ailleurs.
  watch(locale, (code) => {
    if (preferenceSettings.value.language !== code) {
      preferenceSettings.value = {
        ...preferenceSettings.value,
        language: code,
      };
    }
  });

  function persistPreferences(extra = {}) {
    const next = savePreferences({
      ...preferenceSettings.value,
      ...extra,
    });
    preferenceSettings.value = { ...next };
    setLocale(next.language, { persist: false });
    feedback.value = t("settings.preferences.saved");
    return next;
  }

  function resetPreferences() {
    preferenceSettings.value = { ...DEFAULT_PREFERENCES };
  }

  return {
    preferenceSettings,
    feedback,
    persistPreferences,
    resetPreferences,
    t,
    locale,
  };
}
