import apiClient from "../../../services/api.js";
import { unwrapList, unwrapResource } from "../utils/payroll-http.js";

/**
 * API HR — /api/v1/payrolls
 * Liste, détail, génération, suppression des bulletins.
 */
export const payrollApiService = {
  /**
   * @param {object} [params]
   * @param {number} [params.per_page]
   * @param {number} [params.page]
   * @param {number} [params.company_id]
     * @param {string} [params.period] YYYY-MM
     * @param {string} [params.period_from] YYYY-MM
     * @param {string} [params.period_to] YYYY-MM
     * @param {string|string[]} [params.status]
     * @param {number} [params.employee_id]
     * @param {string} [params.department]
     * @param {string} [params.search]
   * @returns {Promise<{ items: any[], meta: object|null }>}
   */
  async fetchPage(params = {}) {
    const { data } = await apiClient.get("/payrolls", { params });
    const items = unwrapList(data);
    const meta = data?.meta ?? null;
    return { items, meta };
  },

  /** Liste plate (pagination élargie pour écrans type “All Records”). */
  async fetchAll(params = {}) {
    const { items } = await this.fetchPage({
      per_page: params.per_page ?? 200,
      page: 1,
      ...params,
    });
    return items;
  },

  async fetchById(id) {
    const { data } = await apiClient.get(`/payrolls/${id}`);
    return unwrapResource(data);
  },

  /**
   * @param {{ employee_id: number, period: string }} payload
   */
  async generate(payload) {
    const { data } = await apiClient.post("/payrolls/generate", payload);
    return unwrapResource(data);
  },

  /**
   * @param {{ employee_id: number, period: string }} payload
   */
  async preview(payload) {
    const { data } = await apiClient.post("/payrolls/preview", payload);
    return unwrapResource(data);
  },

  async remove(id) {
    await apiClient.delete(`/payrolls/${id}`);
    return true;
  },
};
