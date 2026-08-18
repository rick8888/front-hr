import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const departmentsApiService = {
  async fetchAll() {
    const { data } = await apiClient.get("/departments");
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/departments", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/departments/${id}`, payload);
    return unwrap(data);
  },

  async toggleStatus(id) {
    const { data } = await apiClient.patch(`/departments/${id}/status`);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/departments/${id}`);
  },
};
