import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const TERMINATION_TYPE_OPTIONS = [
  { value: "resignation", label: "Démission" },
  { value: "termination", label: "Licenciement" },
  { value: "contract_end", label: "Fin de contrat" },
  { value: "redundancy", label: "Licenciement économique" },
  { value: "retirement", label: "Retraite" },
  { value: "other", label: "Autre" },
];

export function normalizeTerminationType(raw) {
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

export function fallbackTerminationTypes() {
  return TERMINATION_TYPE_OPTIONS.map((option, index) => ({
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

export const terminationTypesApiService = {
  async fetchAll({ activeOnly = false } = {}) {
    const { data } = await apiClient.get("/termination-types", {
      params: activeOnly ? { active_only: 1 } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeTerminationType) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/termination-types", payload);
    return normalizeTerminationType(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/termination-types/${id}`, payload);
    return normalizeTerminationType(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/termination-types/${id}/status`, {
      is_active: isActive,
    });
    return normalizeTerminationType(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/termination-types/${id}`);
  },
};
