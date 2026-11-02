import { computed, ref, watch } from "vue";
import { attendanceRecordsApiService } from "../services/attendanceRecords.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import { shiftsApiService } from "../services/shifts.api.service.js";
import { sitesApiService } from "../../organization/services/sites.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function normalizeAttendanceRecord(raw) {
  return {
    id: raw.id,
    employeeId: raw.employee_id ?? raw.employeeId,
    employee: raw.employee_name ?? raw.employee ?? "—",
    employeeCode: raw.employee_code ?? raw.employeeCode ?? "",
    date: raw.date ?? raw.attendance_date ?? "",
    shiftId: raw.shift_id ?? raw.shiftId ?? null,
    shift: raw.shift_name ?? raw.shift ?? "—",
    siteId: raw.site_id ?? raw.siteId ?? null,
    location: raw.location ?? "—",
    checkIn: raw.check_in ?? raw.checkIn ?? null,
    checkOut: raw.check_out ?? raw.checkOut ?? null,
    workingMinutes: Number(raw.working_minutes ?? raw.workingMinutes ?? 0),
    lateMinutes: Number(raw.late_minutes ?? raw.lateMinutes ?? 0),
    earlyOutMinutes: Number(raw.early_out_minutes ?? raw.earlyOutMinutes ?? 0),
    overtimeMinutes: Number(raw.overtime_minutes ?? raw.overtimeMinutes ?? 0),
    breakMinutes: Number(raw.break_minutes ?? raw.breakMinutes ?? 0),
    isOnBreak: Boolean(raw.is_on_break ?? raw.isOnBreak),
    status: raw.status ?? "on_time",
  };
}

function emptyForm(date = today()) {
  return {
    employeeId: "",
    shiftId: "",
    siteId: "",
    checkIn: "",
    checkOut: "",
    status: "on_time",
    date,
  };
}

function payload(form) {
  return {
    employee_id: Number(form.employeeId),
    attendance_date: form.date,
    shift_id: form.shiftId ? Number(form.shiftId) : null,
    site_id: form.siteId ? Number(form.siteId) : null,
    check_in: form.checkIn || null,
    check_out: form.checkOut || null,
    status: form.status,
  };
}

export function useAttendanceRecords({ initialDate = today(), loadReferences = true } = {}) {
  const { t } = useI18n();
  const records = ref([]);
  const employees = ref([]);
  const shifts = ref([]);
  const sites = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref("");

  const dateFilter = ref(initialDate);
  const employeeFilter = ref("");
  const statusFilter = ref("");
  const search = ref("");
  const page = ref(1);
  const pageSize = ref(10);

  const modalOpen = ref(false);
  const editingId = ref(null);
  const form = ref(emptyForm(initialDate));
  const deleteOpen = ref(false);
  const deleteTarget = ref(null);

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return records.value;
    return records.value.filter((record) =>
      [record.employee, record.employeeCode, record.shift, record.location, record.status]
        .some((value) => String(value || "").toLowerCase().includes(q))
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filtered.value.length / pageSize.value))
  );
  const start = computed(() => filtered.value.length ? (page.value - 1) * pageSize.value : 0);
  const end = computed(() => Math.min(page.value * pageSize.value, filtered.value.length));
  const paginated = computed(() => filtered.value.slice(start.value, end.value));

  watch([search, pageSize], () => { page.value = 1; });
  watch(totalPages, (count) => {
    if (page.value > count) page.value = count;
  });

  async function loadData(extraFilters = {}) {
    loading.value = true;
    error.value = "";
    try {
      const params = { ...extraFilters };
      if (dateFilter.value) params.date = dateFilter.value;
      if (employeeFilter.value) params.employee_id = employeeFilter.value;
      if (statusFilter.value) params.status = statusFilter.value;
      records.value = (await attendanceRecordsApiService.fetchAll(params))
        .map(normalizeAttendanceRecord);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function loadReferenceData() {
    if (!loadReferences) return;
    const [employeesResult, shiftsResult, sitesResult] = await Promise.allSettled([
      employeesApiService.fetchAll(),
      shiftsApiService.fetchAll(),
      sitesApiService.fetchAll(),
    ]);

    if (employeesResult.status === "fulfilled") {
      employees.value = employeesResult.value;
    } else {
      error.value =
        parseApiError(employeesResult.reason) || t("admin.attendance.refError");
    }

    if (shiftsResult.status === "fulfilled") {
      shifts.value = shiftsResult.value;
    } else if (!error.value) {
      error.value =
        parseApiError(shiftsResult.reason) || t("admin.attendance.refError");
    }

    if (sitesResult.status === "fulfilled") {
      sites.value = sitesResult.value;
    }
    // Sites optionnels : liste de présences utilisable sans lieu
  }

  function openCreate() {
    editingId.value = null;
    form.value = emptyForm(dateFilter.value || today());
    modalOpen.value = true;
  }

  function openEdit(record) {
    editingId.value = record.id;
    form.value = {
      employeeId: String(record.employeeId ?? ""),
      shiftId: String(record.shiftId ?? ""),
      siteId: String(record.siteId ?? ""),
      checkIn: record.checkIn || "",
      checkOut: record.checkOut || "",
      status: record.status,
      date: record.date,
    };
    modalOpen.value = true;
  }

  async function submit() {
    if (!form.value.employeeId || !form.value.date || saving.value) return;
    saving.value = true;
    error.value = "";
    try {
      if (editingId.value) {
        await attendanceRecordsApiService.update(editingId.value, payload(form.value));
      } else {
        await attendanceRecordsApiService.create(payload(form.value));
      }
      modalOpen.value = false;
      await loadData();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.saveError");
    } finally {
      saving.value = false;
    }
  }

  function requestDelete(record) {
    deleteTarget.value = record;
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value || deleting.value) return;
    deleting.value = true;
    error.value = "";
    try {
      await attendanceRecordsApiService.remove(deleteTarget.value.id);
      deleteOpen.value = false;
      deleteTarget.value = null;
      await loadData();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.deleteError");
    } finally {
      deleting.value = false;
    }
  }

  return {
    records, employees, shifts, sites, loading, saving, deleting, error,
    dateFilter, employeeFilter, statusFilter, search, page, pageSize,
    modalOpen, editingId, form, deleteOpen, deleteTarget,
    filtered, totalPages, start, end, paginated,
    loadData, loadReferenceData, openCreate, openEdit, submit,
    requestDelete, confirmDelete,
  };
}

export function formatMinutes(value) {
  const minutes = Number(value || 0);
  if (!minutes) return "—";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours}h ${String(rest).padStart(2, "0")}m` : `${rest}m`;
}
