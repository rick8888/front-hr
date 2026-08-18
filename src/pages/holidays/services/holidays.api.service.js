import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const holidaysApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/holidays", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/holidays", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/holidays/${id}`, payload);
    return unwrap(data);
  },

  async toggleStatus(id) {
    const { data } = await apiClient.patch(`/holidays/${id}/status`);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/holidays/${id}`);
  },
};
