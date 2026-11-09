import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const performanceReviewsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/performance-reviews", { params });
    const reviews = unwrap(data);
    return Array.isArray(reviews) ? reviews : [];
  },

  async create(payload) {
    const { data } = await apiClient.post("/performance-reviews", payload);
    return unwrap(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/performance-reviews/${id}`, payload);
    return unwrap(data);
  },

  async submit(id) {
    const { data } = await apiClient.patch(`/performance-reviews/${id}/status`, {
      status: "submitted",
    });
    return unwrap(data);
  },

  async updateObjectiveProgress(reviewId, objectiveId, payload) {
    const { data } = await apiClient.patch(
      `/performance-reviews/${reviewId}/objectives/${objectiveId}/progress`,
      {
        status: payload.status,
        progress: payload.progress,
        comment: payload.comment || null,
      },
    );
    return unwrap(data);
  },

  async remove(id) {
    await apiClient.delete(`/performance-reviews/${id}`);
  },
};
