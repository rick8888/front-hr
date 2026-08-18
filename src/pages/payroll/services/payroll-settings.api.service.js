import apiClient from "../../../services/api.js";
import { unwrapResource } from "../utils/payroll-http.js";

/**
 * API HR — /api/v1/payroll-settings
 * GET  → lecture companies.settings.payroll
 * PUT  → mise à jour + sync cotisations (mode manuel/auto)
 */
export const payrollSettingsApiService = {
  async fetchSettings() {
    const { data } = await apiClient.get("/payroll-settings");
    return unwrapResource(data) ?? data;
  },

  async updateSettings(payload) {
    const { data } = await apiClient.put("/payroll-settings", payload);
    // Garde `sync` éventuel présent sur data.data
    const resource = unwrapResource(data);
    if (resource && typeof resource === "object") {
      return resource;
    }
    return data?.data ?? data;
  },
};
