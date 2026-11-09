import { computed, onMounted, ref } from "vue";
import { documentTemplatesApiService } from "../../../employees/services/documentTemplates.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";
import { useI18n } from "../../../../i18n/index.js";

export function useDocumentTemplatesSettings(options = {}) {
  const { t } = useI18n();
  const platformOnly = options.platformOnly === true;
  const allowDuplicate = options.allowDuplicate !== false && !platformOnly;

  const templates = ref([]);
  const variables = ref([]);
  const loading = ref(false);
  const error = ref("");
  const searchQuery = ref("");
  const familyFilter = ref(options.initialFamilyFilter || "all");
  const channelFilter = ref(options.initialChannelFilter || "all");
  const currentPage = ref(1);
  const pageSize = ref(10);

  const formOpen = ref(false);
  const editingTemplate = ref(null);
  const saving = ref(false);
  const deleteTarget = ref(null);
  const deleteOpen = ref(false);

  const stats = computed(() => {
    const list = templates.value;
    return {
      total: list.length,
      published: list.filter((x) => x.status === "published").length,
      system: list.filter((x) => x.isSystem).length,
    };
  });

  const filteredTemplates = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    return templates.value.filter((row) => {
      if (familyFilter.value !== "all" && row.family !== familyFilter.value) return false;
      if (channelFilter.value !== "all" && row.channel !== channelFilter.value) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q) ||
        row.family.toLowerCase().includes(q)
      );
    });
  });

  const pageCount = computed(() =>
    Math.max(1, Math.ceil(filteredTemplates.value.length / pageSize.value)),
  );

  const paginatedTemplates = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredTemplates.value.slice(start, start + pageSize.value);
  });

  const rangeLabel = computed(() => {
    const total = filteredTemplates.value.length;
    if (!total) return { from: 0, to: 0 };
    const from = (currentPage.value - 1) * pageSize.value + 1;
    const to = Math.min(currentPage.value * pageSize.value, total);
    return { from, to };
  });

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      const [list, vars] = await Promise.all([
        documentTemplatesApiService.fetchAll(),
        documentTemplatesApiService.fetchVariables(),
      ]);
      templates.value = list;
      variables.value = vars;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.employees.documentTemplates.loadError");
    } finally {
      loading.value = false;
    }
  }

  function openCreate() {
    editingTemplate.value = null;
    formOpen.value = true;
  }

  function openEdit(row) {
    editingTemplate.value = { ...row };
    formOpen.value = true;
  }

  async function saveForm(form) {
    saving.value = true;
    error.value = "";
    try {
      const payload = {
        name: form.name,
        code: form.code,
        family: form.family,
        channel: form.channel,
        locale: form.locale || "fr",
        subject: form.subject || null,
        body_html: form.bodyHtml,
        document_category_code: form.documentCategoryCode || null,
        sort_order: form.sortOrder ?? 0,
        is_active: form.isActive !== false,
      };

      if (editingTemplate.value?.id) {
        const updated = await documentTemplatesApiService.update(editingTemplate.value.id, payload);
        templates.value = templates.value.map((x) => (x.id === updated.id ? updated : x));
      } else {
        const created = await documentTemplatesApiService.create(payload);
        templates.value = [...templates.value, created];
      }
      formOpen.value = false;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.employees.documentTemplates.saveError");
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function publishTemplate(row) {
    error.value = "";
    try {
      const updated = await documentTemplatesApiService.publish(row.id);
      templates.value = templates.value.map((x) => (x.id === updated.id ? updated : x));
    } catch (e) {
      error.value = parseApiError(e) || t("admin.employees.documentTemplates.publishError");
    }
  }

  async function duplicateTemplate(row) {
    if (!allowDuplicate) return;
    error.value = "";
    try {
      const copy = await documentTemplatesApiService.duplicate(row.id);
      templates.value = [...templates.value, copy];
    } catch (e) {
      error.value = parseApiError(e) || t("admin.employees.documentTemplates.duplicateError");
    }
  }

  function askDelete(row) {
    deleteTarget.value = row;
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value) return;
    error.value = "";
    try {
      await documentTemplatesApiService.remove(deleteTarget.value.id);
      templates.value = templates.value.filter((x) => x.id !== deleteTarget.value.id);
      deleteOpen.value = false;
      deleteTarget.value = null;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.employees.documentTemplates.deleteError");
    }
  }

  onMounted(load);

  return {
    templates,
    variables,
    loading,
    error,
    searchQuery,
    familyFilter,
    channelFilter,
    currentPage,
    pageSize,
    formOpen,
    editingTemplate,
    saving,
    deleteTarget,
    deleteOpen,
    stats,
    filteredTemplates,
    pageCount,
    paginatedTemplates,
    rangeLabel,
    platformOnly,
    allowDuplicate,
    load,
    openCreate,
    openEdit,
    saveForm,
    publishTemplate,
    duplicateTemplate,
    askDelete,
    confirmDelete,
  };
}
