<template>
  <div
    class="inline-flex items-center gap-2 px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm"
  >
    <div class="w-2 h-2 bg-current rounded-full animate-pulse"></div>
    {{ status }}
  </div>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: "Loading...",
  },
});
</script>

<style scoped></style>
