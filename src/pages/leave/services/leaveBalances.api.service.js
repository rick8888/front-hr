import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

export const leaveBalancesApiService = {
  async fetchAll(year, params = {}) {
    const { data } = await apiClient.get("/leave-balances", {
      params: { year, ...params },
    });
    return unwrap(data);
  },

  async fetchEmployee(employeeCode, year) {
    const { data } = await apiClient.get(
      `/leave-balances/${encodeURIComponent(employeeCode)}`,
      { params: { year } },
    );
    return unwrap(data);
  },

  async setInitial(employeeCode, payload) {
    const { data } = await apiClient.put(
      `/leave-balances/${encodeURIComponent(employeeCode)}/initial`,
      payload,
    );
    return unwrap(data);
  },
};
