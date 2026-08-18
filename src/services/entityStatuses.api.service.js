import apiClient from "./api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export function normalizeEntityStatus(raw) {
  return {
    id: raw.id,
    entityType: raw.entity_type,
    entityLabel: raw.entity_label ?? raw.entity_type,
    code: raw.code,
    name: raw.name,
    nameEn: raw.name_en ?? "",
    description: raw.description ?? "",
    tone: raw.tone || "neutral",
    sortOrder: raw.sort_order ?? 0,
    isSystem: !!raw.is_system,
    isActive: raw.is_active !== false,
  };
}

export const entityStatusesApiService = {
  async fetchCatalogs() {
    const { data } = await apiClient.get("/entity-statuses/catalogs");
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async fetchAll({ entityType, activeOnly = false } = {}) {
    const params = {};
    if (entityType) params.entity_type = entityType;
    if (activeOnly) params.active_only = 1;
    const { data } = await apiClient.get("/entity-statuses", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeEntityStatus) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/entity-statuses", payload);
    return normalizeEntityStatus(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/entity-statuses/${id}`, payload);
    return normalizeEntityStatus(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/entity-statuses/${id}/status`, {
      is_active: isActive,
    });
    return normalizeEntityStatus(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/entity-statuses/${id}`);
  },
};
