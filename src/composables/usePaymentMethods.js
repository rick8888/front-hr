import { ref } from "vue";
import { paymentMethodsApiService } from "../services/payment-methods.api.service.js";

function mapPaymentMethod(method, index) {
  return {
    id: method.code ?? method.id,
    code: method.code ?? method.id,
    title: method.label,
    description: method.description ?? "",
    selected: index === 0,
  };
}

export function usePaymentMethods() {
  const loading = ref(false);
  const error = ref("");
  const methods = ref([]);

  async function load() {
    loading.value = true;
    error.value = "";

    try {
      const rows = await paymentMethodsApiService.fetchPaymentMethods();
      methods.value = (rows ?? []).map(mapPaymentMethod);
    } catch (e) {
      error.value =
        e.response?.data?.message ||
        "Unable to load payment methods.";
      methods.value = [];
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    methods,
    load,
  };
}
