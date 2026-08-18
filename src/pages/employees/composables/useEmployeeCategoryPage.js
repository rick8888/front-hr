import { ref, computed, watch, unref } from "vue";
import { useRouter } from "vue-router";
import { getEmployeeCategory } from "../config/employeeCategories.js";
import { normalizeEmployee } from "./useEmployees.js";
import { employeesApiService } from "../services/employees.api.service.js";
import { teamsApiService } from "../../organization/services/teams.api.service.js";
import { designationsApiService } from "../../organization/services/designations.api.service.js";
import { attendanceTypesApiService } from "../../attendance/services/attendanceTypes.api.service.js";
import { rolesApiService } from "../../sup-admin/parametres/services/roles.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { t } from "../../../i18n/index.js";

const EXITED_STATUSES = ["terminated", "exited", "retired"];

export function useEmployeeCategoryPage(categorySlug) {
  const router = useRouter();
  const category = computed(() => getEmployeeCategory(unref(categorySlug)));

  const employees = ref([]);
  const teamOptions = ref([]);
  const designationOptions = ref([]);
  const attendanceTypeOptions = ref([]);
  const catalogRoles = ref([]);
  const loading = ref(true);
  const error = ref("");
  const filtersOpen = ref(true);

  const searchQuery = ref("");
  const selectedStatus = ref("");
  const selectedRole = ref("");
  const selectedTeam = ref("");
  const selectedDesignation = ref("");
  const selectedAttendanceType = ref("");

  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const roleOptions = computed(() =>
    catalogRoles.value
      .filter((role) => role.slug && role.slug !== "super_admin")
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
      .map((role) => ({ value: role.slug, label: role.name || role.slug }))
  );

  const categoryEmployees = computed(() => {
    if (!category.value) return [];
    return employees.value.filter((employee) => category.value.matches(employee));
  });

  const stats = computed(() => {
    const list = categoryEmployees.value;
    return {
      total: list.length,
      active: list.filter((e) => e.status === "active").length,
      inactive: list.filter((e) => e.status === "inactive").length,
      exited: list.filter((e) => EXITED_STATUSES.includes(e.status)).length,
    };
  });

  const filteredEmployees = computed(() => {
    let list = categoryEmployees.value;
    const q = searchQuery.value.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (employee) =>
          employee.name.toLowerCase().includes(q) ||
          (employee.email || "").toLowerCase().includes(q) ||
          (employee.phone || "").toLowerCase().includes(q) ||
          (employee.uid || "").toLowerCase().includes(q) ||
          String(employee.id).includes(q)
      );
    }

    if (selectedStatus.value) {
      list = list.filter((employee) => employee.status === selectedStatus.value);
    }

    if (selectedRole.value) {
      const selected = catalogRoles.value.find(
        (role) => role.slug === selectedRole.value
      );
      list = list.filter((employee) => {
        const current = (employee.role || "").trim();
        if (!current) return false;
        return (
          current === selectedRole.value ||
          current === selected?.name ||
          current === selected?.slug
        );
      });
    }

    if (selectedTeam.value) {
      list = list.filter((employee) => employee.team === selectedTeam.value);
    }

    if (selectedDesignation.value) {
      list = list.filter(
        (employee) => employee.designation === selectedDesignation.value
      );
    }

    if (selectedAttendanceType.value) {
      list = list.filter(
        (employee) => employee.attendanceType === selectedAttendanceType.value
      );
    }

    return list;
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredEmployees.value.length / itemsPerPage.value))
  );

  const paginatedEmployees = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredEmployees.value.slice(start, start + itemsPerPage.value);
  });

  const paginationFrom = computed(() => {
    if (!filteredEmployees.value.length) return 0;
    return (currentPage.value - 1) * itemsPerPage.value + 1;
  });

  const paginationTo = computed(() =>
    Math.min(currentPage.value * itemsPerPage.value, filteredEmployees.value.length)
  );

  const pageNumbers = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    const pages = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i += 1) pages.push(i);
      return pages;
    }

    const start = Math.max(1, current - 1);
    const end = Math.min(total, start + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  });

  watch(
    [
      searchQuery,
      selectedStatus,
      selectedRole,
      selectedTeam,
      selectedDesignation,
      selectedAttendanceType,
      itemsPerPage,
    ],
    () => {
      currentPage.value = 1;
    }
  );

  watch(totalPages, (total) => {
    if (currentPage.value > total) {
      currentPage.value = total;
    }
  });

  function enrichEmployee(raw) {
    const employee = normalizeEmployee(raw);
    const prefix = category.value?.uidPrefix ?? "EMP";
    return {
      ...employee,
      team: raw.team ?? raw.team_name ?? "",
      designation: raw.designation ?? raw.designation_name ?? employee.role ?? "",
      attendanceType: raw.attendance_type ?? raw.attendanceType ?? "Open",
      uid: employee.matricule || `${prefix}-${String(employee.id).padStart(8, "0")}`,
    };
  }

  async function loadPageData() {
    loading.value = true;
    error.value = "";
    try {
      const [employeeList, teams, designations, attendanceTypes, rolesList] =
        await Promise.all([
          employeesApiService.fetchAll(),
          teamsApiService.fetchAll().catch(() => []),
          designationsApiService.fetchAll().catch(() => []),
          attendanceTypesApiService.fetchAll({ activeOnly: true }).catch(() => []),
          rolesApiService.fetchAll().catch(() => []),
        ]);

      employees.value = employeeList.map(enrichEmployee);
      teamOptions.value = teams.map((team) => team.name).filter(Boolean);
      designationOptions.value = designations
        .map((d) => d.name ?? d.title)
        .filter(Boolean);
      attendanceTypeOptions.value = attendanceTypes.map((type) => type.name).filter(Boolean);
      catalogRoles.value = (Array.isArray(rolesList) ? rolesList : [])
        .filter((role) => role?.is_active !== false && role?.isActive !== false)
        .map((role) => ({
          id: role.id,
          name: role.name ?? "",
          slug: role.slug ?? "",
        }));
    } catch (e) {
      error.value = parseApiError(e) || t("admin.employees.loadError");
    } finally {
      loading.value = false;
    }
  }

  function clearFilters() {
    searchQuery.value = "";
    selectedStatus.value = "";
    selectedRole.value = "";
    selectedTeam.value = "";
    selectedDesignation.value = "";
    selectedAttendanceType.value = "";
    currentPage.value = 1;
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
  }

  function getInitials(name) {
    return (name || "?")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function viewEmployee(employee) {
    router.push(`/employees/view/${employee.id}`);
  }

  watch(
    () => unref(categorySlug),
    () => {
      clearFilters();
      loadPageData();
    }
  );

  return {
    category,
    employees,
    teamOptions,
    designationOptions,
    roleOptions,
    attendanceTypeOptions,
    loading,
    error,
    filtersOpen,
    searchQuery,
    selectedStatus,
    selectedRole,
    selectedTeam,
    selectedDesignation,
    selectedAttendanceType,
    currentPage,
    itemsPerPage,
    stats,
    filteredEmployees,
    paginatedEmployees,
    totalPages,
    paginationFrom,
    paginationTo,
    pageNumbers,
    loadPageData,
    clearFilters,
    goToPage,
    getInitials,
    viewEmployee,
  };
}
