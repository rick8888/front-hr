<template>
  <AuthLayout>
    <div class="w-full max-w-md mx-auto">
      <!-- Header -->
      <div class="text-center mb-5">
        <h2 class="text-2xl font-bold text-neutral-900 mb-1">Forgot Password?</h2>
        <p class="text-neutral-600 text-xs">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-neutral-100 p-6">
        <form @submit.prevent="handleForgotPassword" class="space-y-4">
          <!-- Email Field -->
          <div>
            <label
              for="email"
              class="block text-sm font-semibold text-neutral-700 mb-1.5"
            >
              Email Address
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
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full pl-9 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-neutral-400"
                required
                autocomplete="email"
              />
            </div>
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
            <span v-else>Sending...</span>
          </button>
        </form>

        <div
          v-if="error"
          class="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg text-xs text-error-700"
          role="alert"
        >
          {{ error }}
        </div>

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
                Check your email
              </p>
              <p class="text-xs text-success-700">
                If this address is registered, password reset instructions will be sent.
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
import AuthLayout from "../components/layout/AuthLayout.vue";
import { passwordResetApi } from "../services/passwordReset.api.js";

const email = ref("");
const isLoading = ref(false);
const success = ref(false);
const error = ref("");

const handleForgotPassword = async () => {
  error.value = "";
  success.value = false;
  isLoading.value = true;
  try {
    await passwordResetApi.requestResetLink(email.value);
    success.value = true;
  } catch (requestError) {
    error.value =
      requestError.response?.data?.message ||
      requestError.message ||
      "The password reset request could not be completed.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Smooth transitions for form elements */
input[type="email"] {
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

