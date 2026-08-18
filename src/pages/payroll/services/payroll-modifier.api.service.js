import apiClient from "../../../services/api.js";
import { unwrapList, unwrapResource } from "../utils/payroll-http.js";

/**
 * API HR — /api/v1/payroll-modifiers
 */
export const payrollModifierApiService = {
  async fetchAll(params = {}) {
    const { data } = await apiClient.get("/payroll-modifiers", {
      params: { per_page: 200, ...params },
    });
    return unwrapList(data);
  },

  async fetchById(id) {
    const { data } = await apiClient.get(`/payroll-modifiers/${id}`);
    return unwrapResource(data);
  },

  async create(payload) {
    const { data } = await apiClient.post("/payroll-modifiers", payload);
    return unwrapResource(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/payroll-modifiers/${id}`, payload);
    return unwrapResource(data);
  },

  async remove(id) {
    await apiClient.delete(`/payroll-modifiers/${id}`);
    return true;
  },
};
