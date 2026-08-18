import { ref, computed, watch } from "vue";
import { departmentsApiService } from "../services/departments.api.service.js";
import { designationsApiService } from "../services/designations.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

function normalizeDesignation(raw) {
  return {
    id: raw.id,
    name: raw.name,
    code: raw.code,
    departmentId: raw.department_id ?? raw.departmentId ?? null,
    description: raw.description ?? "",
    active: !!raw.active,
  };
}

function emptyForm() {
  return {
    name: "",
    code: "",
    departmentId: null,
    description: "",
    active: true,
  };
}

export function useDesignations() {
  const { t } = useI18n();
  const departments = ref([]);
  const designations = ref([]);
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

  const filteredDesignations = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return designations.value;
    return designations.value.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.code || "").toLowerCase().includes(q) ||
        (d.description || "").toLowerCase().includes(q) ||
        departmentNameFor(d).toLowerCase().includes(q)
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredDesignations.value.length / pageSize.value))
  );

  const startIndex = computed(() =>
    filteredDesignations.value.length === 0
      ? 0
      : (currentPage.value - 1) * pageSize.value
  );

  const endIndex = computed(() =>
    Math.min(currentPage.value * pageSize.value, filteredDesignations.value.length)
  );

  const paginatedDesignations = computed(() =>
    filteredDesignations.value.slice(startIndex.value, endIndex.value)
  );

  watch([searchQuery, pageSize], () => {
    currentPage.value = 1;
  });

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) currentPage.value = pages;
  });

  function departmentNameFor(desig) {
    if (!desig.departmentId) return "—";
    return departments.value.find((d) => d.id === desig.departmentId)?.name || "—";
  }

  function nextCode() {
    const nums = designations.value
      .map((d) => Number((d.code || "").replace(/\D/g, "")))
      .filter((n) => !Number.isNaN(n) && n < 10000);
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `DES-${String(next).padStart(3, "0")}`;
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const [deptList, desigList] = await Promise.all([
        departmentsApiService.fetchAll(),
        designationsApiService.fetchAll(),
      ]);
      departments.value = deptList;
      designations.value = desigList.map(normalizeDesignation);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.designations.loadError");
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

  function openAddDesignation() {
    editingId.value = null;
    form.value = { ...emptyForm(), code: nextCode() };
    modalOpen.value = true;
  }

  function editDesignation(desig) {
    editingId.value = desig.id;
    form.value = {
      name: desig.name,
      code: desig.code,
      departmentId: desig.departmentId ?? null,
      description: desig.description || "",
      active: !!desig.active,
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
      department_id: form.value.departmentId || null,
      description: form.value.description.trim() || null,
      active: !!form.value.active,
    };

    try {
      if (editingId.value) {
        const updated = normalizeDesignation(
          await designationsApiService.update(editingId.value, payload)
        );
        const idx = designations.value.findIndex((d) => d.id === editingId.value);
        if (idx !== -1) designations.value[idx] = updated;
      } else {
        const created = normalizeDesignation(
          await designationsApiService.create(payload)
        );
        designations.value = [created, ...designations.value];
      }
      closeModal();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.designations.saveError");
    } finally {
      saving.value = false;
    }
  }

  async function toggleActive(desig) {
    openMenuId.value = null;
    error.value = "";
    try {
      const updated = normalizeDesignation(
        await designationsApiService.toggleStatus(desig.id)
      );
      const idx = designations.value.findIndex((d) => d.id === desig.id);
      if (idx !== -1) designations.value[idx] = updated;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.statusError");
    }
  }

  function requestDelete(desig) {
    openMenuId.value = null;
    deleteTarget.value = desig;
    deleteMessage.value = t("admin.org.designations.deleteMessage", { name: desig.name });
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value || deleting.value) return;

    deleting.value = true;
    error.value = "";
    const id = deleteTarget.value.id;

    try {
      await designationsApiService.remove(id);
      designations.value = designations.value.filter((d) => d.id !== id);
      deleteOpen.value = false;
      deleteTarget.value = null;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.designations.deleteError");
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
    designations,
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
    filteredDesignations,
    totalPages,
    startIndex,
    endIndex,
    paginatedDesignations,
    departmentNameFor,
    loadData,
    toggleMenu,
    closeMenus,
    openAddDesignation,
    editDesignation,
    closeModal,
    submitForm,
    toggleActive,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
