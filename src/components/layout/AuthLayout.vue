<template>
  <div
    class="flex min-h-screen min-h-[100dvh] bg-gradient-to-br from-neutral-50 via-white to-neutral-50"
  >
    <!-- Left Side - Illustration/Info -->
    <div
      class="relative hidden min-h-0 shrink-0 flex-col items-center justify-center overflow-hidden p-8 lg:flex lg:min-h-screen lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600"
    >
      <!-- Animated Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute top-0 right-0 bg-white rounded-full w-96 h-96 blur-3xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-0 left-0 bg-white rounded-full w-96 h-96 blur-3xl animate-pulse"
          style="animation-delay: 1s"
        ></div>
      </div>

      <!-- Decorative Shapes -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute rounded-full top-20 right-20 w-72 h-72 bg-white/5 blur-2xl"
        ></div>
        <div
          class="absolute rounded-full bottom-20 left-20 w-96 h-96 bg-white/5 blur-2xl"
        ></div>
      </div>

      <!-- Content (centered block in the left column) -->
      <div class="relative z-10 w-full max-w-lg">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-10">
          <div
            class="flex items-center justify-center w-12 h-12 text-xl font-bold bg-white shadow-xl rounded-xl text-primary-600"
          >
            BR
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Bravo RH</h1>
            <p class="text-xs text-primary-100">HR Management System</p>
          </div>
        </div>

        <!-- Features -->
        <div class="space-y-5">
          <div class="flex gap-3 group">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30"
              >
                <svg
                  class="w-5 h-5 text-white"
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
              </div>
            </div>
            <div>
              <h3 class="mb-0.5 text-base font-semibold text-white">
                Complete HR Management
              </h3>
              <p class="text-xs text-primary-100">
                Manage employees, attendance, payroll, and more in one place
              </p>
            </div>
          </div>

          <div class="flex gap-3 group">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="mb-0.5 text-base font-semibold text-white">
                Advanced Analytics
              </h3>
              <p class="text-xs text-primary-100">
                Get insights with detailed reports and performance metrics
              </p>
            </div>
          </div>

          <div class="flex gap-3 group">
            <div class="flex-shrink-0">
              <div
                class="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30"
              >
                <svg
                  class="w-5 h-5 text-white"
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
            </div>
            <div>
              <h3 class="mb-0.5 text-base font-semibold text-white">
                Secure & Reliable
              </h3>
              <p class="text-xs text-primary-100">
                Enterprise-grade security to protect your HR data
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Stats -->
        <div
          class="grid grid-cols-3 gap-4 border-t border-white/20 pt-6"
        >
          <div>
            <p class="mb-0.5 text-2xl font-bold text-white">5K+</p>
            <p class="text-xs text-primary-100">Active Users</p>
          </div>
          <div>
            <p class="mb-0.5 text-2xl font-bold text-white">98%</p>
            <p class="text-xs text-primary-100">Satisfaction</p>
          </div>
          <div>
            <p class="mb-0.5 text-2xl font-bold text-white">24/7</p>
            <p class="text-xs text-primary-100">Support</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Form -->
    <div
      class="flex min-h-screen min-h-[100dvh] w-full items-center justify-center overflow-y-auto px-6 py-6 sm:px-8 lg:w-1/2 lg:px-12 xl:px-16"
    >
      <div :class="['w-full my-auto', maxWidthClass]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  /** Tailwind max-width key for the form column */
  maxWidth: { type: String, default: "xl" },
});

const MAX_WIDTHS = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

const maxWidthClass = computed(
  () => MAX_WIDTHS[props.maxWidth] || MAX_WIDTHS.md,
);
</script>

<style scoped>
/* Smooth animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
