<template>
  <section
    class="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-6"
  >
    <div>
      <h1 class="text-lg font-bold text-neutral-900 md:text-xl">
        Welcome to your Tenant Portal
      </h1>
      <p class="mt-1 text-sm text-neutral-500">
        Manage your subscription, billing, and access your application
      </p>
    </div>
    <a
      :href="applicationUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#7c7cf8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#6b6be8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c7cf8]"
    >
      <svg
        class="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      Access Your Application
    </a>
  </section>
</template>

<script setup>
defineProps({
  applicationUrl: { type: String, required: true },
});
</script>
