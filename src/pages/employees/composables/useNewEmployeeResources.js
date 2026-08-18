import { ref, computed } from "vue";
import { teamsApiService } from "../../organization/services/teams.api.service.js";
import { designationsApiService } from "../../organization/services/designations.api.service.js";
import { departmentsApiService } from "../../organization/services/departments.api.service.js";
import { countriesApiService } from "../../organization/services/countries.api.service.js";
import { shiftsApiService } from "../../attendance/services/shifts.api.service.js";
import { attendanceTypesApiService } from "../../attendance/services/attendanceTypes.api.service.js";
import { employeesApiService } from "../services/employees.api.service.js";
import { companyUsersApiService } from "../../tenant/services/company-users.api.service.js";
import { rolesApiService } from "../../sup-admin/parametres/services/roles.api.service.js";
import { normalizeShift, formatTime12 } from "../../attendance/composables/useShifts.js";
import { normalizeEmployee } from "./useEmployees.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { t } from "../../../i18n/index.js";

function isActive(item) {
  return item.active !== false && item.is_active !== false;
}

function normalizeTeamOption(raw) {
  return {
    id: raw.id,
    name: raw.name,
    label: raw.name,
    code: raw.code ?? "",
  };
}

function normalizeDesignationOption(raw) {
  return {
    id: raw.id,
    name: raw.name,
    label: raw.name,
    departmentId: raw.department_id ?? raw.departmentId ?? null,
    departmentName: raw.department_name ?? "",
  };
}

function normalizeShiftOption(raw) {
  const shift = normalizeShift(raw);
  return {
    id: shift.id,
    name: shift.name,
    label: `${shift.name} (${formatTime12(shift.start)} - ${formatTime12(shift.end)})`,
    start: shift.start,
    end: shift.end,
  };
}

function normalizeDepartmentOption(raw) {
  return {
    id: raw.id,
    name: raw.name,
    label: raw.name,
  };
}

function normalizeCountryOption(raw) {
  return {
    id: raw.id,
    name: raw.name ?? raw.label,
    label: raw.name ?? raw.label,
    code: raw.code ?? raw.iso2 ?? "",
  };
}

function normalizeManagerOption(raw) {
  return {
    id: raw.id,
    name: raw.name ?? "",
    label: raw.name ?? "",
    email: raw.email ?? "",
    role: raw.role ?? "",
  };
}

function normalizeRoleOption(raw) {
  return {
    id: raw.id,
    name: raw.name ?? "",
    slug: raw.slug ?? "",
    label: raw.name ?? raw.slug ?? "",
    isActive: raw.is_active !== false && raw.isActive !== false,
    isSystem: !!(raw.is_system ?? raw.isSystem),
  };
}

export function useNewEmployeeResources() {
  const loading = ref(false);
  const error = ref("");

  const teams = ref([]);
  const designations = ref([]);
  const shifts = ref([]);
  const managers = ref([]);
  const employees = ref([]);
  const departments = ref([]);
  const countries = ref([]);
  const attendanceTypes = ref([]);
  const roles = ref([]);

  const roleOptions = computed(() =>
    roles.value
      .filter((role) => role.isActive && role.slug && role.slug !== "super_admin")
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  const existingEmails = computed(() =>
    employees.value
      .map((e) => e.email?.trim().toLowerCase())
      .filter(Boolean)
  );

  const existingCodes = computed(() =>
    employees.value
      .map((e) => e.matricule?.trim().toUpperCase())
      .filter(Boolean)
  );

  async function loadResources() {
    loading.value = true;
    error.value = "";

    try {
      const [
        teamsList,
        designationsList,
        shiftsList,
        employeesList,
        managersList,
        departmentsList,
        countriesList,
        attendanceTypesList,
        rolesList,
      ] = await Promise.all([
        teamsApiService.fetchAll(),
        designationsApiService.fetchAll(),
        shiftsApiService.fetchAll(),
        employeesApiService.fetchAll(),
        companyUsersApiService.fetchUsers({ roles: "tenant,admin" }),
        departmentsApiService.fetchAll().catch(() => []),
        countriesApiService.fetchAll().catch(() => []),
        attendanceTypesApiService.fetchAll({ activeOnly: true }).catch(() => []),
        rolesApiService.fetchAll().catch(() => []),
      ]);

      teams.value = teamsList.filter(isActive).map(normalizeTeamOption);
      designations.value = designationsList.filter(isActive).map(normalizeDesignationOption);
      shifts.value = shiftsList.filter(isActive).map(normalizeShiftOption);
      employees.value = employeesList
        .filter((e) => e.is_active !== false)
        .map(normalizeEmployee);
      managers.value = (Array.isArray(managersList) ? managersList : [])
        .map(normalizeManagerOption)
        .sort((a, b) => a.name.localeCompare(b.name));
      departments.value = departmentsList.filter(isActive).map(normalizeDepartmentOption);
      countries.value = countriesList.map(normalizeCountryOption);
      attendanceTypes.value = attendanceTypesList;
      roles.value = (Array.isArray(rolesList) ? rolesList : []).map(normalizeRoleOption);
    } catch (e) {
      error.value =
        parseApiError(e) || t("admin.employees.create.error.resources");
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    teams,
    designations,
    shifts,
    managers,
    departments,
    countries,
    attendanceTypes,
    roles,
    roleOptions,
    existingEmails,
    existingCodes,
    loadResources,
  };
}
