import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const regularizationsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/regularizations", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/regularizations", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/regularizations/${id}`, payload);
    return unwrap(data);
  },

  async updateStatus(id, status) {
    const { data } = await apiClient.patch(`/regularizations/${id}/status`, { status });
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/regularizations/${id}`);
  },
};
