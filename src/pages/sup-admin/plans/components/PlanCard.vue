<template>
  <article
    class="relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-xs transition-shadow hover:shadow-sm"
    :class="plan.is_highlighted ? 'border-primary-300 ring-1 ring-primary-200' : 'border-neutral-200'"
  >
    <header
      v-if="plan.is_highlighted"
      class="bg-primary-500 px-4 py-2 text-center text-xs font-semibold text-white"
    >
      Le plus populaire
    </header>

    <div class="flex flex-1 flex-col p-5">
      <div class="flex items-start justify-between gap-2">
        <div>
          <h3 class="text-lg font-bold text-neutral-900">{{ plan.name }}</h3>
          <p class="mt-0.5 font-mono text-xs text-neutral-400">{{ plan.code }}</p>
        </div>
        <span
          class="shrink-0 rounded-md px-2 py-0.5 text-xs font-medium"
          :class="plan.is_active ? 'bg-green-50 text-green-800' : 'bg-neutral-100 text-neutral-500'"
        >
          {{ plan.is_active ? "Actif" : "Inactif" }}
        </span>
      </div>

      <p class="mt-2 text-sm text-neutral-600">{{ plan.tagline }}</p>

      <p class="mt-4 flex items-baseline gap-1">
        <span class="text-3xl font-bold text-neutral-900">{{ formattedPrice }}</span>
        <span v-if="plan.price_monthly > 0" class="text-sm text-neutral-500">/ mois</span>
      </p>
      <p v-if="configuredPrices.length > 1" class="mt-1 text-xs text-neutral-500">
        Tarifs : {{ configuredPrices.join(" · ") }}
      </p>

      <ul class="mt-5 flex-1 space-y-2">
        <li v-for="(line, idx) in highlights" :key="idx" class="flex items-start gap-2 text-sm text-neutral-700">
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ line }}</span>
        </li>
      </ul>

      <button
        type="button"
        class="btn-outline mt-5 w-full text-sm"
        :disabled="disabled"
        @click="$emit('edit', plan)"
      >
        Configurer le plan
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { buildPlanHighlights, formatPlanPrice } from "../../../../data/subscription/index.js";

const props = defineProps({
  plan: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
});

defineEmits(["edit"]);

const formattedPrice = computed(() => formatPlanPrice(props.plan));
const configuredPrices = computed(() => Object.entries(props.plan.currency_prices ?? {})
  .map(([currency, amount]) => new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount))));
const highlights = computed(() => buildPlanHighlights(props.plan));
</script>
