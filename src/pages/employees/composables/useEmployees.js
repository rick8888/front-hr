import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { employeesApiService } from "../services/employees.api.service.js";
import { departmentsApiService } from "../../organization/services/departments.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useEmployeeImportExport } from "./useEmployeeImportExport.js";
import { useI18n } from "../../../i18n/index.js";
import {
  catalogStatusBadgeClass,
  catalogStatusLabel,
  catalogStatusOptions,
} from "../../../stores/entityStatusCatalog.store.js";

export function normalizeEmployee(raw) {
  return {
    id: raw.id,
    name: raw.name ?? raw.full_name ?? `${raw.first_name ?? ""} ${raw.last_name ?? ""}`.trim(),
    firstName: raw.first_name,
    lastName: raw.last_name,
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    department: raw.department ?? "",
    role: raw.role ?? raw.job_title ?? "",
    status: raw.status ?? (raw.is_active ? "active" : "inactive"),
    joinDate: raw.joinDate ?? raw.hired_at ?? "",
    matricule: raw.matricule,
    isActive: !!raw.is_active,
  };
}

const EMPTY_KPIS = {
  totalLeave: 0,
  attendanceRate: 0,
  pendingApprovals: 0,
  activeWarnings: 0,
  presentDays: 0,
  plannedDays: 0,
  lateArrivals: 0,
  absentDays: 0,
};

/** Vue détail employé (EmployeeView) à partir de l’API. */
export function normalizeEmployeeDetail(raw) {
  const meta = raw?.metadata && typeof raw.metadata === "object" ? raw.metadata : {};
  const firstName = raw?.first_name ?? "";
  const lastName = raw?.last_name ?? "";
  const name =
    raw?.name ||
    raw?.full_name ||
    `${firstName} ${lastName}`.trim() ||
    "—";

  return {
    id: raw?.id,
    code: raw?.matricule ?? "—",
    matricule: raw?.matricule ?? "",
    firstName,
    lastName,
    name,
    email: raw?.email ?? null,
    phone: raw?.phone ?? null,
    alternativePhone: meta.alternative_phone ?? null,
    gender: meta.gender ?? null,
    dateOfBirth: raw?.date_of_birth ?? null,
    bloodGroup: meta.blood_group ?? null,
    address: meta.address ?? null,
    designation: raw?.designation ?? meta.designation ?? raw?.job_title ?? "—",
    team: raw?.team ?? meta.team ?? "—",
    shift: raw?.shift ?? meta.shift ?? "—",
    shiftId: raw?.shift_id ?? meta.shift_id ?? null,
    reportingManager: raw?.reporting_manager ?? raw?.reportingManager ?? meta.reporting_manager ?? "—",
    role: raw?.role ?? meta.role ?? raw?.job_title ?? "—",
    joinDate: raw?.joinDate ?? raw?.hired_at ?? null,
    employmentType: raw?.contract_type ?? "—",
    attendanceType: raw?.attendance_type ?? raw?.attendanceType ?? meta.attendance_type ?? "—",
    qrGroup: raw?.qr_group ?? raw?.qrGroup ?? meta.qr_group ?? "",
    department: raw?.department ?? "",
    status: raw?.status ?? (raw?.is_active ? "active" : "inactive"),
    emergency: {
      name: meta.emergency_contact_name ?? null,
      relationship: meta.emergency_relationship ?? null,
      phone: meta.emergency_contact_phone ?? null,
      address: meta.emergency_contact_address ?? null,
    },
    kpis: { ...EMPTY_KPIS },
    attendanceLog: [],
    leaveBalances: [],
    leaveHistory: [],
    timeline: [],
    recentActivity: [],
  };
}

