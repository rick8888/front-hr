import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const leaveTypesApiService = {
  async fetchAll() {
    const { data } = await apiClient.get("/leave-types");
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/leave-types", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/leave-types/${id}`, payload);
    return unwrap(data);
  },

  async toggleStatus(id) {
    const { data } = await apiClient.patch(`/leave-types/${id}/status`);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/leave-types/${id}`);
  },
};
