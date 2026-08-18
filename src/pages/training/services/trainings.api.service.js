import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const trainingsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/trainings", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async fetchOne(id) {
    const { data } = await apiClient.get(`/trainings/${id}`);
    return unwrap(data);
  },

  async create(payload) {
    const { data } = await apiClient.post("/trainings", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/trainings/${id}`, payload);
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/trainings/${id}`);
  },
};

export const trainingEnrollmentsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/training-enrollments", { params });
    const list = unwrap(data);
    return Array.isArray(list) ? list : [];
  },

  async enroll(trainingId) {
    const { data } = await apiClient.post("/training-enrollments", {
      training_id: trainingId,
    });
    return unwrap(data);
  },

  async cancel(id) {
    await apiClient.delete(`/training-enrollments/${id}`);
  },
};
