import { computed, onMounted, ref } from "vue";
import {
  equipmentsApiService,
  equipmentRequestsApiService,
  equipmentAssignmentsApiService,
} from "../services/equipments.api.service.js";
import {
  EQUIPMENT_CATEGORY_OPTIONS,
  fallbackEquipmentCategories,
  equipmentCategoriesApiService,
  equipmentCategoryLabel,
} from "../services/equipmentCategories.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import {
  catalogStatusClass,
  catalogStatusLabel,
  useEntityStatusCatalogStore,
} from "../../../stores/entityStatusCatalog.store.js";

export { EQUIPMENT_CATEGORY_OPTIONS };

const CATEGORY_CLASS = {
  laptop: "bg-blue-100 text-blue-700",
  desktop: "bg-indigo-100 text-indigo-700",
  monitor: "bg-purple-100 text-purple-700",
  phone: "bg-green-100 text-green-700",
  tablet: "bg-yellow-100 text-yellow-700",
  accessories: "bg-orange-100 text-orange-700",
  furniture: "bg-pink-100 text-pink-700",
  other: "bg-neutral-100 text-neutral-700",
};

function normalizeCategory(raw) {
  return String(raw || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function normalizeEquipment(raw = {}) {
  const category = normalizeCategory(raw.category);
  return {
    id: raw.id,
    name: raw.name || "—",
    category,
    description: raw.description || "",
    stock: Number(raw.stock ?? 0),
    brand: raw.brand || "",
    model: raw.model || "",
    specifications: Array.isArray(raw.specifications) ? raw.specifications : [],
  };
}

export function normalizeEquipmentRequest(raw = {}) {
  return {
    id: raw.id,
    equipmentId: raw.equipment_id ?? raw.equipmentId ?? raw.equipment?.id,
    equipmentName: raw.equipment_name ?? raw.equipmentName ?? raw.equipment?.name ?? "—",
    quantity: Number(raw.quantity ?? 1),
    requestDate: raw.request_date ?? raw.requestDate ?? raw.created_at?.slice?.(0, 10) ?? "",
    status: String(raw.status || "pending").toLowerCase(),
    priority: String(raw.priority || "medium").toLowerCase(),
    expectedDate: raw.expected_date ?? raw.expectedDate ?? null,
    reason: raw.reason || "",
    rejectReason: raw.reject_reason ?? raw.rejectReason ?? null,
  };
}

export function normalizeEquipmentAssignment(raw = {}) {
  const equipment = raw.equipment || {};
  const category = normalizeCategory(raw.category ?? equipment.category);
  return {
    id: raw.id,
    name: raw.name || equipment.name || "—",
    category,
    brand: raw.brand || equipment.brand || "",
    model: raw.model || equipment.model || "",
    serialNumber: raw.serial_number ?? raw.serialNumber ?? "",
    assignedDate: raw.assigned_date ?? raw.assignedDate ?? "",
    status: String(raw.status || "assigned").toLowerCase(),
    issueNote: raw.issue_note ?? raw.issueNote ?? null,
    description: equipment.description || "",
    specifications: Array.isArray(equipment.specifications)
      ? equipment.specifications
      : [],
  };
}

export function getCategoryClass(category) {
  return CATEGORY_CLASS[normalizeCategory(category)] || "bg-neutral-100 text-neutral-700";
}

export function getCategoryLabel(category, catalog = []) {
  return equipmentCategoryLabel(normalizeCategory(category), catalog);
}

export function getStatusClass(status) {
  const store = useEntityStatusCatalogStore();
  if (store.find("equipment_requests", status)) {
    return store.pillClass("equipment_requests", status);
  }
  if (store.find("equipment_assignments", status)) {
    return store.pillClass("equipment_assignments", status);
  }
  return catalogStatusClass("equipment_requests", status);
}

export function getStatusLabel(status) {
  const store = useEntityStatusCatalogStore();
  const fallback = {
    pending: "En attente",
    approved: "Approuvée",
    rejected: "Refusée",
    cancelled: "Annulée",
    assigned: "Attribué",
    returned: "Retourné",
  };
  if (store.find("equipment_requests", status)) {
    return store.label("equipment_requests", status);
  }
  if (store.find("equipment_assignments", status)) {
    return store.label("equipment_assignments", status);
  }
  return fallback[status] || catalogStatusLabel("equipment_requests", status, status);
}

export function getPriorityLabel(priority) {
  const labels = { low: "Faible", medium: "Moyenne", high: "Élevée" };
  return labels[priority] || priority;
}

export function formatEquipmentDate(date) {
  if (!date) return "";
  const d = new Date(
    typeof date === "string" && !date.includes("T") ? `${date}T12:00:00` : date
  );
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function useEquipment() {
  const activeTab = ref("available");
  const filterCategory = ref("");
  const categoryCatalog = ref(fallbackEquipmentCategories());
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");

  const availableEquipment = ref([]);
  const myRequests = ref([]);
  const myEquipment = ref([]);

  const categoryOptions = computed(() =>
    categoryCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  const filteredAvailableEquipment = computed(() => {
    if (!filterCategory.value) return availableEquipment.value;
    return availableEquipment.value.filter(
      (e) => e.category === filterCategory.value
    );
  });

  function getEquipmentCount(tabId) {
    switch (tabId) {
      case "available":
        return filteredAvailableEquipment.value.length;
      case "my-requests":
        return myRequests.value.length;
      case "my-equipment":
        return myEquipment.value.length;
      default:
        return 0;
    }
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const [catalogue, requests, assignments, categories] = await Promise.all([
        equipmentsApiService.fetchAll({ active: 1 }),
        equipmentRequestsApiService.fetchAll({ mine: 1 }),
        equipmentAssignmentsApiService.fetchAll({ mine: 1 }),
        equipmentCategoriesApiService.fetchAll({ activeOnly: true }).catch(() => []),
      ]);

      categoryCatalog.value = categories.length ? categories : fallbackEquipmentCategories();

      availableEquipment.value = catalogue.map(normalizeEquipment);
      myRequests.value = requests
        .map(normalizeEquipmentRequest)
        .filter((r) => r.status !== "cancelled");
      myEquipment.value = assignments.map(normalizeEquipmentAssignment);
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger les équipements.";
      availableEquipment.value = [];
      myRequests.value = [];
      myEquipment.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function createRequest(payload) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await equipmentRequestsApiService.create(payload);
      await loadData();
      activeTab.value = "my-requests";
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de soumettre la demande.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function cancelRequest(id) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await equipmentRequestsApiService.cancel(id);
      await loadData();
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible d'annuler la demande.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function reportIssue(id, note) {
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await equipmentAssignmentsApiService.reportIssue(id, note);
      await loadData();
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de signaler le problème.";
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
    availableEquipment,
    myRequests,
    myEquipment,
    filteredAvailableEquipment,
    categoryOptions,
    getEquipmentCount,
    getCategoryClass,
    getCategoryLabel: (category) => getCategoryLabel(category, categoryCatalog.value),
    getStatusClass,
    getStatusLabel,
    getPriorityLabel,
    formatDate: formatEquipmentDate,
    createRequest,
    cancelRequest,
    reportIssue,
    loadData,
  };
}
