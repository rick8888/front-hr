<template>
  <AuthLayout>
    <!-- Login Form Card -->
    <div class="space-y-8">
      <!-- Header -->
          <div class="text-center">
        <h2 class="text-3xl font-bold text-neutral-900">{{ t("login.title") }}</h2>
        <p class="text-neutral-600 text-sm mt-2">
          {{ t("login.subtitle") }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2"
            >{{ t("login.email") }}</label
          >
          <input
            v-model="credentials.email"
            type="email"
            placeholder="you@example.com"
            class="input-base w-full"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2"
            >{{ t("login.password") }}</label
          >
          <div class="relative">
          <input
            v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
              class="input-base w-full pr-10"
            required
          />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <svg
                v-if="!showPassword"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          {{ errorMessage }}
        </div>

        <!-- Remember & Forgot -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded border-neutral-300 text-primary-600"
            />
            <span class="text-sm text-neutral-600">Remember me</span>
          </label>
          <router-link
            to="/forgot-password"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >{{ t("login.forgot") }}</router-link
          >
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="btn-primary w-full py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg
            v-if="isLoading"
            class="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span v-if="!isLoading">{{ t("login.submit") }}</span>
          <span v-else>{{ t("login.signingIn") }}</span>
        </button>
      </form>

      <!-- Sign Up Link -->
      <p class="text-center text-neutral-600 text-sm">
        Don't have an account?
        <router-link
          to="/register"
          class="text-primary-600 font-semibold hover:text-primary-700"
          >Create one</router-link
        >
      </p>

      <!-- Demo Info -->
      <div class="p-4 bg-info-50 border border-info-200 rounded-lg">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-2 text-left"
          :aria-expanded="demoCredentialsOpen"
          aria-controls="demo-credentials-panel"
          @click="demoCredentialsOpen = !demoCredentialsOpen"
        >
          <p class="text-xs font-semibold text-info-900">
            {{ t("login.demoCredentials") }}
          </p>
          <svg
            class="h-4 w-4 flex-shrink-0 text-info-700 transition-transform duration-200"
            :class="demoCredentialsOpen ? '-rotate-180' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <div
          v-show="demoCredentialsOpen"
          id="demo-credentials-panel"
          class="mt-2 space-y-2"
        >
          <div
            v-for="(account, index) in demoAccounts"
            :key="account.email"
            :class="index > 0 ? 'pt-2 border-t border-info-200' : ''"
          >
            <p class="text-xs font-medium text-info-900 mb-0.5">
              {{ account.label }}:
            </p>
            <p class="text-xs text-info-700">
              <span class="font-medium">{{ t("login.email") }}:</span>
              {{ account.email }}<br />
              <span class="font-medium">{{ t("login.password") }}:</span>
              {{ account.password }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import AuthLayout from "../components/layout/AuthLayout.vue";
import { useI18n } from "../i18n/index.js";

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const credentials = ref({
  email: "",
  password: "",
});
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const demoCredentialsOpen = ref(false);

const demoAccounts = [
  { label: "Admin", email: "admin@bravorh.com", password: "password123" },
  { label: "Employee", email: "employee@bravorh.com", password: "password123" },
  { label: "Tenant", email: "tenant@bravorh.com", password: "password123" },
  {
    label: "Super Admin",
    email: "superadmin@bravorh.com",
    password: "password123",
  },
];

const handleLogin = async () => {
  errorMessage.value = "";

  if (!credentials.value.email || !credentials.value.password) {
    errorMessage.value = "Veuillez saisir votre email et votre mot de passe";
    return;
  }

  isLoading.value = true;

  try {
    await authStore.login(credentials.value);

    if (rememberMe.value) {
      localStorage.setItem("rememberMe", "true");
    }

    router.push(authStore.homePath);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      "Email ou mot de passe incorrect";
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped></style>
