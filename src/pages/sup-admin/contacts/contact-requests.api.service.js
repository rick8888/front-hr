import apiClient from "../../../services/api.js";

/**
 * API HR — /api/v1/contact-requests (demandes du formulaire de contact de la home page)
 */
export const contactRequestsApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/contact-requests", { params });
    return { items: data.data ?? [], unread: data.meta?.unread ?? 0 };
  },

  async updateStatus(id, status) {
    const { data } = await apiClient.patch(`/contact-requests/${id}`, { status });
    return data.data ?? data;
  },

  async remove(id) {
    await apiClient.delete(`/contact-requests/${id}`);
    return true;
  },
};
