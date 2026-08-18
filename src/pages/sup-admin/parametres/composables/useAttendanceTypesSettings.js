import { ref, computed } from "vue";
import { attendanceTypesApiService } from "../../../attendance/services/attendanceTypes.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";
import { useI18n } from "../../../../i18n/index.js";

function emptyForm() {
  return {
    name: "",
    code: "",
    description: "",
    sortOrder: 0,
    isActive: true,
  };
}

export function useAttendanceTypesSettings() {
  const { t } = useI18n();
  const types = ref([]);
  const loading = ref(true);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const pageSize = ref(10);
  const currentPage = ref(1);

  const modalOpen = ref(false);
  const editingType = ref(null);
  const form = ref(emptyForm());

  const deleteOpen = ref(false);
  const deleteTarget = ref(null);

  const filteredTypes = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return types.value;
    return types.value.filter(
      (type) =>
        type.name.toLowerCase().includes(q) ||
        type.code.toLowerCase().includes(q) ||
        type.description.toLowerCase().includes(q)
    );
  });

  const pageCount = computed(() =>
    Math.max(1, Math.ceil(filteredTypes.value.length / pageSize.value))
  );

  const paginatedTypes = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredTypes.value.slice(start, start + pageSize.value);
  });

  const rangeLabel = computed(() => {
    const total = filteredTypes.value.length;
    if (!total) return { from: 0, to: 0 };
    return {
      from: (currentPage.value - 1) * pageSize.value + 1,
      to: Math.min(currentPage.value * pageSize.value, total),
    };
  });

  const stats = computed(() => ({
    total: types.value.length,
    active: types.value.filter((t) => t.isActive).length,
    system: types.value.filter((t) => t.isSystem).length,
  }));

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      types.value = await attendanceTypesApiService.fetchAll();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.types.loadError");
    } finally {
      loading.value = false;
    }
  }

  function openCreate() {
    editingType.value = null;
    form.value = emptyForm();
    modalOpen.value = true;
  }

  function openEdit(type) {
    editingType.value = type;
    form.value = {
      name: type.name,
      code: type.code,
      description: type.description,
      sortOrder: type.sortOrder,
      isActive: type.isActive,
    };
    modalOpen.value = true;
  }

  function slugify(value) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  async function save() {
    saving.value = true;
    error.value = "";
    const payload = {
      name: form.value.name.trim(),
      code: form.value.code.trim(),
      description: form.value.description.trim() || null,
      sort_order: Number(form.value.sortOrder) || 0,
      is_active: form.value.isActive,
    };

    try {
      if (editingType.value?.id) {
        const updated = await attendanceTypesApiService.update(editingType.value.id, payload);
        const idx = types.value.findIndex((t) => t.id === updated.id);
        if (idx !== -1) types.value[idx] = updated;
      } else {
        const created = await attendanceTypesApiService.create(payload);
        types.value = [...types.value, created].sort(
          (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
        );
      }
      modalOpen.value = false;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.types.saveError");
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function toggleActive(type) {
    saving.value = true;
    error.value = "";
    try {
      const updated = await attendanceTypesApiService.toggleStatus(type.id, !type.isActive);
      const idx = types.value.findIndex((t) => t.id === type.id);
      if (idx !== -1) types.value[idx] = updated;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.types.statusError");
    } finally {
      saving.value = false;
    }
  }

  function requestDelete(type) {
    deleteTarget.value = type;
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value || deleting.value) return;
    deleting.value = true;
    error.value = "";
    try {
      await attendanceTypesApiService.remove(deleteTarget.value.id);
      types.value = types.value.filter((t) => t.id !== deleteTarget.value.id);
      deleteOpen.value = false;
      deleteTarget.value = null;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.attendance.types.deleteError");
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
    types,
    loading,
    saving,
    deleting,
    error,
    searchQuery,
    pageSize,
    currentPage,
    filteredTypes,
    paginatedTypes,
    pageCount,
    rangeLabel,
    stats,
    modalOpen,
    editingType,
    form,
    deleteOpen,
    deleteTarget,
    load,
    openCreate,
    openEdit,
    slugify,
    save,
    toggleActive,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
