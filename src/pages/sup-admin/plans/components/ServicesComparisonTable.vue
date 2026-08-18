<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
    <header class="border-b border-neutral-100 px-5 py-4">
      <h2 class="text-base font-semibold text-neutral-800">Matrice des services</h2>
      <p class="text-xs text-neutral-500">Comparaison des modules inclus par plan</p>
    </header>

    <div
      v-if="loading"
      class="flex min-h-[160px] items-center justify-center gap-2 text-sm text-neutral-500"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
        aria-hidden="true"
      />
      Chargement…
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead>
          <tr class="border-b border-neutral-100 bg-neutral-50/80">
            <th class="px-4 py-3 text-xs font-semibold uppercase text-neutral-500">Service</th>
            <th
              v-for="plan in plans"
              :key="plan.id"
              class="px-4 py-3 text-center text-xs font-semibold uppercase text-neutral-500"
            >
              {{ plan.name }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-50">
          <template v-for="(services, category) in groupedServices" :key="category">
            <tr class="bg-neutral-50/50">
              <td colspan="99" class="px-4 py-2 text-xs font-semibold text-neutral-600">
                {{ categoryLabel(category) }}
              </td>
            </tr>
            <tr v-for="service in services" :key="service.id" class="hover:bg-neutral-50/40">
              <td class="px-4 py-3">
                <p class="font-medium text-neutral-800">{{ service.label }}</p>
                <p class="text-xs text-neutral-400">{{ service.description }}</p>
              </td>
              <td
                v-for="plan in plans"
                :key="`${plan.id}-${service.id}`"
                class="px-4 py-3 text-center"
              >
                <span
                  v-if="planIncludesService(plan, service.id)"
                  class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                  title="Inclus"
                >✓</span>
                <span v-else class="text-neutral-300">—</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import {
  SUBSCRIPTION_SERVICES,
  SERVICE_CATEGORY_LABELS,
  groupServicesByCategory,
  planIncludesService,
} from "../../../../data/subscription/index.js";

const props = defineProps({
  plans: { type: Array, default: () => [] },
  services: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const serviceList = computed(() =>
  props.services.length ? props.services : SUBSCRIPTION_SERVICES
);

const groupedServices = computed(() => groupServicesByCategory(serviceList.value));

function categoryLabel(cat) {
  return SERVICE_CATEGORY_LABELS[cat] ?? cat;
}
</script>
