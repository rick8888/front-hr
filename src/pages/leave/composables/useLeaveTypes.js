import { computed, ref, watch } from "vue";
import { leaveTypesApiService } from "../services/leaveTypes.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

const FREQUENCY_TO_API = {
  Monthly: "monthly",
  Quarterly: "quarterly",
  Yearly: "yearly",
  monthly: "monthly",
  quarterly: "quarterly",
  yearly: "yearly",
};

const FREQUENCY_TO_UI = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

export function normalizeLeaveType(raw) {
  const accrualEnabled = !!(raw.enable_automatic_accrual ?? raw.enableAutomaticAccrual);
  const carryEnabled = !!(raw.allow_carry_forward ?? raw.allowCarryForward);
  const encashEnabled = !!(raw.allow_encashment ?? raw.allowEncashment);
  const active = !!(raw.active ?? raw.is_active ?? true);

  return {
    id: raw.id,
    name: raw.name ?? "",
    code: raw.code ?? "",
    description: raw.description ?? "",
    proofRequired: !!(raw.proof_required ?? raw.proofRequired),
    isCompensatoryOffType: !!(raw.is_compensatory_off_type ?? raw.isCompensatoryOffType),
    accrual: accrualEnabled
      ? {
          frequency:
            FREQUENCY_TO_UI[raw.accrual_frequency ?? raw.accrualFrequency] ||
            raw.accrual_frequency ||
            "Monthly",
          rate: raw.accrual_rate ?? raw.accrualRate ?? null,
          maxLimit: raw.max_accrual_limit ?? raw.maxAccrualLimit ?? null,
        }
      : null,
    carryForward: carryEnabled
      ? {
          maxDays: raw.max_carry_forward_days ?? raw.maxCarryForwardDays ?? null,
          expiryMonths:
            raw.carry_forward_expiry_months ?? raw.carryForwardExpiryMonths ?? null,
        }
      : null,
    encashment: encashEnabled
      ? { maxDays: raw.max_encashment_days ?? raw.maxEncashmentDays ?? null }
      : null,
    status: active ? "Active" : "Inactive",
  };
}

function toApiPayload(payload) {
  return {
    name: payload.name.trim(),
    code: payload.code.trim().toUpperCase(),
    description: (payload.description || "").trim() || null,
    proof_required: !!payload.proofRequired,
    is_compensatory_off_type: !!payload.isCompensatoryOffType,
    enable_automatic_accrual: !!payload.accrual,
    accrual_frequency: payload.accrual
      ? FREQUENCY_TO_API[payload.accrual.frequency] || "monthly"
      : null,
    accrual_rate: payload.accrual?.rate ?? null,
    max_accrual_limit: payload.accrual?.maxLimit ?? null,
    allow_carry_forward: !!payload.carryForward,
    max_carry_forward_days: payload.carryForward?.maxDays ?? null,
    carry_forward_expiry_months: payload.carryForward?.expiryMonths ?? null,
    allow_encashment: !!payload.encashment,
    max_encashment_days: payload.encashment?.maxDays ?? null,
    active: (payload.status || "Active") === "Active",
  };
}

export function useLeaveTypes() {
  const { t } = useI18n();
  const rows = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(7);

  const actionMenuOpen = ref(null);
  const isFormOpen = ref(false);
  const editingRow = ref(null);
  const viewRow = ref(null);
  const deleteRow = ref(null);

  const filtered = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return rows.value;
    return rows.value.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q)
    );
  });

  const totalFiltered = computed(() => filtered.value.length);
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(totalFiltered.value / pageSize.value))
  );
  const paginatedRows = computed(() => {
    const p = Math.min(page.value, pageCount.value);
    const start = (p - 1) * pageSize.value;
    return filtered.value.slice(start, start + pageSize.value);
  });
  const rangeLabel = computed(() => {
    if (totalFiltered.value === 0) return { from: 0, to: 0 };
    return {
      from: (page.value - 1) * pageSize.value + 1,
      to: Math.min(page.value * pageSize.value, totalFiltered.value),
    };
  });

  watch([searchQuery, pageSize], () => {
    page.value = 1;
  });
  watch(totalFiltered, (n) => {
    const maxPage = Math.max(1, Math.ceil(n / pageSize.value));
    if (page.value > maxPage) page.value = maxPage;
  });

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const list = await leaveTypesApiService.fetchAll();
      rows.value = list.map(normalizeLeaveType);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.leave.types.loadError");
    } finally {
      loading.value = false;
    }
  }

  function toggleMenu(id) {
    actionMenuOpen.value = actionMenuOpen.value === id ? null : id;
  }

  function closeMenu() {
    actionMenuOpen.value = null;
  }

  function onAdd() {
    closeMenu();
    editingRow.value = null;
    isFormOpen.value = true;
  }

  function onView(row) {
    closeMenu();
    viewRow.value = row;
  }

  function onEdit(row) {
    closeMenu();
    editingRow.value = row;
    isFormOpen.value = true;
  }

  async function onToggleStatus(row) {
    closeMenu();
    error.value = "";
    try {
      const updated = normalizeLeaveType(await leaveTypesApiService.toggleStatus(row.id));
      const idx = rows.value.findIndex((r) => r.id === row.id);
      if (idx !== -1) rows.value[idx] = updated;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.leave.types.statusError");
    }
  }

  function onDelete(row) {
    closeMenu();
    deleteRow.value = row;
  }

  function cancelDelete() {
    if (deleting.value) return;
    deleteRow.value = null;
  }

  async function confirmDelete() {
    if (!deleteRow.value || deleting.value) return;
    deleting.value = true;
    error.value = "";
    const id = deleteRow.value.id;
    try {
      await leaveTypesApiService.remove(id);
      rows.value = rows.value.filter((r) => r.id !== id);
      deleteRow.value = null;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.leave.types.deleteError");
    } finally {
      deleting.value = false;
    }
  }

  async function onFormSubmit(payload) {
    if (saving.value) return;
    saving.value = true;
    error.value = "";
    try {
      if (editingRow.value) {
        const updated = normalizeLeaveType(
          await leaveTypesApiService.update(editingRow.value.id, toApiPayload(payload))
        );
        const idx = rows.value.findIndex((r) => r.id === editingRow.value.id);
        if (idx !== -1) rows.value[idx] = updated;
      } else {
        const created = normalizeLeaveType(
          await leaveTypesApiService.create(toApiPayload(payload))
        );
        rows.value = [created, ...rows.value];
        page.value = 1;
      }
      editingRow.value = null;
      isFormOpen.value = false;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.leave.types.saveError");
    } finally {
      saving.value = false;
    }
  }

  return {
    rows,
    loading,
    saving,
    deleting,
    error,
    searchQuery,
    page,
    pageSize,
    actionMenuOpen,
    isFormOpen,
    editingRow,
    viewRow,
    deleteRow,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
    loadData,
    toggleMenu,
    closeMenu,
    onAdd,
    onView,
    onEdit,
    onToggleStatus,
    onDelete,
    cancelDelete,
    confirmDelete,
    onFormSubmit,
  };
}
