import { defineStore } from "pinia";
import { ref } from "vue";
import { payrollSettingsApiService } from "../services/payroll-settings.api.service.js";
import {
  emptyPayrollSettingsForm,
  mapSettingsFromApi,
  mapSettingsToApi,
} from "../mappers/payroll-settings.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { t } from "../../../i18n/index.js";
import { useSalaryComponentStore } from "./salary-component.store.js";

export const usePayrollSettingsStore = defineStore("payrollSettings", () => {
  const form = ref(emptyPayrollSettingsForm());
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  const successMessage = ref("");
  const lastSync = ref(null);
  const companyId = ref(null);
  const countryId = ref(null);
  /** Snapshot of last loaded/saved form for Reset */
  let snapshot = JSON.stringify(emptyPayrollSettingsForm());

  function applyForm(data) {
    form.value = mapSettingsFromApi(data);
    snapshot = JSON.stringify(form.value);
    if (data?.company_id != null) companyId.value = data.company_id;
    if (data?.country_id != null) countryId.value = data.country_id;
  }

  async function fetchSettings() {
    loading.value = true;
    error.value = null;
    successMessage.value = "";
    try {
      const data = await payrollSettingsApiService.fetchSettings();
      applyForm(data);
      lastSync.value = data?.sync ?? null;
      return form.value;
    } catch (e) {
      error.value =
        parseApiError(e) || t("admin.payroll.settings.loadError");
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function saveSettings() {
    saving.value = true;
    error.value = null;
    successMessage.value = "";
    try {
      const payload = mapSettingsToApi(form.value);
      const data = await payrollSettingsApiService.updateSettings(payload);
      applyForm(data);
      lastSync.value = data?.sync ?? null;

      successMessage.value =
        form.value.statutory_mode === "manual"
          ? t("admin.payroll.settings.saveSuccessManual")
          : t("admin.payroll.settings.saveSuccessAuto");

      // Recharger le catalogue selon le mode
      try {
        const components = useSalaryComponentStore();
        await components.fetchAll({
          includeStatutory: form.value.statutory_mode === "manual",
        });
      } catch {
        /* non bloquant */
      }

      return data;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.payroll.settings.saveError");
      throw e;
    } finally {
      saving.value = false;
    }
  }

  function resetToSnapshot() {
    form.value = { ...JSON.parse(snapshot) };
    error.value = null;
    successMessage.value = "";
  }

  function setField(key, value) {
    form.value = { ...form.value, [key]: value };
  }

  return {
    form,
    loading,
    saving,
    error,
    successMessage,
    lastSync,
    companyId,
    countryId,
    fetchSettings,
    saveSettings,
    resetToSnapshot,
    setField,
  };
});
