import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const shiftsApiService = {
  async fetchAll() {
    const { data } = await apiClient.get("/shifts");
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/shifts", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/shifts/${id}`, payload);
    return unwrap(data);
  },

  async toggleStatus(id) {
    const { data } = await apiClient.patch(`/shifts/${id}/status`);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/shifts/${id}`);
  },
};
