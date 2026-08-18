import { ref, computed, watch } from "vue";
import { regularizationsApiService } from "../services/regularizations.api.service.js";
import { employeesApiService } from "../../employees/services/employees.api.service.js";
import {
  fallbackRegularizationTypes,
  regularizationTypeLabel,
  regularizationTypesApiService,
} from "../services/regularizationTypes.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

const todayIso = () => new Date().toISOString().slice(0, 10);

export function normalizeRegularization(raw) {
  return {
    id: raw.id,
    employeeId: raw.employee_id ?? raw.employeeId ?? null,
    employeeName: raw.employee_name ?? raw.employeeName ?? "—",
    department: raw.department || "—",
    requestDate: raw.request_date ?? raw.requestDate ?? "",
    attendanceDate: raw.attendance_date ?? raw.attendanceDate ?? "",
    type: raw.type ?? "",
    status: raw.status ?? "pending",
    manager: raw.manager_name ?? raw.managerName ?? raw.manager ?? "—",
    reviewedAt: raw.reviewed_at ?? raw.reviewedAt ?? null,
    checkIn: raw.check_in ?? raw.checkIn ?? null,
    checkOut: raw.check_out ?? raw.checkOut ?? null,
    reason: raw.reason ?? "",
    attachmentCount: Number(raw.attachment_count ?? raw.attachmentCount ?? 0),
  };
}

function emptyForm() {
  return {
    employeeId: "",
    date: "",
    type: "",
    checkIn: "",
    checkOut: "",
    reason: "",
  };
}

function emptyFilters() {
  return {
    from: "",
    to: "",
    status: "",
    type: "",
    employeeId: "",
  };
}

function toApiPayload(form, attachmentCount = 0) {
  return {
    employee_id: Number(form.employeeId),
    attendance_date: form.date,
    type: form.type,
    check_in: form.checkIn || null,
    check_out: form.checkOut || null,
    reason: (form.reason || "").trim(),
    attachment_count: attachmentCount,
  };
}

function toQueryParams(filters) {
  const params = {};
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.status) params.status = filters.status;
  if (filters.type) params.type = filters.type;
  if (filters.employeeId) params.employee_id = filters.employeeId;
  return params;
}

