import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

/** Admin dashboard : GET /dashboard/admin?period=today|week|month */
export const adminDashboardApiService = {
  async fetch(params = {}) {
    const { data } = await apiClient.get("/dashboard/admin", { params });
    return unwrap(data) ?? {};
  },
};
