import { ref, computed, watch } from "vue";
import { shiftsApiService } from "../services/shifts.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

export const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function normalizeShift(raw) {
  return {
    id: raw.id,
    name: raw.name,
    code: raw.code,
    start: raw.start ?? raw.start_time?.slice?.(0, 5) ?? raw.start_time ?? "09:00",
    end: raw.end ?? raw.end_time?.slice?.(0, 5) ?? raw.end_time ?? "18:00",
    days: raw.days ?? raw.working_days ?? [],
    note: raw.note ?? "",
    active: !!raw.active,
  };
}

function emptyForm() {
  return {
    name: "",
    code: "",
    start: "09:00",
    end: "18:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    active: true,
    note: "",
  };
}

export function formatTime12(hhmm) {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return hhmm;
  const [hStr, mStr] = hhmm.split(":");
  const h = parseInt(hStr, 10) % 24;
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function useShifts() {
  const { t } = useI18n();
  const shifts = ref([]);
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

  const deleteOpen = ref(false);
  const deleteTarget = ref(null);
  const deleteMessage = ref("");

  const filteredShifts = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return shifts.value;
    return shifts.value.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.id.toString().includes(q) ||
        (s.note || "").toLowerCase().includes(q)
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredShifts.value.length / pageSize.value))
  );

  const startIndex = computed(() =>
    filteredShifts.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value
  );

  const endIndex = computed(() =>
    Math.min(currentPage.value * pageSize.value, filteredShifts.value.length)
  );

  const paginatedShifts = computed(() =>
    filteredShifts.value.slice(startIndex.value, endIndex.value)
  );

  watch([searchQuery, pageSize], () => {
    currentPage.value = 1;
  });

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) currentPage.value = pages;
  });

  function nextCode() {
    const nums = shifts.value
      .map((s) => Number((s.code || "").replace(/\D/g, "")))
      .filter((n) => !Number.isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `SH-${String(next).padStart(3, "0")}`;
  }

  async function loadShifts() {
    loading.value = true;
    error.value = "";
    try {
      const list = await shiftsApiService.fetchAll();
      shifts.value = list.map(normalizeShift);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.shifts.loadError");
    } finally {
      loading.value = false;
    }
  }

  function isDaySelected(d) {
    return (form.value.days || []).includes(d);
  }

  function toggleDay(d, checked) {
    const s = new Set(form.value.days || []);
    if (checked) s.add(d);
    else s.delete(d);
    form.value.days = ALL_DAYS.filter((x) => s.has(x));
  }

  function toggleMenu(id) {
    openMenuId.value = openMenuId.value === id ? null : id;
  }

  function closeMenus() {
    openMenuId.value = null;
  }

  function openAdd() {
    editingId.value = null;
    form.value = { ...emptyForm(), code: nextCode() };
    modalOpen.value = true;
  }

  function editRow(row) {
    openMenuId.value = null;
    editingId.value = row.id;
    form.value = {
      name: row.name,
      code: row.code,
      start: row.start,
      end: row.end,
      days: [...row.days],
      active: !!row.active,
      note: row.note || "",
    };
    modalOpen.value = true;
  }

  function closeModal() {
    modalOpen.value = false;
    editingId.value = null;
  }

  async function submitForm() {
    if (!form.value.name?.trim() || !form.value.code?.trim() || saving.value) return;

    saving.value = true;
    error.value = "";
    const payload = {
      name: form.value.name.trim(),
      code: form.value.code.trim().toUpperCase(),
      start: form.value.start,
      end: form.value.end,
      days: form.value.days.length ? [...form.value.days] : ["Mon", "Tue", "Wed", "Thu", "Fri"],
      note: (form.value.note || "").trim() || null,
      active: !!form.value.active,
    };

    try {
      if (editingId.value) {
        const updated = normalizeShift(
          await shiftsApiService.update(editingId.value, payload)
        );
        const idx = shifts.value.findIndex((s) => s.id === editingId.value);
        if (idx !== -1) shifts.value[idx] = updated;
      } else {
        const created = normalizeShift(await shiftsApiService.create(payload));
        shifts.value = [created, ...shifts.value];
      }
      closeModal();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.shifts.saveError");
    } finally {
      saving.value = false;
    }
  }

  function requestDelete(row) {
    openMenuId.value = null;
    deleteTarget.value = row;
    deleteMessage.value = t("admin.attendance.shifts.deleteMessage", { name: row.name });
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value || deleting.value) return;

    deleting.value = true;
    error.value = "";
    const id = deleteTarget.value.id;

    try {
      await shiftsApiService.remove(id);
      shifts.value = shifts.value.filter((s) => s.id !== id);
      deleteOpen.value = false;
      deleteTarget.value = null;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.shifts.deleteError");
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
    shifts,
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
    deleteOpen,
    deleteMessage,
    filteredShifts,
    totalPages,
    startIndex,
    endIndex,
    paginatedShifts,
    loadShifts,
    isDaySelected,
    toggleDay,
    toggleMenu,
    closeMenus,
    openAdd,
    editRow,
    closeModal,
    submitForm,
    requestDelete,
    confirmDelete,
    cancelDelete,
    formatTime12,
  };
}
