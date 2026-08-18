<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          Usage Overview
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          Monitor your resource usage and limits
        </p>
      </header>

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <TenantUsagePlanCard :plan="plan" :loading="loading" />

      <section
        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <template v-if="loading && !metrics.length">
          <TenantUsageMetricCard
            v-for="i in 3"
            :key="'skeleton-' + i"
            :metric="skeletonMetric"
            :loading="true"
          />
        </template>
        <template v-else>
          <TenantUsageMetricCard
            v-for="metric in metrics"
            :key="metric.id"
            :metric="metric"
            :loading="loading"
          />
        </template>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import TenantUsagePlanCard from "../../components/tenant/TenantUsagePlanCard.vue";
import TenantUsageMetricCard from "../../components/tenant/TenantUsageMetricCard.vue";
import { useTenantUsage } from "../../composables/useTenantUsage.js";

const { loading, error, plan, metrics, load } = useTenantUsage();

const skeletonMetric = {
  id: "skeleton",
  label: "…",
  icon: "user",
  used: 0,
  limit: 1,
};

onMounted(() => {
  load();
});
</script>
