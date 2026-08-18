import apiClient from "../../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export function normalizeCountry(raw) {
  return {
    id: raw.id,
    code: raw.code ?? "",
    name: raw.name ?? "",
    currency: raw.currency ?? "",
    locale: raw.locale ?? "fr_FR",
    isActive: raw.is_active !== false,
  };
}

export const countriesAdminApiService = {
  async fetchAll({ activeOnly = false } = {}) {
    const { data } = await apiClient.get("/countries", {
      params: { active_only: activeOnly ? 1 : 0 },
    });
    const list = unwrap(data);
    return Array.isArray(list) ? list.map(normalizeCountry) : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/countries", payload);
    return normalizeCountry(unwrap(data));
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/countries/${id}`, payload);
    return normalizeCountry(unwrap(data));
  },

  async toggleStatus(id, isActive) {
    const { data } = await apiClient.patch(`/countries/${id}/status`, {
      is_active: isActive,
    });
    return normalizeCountry(unwrap(data));
  },

  async remove(id) {
    await apiClient.delete(`/countries/${id}`);
  },
};
