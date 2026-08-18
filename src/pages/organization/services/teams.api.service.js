import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const teamsApiService = {
  async fetchAll() {
    const { data } = await apiClient.get("/teams");
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/teams", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/teams/${id}`, payload);
    return unwrap(data);
  },

  async toggleStatus(id) {
    const { data } = await apiClient.patch(`/teams/${id}/status`);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/teams/${id}`);
  },
};
