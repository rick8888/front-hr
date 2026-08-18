import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const designationsApiService = {
  async fetchAll() {
    const { data } = await apiClient.get("/designations");
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/designations", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/designations/${id}`, payload);
    return unwrap(data);
  },

  async toggleStatus(id) {
    const { data } = await apiClient.patch(`/designations/${id}/status`);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/designations/${id}`);
  },
};
