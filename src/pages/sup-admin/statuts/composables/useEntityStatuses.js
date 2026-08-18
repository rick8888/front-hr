import { computed, ref, watch } from "vue";
import { entityStatusesApiService } from "../services/entityStatuses.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";
import { useEntityStatusCatalogStore } from "../../../../stores/entityStatusCatalog.store.js";

export const STATUS_TONES = [
  { value: "success", label: "Succès (vert)" },
  { value: "warning", label: "Attention (ambre)" },
  { value: "danger", label: "Danger (rouge)" },
  { value: "info", label: "Info (bleu)" },
  { value: "secondary", label: "Secondaire" },
  { value: "neutral", label: "Neutre" },
];

export const TONE_CLASSES = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-800",
  danger: "bg-rose-50 text-rose-700",
  info: "bg-sky-50 text-sky-800",
  secondary: "bg-secondary-50 text-secondary-700",
  neutral: "bg-neutral-100 text-neutral-700",
};

function emptyForm(entityType = "") {
  return {
    entityType,
    name: "",
    nameEn: "",
    code: "",
    description: "",
    tone: "neutral",
    sortOrder: 0,
    isActive: true,
  };
}

export function useEntityStatuses() {
  const catalogs = ref([]);
  const statuses = ref([]);
  const loading = ref(true);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref("");

  const activeType = ref("leave_requests");
  const searchQuery = ref("");
  const pageSize = ref(10);
  const currentPage = ref(1);

  const modalOpen = ref(false);
  const editingStatus = ref(null);
  const form = ref(emptyForm());

  const deleteOpen = ref(false);
  const deleteTarget = ref(null);

  const currentCatalog = computed(
    () => catalogs.value.find((c) => c.type === activeType.value) || null
  );

  const filteredStatuses = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return statuses.value;
    return statuses.value.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.nameEn.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q)
    );
  });

  const pageCount = computed(() =>
    Math.max(1, Math.ceil(filteredStatuses.value.length / pageSize.value))
  );

  const paginatedStatuses = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredStatuses.value.slice(start, start + pageSize.value);
  });

  const rangeLabel = computed(() => {
    const total = filteredStatuses.value.length;
    if (!total) return { from: 0, to: 0 };
    return {
      from: (currentPage.value - 1) * pageSize.value + 1,
      to: Math.min(currentPage.value * pageSize.value, total),
    };
  });

  const stats = computed(() => ({
    total: statuses.value.length,
    active: statuses.value.filter((s) => s.isActive).length,
    system: statuses.value.filter((s) => s.isSystem).length,
  }));

  watch(activeType, () => {
    searchQuery.value = "";
    currentPage.value = 1;
    loadStatuses();
  });

  watch(searchQuery, () => {
    currentPage.value = 1;
  });

  async function loadCatalogs() {
    catalogs.value = await entityStatusesApiService.fetchCatalogs();
    if (!catalogs.value.some((c) => c.type === activeType.value) && catalogs.value[0]) {
      activeType.value = catalogs.value[0].type;
    }
  }

  async function loadStatuses() {
    loading.value = true;
    error.value = "";
    try {
      statuses.value = await entityStatusesApiService.fetchAll({
        entityType: activeType.value,
      });
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de charger les statuts.";
      statuses.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      await loadCatalogs();
      statuses.value = await entityStatusesApiService.fetchAll({
        entityType: activeType.value,
      });
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de charger les catalogues de statuts.";
    } finally {
      loading.value = false;
    }
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

  function openCreate() {
    editingStatus.value = null;
    form.value = emptyForm(activeType.value);
    modalOpen.value = true;
  }

  function openEdit(row) {
    editingStatus.value = row;
    form.value = {
      entityType: row.entityType,
      name: row.name,
      nameEn: row.nameEn,
      code: row.code,
      description: row.description,
      tone: row.tone,
      sortOrder: row.sortOrder,
      isActive: row.isActive,
    };
    modalOpen.value = true;
  }

  async function save() {
    saving.value = true;
    error.value = "";
    const payload = {
      entity_type: form.value.entityType || activeType.value,
      name: form.value.name.trim(),
      name_en: (form.value.nameEn || "").trim() || null,
      code: form.value.code.trim(),
      description: (form.value.description || "").trim() || null,
      tone: form.value.tone,
      sort_order: Number(form.value.sortOrder) || 0,
      is_active: form.value.isActive,
    };

    try {
      if (editingStatus.value?.id) {
        const updated = await entityStatusesApiService.update(
          editingStatus.value.id,
          payload
        );
        const idx = statuses.value.findIndex((s) => s.id === updated.id);
        if (idx !== -1) statuses.value[idx] = updated;
      } else {
        const created = await entityStatusesApiService.create(payload);
        statuses.value = [...statuses.value, created].sort(
          (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
        );
      }
      modalOpen.value = false;
      await loadCatalogs();
      await useEntityStatusCatalogStore().load({ force: true });
    } catch (e) {
      error.value = parseApiError(e) || "Impossible d'enregistrer le statut.";
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function toggleActive(row) {
    saving.value = true;
    error.value = "";
    try {
      const updated = await entityStatusesApiService.toggleStatus(row.id, !row.isActive);
      const idx = statuses.value.findIndex((s) => s.id === row.id);
      if (idx !== -1) statuses.value[idx] = updated;
      await loadCatalogs();
      await useEntityStatusCatalogStore().load({ force: true });
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de modifier l'activation.";
    } finally {
      saving.value = false;
    }
  }

  function requestDelete(row) {
    deleteTarget.value = row;
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value || deleting.value) return;
    deleting.value = true;
    error.value = "";
    try {
      await entityStatusesApiService.remove(deleteTarget.value.id);
      statuses.value = statuses.value.filter((s) => s.id !== deleteTarget.value.id);
      deleteOpen.value = false;
      deleteTarget.value = null;
      await loadCatalogs();
      await useEntityStatusCatalogStore().load({ force: true });
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de supprimer le statut.";
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
    catalogs,
    statuses,
    loading,
    saving,
    deleting,
    error,
    activeType,
    currentCatalog,
    searchQuery,
    pageSize,
    currentPage,
    filteredStatuses,
    paginatedStatuses,
    pageCount,
    rangeLabel,
    stats,
    modalOpen,
    editingStatus,
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
