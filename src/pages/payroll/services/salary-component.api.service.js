import apiClient from "../../../services/api.js";
import { unwrapList, unwrapResource } from "../utils/payroll-http.js";

/**
 * API HR — /api/v1/salary-components
 *
 * Mode manuel : include_statutory=1 → cotisations légales visibles.
 * Mode auto : include_statutory=0 → cotisations masquées (TaxEngine).
 */
export const salaryComponentApiService = {
  async fetchAll(params = {}) {
    const include =
      params.include_statutory === true ||
      params.include_statutory === 1 ||
      params.include_statutory === "1";

    const { include_statutory: _drop, ...rest } = params;

    const { data } = await apiClient.get("/salary-components", {
      params: {
        per_page: 200,
        ...rest,
        include_statutory: include ? 1 : 0,
      },
    });
    return unwrapList(data);
  },

  async fetchById(id) {
    const { data } = await apiClient.get(`/salary-components/${id}`);
    return unwrapResource(data);
  },

  async create(payload) {
    const { data } = await apiClient.post("/salary-components", payload);
    return unwrapResource(data);
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`/salary-components/${id}`, payload);
    return unwrapResource(data);
  },

  async remove(id) {
    await apiClient.delete(`/salary-components/${id}`);
    return true;
  },
};
