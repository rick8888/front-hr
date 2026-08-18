import apiClient from "../../../services/api.js";

function unwrap(data) {
  return data?.data ?? data;
}

/** Self-service : GET /leave-balance (summary + by_type + upcoming + history). */
export const myLeaveBalanceApiService = {
  async fetchMine(year) {
    const { data } = await apiClient.get("/leave-balance", {
      params: year ? { year } : undefined,
    });
    return unwrap(data) ?? {};
  },
};
