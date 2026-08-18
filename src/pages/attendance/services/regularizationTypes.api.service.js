import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export function normalizeRegularizationType(raw) {
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

export function fallbackRegularizationTypes(t) {
  return [
    {
      id: "missed_punch",
      name: t?.("admin.attendance.regularizations.type.missed_punch") || "Pointage manqué",
      code: "missed_punch",
      label: t?.("admin.attendance.regularizations.type.missed_punch") || "Pointage manqué",
      description: "",
      sortOrder: 10,
      isSystem: true,
      isActive: true,
    },
    {
      id: "overtime",
      name: t?.("admin.attendance.regularizations.type.overtime") || "Heures supplémentaires",
      code: "overtime",
      label: t?.("admin.attendance.regularizations.type.overtime") || "Heures supplémentaires",
      description: "",
      sortOrder: 20,
      isSystem: true,
      isActive: true,
    },
    {
      id: "correction",
      name: t?.("admin.attendance.regularizations.type.correction") || "Correction",
      code: "correction",
      label: t?.("admin.attendance.regularizations.type.correction") || "Correction",
      description: "",
      sortOrder: 30,
      isSystem: true,
      isActive: true,
    },
  ];
}

export function regularizationTypeLabel(code, catalog = [], t) {
  const found = catalog.find((item) => item.code === code);
  if (found?.name) return found.name;
  const key = `admin.attendance.regularizations.type.${code}`;
  const translated = t?.(key);
  if (translated && translated !== key) return translated;
  return code || "—";
}

export const regularizationTypesApiService = {
  async fetchAll({ activeOnly = false } = {}) {
    const { data } = await apiClient.get("/regularization-types", {
      params: activeOnly ? { active_only: 1 } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeRegularizationType) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/regularization-types", payload);
    return normalizeRegularizationType(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/regularization-types/${id}`, payload);
    return normalizeRegularizationType(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/regularization-types/${id}/status`, {
      is_active: isActive,
    });
    return normalizeRegularizationType(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/regularization-types/${id}`);
  },
};
