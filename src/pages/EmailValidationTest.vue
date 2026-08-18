<template>
  <div class="max-w-xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Test de validité d'email</h1>
    <form @submit.prevent="checkEmail" class="flex flex-col space-y-4">
      <label class="flex flex-col">
        <span class="mb-1">Adresse email :</span>
        <input
          v-model="email"
          type="email"
          placeholder="exemple@domain.com"
          class="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </label>
      <button
        type="submit"
        class="bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 transition"
      >
        Vérifier
      </button>
    </form>
    <div
      v-if="result !== null"
      class="mt-4 p-3 rounded"
      :class="result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
    >
      {{ resultMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useValidation } from "../utils/validation";

const { validateEmail } = useValidation();
const email = ref("");
const result = ref(null); // null = not tested yet, true = valid, false = invalid

const checkEmail = () => {
  result.value = validateEmail(email.value.trim());
};

const resultMessage = computed(() => {
  if (result.value === null) return "";
  return result.value
    ? `"${email.value}" est une adresse email valide.`
    : `"${email.value}" n'est pas une adresse email valide.`;
});
</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style>
