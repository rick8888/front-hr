import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export function normalizeDayType(raw) {
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

export function fallbackDayTypes(t) {
  return [
    {
      id: "weekday",
      name: t?.("admin.attendance.reports.overtime.dayType.weekday") || "Jour ouvré",
      code: "weekday",
      label: t?.("admin.attendance.reports.overtime.dayType.weekday") || "Jour ouvré",
      description: "",
      sortOrder: 10,
      isSystem: true,
      isActive: true,
    },
    {
      id: "weekend",
      name: t?.("admin.attendance.reports.overtime.dayType.weekend") || "Week-end",
      code: "weekend",
      label: t?.("admin.attendance.reports.overtime.dayType.weekend") || "Week-end",
      description: "",
      sortOrder: 20,
      isSystem: true,
      isActive: true,
    },
    {
      id: "holiday",
      name: t?.("admin.attendance.reports.overtime.dayType.holiday") || "Jour férié",
      code: "holiday",
      label: t?.("admin.attendance.reports.overtime.dayType.holiday") || "Jour férié",
      description: "",
      sortOrder: 30,
      isSystem: true,
      isActive: true,
    },
  ];
}

export function dayTypeLabel(code, catalog = [], t) {
  const found = catalog.find((item) => item.code === code);
  if (found?.name) return found.name;
  const key = `admin.attendance.reports.overtime.dayType.${code}`;
  const translated = t?.(key);
  if (translated && translated !== key) return translated;
  return code || "—";
}

export const dayTypesApiService = {
  async fetchAll({ activeOnly = false } = {}) {
    const { data } = await apiClient.get("/day-types", {
      params: activeOnly ? { active_only: 1 } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeDayType) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/day-types", payload);
    return normalizeDayType(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/day-types/${id}`, payload);
    return normalizeDayType(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/day-types/${id}/status`, {
      is_active: isActive,
    });
    return normalizeDayType(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/day-types/${id}`);
  },
};
