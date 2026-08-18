import { ref, computed, watch } from "vue";
import { holidaysApiService } from "../services/holidays.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

export function buildProperties(holiday) {
  const props = [];
  if (holiday.visibleToEmployees) props.push("share");
  props.push("info");
  if (holiday.recurring || holiday.halfDay) props.push("clock");
  if (holiday.restrictedHoliday) props.push("lock");
  return props;
}

export function normalizeHoliday(raw) {
  const holiday = {
    id: raw.id,
    name: raw.name ?? "",
    code: raw.code ?? "",
    date: raw.date ?? "",
    type: raw.type ?? "",
    category: raw.category ?? "",
    description: raw.description ?? "",
    color: raw.color || "#22c55e",
    applicableTo: raw.applicable_to ?? raw.applicableTo ?? "all",
    recurring: !!raw.recurring,
    optionalHoliday: !!(raw.optional_holiday ?? raw.optionalHoliday),
    restrictedHoliday: !!(raw.restricted_holiday ?? raw.restrictedHoliday),
    halfDay: !!(raw.half_day ?? raw.halfDay),
    visibleToEmployees: !!(raw.visible_to_employees ?? raw.visibleToEmployees ?? true),
    sendNotification: !!(raw.send_notification ?? raw.sendNotification),
    status: (raw.active ?? raw.is_active ?? true) ? "active" : "inactive",
  };

  holiday.properties = buildProperties(holiday);
  return holiday;
}

function emptyForm() {
  return {
    name: "",
    code: "",
    date: new Date().toISOString().slice(0, 10),
    type: "",
    category: "",
    description: "",
    color: "#22c55e",
    applicableTo: "all",
    recurring: false,
    optionalHoliday: false,
    restrictedHoliday: false,
    halfDay: false,
    visibleToEmployees: true,
    sendNotification: false,
  };
}

function toApiPayload(form) {
  return {
    name: form.name.trim(),
    code: form.code.trim().toUpperCase().replace(/\s+/g, "_"),
    date: form.date,
    type: form.type,
    category: form.category || null,
    description: (form.description || "").trim() || null,
    color: form.color || "#22c55e",
    applicable_to: form.applicableTo,
    recurring: !!form.recurring,
    optional_holiday: !!form.optionalHoliday,
    restricted_holiday: !!form.restrictedHoliday,
    half_day: !!form.halfDay,
    visible_to_employees: !!form.visibleToEmployees,
    send_notification: !!form.sendNotification,
  };
}

export function useHolidays() {
  const { t } = useI18n();
  const holidays = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const pageSize = ref(10);
  const currentPage = ref(1);
  const openMenuId = ref(null);

  const modalOpen = ref(false);
  const editingId = ref(null);
  const form = ref(emptyForm());
  const formErrors = ref({});

  const deleteOpen = ref(false);
  const deleteTarget = ref(null);
  const deleteMessage = ref("");

  const filteredHolidays = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    let list = [...holidays.value].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    if (!q) return list;

    const typeLabels = {
      public: "public",
      religious: "religious",
      company: "company",
      regional: "regional",
    };

    return list.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.date.includes(q) ||
        (h.code && h.code.toLowerCase().includes(q)) ||
        (typeLabels[h.type] || h.type || "").toLowerCase().includes(q)
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredHolidays.value.length / pageSize.value))
  );

  const startIndex = computed(() =>
    filteredHolidays.value.length === 0
      ? 0
      : (currentPage.value - 1) * pageSize.value
  );

  const endIndex = computed(() =>
    Math.min(currentPage.value * pageSize.value, filteredHolidays.value.length)
  );

  const paginatedHolidays = computed(() =>
    filteredHolidays.value.slice(startIndex.value, endIndex.value)
  );

  watch([searchQuery, pageSize], () => {
    currentPage.value = 1;
  });

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) currentPage.value = pages;
  });

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const list = await holidaysApiService.fetchAll();
      holidays.value = list.map(normalizeHoliday);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.holidays.loadError");
    } finally {
      loading.value = false;
    }
  }

  function toggleMenu(id) {
    openMenuId.value = openMenuId.value === id ? null : id;
  }

  function closeMenus() {
    openMenuId.value = null;
  }

  function openAddHoliday() {
    editingId.value = null;
    form.value = emptyForm();
    formErrors.value = {};
    modalOpen.value = true;
  }

  function editHoliday(row) {
    openMenuId.value = null;
    editingId.value = row.id;
    form.value = {
      name: row.name,
      code: row.code || "",
      date: row.date,
      type: row.type || "",
      category: row.category || "",
      description: row.description || "",
      color: row.color || "#22c55e",
      applicableTo: row.applicableTo || "all",
      recurring: !!row.recurring,
      optionalHoliday: !!row.optionalHoliday,
      restrictedHoliday: !!row.restrictedHoliday,
      halfDay: !!row.halfDay,
      visibleToEmployees: row.visibleToEmployees ?? true,
      sendNotification: !!row.sendNotification,
    };
    formErrors.value = {};
    modalOpen.value = true;
  }

  function closeModal() {
    modalOpen.value = false;
    editingId.value = null;
    form.value = emptyForm();
    formErrors.value = {};
  }

  function validateForm() {
    const e = {};
    if (!form.value.name?.trim()) e.name = t("admin.attendance.holidays.requiredName");
    if (!form.value.code?.trim()) e.code = t("admin.attendance.holidays.requiredCode");
    if (!form.value.date) e.date = t("admin.attendance.holidays.requiredDate");
    if (!form.value.type) e.type = t("admin.attendance.holidays.requiredType");
    if (!form.value.applicableTo) e.applicableTo = t("admin.attendance.holidays.requiredScope");
    formErrors.value = e;
    return Object.keys(e).length === 0;
  }

  async function submitForm() {
    if (!validateForm() || saving.value) return;

    saving.value = true;
    error.value = "";
    const payload = toApiPayload(form.value);

    try {
      if (editingId.value) {
        const updated = normalizeHoliday(
          await holidaysApiService.update(editingId.value, payload)
        );
        const idx = holidays.value.findIndex((h) => h.id === editingId.value);
        if (idx !== -1) holidays.value[idx] = updated;
      } else {
        const created = normalizeHoliday(await holidaysApiService.create(payload));
        holidays.value = [created, ...holidays.value];
      }
      closeModal();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.holidays.saveError");
    } finally {
      saving.value = false;
    }
  }

  function requestDelete(holiday) {
    openMenuId.value = null;
    deleteTarget.value = holiday;
    deleteMessage.value = t("admin.attendance.holidays.deleteMessage", { name: holiday.name });
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value || deleting.value) return;

    deleting.value = true;
    error.value = "";
    const id = deleteTarget.value.id;

    try {
      await holidaysApiService.remove(id);
      holidays.value = holidays.value.filter((h) => h.id !== id);
      deleteOpen.value = false;
      deleteTarget.value = null;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.holidays.deleteError");
    } finally {
      deleting.value = false;
    }
  }

  function cancelDelete() {
    if (deleting.value) return;
    deleteOpen.value = false;
    deleteTarget.value = null;
  }

  return {
    holidays,
    loading,
    saving,
    deleting,
    error,
    searchQuery,
    pageSize,
    currentPage,
    openMenuId,
    modalOpen,
    editingId,
    form,
    formErrors,
    deleteOpen,
    deleteTarget,
    deleteMessage,
    filteredHolidays,
    totalPages,
    startIndex,
    endIndex,
    paginatedHolidays,
    loadData,
    toggleMenu,
    closeMenus,
    openAddHoliday,
    editHoliday,
    closeModal,
    submitForm,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
