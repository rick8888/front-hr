import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const leaveRequestsApiService = {
  async fetchFilterOptions() {
    const { data } = await apiClient.get("/leave-requests/filter-options");
    return unwrap(data) ?? {};
  },

  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/leave-requests", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async fetchOne(id) {
    const { data } = await apiClient.get(`/leave-requests/${id}`);
    return unwrap(data);
  },

  async create(payload) {
    const { data } = await apiClient.post("/leave-requests", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/leave-requests/${id}`, payload);
    return unwrap(data);
  },

  async updateStatus(id, status, extra = {}) {
    const { data } = await apiClient.patch(`/leave-requests/${id}/status`, {
      status,
      ...extra,
    });
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/leave-requests/${id}`);
  },
};
