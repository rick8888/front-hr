<template>
  <AuthLayout>
    <div class="w-full max-w-md mx-auto">
      <!-- Logo Section (Mobile) -->
      <div class="lg:hidden flex items-center justify-center mb-4">
        <div class="flex items-center gap-2">
          <div
            class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg"
          >
            BR
          </div>
          <div>
            <h1 class="text-xl font-bold text-neutral-900">Bravo RH</h1>
            <p class="text-neutral-500 text-xs">HR Management System</p>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div class="text-center mb-5">
        <h2 class="text-2xl font-bold text-neutral-900 mb-1">Reset Password</h2>
        <p class="text-neutral-600 text-xs">
          Enter your new password below
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-neutral-100 p-6">
        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <!-- New Password Field -->
          <div>
            <label
              for="newPassword"
              class="block text-sm font-semibold text-neutral-700 mb-1.5"
            >
              New Password
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-4 w-4 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                id="newPassword"
                v-model="formData.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                class="w-full pl-9 pr-10 py-2.5 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-neutral-400"
                required
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg
                  v-if="!showNewPassword"
                  class="h-4 w-4"
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
                  class="h-4 w-4"
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
            <p class="text-xs text-neutral-500 mt-0.5">Min. 8 characters</p>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-semibold text-neutral-700 mb-1.5"
            >
              Confirm Password
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-4 w-4 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm new password"
                class="w-full pl-9 pr-10 py-2.5 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-neutral-400"
                required
                autocomplete="new-password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg
                  v-if="!showConfirmPassword"
                  class="h-4 w-4"
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
                  class="h-4 w-4"
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
            class="p-2 bg-error-50 border border-error-200 rounded-lg text-xs text-error-700"
          >
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center justify-center gap-2 text-sm"
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
            <span v-if="!isLoading">Reset Password</span>
            <span v-else>Resetting...</span>
          </button>
        </form>

        <!-- Success Message -->
        <div
          v-if="success"
          class="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg"
        >
          <div class="flex items-start gap-2">
            <svg
              class="h-5 w-5 text-success-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-semibold text-success-900 mb-0.5">
                Password reset successful!
              </p>
              <p class="text-xs text-success-700">
                You can now login with your new password.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to Login Link -->
      <div class="mt-4 text-center">
        <router-link
          to="/login"
          class="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to login
        </router-link>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import AuthLayout from "../components/layout/AuthLayout.vue";

const router = useRouter();
const route = useRoute();

const formData = ref({
  newPassword: "",
  confirmPassword: "",
});
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const success = ref(false);

const validateForm = () => {
  if (formData.value.newPassword.length < 8) {
    errorMessage.value = "Password must be at least 8 characters";
    return false;
  }

  if (formData.value.newPassword !== formData.value.confirmPassword) {
    errorMessage.value = "Passwords do not match";
    return false;
  }

  return true;
};

const handleResetPassword = async () => {
  errorMessage.value = "";
  success.value = false;

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock reset password - in real app, call API with token from route
  // const token = route.query.token;
  
  success.value = true;
  isLoading.value = false;

  // Redirect to login after 2 seconds
  setTimeout(() => {
    router.push("/login");
  }, 2000);
};
</script>

<style scoped>
/* Smooth transitions for form elements */
input[type="password"] {
  transition: all 0.2s ease-in-out;
}

/* Focus ring animation */
input:focus {
  animation: focusRing 0.3s ease-out;
}

@keyframes focusRing {
  0% {
    box-shadow: 0 0 0 0 rgba(91, 153, 245, 0);
  }
  100% {
    box-shadow: 0 0 0 3px rgba(91, 153, 245, 0.1);
  }
}
</style>




