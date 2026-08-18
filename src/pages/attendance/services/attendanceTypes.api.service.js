import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export function normalizeAttendanceType(raw) {
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

export const attendanceTypesApiService = {
  async fetchAll({ activeOnly = false } = {}) {
    const { data } = await apiClient.get("/attendance-types", {
      params: activeOnly ? { active_only: 1 } : undefined,
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeAttendanceType) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/attendance-types", payload);
    return normalizeAttendanceType(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/attendance-types/${id}`, payload);
    return normalizeAttendanceType(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/attendance-types/${id}/status`, {
      is_active: isActive,
    });
    return normalizeAttendanceType(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/attendance-types/${id}`);
  },
};
