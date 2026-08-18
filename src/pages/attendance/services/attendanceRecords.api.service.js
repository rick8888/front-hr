import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const attendanceRecordsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/attendance-records", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/attendance-records", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/attendance-records/${id}`, payload);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/attendance-records/${id}`);
  },
};
