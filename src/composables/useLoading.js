import { ref } from "vue";

export const useLoading = () => {
  const isLoading = ref(false);
  const error = ref(null);

  const startLoading = () => {
    isLoading.value = true;
    error.value = null;
  };

  const stopLoading = () => {
    isLoading.value = false;
  };

  const setError = (err) => {
    error.value = err;
    isLoading.value = false;
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError,
  };
};