export function useRegularizations() {
  const { t } = useI18n();
  const requests = ref([]);
  const employeesList = ref([]);
  const typeCatalog = ref(fallbackRegularizationTypes(t));
  const loading = ref(false);
  const saving = ref(false);
  const error = ref("");

  const filters = ref(emptyFilters());
  const applied = ref(emptyFilters());
  const searchQuery = ref("");
  const pageSize = ref(10);
  const currentPage = ref(1);
  const openMenuId = ref(null);

  const createModalOpen = ref(false);
  const createForm = ref(emptyForm());
  const createErrors = ref({});
  const selectedFiles = ref([]);
  const fileInputKey = ref(0);

  /** Confirmation unifiée pour Approve / Reject / Delete. */
  const confirmOpen = ref(false);
  const confirmBusy = ref(false);
  const confirmState = ref({
    title: "",
    message: "",
    variant: "warning",
    confirmText: "Confirm",
    loadingText: "Processing…",
    action: null,
    row: null,
  });

  const attachmentLabel = computed(() => {
    if (!selectedFiles.value.length) return t("admin.attendance.regularizations.noFile");
    return selectedFiles.value.map((f) => f.name).join(", ");
  });

  const typeOptions = computed(() =>
    typeCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  function typeLabel(type) {
    return regularizationTypeLabel(type, typeCatalog.value, t);
  }

  const filteredRows = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    let rows = requests.value;
    if (!q) return rows;
    return rows.filter(
      (r) =>
        String(r.id).includes(q) ||
        (r.employeeName && r.employeeName.toLowerCase().includes(q)) ||
        (r.department && r.department.toLowerCase().includes(q))
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value))
  );

  const start = computed(() =>
    filteredRows.value.length ? (currentPage.value - 1) * pageSize.value : 0
  );

  const end = computed(() =>
    Math.min(currentPage.value * pageSize.value, filteredRows.value.length)
  );

  const paginatedRows = computed(() =>
    filteredRows.value.slice(start.value, end.value)
  );

  const kpiCards = computed(() => {
    const list = requests.value;
    const isToday = (d) => d === todayIso();
    return {
      total: list.length,
      pending: list.filter((r) => r.status === "pending").length,
      approvedToday: list.filter(
        (r) => r.status === "approved" && isToday(r.reviewedAt || r.requestDate)
      ).length,
      rejectedToday: list.filter(
        (r) => r.status === "rejected" && isToday(r.reviewedAt || r.requestDate)
      ).length,
    };
  });

  watch([searchQuery, pageSize], () => {
    currentPage.value = 1;
  });

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) currentPage.value = pages;
  });

  async function loadEmployees() {
    try {
      const list = await employeesApiService.fetchAll();
      employeesList.value = list.map((e) => ({
        id: e.id,
        name: e.name || e.full_name || `${e.first_name || ""} ${e.last_name || ""}`.trim(),
      }));
    } catch {
      employeesList.value = [];
    }
  }

  async function loadTypes() {
    try {
      const list = await regularizationTypesApiService.fetchAll();
      typeCatalog.value = list.length ? list : fallbackRegularizationTypes(t);
    } catch {
      typeCatalog.value = fallbackRegularizationTypes(t);
    }
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const list = await regularizationsApiService.fetchAll(toQueryParams(applied.value));
      requests.value = list.map(normalizeRegularization);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.regularizations.loadError");
    } finally {
      loading.value = false;
    }
  }

  async function applyFilters() {
    applied.value = { ...filters.value };
    currentPage.value = 1;
    await loadData();
  }

  async function resetFilters() {
    filters.value = emptyFilters();
    applied.value = emptyFilters();
    currentPage.value = 1;
    await loadData();
  }

  function toggleMenu(id) {
    openMenuId.value = openMenuId.value === id ? null : id;
  }

  function closeMenus() {
    openMenuId.value = null;
  }

  function onAttachmentChange(e) {
    const el = e.target;
    const files = el?.files;
    if (!files?.length) {
      selectedFiles.value = [];
      if (createErrors.value.files) {
        const c = { ...createErrors.value };
        delete c.files;
        createErrors.value = c;
      }
      return;
    }
    const maxBytes = 5 * 1024 * 1024;
    const list = Array.from(files);
    const bad = list.filter((f) => {
      const ext = (f.name.split(".").pop() || "").toLowerCase();
      const okExt = ["pdf", "jpg", "jpeg", "png"].includes(ext);
      return !okExt || f.size > maxBytes;
    });
    if (bad.length) {
      createErrors.value = {
        ...createErrors.value,
        files: "Invalid file type or size (> 5MB): " + bad.map((f) => f.name).join(", "),
      };
      el.value = "";
      selectedFiles.value = [];
      return;
    }
    if (createErrors.value.files) {
      const c = { ...createErrors.value };
      delete c.files;
      createErrors.value = c;
    }
    selectedFiles.value = list;
  }

  function openCreateModal() {
    createForm.value = emptyForm();
    createErrors.value = {};
    selectedFiles.value = [];
    fileInputKey.value += 1;
    createModalOpen.value = true;
  }

  function closeCreateModal() {
    if (saving.value) return;
    createModalOpen.value = false;
    createForm.value = emptyForm();
    createErrors.value = {};
    selectedFiles.value = [];
    fileInputKey.value += 1;
  }

  function validateCreateForm() {
    const err = {};
    if (!createForm.value.employeeId) err.employeeId = t("common.required");
    if (!createForm.value.date) err.date = t("common.required");
    if (!createForm.value.type) err.type = t("common.required");
    const r = (createForm.value.reason || "").trim();
    if (!r) err.reason = t("common.required");
    else if (r.length > 1000) err.reason = t("admin.attendance.regularizations.maxReason");
    createErrors.value = { ...err };
    return Object.keys(err).length === 0;
  }

  async function submitCreateRequest() {
    if (!validateCreateForm() || saving.value) return;

    saving.value = true;
    error.value = "";
    try {
      const created = normalizeRegularization(
        await regularizationsApiService.create(
          toApiPayload(createForm.value, selectedFiles.value.length)
        )
      );
      requests.value = [created, ...requests.value];
      currentPage.value = 1;
      createModalOpen.value = false;
      createForm.value = emptyForm();
      createErrors.value = {};
      selectedFiles.value = [];
      fileInputKey.value += 1;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.regularizations.createError");
    } finally {
      saving.value = false;
    }
  }

  function askConfirm({ title, message, variant, confirmText, loadingText, action, row }) {
    openMenuId.value = null;
    confirmState.value = {
      title,
      message,
      variant: variant || "warning",
      confirmText: confirmText || t("common.confirm"),
      loadingText: loadingText || t("admin.attendance.regularizations.processing"),
      action,
      row,
    };
    confirmOpen.value = true;
  }

  function requestApprove(row) {
    askConfirm({
      title: t("admin.attendance.regularizations.approveTitle"),
      message: t("admin.attendance.regularizations.approveMessage", {
        id: row.id,
        name: row.employeeName,
        type: typeLabel(row.type),
        date: row.attendanceDate,
      }),
      variant: "success",
      confirmText: t("common.approve"),
      loadingText: t("admin.attendance.regularizations.approving"),
      action: "approve",
      row,
    });
  }

  function requestReject(row) {
    askConfirm({
      title: t("admin.attendance.regularizations.rejectTitle"),
      message: t("admin.attendance.regularizations.rejectMessage", {
        id: row.id,
        name: row.employeeName,
        type: typeLabel(row.type),
        date: row.attendanceDate,
      }),
      variant: "warning",
      confirmText: t("common.reject"),
      loadingText: t("admin.attendance.regularizations.rejecting"),
      action: "reject",
      row,
    });
  }

  function requestDelete(row) {
    askConfirm({
      title: t("admin.attendance.regularizations.deleteTitle"),
      message: t("admin.attendance.regularizations.deleteMessage", {
        id: row.id,
        name: row.employeeName,
      }),
      variant: "danger",
      confirmText: t("common.delete"),
      loadingText: t("common.deleting"),
      action: "delete",
      row,
    });
  }

  async function confirmAction() {
    const { action, row } = confirmState.value;
    if (!action || !row || confirmBusy.value) return;

    confirmBusy.value = true;
    error.value = "";

    try {
      if (action === "delete") {
        await regularizationsApiService.remove(row.id);
        requests.value = requests.value.filter((r) => r.id !== row.id);
      } else {
        const status = action === "approve" ? "approved" : "rejected";
        const updated = normalizeRegularization(
          await regularizationsApiService.updateStatus(row.id, status)
        );
        const idx = requests.value.findIndex((r) => r.id === row.id);
        if (idx !== -1) requests.value[idx] = updated;
      }
      confirmOpen.value = false;
      confirmState.value = { ...confirmState.value, row: null, action: null };
    } catch (e) {
      const fallback =
        action === "delete"
          ? t("admin.attendance.regularizations.deleteError")
          : t("admin.attendance.regularizations.statusError");
      error.value = parseApiError(e) || fallback;
    } finally {
      confirmBusy.value = false;
    }
  }

  function cancelConfirm() {
    if (confirmBusy.value) return;
    confirmOpen.value = false;
    confirmState.value = { ...confirmState.value, row: null, action: null };
  }

  return {
    requests,
    employeesList,
    typeOptions,
    typeLabel,
    loading,
    saving,
    confirmBusy,
    error,
    filters,
    searchQuery,
    pageSize,
    currentPage,
    openMenuId,
    createModalOpen,
    createForm,
    createErrors,
    selectedFiles,
    fileInputKey,
    attachmentLabel,
    confirmOpen,
    confirmState,
    filteredRows,
    totalPages,
    start,
    end,
    paginatedRows,
    kpiCards,
    loadData,
    loadEmployees,
    loadTypes,
    applyFilters,
    resetFilters,
    toggleMenu,
    closeMenus,
    onAttachmentChange,
    openCreateModal,
    closeCreateModal,
    submitCreateRequest,
    requestApprove,
    requestReject,
    requestDelete,
    confirmAction,
    cancelConfirm,
  };
}
