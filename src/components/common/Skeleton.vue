<template>
  <span
    class="block animate-pulse bg-neutral-200"
    :class="[rounded, boxClass]"
    aria-hidden="true"
  />
</template>

<script setup>
defineProps({
  boxClass: { type: String, default: "h-4 w-24" },
  rounded: { type: String, default: "rounded-md" },
});
</script>
