import { computed, onMounted, ref } from "vue";
import { equipmentsApiService } from "../services/equipments.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import {
  fallbackEquipmentCategories,
  equipmentCategoriesApiService,
  equipmentCategoryLabel,
} from "../services/equipmentCategories.api.service.js";

function normalizeCategory(raw) {
  return String(raw || "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function emptyForm(defaultCategory = "laptop") {
  return {
    name: "",
    category: defaultCategory,
    description: "",
    stock: 0,
    brand: "",
    model: "",
    specificationsText: "",
    isActive: true,
  };
}

function specsFromText(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function specsToText(specs) {
  return Array.isArray(specs) ? specs.filter(Boolean).join("\n") : "";
}

export function normalizeAdminEquipment(raw = {}, catalog = []) {
  const category = normalizeCategory(raw.category);
  const active = !!(raw.active ?? raw.is_active ?? true);
  const stock = Number(raw.stock ?? 0);

  return {
    id: raw.id,
    name: raw.name || "—",
    category,
    categoryLabel: equipmentCategoryLabel(category, catalog),
    description: raw.description || "",
    stock,
    brand: raw.brand || "",
    model: raw.model || "",
    specifications: Array.isArray(raw.specifications) ? raw.specifications : [],
    isActive: active,
    statusLabel: active ? "Actif" : "Inactif",
  };
}

function toApiPayload(form) {
  return {
    name: form.name.trim(),
    category: form.category,
    description: form.description.trim() || null,
    stock: Number(form.stock) || 0,
    brand: form.brand.trim() || null,
    model: form.model.trim() || null,
    specifications: specsFromText(form.specificationsText),
    is_active: !!form.isActive,
  };
}

export function useAdminEquipments() {
  const equipments = ref([]);
  const categoryCatalog = ref(fallbackEquipmentCategories());
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const categoryFilter = ref("");
  const isModalOpen = ref(false);
  const editingEquipment = ref(null);
  const form = ref(emptyForm());

  const categoryOptions = computed(() =>
    categoryCatalog.value
      .filter((item) => item.isActive)
      .map((item) => ({ value: item.code, label: item.name }))
  );

  const defaultCategory = computed(
    () => categoryOptions.value[0]?.value || "laptop"
  );

  const filteredEquipments = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return equipments.value.filter((item) => {
      const matchesSearch =
        !query ||
        [item.name, item.categoryLabel, item.brand, item.model]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(query));
      const matchesCategory =
        !categoryFilter.value || item.category === categoryFilter.value;
      return matchesSearch && matchesCategory;
    });
  });

  const activeCount = computed(
    () => equipments.value.filter((e) => e.isActive).length
  );
  const inactiveCount = computed(
    () => equipments.value.filter((e) => !e.isActive).length
  );
  const totalStock = computed(() =>
    equipments.value.reduce((sum, e) => sum + Number(e.stock || 0), 0)
  );

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const [list, categories] = await Promise.all([
        equipmentsApiService.fetchAll(),
        equipmentCategoriesApiService.fetchAll({ activeOnly: true }).catch(() => []),
      ]);
      categoryCatalog.value = categories.length ? categories : fallbackEquipmentCategories();
      equipments.value = list.map((row) =>
        normalizeAdminEquipment(row, categoryCatalog.value)
      );
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger les équipements.";
      equipments.value = [];
    } finally {
      loading.value = false;
    }
  }

  function resetForm() {
    form.value = emptyForm(defaultCategory.value);
  }

  function openAddModal() {
    editingEquipment.value = null;
    resetForm();
    isModalOpen.value = true;
  }

  function editEquipment(item) {
    editingEquipment.value = item;
    form.value = {
      name: item.name === "—" ? "" : item.name,
      category: item.category || "laptop",
      description: item.description || "",
      stock: Number(item.stock) || 0,
      brand: item.brand || "",
      model: item.model || "",
      specificationsText: specsToText(item.specifications),
      isActive: item.isActive !== false,
    };
    isModalOpen.value = true;
  }

  function closeModal() {
    if (saving.value) return;
    isModalOpen.value = false;
    editingEquipment.value = null;
    resetForm();
  }

  async function saveEquipment() {
    if (!form.value.name.trim()) {
      error.value = "Le nom de l'équipement est obligatoire.";
      return false;
    }
    if (saving.value) return false;

    saving.value = true;
    error.value = "";
    try {
      const payload = toApiPayload(form.value);
      if (editingEquipment.value) {
        await equipmentsApiService.update(editingEquipment.value.id, payload);
      } else {
        await equipmentsApiService.create(payload);
      }
      await loadData();
      closeModal();
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible d'enregistrer l'équipement.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function deleteEquipment(id) {
    if (!confirm("Supprimer cet équipement ?")) return false;
    if (saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await equipmentsApiService.remove(id);
      await loadData();
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de supprimer l'équipement.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  onMounted(loadData);

  return {
    equipments,
    loading,
    saving,
    error,
    searchQuery,
    categoryFilter,
    isModalOpen,
    editingEquipment,
    form,
    filteredEquipments,
    activeCount,
    inactiveCount,
    totalStock,
    categoryOptions,
    openAddModal,
    editEquipment,
    closeModal,
    saveEquipment,
    deleteEquipment,
    loadData,
  };
}
