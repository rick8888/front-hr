<template>
  <div
    class="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center px-4"
  >
    <div class="text-center">
      <div
        class="text-9xl font-bold text-transparent bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text mb-6"
      >
        404
      </div>
      <h1 class="text-4xl font-bold text-neutral-900 mb-2">Page Not Found</h1>
      <p class="text-lg text-neutral-600 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink to="/" class="btn-primary"> Back to Dashboard </RouterLink>
        <RouterLink to="/employees" class="btn-outline">
          Go to Employees
        </RouterLink>
      </div>

      <div class="mt-12 flex justify-center">
        <div class="w-64 h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
          <svg
            class="w-32 h-32 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
