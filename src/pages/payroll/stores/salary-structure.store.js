import { defineStore } from "pinia";
import { ref } from "vue";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import { salaryStructureApiService } from "../services/salary-structure.api.service.js";
import { useSalaryComponentStore } from "./salary-component.store.js";
import {
  mapEmployeeBase,
  pickActiveStructure,
  enrichEmployeeWithStructure,
  mapDraftToAssignPayload,
} from "../mappers/salary-structure.mapper.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { t } from "../../../i18n/index.js";

export const DEFAULT_EXPECTED = 1;

export function catalogLabel(code) {
  try {
    return useSalaryComponentStore().byCode(code)?.name ?? code;
  } catch {
    return code;
  }
}

export function metaForCode(code) {
  try {
    return useSalaryComponentStore().byCode(code);
  } catch {
    return null;
  }
}

export function newLineId() {
  return `ln-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function buildDefaultStructureLines() {
  return [];
}

export const useSalaryStructureStore = defineStore("payrollSalaryStructure", () => {
  const employees = ref([]);
  const departmentOptions = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);

  const componentsStore = useSalaryComponentStore();

  function departmentNameForRow(row) {
    if (!row) return "—";
    if (row.departmentName && row.departmentName !== "—") return row.departmentName;
    if (!row.departmentId) return t("admin.payroll.noDepartment");
    return String(row.departmentId);
  }

  function getEmployee(id) {
    return employees.value.find((e) => e.id === Number(id));
  }

  function catalogByCode() {
    const map = {};
    // Catalogue attendu pour « complet » : composants actifs de l'entreprise
    for (const c of componentsStore.items) {
      if (c.is_active === false) continue;
      if (!c.code) continue;
      map[c.code] = {
        id: c.id,
        code: c.code,
        name: c.name,
        type: c.type === "earning" ? "gain" : c.type,
        source_type:
          c.is_statutory || c.calculation_type === "tax" ? "tax" : "manual",
        display_order: c.display_order ?? c.sequence ?? 0,
        base: c.base || String(c.code).toUpperCase() === "BASE_SALARY",
        calculation_type: c.calculation_type,
        default_value: c.default_value,
        is_statutory: !!(c.is_statutory || c.is_system),
      };
    }
    return map;
  }

  async function loadOneEmployeeStructure(base) {
    try {
      const structures = await salaryStructureApiService.listForEmployee(base.id);
      const active = pickActiveStructure(structures);
      return enrichEmployeeWithStructure(base, active, catalogByCode());
    } catch {
      return enrichEmployeeWithStructure(base, null, catalogByCode());
    }
  }

  /**
   * @param {object} [filters]
   * @param {string} [filters.search]
   * @param {string} [filters.department]
   * @param {string} [filters.structureStatus]
   * @param {boolean} [filters.refreshDepartments] — recharger la liste des départements
   */
  async function fetchAll(filters = {}) {
    loading.value = true;
    error.value = null;
    try {
      // Mode manuel → cotisations légales dans le catalogue structure
      await componentsStore.fetchAll();

      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.department) params.department = filters.department;
      if (filters.structureStatus && filters.structureStatus !== "all") {
        params.structure_status = filters.structureStatus;
      }

      const rawEmployees = await employeesApiService.fetchAll(params);
      const bases = rawEmployees.map(mapEmployeeBase);

      // Ne pas vider les options département quand on filtre par search / statut
      if (filters.refreshDepartments !== false && !params.department) {
        const depts = new Map();
        for (const b of bases) {
          if (b.departmentId) depts.set(b.departmentId, b.departmentName || b.departmentId);
        }
        if (depts.size > 0 || !params.search && !params.structure_status) {
          departmentOptions.value = [...depts.entries()].map(([id, name]) => ({
            id,
            name,
          }));
        }
      }

      employees.value = await Promise.all(bases.map((b) => loadOneEmployeeStructure(b)));
    } catch (e) {
      error.value = parseApiError(e);
      employees.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function reloadEmployee(employeeId) {
    try {
      const raw = await employeesApiService.fetchById(employeeId);
      const base = mapEmployeeBase(raw);
      const enriched = await loadOneEmployeeStructure(base);
      const idx = employees.value.findIndex((e) => e.id === Number(employeeId));
      if (idx !== -1) employees.value[idx] = enriched;
      else employees.value.push(enriched);
      return enriched;
    } catch (e) {
      error.value = parseApiError(e);
      return null;
    }
  }

  async function saveStructureFromBuilder(employeeId, draftLines) {
    saving.value = true;
    error.value = null;
    try {
      if (!componentsStore.items.length) {
        await componentsStore.fetchAll();
      }
      const emp = getEmployee(employeeId);
      const payload = mapDraftToAssignPayload({
        draftLines,
        components: componentsStore.items,
        baseSalaryHint: emp?.baseSalaryContract ?? emp?.baseSalary ?? 0,
      });

      if (!payload.lines.length) {
        throw new Error(t("admin.payroll.builder.saveNeedActive"));
      }

      await salaryStructureApiService.assign(employeeId, payload);
      await reloadEmployee(employeeId);
      return true;
    } catch (e) {
      error.value = parseApiError(e) || e?.message || t("admin.payroll.builder.saveError");
      throw e;
    } finally {
      saving.value = false;
    }
  }

  return {
    employees,
    departmentOptions,
    loading,
    saving,
    error,
    getEmployee,
    departmentNameForRow,
    fetchAll,
    reloadEmployee,
    saveStructureFromBuilder,
  };
});

// export name used by list page for filter select
export const departments = [];
