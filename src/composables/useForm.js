import { ref, computed } from "vue";

export const useForm = (initialValues = {}) => {
  const form = ref({ ...initialValues });
  const errors = ref({});

  const setField = (field, value) => {
    form.value[field] = value;
    if (errors.value[field]) {
      errors.value[field] = null;
    }
  };

  const setError = (field, message) => {
    errors.value[field] = message;
  };

  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  const reset = () => {
    form.value = { ...initialValues };
    errors.value = {};
  };

  return {
    form,
    errors,
    setField,
    setError,
    hasErrors,
    reset,
  };
};
