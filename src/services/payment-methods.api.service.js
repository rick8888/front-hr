import apiClient from "./api.js";

export const paymentMethodsApiService = {
  async fetchPaymentMethods() {
    const { data } = await apiClient.get("/payment-methods");
    return data.data ?? data;
  },
};
