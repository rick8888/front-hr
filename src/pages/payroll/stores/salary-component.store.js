import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { salaryComponentApiService } from "../services/salary-component.api.service.js";
import { payrollSettingsApiService } from "../services/payroll-settings.api.service.js";
import {
  mapComponentFromApi,
  mapComponentToApi,
  mapComponentToCatalogItem,
} from "../mappers/salary-component.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useAuthStore } from "../../../stores/authStore.js";

/** true si mode cotisations = manuel (affichage catalogue) */
export async function isStatutoryModeManual() {
  try {
    const data = await payrollSettingsApiService.fetchSettings();
    return data?.statutory_mode === "manual";
  } catch {
    return false;
  }
}

export const useSalaryComponentStore = defineStore("payrollSalaryComponents", () => {
  const items = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  /** Dernier mode de chargement (manual = cotisations incluses) */
  const lastIncludeStatutory = ref(false);

  const stats = computed(() => {
    const list = items.value;
    return {
      total: list.length,
      gains: list.filter((c) => c.type === "earning").length,
      deductions: list.filter((c) => c.type === "deduction").length,
      baseCount: list.filter((c) => c.base).length,
    };
  });

  /**
   * Liste de l’écran Composants : tout ce qui a été chargé.
   * (en auto : sans cotisations ; en manuel : avec cotisations)
   */
  const managementItems = computed(() => items.value);

  const catalog = computed(() => items.value.map(mapComponentToCatalogItem));

  function companyParams() {
    const auth = useAuthStore();
    const id = auth.user?.company_id;
    return id ? { company_id: id } : {};
  }

  /**
   * @param {{ includeStatutory?: boolean }} [opts]
   * Si includeStatutory omis → lu depuis payroll-settings (manuel = true).
   */
  async function fetchAll(opts = {}) {
    loading.value = true;
    error.value = null;
    try {
      let includeStatutory = opts.includeStatutory;
      if (includeStatutory === undefined) {
        includeStatutory = await isStatutoryModeManual();
      } else {
        includeStatutory = !!includeStatutory;
      }

      lastIncludeStatutory.value = includeStatutory;

      const raw = await salaryComponentApiService.fetchAll({
        ...companyParams(),
        include_statutory: includeStatutory,
      });
      items.value = raw.map(mapComponentFromApi);
    } catch (e) {
      error.value = parseApiError(e);
      items.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function create(form) {
    saving.value = true;
    error.value = null;
    try {
      const payload = {
        ...mapComponentToApi(form),
        ...companyParams(),
      };
      const created = mapComponentFromApi(await salaryComponentApiService.create(payload));
      items.value.push(created);
      items.value.sort((a, b) => a.display_order - b.display_order);
      return created;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function update(id, form) {
    saving.value = true;
    error.value = null;
    try {
      const payload = mapComponentToApi(form);
      const updated = mapComponentFromApi(
        await salaryComponentApiService.update(id, payload)
      );
      const idx = items.value.findIndex((c) => c.id === id);
      if (idx !== -1) items.value[idx] = updated;
      return updated;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function remove(id) {
    saving.value = true;
    error.value = null;
    try {
      await salaryComponentApiService.remove(id);
      items.value = items.value.filter((c) => c.id !== id);
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  function byCode(code) {
    return items.value.find((c) => c.code === code) ?? null;
  }

  return {
    items,
    managementItems,
    loading,
    saving,
    error,
    stats,
    catalog,
    lastIncludeStatutory,
    fetchAll,
    create,
    update,
    remove,
    byCode,
  };
});
