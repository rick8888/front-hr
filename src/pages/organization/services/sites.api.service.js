import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const sitesApiService = {
  async fetchAll() {
    const { data } = await apiClient.get("/sites");
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/sites", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/sites/${id}`, payload);
    return unwrap(data);
  },

  async toggleStatus(id) {
    const { data } = await apiClient.patch(`/sites/${id}/status`);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/sites/${id}`);
  },
};
