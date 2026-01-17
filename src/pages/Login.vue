<template>
  <AuthLayout>
    <!-- Login Form Card -->
    <div class="space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-neutral-900">Welcome Back</h2>
        <p class="text-neutral-600 text-sm mt-2">
          Sign in to your account to continue
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2"
            >Email Address</label
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
            >Password</label
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
            >Forgot password?</router-link
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
          <span v-if="!isLoading">Sign In</span>
          <span v-else>Signing in...</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-neutral-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-neutral-500">or</span>
        </div>
      </div>

      <!-- Social Login -->
      <div class="space-y-3">
        <button
          type="button"
          class="btn-outline w-full py-3 font-medium flex items-center justify-center gap-2 hover:bg-neutral-50"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
        <button
          type="button"
          class="btn-outline w-full py-3 font-medium flex items-center justify-center gap-2 hover:bg-neutral-50"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
          Continue with GitHub
        </button>
      </div>

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
        <p class="text-xs font-semibold text-info-900 mb-2">Demo Credentials</p>
        <div class="space-y-2">
          <div>
            <p class="text-xs font-medium text-info-900 mb-0.5">Admin:</p>
            <p class="text-xs text-info-700">
              <span class="font-medium">Email:</span> admin@bravorh.com<br />
              <span class="font-medium">Password:</span> password123
            </p>
          </div>
          <div class="pt-2 border-t border-info-200">
            <p class="text-xs font-medium text-info-900 mb-0.5">Employee:</p>
        <p class="text-xs text-info-700">
              <span class="font-medium">Email:</span> employee@bravorh.com<br />
              <span class="font-medium">Password:</span> password123
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

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref({
  email: "",
  password: "",
});
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  
  // Validate credentials
  if (!credentials.value.email || !credentials.value.password) {
    errorMessage.value = "Please enter both email and password";
    return;
  }

  // Check for demo credentials
  const isAdminLogin = 
    credentials.value.email === "admin@bravorh.com" && 
    credentials.value.password === "password123";
  
  const isEmployeeLogin = 
    credentials.value.email === "employee@bravorh.com" && 
    credentials.value.password === "password123";

  if (!isAdminLogin && !isEmployeeLogin) {
    errorMessage.value = "Invalid email or password";
    return;
  }

  isLoading.value = true;
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Login using store
  authStore.login(credentials.value);
  
  if (rememberMe.value) {
    localStorage.setItem("rememberMe", "true");
  }
  
  isLoading.value = false;
  router.push("/");
};

const handleSocialLogin = (provider) => {
  console.log(`Login with ${provider}`);
  // Implement social login logic here
};
</script>

<style scoped></style>
