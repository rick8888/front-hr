import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { payrollModifierApiService } from "../services/payroll-modifier.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import {
  mapModifierFromApi,
  mapModifierToApi,
} from "../mappers/payroll-modifier.mapper.js";
import { mapEmployeeBase } from "../mappers/salary-structure.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useAuthStore } from "../../../stores/authStore.js";

export const usePayrollModifierStore = defineStore("payrollModifiers", () => {
  const items = ref([]);
  const employees = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);

  const stats = computed(() => {
    const list = items.value;
    return {
      total: list.length,
      deductions: list.filter((m) => m.type === "deduction").length,
      earnings: list.filter((m) => m.type === "earning").length,
      allEmployees: list.filter((m) => m.applicability === "all").length,
    };
  });

  const employeeOptions = computed(() =>
    employees.value.map((e) => ({
      id: e.id,
      name: e.name,
      empCode: e.empCode,
      initials: e.initials,
    }))
  );

  function companyId() {
    return useAuthStore().user?.company_id ?? null;
  }

  async function fetchEmployees() {
    const raw = await employeesApiService.fetchAll();
    employees.value = raw.map(mapEmployeeBase);
  }

  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const cid = companyId();
      const [mods] = await Promise.all([
        payrollModifierApiService.fetchAll(cid ? { company_id: cid } : {}),
        fetchEmployees().catch(() => {
          employees.value = [];
        }),
      ]);
      items.value = mods.map(mapModifierFromApi);
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
      const payload = mapModifierToApi(form, companyId());
      const created = mapModifierFromApi(await payrollModifierApiService.create(payload));
      items.value.push(created);
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
      const payload = mapModifierToApi(form, companyId());
      const updated = mapModifierFromApi(await payrollModifierApiService.update(id, payload));
      const idx = items.value.findIndex((m) => m.id === id);
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
      await payrollModifierApiService.remove(id);
      items.value = items.value.filter((m) => m.id !== id);
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  return {
    items,
    employees,
    employeeOptions,
    loading,
    saving,
    error,
    stats,
    fetchAll,
    create,
    update,
    remove,
  };
});
