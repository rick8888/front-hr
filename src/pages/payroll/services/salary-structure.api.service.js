import apiClient from "../../../services/api.js";
import { unwrapList, unwrapResource } from "../utils/payroll-http.js";

/**
 * API HR — /api/v1/employees/{id}/structure
 */
export const salaryStructureApiService = {
  async listForEmployee(employeeId) {
    const { data } = await apiClient.get(`/employees/${employeeId}/structure`);
    return unwrapList(data);
  },

  async assign(employeeId, payload) {
    const { data } = await apiClient.post(`/employees/${employeeId}/structure`, payload);
    return unwrapResource(data);
  },
};
