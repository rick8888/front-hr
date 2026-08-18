import { computed, ref } from "vue";
import en from "./locales/en.js";
import fr from "./locales/fr.js";
import adminEn from "./locales/admin/en.js";
import adminFr from "./locales/admin/fr.js";
import adminSettingsEn from "./locales/admin/settings/en.js";
import adminSettingsFr from "./locales/admin/settings/fr.js";
import adminPayrollEn from "./locales/admin/payroll/en.js";
import adminPayrollFr from "./locales/admin/payroll/fr.js";
import adminAttendanceEn from "./locales/admin/attendance/en.js";
import adminAttendanceFr from "./locales/admin/attendance/fr.js";
import adminLeaveEn from "./locales/admin/leave/en.js";
import adminLeaveFr from "./locales/admin/leave/fr.js";
import adminRecruitmentEn from "./locales/admin/recruitment/en.js";
import adminRecruitmentFr from "./locales/admin/recruitment/fr.js";
import adminEmployeesEn from "./locales/admin/employees/en.js";
import adminEmployeesFr from "./locales/admin/employees/fr.js";
import landingEn from "./locales/landing/en.js";
import landingFr from "./locales/landing/fr.js";
import {
  loadPreferences,
  localeToBcp47,
  normalizeLocale,
  savePreferences,
} from "./preferences.js";

const MESSAGES = {
  en: { ...en, ...adminEn, ...adminSettingsEn, ...adminPayrollEn, ...adminAttendanceEn, ...adminLeaveEn, ...adminRecruitmentEn, ...adminEmployeesEn, ...landingEn },
  fr: { ...fr, ...adminFr, ...adminSettingsFr, ...adminPayrollFr, ...adminAttendanceFr, ...adminLeaveFr, ...adminRecruitmentFr, ...adminEmployeesFr, ...landingFr },
};

const localeRef = ref(normalizeLocale(loadPreferences().language));

function applyDocumentLang(code) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = code === "en" ? "en" : "fr";
  }
}

applyDocumentLang(localeRef.value);

/**
 * @param {string} key
 * @param {Record<string, string|number>} [params]
 */
export function translate(key, params = {}) {
  const code = localeRef.value;
  const dict = MESSAGES[code] || MESSAGES.fr;
  let text = dict[key] ?? MESSAGES.en[key] ?? key;
  if (params && typeof text === "string") {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    });
  }
  return text;
}

/** Alias court. */
export const t = translate;

export function getLocale() {
  return localeRef.value;
}

/**
 * Change la langue active (et persiste dans les préférences).
 * @param {string} code
 * @param {{ persist?: boolean }} [opts]
 */
export function setLocale(code, opts = {}) {
  const next = normalizeLocale(code);
  localeRef.value = next;
  applyDocumentLang(next);
  if (opts.persist !== false) {
    savePreferences({ language: next });
  }
  return next;
}

/** @param {import('vue').App} app */
export function setupI18n(app) {
  app.config.globalProperties.$t = translate;
  app.config.globalProperties.$locale = localeRef;
  app.provide("i18n", {
    t: translate,
    locale: localeRef,
    setLocale,
  });
}

/**
 * Composition API — `locale` est réactif pour recalculer les labels nav.
 */
export function useI18n() {
  const locale = computed(() => localeRef.value);
  const bcp47 = computed(() => localeToBcp47(localeRef.value));

  return {
    t: translate,
    locale,
    bcp47,
    setLocale,
    getLocale,
  };
}

export { localeRef };
