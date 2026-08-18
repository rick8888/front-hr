import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const EXPENSE_TYPE_OPTIONS = [
  { value: "food", label: "Restauration" },
  { value: "travel", label: "Déplacement" },
  { value: "accommodation", label: "Hébergement" },
  { value: "office_supplies", label: "Fournitures de bureau" },
  { value: "training", label: "Formation" },
  { value: "other", label: "Autre" },
];

export function normalizeExpenseType(raw) {
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

export function fallbackExpenseTypes() {
  return EXPENSE_TYPE_OPTIONS.map((option, index) => ({
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

export function expenseTypeLabel(code, catalog = []) {
  const found = catalog.find((item) => item.code === code);
  if (found?.name) return found.name;
  const fallback = EXPENSE_TYPE_OPTIONS.find((item) => item.value === code);
  return fallback?.label || code || "—";
}

export const expenseTypesApiService = {
  async fetchAll({ activeOnly = false } = {}) {
    const { data } = await apiClient.get("/expense-types", {
      params: activeOnly ? { active_only: 1 } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeExpenseType) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/expense-types", payload);
    return normalizeExpenseType(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/expense-types/${id}`, payload);
    return normalizeExpenseType(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/expense-types/${id}/status`, {
      is_active: isActive,
    });
    return normalizeExpenseType(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/expense-types/${id}`);
  },
};
