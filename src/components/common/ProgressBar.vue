<template>
  <div class="w-full bg-neutral-200 rounded-full overflow-hidden">
    <div
      :style="{ width: percentage + '%' }"
      class="h-2 bg-primary-500 transition-all duration-300"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  percentage: {
    type: Number,
    required: true,
    validator: (v) => v >= 0 && v <= 100,
  },
});
</script>

<style scoped></style>
