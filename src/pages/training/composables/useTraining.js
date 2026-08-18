import { computed, onMounted, ref } from "vue";
import {
  trainingsApiService,
  trainingEnrollmentsApiService,
} from "../services/trainings.api.service.js";
import {
  TRAINING_CATEGORY_OPTIONS,
  fallbackTrainingCategories,
  trainingCategoriesApiService,
  trainingCategoryLabel,
} from "../services/trainingCategories.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import {
  catalogStatusClass,
  catalogStatusLabel,
  useEntityStatusCatalogStore,
} from "../../../stores/entityStatusCatalog.store.js";

export { TRAINING_CATEGORY_OPTIONS };

const CATEGORY_CLASS = {
  technical: "bg-blue-100 text-blue-700",
  management: "bg-purple-100 text-purple-700",
  soft_skills: "bg-green-100 text-green-700",
  sales: "bg-orange-100 text-orange-700",
  compliance: "bg-red-100 text-red-700",
};

function resolveFileUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

function normalizeCategory(raw) {
  return String(raw || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function normalizeTraining(raw = {}, catalog = []) {
  const category = normalizeCategory(raw.category);
  return {
    id: raw.id,
    name: raw.name || "—",
    category,
    categoryLabel: trainingCategoryLabel(category, catalog),
    description: raw.description || "",
    duration: raw.duration || "—",
    enrolled: Number(raw.enrolled ?? 0),
    startDate: raw.start_date ?? raw.startDate ?? null,
    endDate: raw.end_date ?? raw.endDate ?? null,
    objectives: Array.isArray(raw.objectives) ? raw.objectives : [],
    status: raw.status || "published",
  };
}

export function normalizeEnrollment(raw = {}, catalog = []) {
  const training = normalizeTraining(raw.training || {}, catalog);
  const status = String(raw.status || "enrolled").toLowerCase();

  return {
    id: raw.id,
    enrollmentId: raw.id,
    trainingId: raw.training_id ?? raw.trainingId ?? training.id,
    name: training.name,
    category: training.category,
    categoryLabel: training.categoryLabel,
    description: training.description,
    duration: training.duration,
    objectives: training.objectives,
    enrolled: training.enrolled,
    startDate: training.startDate,
    endDate: training.endDate,
    progress: Number(raw.progress ?? 0),
    status,
    score: raw.score || null,
    certificate: !!(raw.certificate || raw.certificate_url || raw.certificateUrl),
    certificateUrl: resolveFileUrl(raw.certificate_url ?? raw.certificateUrl),
    completedDate: raw.completed_at ?? raw.completedAt ?? null,
  };
}

export function getCategoryClass(category) {
  return CATEGORY_CLASS[normalizeCategory(category)] || "bg-neutral-100 text-neutral-700";
}

export function getCategoryLabel(category, catalog = []) {
  return trainingCategoryLabel(normalizeCategory(category), catalog);
}

function labelFromCatalogs(status, types, fallbackMap = {}) {
  const store = useEntityStatusCatalogStore();
  for (const type of types) {
    if (store.find(type, status)) return store.label(type, status);
  }
  return fallbackMap[status] || catalogStatusLabel(types[0], status, status);
}

function classFromCatalogs(status, types) {
  const store = useEntityStatusCatalogStore();
  for (const type of types) {
    if (store.find(type, status)) return store.pillClass(type, status);
  }
  return catalogStatusClass(types[0], status);
}

export function getStatusClass(status) {
  return classFromCatalogs(status, ["training_enrollments", "trainings"]);
}

export function getStatusLabel(status) {
  return labelFromCatalogs(status, ["training_enrollments", "trainings"], {
    enrolled: "Inscrit",
    in_progress: "En cours",
    completed: "Terminé",
    draft: "Brouillon",
    published: "Publié",
    archived: "Archivé",
    cancelled: "Annulé",
  });
}

export function formatTrainingDate(date) {
  if (!date) return "";
  const d = new Date(typeof date === "string" && !date.includes("T") ? `${date}T12:00:00` : date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function useTraining() {
  const activeTab = ref("available");
  const filterCategory = ref("");
  const categoryCatalog = ref(fallbackTrainingCategories());
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");

  const availableTrainings = ref([]);
  const myTrainings = ref([]);
  const completedTrainings = ref([]);

  const categoryOptions = computed(() =>
    categoryCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  const enrolledTrainingIds = computed(() =>
    new Set(myTrainings.value.map((t) => t.trainingId))
  );

  const filteredAvailableTrainings = computed(() => {
    return availableTrainings.value.filter((t) => {
      if (enrolledTrainingIds.value.has(t.id)) return false;
      if (filterCategory.value && t.category !== filterCategory.value) return false;
      return true;
    });
  });

  function getTrainingCount(tabId) {
    switch (tabId) {
      case "available":
        return filteredAvailableTrainings.value.length;
      case "my-trainings":
        return myTrainings.value.length;
      case "history":
        return completedTrainings.value.length;
      default:
        return 0;
    }
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const [catalogue, enrollments, categories] = await Promise.all([
        trainingsApiService.fetchAll({ status: "published", active: 1 }),
        trainingEnrollmentsApiService.fetchAll({ mine: 1 }),
        trainingCategoriesApiService.fetchAll({ activeOnly: true }).catch(() => []),
      ]);

      categoryCatalog.value = categories.length ? categories : fallbackTrainingCategories();

      availableTrainings.value = catalogue.map((row) =>
        normalizeTraining(row, categoryCatalog.value)
      );

      const active = [];
      const history = [];
      for (const raw of enrollments) {
        const row = normalizeEnrollment(raw, categoryCatalog.value);
        if (row.status === "cancelled") continue;
        if (row.status === "completed") history.push(row);
        else active.push(row);
      }
      myTrainings.value = active;
      completedTrainings.value = history;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger les formations.";
      availableTrainings.value = [];
      myTrainings.value = [];
      completedTrainings.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function enroll(trainingId) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await trainingEnrollmentsApiService.enroll(trainingId);
      await loadData();
      activeTab.value = "my-trainings";
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de s'inscrire à cette formation.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function cancelEnrollment(enrollmentId) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await trainingEnrollmentsApiService.cancel(enrollmentId);
      await loadData();
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible d'annuler l'inscription.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  onMounted(loadData);

  return {
    activeTab,
    filterCategory,
    loading,
    saving,
    error,
    availableTrainings,
    myTrainings,
    completedTrainings,
    filteredAvailableTrainings,
    categoryOptions,
    getTrainingCount,
    getCategoryClass,
    getCategoryLabel: (category) => getCategoryLabel(category, categoryCatalog.value),
    getStatusClass,
    getStatusLabel,
    formatDate: formatTrainingDate,
    enroll,
    cancelEnrollment,
    loadData,
  };
}
