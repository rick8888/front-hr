import apiClient from "../../../services/api.js";

export const tenantBillingsApiService = {
  async fetchBillings() {
    const { data } = await apiClient.get("/tenant/billings");
    return data?.data ?? data;
  },
};
