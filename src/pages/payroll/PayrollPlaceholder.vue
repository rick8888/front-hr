<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold text-neutral-900 mb-1">{{ title }}</h1>
    <p class="text-sm text-neutral-600">
      Cette section sera branchée sur l’API métier.
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const title = computed(() => route.meta.title || "Payroll");
</script>
