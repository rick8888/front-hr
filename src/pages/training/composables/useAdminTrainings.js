import { computed, onMounted, ref } from "vue";
import { trainingsApiService } from "../services/trainings.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import {
  fallbackTrainingCategories,
  trainingCategoriesApiService,
  trainingCategoryLabel,
} from "../services/trainingCategories.api.service.js";

function normalizeCategory(raw) {
  return String(raw || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function emptyForm(defaultCategory = "technical") {
  return {
    name: "",
    category: defaultCategory,
    duration: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "published",
  };
}

function toApiStatus(uiStatus) {
  const s = String(uiStatus || "").toLowerCase();
  if (s === "active" || s === "published") return "published";
  if (s === "draft") return "draft";
  if (s === "archived") return "archived";
  return "published";
}

export function normalizeAdminTraining(raw = {}, catalog = []) {
  const category = normalizeCategory(raw.category);
  const apiStatus = String(raw.status || "published").toLowerCase();
  const active = raw.active ?? raw.is_active ?? true;

  return {
    id: raw.id,
    name: raw.name || "—",
    category,
    categoryLabel: trainingCategoryLabel(category, catalog),
    duration: raw.duration || "—",
    description: raw.description || "",
    startDate: raw.start_date ?? raw.startDate ?? "",
    endDate: raw.end_date ?? raw.endDate ?? "",
    objectives: Array.isArray(raw.objectives) ? raw.objectives : [],
    enrolled: Number(raw.enrolled ?? 0),
    status: apiStatus,
    statusLabel:
      apiStatus === "published" && active
        ? "Active"
        : apiStatus === "draft"
          ? "Draft"
          : apiStatus === "archived"
            ? "Archivée"
            : apiStatus,
    isActive: !!active,
  };
}

function toApiPayload(form) {
  return {
    name: form.name.trim(),
    category: form.category,
    duration: form.duration.trim() || null,
    description: form.description.trim() || null,
    start_date: form.startDate || null,
    end_date: form.endDate || null,
    status: toApiStatus(form.status),
    is_active: true,
  };
}

export function useAdminTrainings() {
  const trainings = ref([]);
  const categoryCatalog = ref(fallbackTrainingCategories());
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const categoryFilter = ref("");
  const isModalOpen = ref(false);
  const editingTraining = ref(null);
  const form = ref(emptyForm());

  const categoryOptions = computed(() =>
    categoryCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  const defaultCategory = computed(
    () => categoryOptions.value[0]?.value || "technical"
  );

  const filteredTrainings = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return trainings.value.filter((training) => {
      const matchesSearch =
        !query ||
        [training.name, training.categoryLabel, training.duration]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(query));
      const matchesCategory =
        !categoryFilter.value || training.category === categoryFilter.value;
      return matchesSearch && matchesCategory;
    });
  });

  const activeTrainingsCount = computed(
    () =>
      trainings.value.filter(
        (t) => t.status === "published" && t.isActive
      ).length
  );
  const draftTrainingsCount = computed(
    () => trainings.value.filter((t) => t.status === "draft").length
  );
  const totalEnrollments = computed(() =>
    trainings.value.reduce((sum, t) => sum + Number(t.enrolled || 0), 0)
  );

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const [list, categories] = await Promise.all([
        trainingsApiService.fetchAll(),
        trainingCategoriesApiService.fetchAll({ activeOnly: true }).catch(() => []),
      ]);
      categoryCatalog.value = categories.length ? categories : fallbackTrainingCategories();
      trainings.value = list.map((row) =>
        normalizeAdminTraining(row, categoryCatalog.value)
      );
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger les formations.";
      trainings.value = [];
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    form.value = emptyForm(defaultCategory.value);
  }

  function openAddTrainingModal() {
    editingTraining.value = null;
    resetForm();
    isModalOpen.value = true;
  }

  function editTraining(training) {
    editingTraining.value = training;
    form.value = {
      name: training.name,
      category: training.category,
      duration: training.duration === "—" ? "" : training.duration,
      description: training.description || "",
      startDate: training.startDate || "",
      endDate: training.endDate || "",
      status: training.status === "draft" ? "draft" : "published",
    };
    isModalOpen.value = true;
  }

  function closeModal() {
    if (saving.value) return;
    isModalOpen.value = false;
    editingTraining.value = null;
    resetForm();
  }

  async function saveTraining() {
    if (!form.value.name.trim()) {
      error.value = "Le nom de la formation est obligatoire.";
      return false;
    }
    if (saving.value) return false;

    saving.value = true;
    error.value = "";
    try {
      const payload = toApiPayload(form.value);
      if (editingTraining.value) {
        await trainingsApiService.update(editingTraining.value.id, payload);
      } else {
        await trainingsApiService.create(payload);
      }
      await loadData();
      closeModal();
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible d'enregistrer la formation.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function deleteTraining(id) {
    if (!confirm("Supprimer cette formation ?")) return false;
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await trainingsApiService.remove(id);
      await loadData();
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de supprimer la formation.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  onMounted(loadData);

  return {
    trainings,
    loading,
    saving,
    error,
    searchQuery,
    categoryFilter,
    isModalOpen,
    editingTraining,
    form,
    filteredTrainings,
    activeTrainingsCount,
    draftTrainingsCount,
    totalEnrollments,
    categoryOptions,
    openAddTrainingModal,
    editTraining,
    closeModal,
    saveTraining,
    deleteTraining,
    loadData,
  };
}
