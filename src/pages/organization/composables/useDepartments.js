import { ref, computed, watch } from "vue";
import { departmentsApiService } from "../services/departments.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

function normalizeDepartment(raw) {
  return {
    id: raw.id,
    name: raw.name,
    code: raw.code,
    parentId: raw.parent_department_id ?? raw.parentId ?? null,
    description: raw.description ?? "",
    active: !!raw.active,
  };
}

function emptyForm() {
  return {
    name: "",
    code: "",
    parentId: null,
    description: "",
    active: true,
  };
}

export function useDepartments() {
  const { t } = useI18n();
  const departments = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const pageSize = ref(25);
  const currentPage = ref(1);
  const openMenuId = ref(null);

  const modalOpen = ref(false);
  const editingId = ref(null);
  const form = ref(emptyForm());

  const deleteOpen = ref(false);
  const deleteTarget = ref(null);
  const deleteMessage = ref("");

  const parentOptions = computed(() =>
    [...departments.value].sort((a, b) => a.name.localeCompare(b.name))
  );

  const filteredDepartments = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return departments.value;
    return departments.value.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.code || "").toLowerCase().includes(q) ||
        (d.description || "").toLowerCase().includes(q) ||
        parentNameFor(d).toLowerCase().includes(q)
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredDepartments.value.length / pageSize.value))
  );

  const startIndex = computed(() =>
    filteredDepartments.value.length === 0
      ? 0
      : (currentPage.value - 1) * pageSize.value
  );

  const endIndex = computed(() =>
    Math.min(currentPage.value * pageSize.value, filteredDepartments.value.length)
  );

  const paginatedDepartments = computed(() =>
    filteredDepartments.value.slice(startIndex.value, endIndex.value)
  );

  watch([searchQuery, pageSize], () => {
    currentPage.value = 1;
  });

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) currentPage.value = pages;
  });

  function parentNameFor(dept) {
    if (!dept.parentId) return "No Parent";
    return departments.value.find((d) => d.id === dept.parentId)?.name || "No Parent";
  }

  function nextCode() {
    const nums = departments.value
      .map((d) => Number((d.code || "").replace(/\D/g, "")))
      .filter((n) => !Number.isNaN(n) && n < 10000);
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `DEPT-${String(next).padStart(3, "0")}`;
  }

  async function loadDepartments() {
    loading.value = true;
    error.value = "";
    try {
      const list = await departmentsApiService.fetchAll();
      departments.value = list.map(normalizeDepartment);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.departments.loadError");
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

  function openAddDepartment() {
    editingId.value = null;
    form.value = { ...emptyForm(), code: nextCode() };
    modalOpen.value = true;
  }

  function editDepartment(dept) {
    editingId.value = dept.id;
    form.value = {
      name: dept.name,
      code: dept.code,
      parentId: dept.parentId ?? null,
      description: dept.description || "",
      active: !!dept.active,
    };
    openMenuId.value = null;
    modalOpen.value = true;
  }

  function closeModal() {
    modalOpen.value = false;
    editingId.value = null;
  }

  async function submitForm() {
    if (!form.value.name.trim() || saving.value) return;

    saving.value = true;
    error.value = "";
    const payload = {
      name: form.value.name.trim(),
      code: form.value.code.trim() || undefined,
      parent_department_id: form.value.parentId || null,
      description: form.value.description.trim() || null,
      active: !!form.value.active,
    };

    try {
      if (editingId.value) {
        const updated = normalizeDepartment(
          await departmentsApiService.update(editingId.value, payload)
        );
        const idx = departments.value.findIndex((d) => d.id === editingId.value);
        if (idx !== -1) departments.value[idx] = updated;
      } else {
        const created = normalizeDepartment(
          await departmentsApiService.create(payload)
        );
        departments.value = [...departments.value, created].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }
      closeModal();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.departments.saveError");
    } finally {
      saving.value = false;
    }
  }

  async function toggleActive(dept) {
    openMenuId.value = null;
    error.value = "";
    try {
      const updated = normalizeDepartment(
        await departmentsApiService.toggleStatus(dept.id)
      );
      const idx = departments.value.findIndex((d) => d.id === dept.id);
      if (idx !== -1) departments.value[idx] = updated;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.statusError");
    }
  }

  function requestDelete(dept) {
    openMenuId.value = null;
    deleteTarget.value = dept;
    deleteMessage.value = t("admin.org.departments.deleteMessage", { name: dept.name });
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value || deleting.value) return;

    deleting.value = true;
    error.value = "";
    const id = deleteTarget.value.id;

    try {
      await departmentsApiService.remove(id);
      departments.value = departments.value
        .filter((d) => d.id !== id)
        .map((d) => (d.parentId === id ? { ...d, parentId: null } : d));
      deleteOpen.value = false;
      deleteTarget.value = null;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.departments.deleteError");
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
    departments,
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
    parentOptions,
    filteredDepartments,
    totalPages,
    startIndex,
    endIndex,
    paginatedDepartments,
    parentNameFor,
    loadDepartments,
    toggleMenu,
    closeMenus,
    openAddDepartment,
    editDepartment,
    closeModal,
    submitForm,
    toggleActive,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
