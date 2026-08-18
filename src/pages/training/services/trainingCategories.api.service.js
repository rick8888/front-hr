import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const TRAINING_CATEGORY_OPTIONS = [
  { value: "technical", label: "Technique" },
  { value: "management", label: "Management" },
  { value: "soft_skills", label: "Compétences comportementales" },
  { value: "sales", label: "Ventes" },
  { value: "compliance", label: "Conformité" },
];

export function normalizeTrainingCategory(raw) {
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

export function fallbackTrainingCategories() {
  return TRAINING_CATEGORY_OPTIONS.map((option, index) => ({
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

export function trainingCategoryLabel(code, catalog = []) {
  const found = catalog.find((item) => item.code === code);
  if (found?.name) return found.name;
  const fallback = TRAINING_CATEGORY_OPTIONS.find((item) => item.value === code);
  return fallback?.label || code || "—";
}

export const trainingCategoriesApiService = {
  async fetchAll({ activeOnly = false } = {}) {
    const { data } = await apiClient.get("/training-categories", {
      params: activeOnly ? { active_only: 1 } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeTrainingCategory) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/training-categories", payload);
    return normalizeTrainingCategory(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/training-categories/${id}`, payload);
    return normalizeTrainingCategory(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/training-categories/${id}/status`, {
      is_active: isActive,
    });
    return normalizeTrainingCategory(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/training-categories/${id}`);
  },
};