export function useEmployees() {
  const router = useRouter();
  const { t } = useI18n();

  const employees = ref([]);
  const departmentOptions = ref([]);
  const loading = ref(false);
  const deleting = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const selectedDepartment = ref("");
  const selectedStatus = ref("");
  const selectedRole = ref("");

  const selectedEmployees = ref([]);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);

  const deleteOpen = ref(false);
  const deleteMessage = ref("");

  const roleOptions = computed(() => {
    const roles = new Set(
      employees.value.map((e) => e.role).filter((r) => r && r.trim())
    );
    return [...roles].sort((a, b) => a.localeCompare(b));
  });

  const employeeStats = computed(() => {
    const list = employees.value;
    const exitedStatuses = ["terminated", "exited", "retired"];
    return {
      total: list.length,
      active: list.filter((e) => e.status === "active").length,
      inactive: list.filter((e) => e.status === "inactive").length,
      exited: list.filter((e) => exitedStatuses.includes(e.status)).length,
    };
  });

  const filteredEmployees = computed(() => {
    let filtered = employees.value;
    const q = searchQuery.value.trim().toLowerCase();

    if (q) {
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(q) ||
          (employee.email || "").toLowerCase().includes(q) ||
          (employee.matricule || "").toLowerCase().includes(q)
      );
    }

    if (selectedDepartment.value) {
      filtered = filtered.filter(
        (employee) => employee.department === selectedDepartment.value
      );
    }

    if (selectedStatus.value) {
      filtered = filtered.filter(
        (employee) => employee.status === selectedStatus.value
      );
    }

    if (selectedRole.value) {
      filtered = filtered.filter((employee) => employee.role === selectedRole.value);
    }

    return filtered;
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredEmployees.value.length / itemsPerPage.value))
  );

  const paginatedEmployees = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredEmployees.value.slice(start, start + itemsPerPage.value);
  });

  async function loadEmployees() {
    loading.value = true;
    error.value = "";
    try {
      const [employeeList, departments] = await Promise.all([
        employeesApiService.fetchAll(),
        departmentsApiService.fetchAll().catch(() => []),
      ]);
      employees.value = employeeList.map(normalizeEmployee);
      departmentOptions.value = departments.map((d) => d.name).filter(Boolean);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.employees.loadError");
    } finally {
      loading.value = false;
    }
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

  function getStatusBadgeClass(status) {
    return catalogStatusBadgeClass("employees", status);
  }

  function getStatusLabel(status) {
    const map = {
      active: "admin.employees.status.active",
      inactive: "admin.employees.status.inactive",
      "on-leave": "admin.employees.status.onLeave",
      terminated: "admin.employees.status.terminated",
      exited: "admin.employees.status.exited",
      retired: "admin.employees.status.retired",
    };
    const fallback = map[status] ? t(map[status]) : status;
    return catalogStatusLabel("employees", status, fallback);
  }

  const employeeStatusOptions = computed(() =>
    catalogStatusOptions("employees", [
      { value: "active", label: t("admin.employees.status.active") },
      { value: "inactive", label: t("admin.employees.status.inactive") },
      { value: "terminated", label: t("admin.employees.status.terminated") },
    ])
  );

  function selectAllEmployees(event) {
    if (event.target.checked) {
      selectedEmployees.value = paginatedEmployees.value.map((emp) => emp.id);
    } else {
      selectedEmployees.value = [];
    }
  }

  function toggleEmployeeSelection(employeeId) {
    const index = selectedEmployees.value.indexOf(employeeId);
    if (index > -1) {
      selectedEmployees.value.splice(index, 1);
    } else {
      selectedEmployees.value.push(employeeId);
    }
  }

  function clearSelection() {
    selectedEmployees.value = [];
  }

  function clearFilters() {
    searchQuery.value = "";
    selectedDepartment.value = "";
    selectedStatus.value = "";
    selectedRole.value = "";
    currentPage.value = 1;
  }

  function viewEmployee(employee) {
    router.push(`/employees/view/${employee.id}`);
  }

  function bulkSendEmail() {
    const selectedEmails = employees.value
      .filter((emp) => selectedEmployees.value.includes(emp.id))
      .map((emp) => emp.email)
      .filter(Boolean)
      .join(",");
    if (selectedEmails) {
      window.open(`mailto:${selectedEmails}`, "_blank");
    }
  }

  function bulkChangeStatus() {
    error.value = t("admin.employees.bulkStatusSoon");
  }

  const {
    exporting,
    importing,
    ioError,
    ioSuccess,
    exportEmployees: doExport,
    bulkExport: doBulkExport,
    importEmployees: doImport,
  } = useEmployeeImportExport({
    getSelectedIds: () => [...selectedEmployees.value],
    onImported: loadEmployees,
  });

  async function exportEmployees() {
    error.value = "";
    await doExport();
    if (ioError.value) error.value = ioError.value;
  }

  async function bulkExport() {
    error.value = "";
    await doBulkExport();
    if (ioError.value) error.value = ioError.value;
  }

  function importEmployees() {
    error.value = "";
    doImport();
  }

  function requestBulkDelete() {
    if (!selectedEmployees.value.length) return;
    deleteMessage.value = t("admin.employees.deleteMessage", {
      n: selectedEmployees.value.length,
    });
    deleteOpen.value = true;
  }

  async function confirmBulkDelete() {
    if (!selectedEmployees.value.length || deleting.value) return;

    deleting.value = true;
    error.value = "";
    const ids = [...selectedEmployees.value];

    try {
      for (const id of ids) {
        await employeesApiService.remove(id);
      }
      employees.value = employees.value.filter((e) => !ids.includes(e.id));
      selectedEmployees.value = [];
      deleteOpen.value = false;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.employees.deleteError");
    } finally {
      deleting.value = false;
    }
  }

  function cancelBulkDelete() {
    if (deleting.value) return;
    deleteOpen.value = false;
  }

  return {
    employees,
    departmentOptions,
    roleOptions,
    loading,
    deleting,
    exporting,
    importing,
    error,
    ioError,
    ioSuccess,
    searchQuery,
    selectedDepartment,
    selectedStatus,
    selectedRole,
    selectedEmployees,
    currentPage,
    itemsPerPage,
    deleteOpen,
    deleteMessage,
    employeeStats,
    filteredEmployees,
    totalPages,
    paginatedEmployees,
    loadEmployees,
    getInitials,
    getStatusBadgeClass,
    getStatusLabel,
    employeeStatusOptions,
    selectAllEmployees,
    toggleEmployeeSelection,
    clearSelection,
    clearFilters,
    viewEmployee,
    bulkSendEmail,
    bulkChangeStatus,
    bulkExport,
    exportEmployees,
    importEmployees,
    requestBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
  };
}
