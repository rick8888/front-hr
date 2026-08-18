import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const compensatoryOffsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/compensatory-offs", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/compensatory-offs", payload);
    return unwrap(data);
  },

  async updateStatus(id, status, extra = {}) {
    const { data } = await apiClient.patch(`/compensatory-offs/${id}/status`, {
      status,
      ...extra,
    });
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/compensatory-offs/${id}`);
  },
};
