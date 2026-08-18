import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const jobOpeningsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/job-openings", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/job-openings", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/job-openings/${id}`, payload);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/job-openings/${id}`);
  },
};

export const candidatesApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/candidates", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/candidates", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/candidates/${id}`, payload);
    return unwrap(data);
  },

  async updateStage(id, stage) {
    const { data } = await apiClient.patch(`/candidates/${id}/stage`, { stage });
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/candidates/${id}`);
  },
};
