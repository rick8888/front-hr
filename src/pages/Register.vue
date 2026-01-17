<template>
  <AuthLayout>
    <!-- Register Form Card -->
    <div class="w-full max-w-md mx-auto space-y-2">
      <!-- Header -->
      <div class="text-center mb-1">
        <h2 class="text-xl font-bold text-neutral-900">Get Started</h2>
        <p class="text-neutral-600 text-xs mt-0.5">
          Create your account
        </p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow-lg border border-neutral-100 p-4">
      <form @submit.prevent="handleRegister" class="space-y-2">
        <!-- Full Name -->
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1"
            >Full Name *</label
          >
          <input
            v-model="formData.fullName"
            type="text"
            placeholder="John Doe"
            class="input-base w-full text-sm py-1.5"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1"
            >Email Address *</label
          >
          <input
            v-model="formData.email"
            type="email"
            placeholder="you@example.com"
            class="input-base w-full text-sm py-1.5"
            required
          />
        </div>

        <!-- Company -->
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1"
            >Company</label
          >
          <input
            v-model="formData.company"
            type="text"
            placeholder="Your Company Name"
            class="input-base w-full text-sm py-1.5"
          />
        </div>

        <!-- Department -->
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1"
            >Department</label
          >
          <select v-model="formData.department" class="input-base w-full text-sm py-1.5">
            <option value="">Select Department</option>
            <option value="Sales">Sales</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1"
            >Password *</label
          >
          <input
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            class="input-base w-full text-sm py-1.5"
            required
          />
          <p class="text-xs text-neutral-500 mt-0.5 leading-none">Min. 8 characters</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1"
            >Confirm Password *</label
          >
          <input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="••••••••"
            class="input-base w-full text-sm py-1.5"
            required
          />
        </div>

        <!-- Terms -->
        <div class="flex items-start gap-1.5">
          <input
            v-model="formData.agreeToTerms"
            type="checkbox"
            id="terms"
            class="w-3.5 h-3.5 rounded mt-0.5"
            required
          />
          <label for="terms" class="text-xs text-neutral-600 leading-tight">
            I agree to the
            <a href="#" class="text-primary-600 font-medium hover:underline"
              >Terms</a
            >
            and
            <a href="#" class="text-primary-600 font-medium hover:underline"
              >Privacy Policy</a
            >
          </label>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="p-1.5 bg-error-50 border border-error-200 rounded-lg text-xs text-error-700"
        >
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn-primary w-full py-2 font-medium text-sm"
          :disabled="isLoading"
        >
          {{ isLoading ? "Creating Account..." : "Create Account" }}
        </button>
      </form>

      <!-- Divider -->
        <div class="relative my-2">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-neutral-200"></div>
        </div>
          <div class="relative flex justify-center text-xs">
            <span class="px-2 bg-white text-neutral-500">or</span>
          </div>
      </div>

      <!-- Social Signup -->
      <button
        type="button"
          class="btn-outline w-full py-2 font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-50"
      >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
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
        Sign up with Google
      </button>
      </div>

      <!-- Sign In Link -->
      <p class="text-center text-neutral-600 text-xs mt-2">
        Already have an account?
        <router-link
          to="/login"
          class="text-primary-600 font-semibold hover:text-primary-700"
          >Sign in</router-link
        >
      </p>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "../components/layout/AuthLayout.vue";

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref("");

const formData = ref({
  fullName: "",
  email: "",
  company: "",
  department: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
});

const validateForm = () => {
  if (!formData.value.fullName.trim()) {
    errorMessage.value = "Full name is required";
    return false;
  }

  if (!formData.value.email.trim()) {
    errorMessage.value = "Email is required";
    return false;
  }

  if (formData.value.password.length < 8) {
    errorMessage.value = "Password must be at least 8 characters";
    return false;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    errorMessage.value = "Passwords do not match";
    return false;
  }

  if (!formData.value.agreeToTerms) {
    errorMessage.value = "You must agree to the terms and conditions";
    return false;
  }

  return true;
};

const handleRegister = async () => {
  errorMessage.value = "";

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  // Simulate API call
  setTimeout(() => {
    try {
      // Mock registration - in real app, call API
      localStorage.setItem("token", "mock-jwt-token-" + Date.now());
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: formData.value.fullName,
          email: formData.value.email,
          department: formData.value.department,
        })
      );

      isLoading.value = false;
      router.push("/");
    } catch (error) {
      errorMessage.value = "Registration failed. Please try again.";
      isLoading.value = false;
    }
  }, 1500);
};
</script>

<style scoped></style>
