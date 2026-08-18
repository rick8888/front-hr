import { ref, onMounted } from "vue";
import { departmentsApiService } from "../../organization/services/departments.api.service.js";
import { holidaysApiService } from "../../holidays/services/holidays.api.service.js";
import { leaveTypesApiService } from "../../leave/services/leaveTypes.api.service.js";
import { shiftsApiService } from "../../attendance/services/shifts.api.service.js";
import { salaryComponentApiService } from "../../payroll/services/salary-component.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";

const STORAGE_KEY = "settings-business-central";

function defaultRules() {
  return {
    defaultContractType: "CDI",
    payrollCutoffDay: 25,
    enforceUniqueTypeCode: true,
    allowNegativeLeaveBalance: false,
    requireValidationForCompensation: true,
  };
}

/**
 * Paramétrage métier central : règles locales + compteurs API.
 */
export function useBusinessSettings() {
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  const message = ref(null);
  const rules = ref(defaultRules());

  const stats = ref({
    leaveTypes: 0,
    leaveTypesActive: 0,
    shifts: 0,
    shiftsActive: 0,
    payrollComponents: 0,
    payrollComponentsActive: 0,
    departments: 0,
    departmentsActive: 0,
    holidays: 0,
    holidaysActive: 0,
  });

  function loadRulesFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const src = parsed?.businessRules || parsed;
      if (src && typeof src === "object") {
        rules.value = { ...defaultRules(), ...src };
      }
    } catch {
      /* ignore */
    }
  }

  async function loadCatalogStats() {
    loading.value = true;
    error.value = null;

    const results = await Promise.allSettled([
      leaveTypesApiService.fetchAll(),
      shiftsApiService.fetchAll(),
      salaryComponentApiService.fetchAll({ include_statutory: 0 }),
      departmentsApiService.fetchAll(),
      holidaysApiService.fetchAll(),
    ]);

    const [leaveTypes, shifts, components, departments, holidays] = results.map((r) =>
      r.status === "fulfilled" && Array.isArray(r.value) ? r.value : []
    );

    const isActive = (item) =>
      item?.active !== false &&
      item?.is_active !== false &&
      item?.status !== "Inactive" &&
      item?.status !== "inactive";

    stats.value = {
      leaveTypes: leaveTypes.length,
      leaveTypesActive: leaveTypes.filter(isActive).length,
      shifts: shifts.length,
      shiftsActive: shifts.filter(isActive).length,
      payrollComponents: components.length,
      payrollComponentsActive: components.filter(isActive).length,
      departments: departments.length,
      departmentsActive: departments.filter(isActive).length,
      holidays: holidays.length,
      holidaysActive: holidays.filter(isActive).length,
    };

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length === results.length) {
      error.value =
        parseApiError(failed[0].reason) ||
        "Impossible de charger les catalogues métier.";
    }

    loading.value = false;
  }

  async function bootstrap() {
    loadRulesFromStorage();
    await loadCatalogStats();
  }

  async function saveRules() {
    message.value = null;
    error.value = null;

    const day = Number(rules.value.payrollCutoffDay);
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      error.value = "Le jour de clôture de paie doit être entre 1 et 31.";
      return;
    }

    saving.value = true;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          businessRules: {
            ...rules.value,
            payrollCutoffDay: day,
          },
          updatedAt: new Date().toISOString(),
        })
      );
      rules.value.payrollCutoffDay = day;
      message.value = "Paramétrage métier enregistré.";
    } catch {
      error.value = "Impossible d'enregistrer le paramétrage.";
    } finally {
      saving.value = false;
    }
  }

  onMounted(() => {
    bootstrap();
  });

  return {
    loading,
    saving,
    error,
    message,
    rules,
    stats,
    bootstrap,
    loadCatalogStats,
    saveRules,
  };
}
