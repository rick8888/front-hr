import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const EQUIPMENT_CATEGORY_OPTIONS = [
  { value: "laptop", label: "Ordinateurs portables" },
  { value: "desktop", label: "Ordinateurs de bureau" },
  { value: "monitor", label: "Écrans" },
  { value: "phone", label: "Téléphones" },
  { value: "tablet", label: "Tablettes" },
  { value: "accessories", label: "Accessoires" },
  { value: "furniture", label: "Mobilier" },
  { value: "other", label: "Autre" },
];

export function normalizeEquipmentCategory(raw) {
  return {
    id: raw.id,
    name: raw.name,
    code: raw.code,
    label: raw.name,
    description: raw.description ?? "",
    sortOrder: raw.sort_order ?? 0,
    isSystem: !!raw.is_system,
    isActive: raw.is_active !== false,
  };
}

export function fallbackEquipmentCategories() {
  return EQUIPMENT_CATEGORY_OPTIONS.map((option, index) => ({
    id: option.value,
    name: option.label,
    code: option.value,
    label: option.label,
    description: "",
    sortOrder: (index + 1) * 10,
    isSystem: true,
    isActive: true,
  }));
}

export function equipmentCategoryLabel(code, catalog = []) {
  const found = catalog.find((item) => item.code === code);
  if (found?.name) return found.name;
  const fallback = EQUIPMENT_CATEGORY_OPTIONS.find((item) => item.value === code);
  return fallback?.label || code || "—";
}

export const equipmentCategoriesApiService = {
  async fetchAll({ activeOnly = false } = {}) {
    const { data } = await apiClient.get("/equipment-categories", {
      params: activeOnly ? { active_only: 1 } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeEquipmentCategory) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/equipment-categories", payload);
    return normalizeEquipmentCategory(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/equipment-categories/${id}`, payload);
    return normalizeEquipmentCategory(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/equipment-categories/${id}/status`, {
      is_active: isActive,
    });
    return normalizeEquipmentCategory(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/equipment-categories/${id}`);
  },
};
