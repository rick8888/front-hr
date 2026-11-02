<template>
  <article
    class="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden print:shadow-none print:border-none"
  >
    <!-- Bandeau titre -->
    <header
      class="bg-gradient-to-r from-secondary-600 to-primary-600 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div>
        <p class="text-xs uppercase tracking-wider text-white/70">
          {{ t("admin.payroll.preview.title") }}
        </p>
        <h2 class="text-xl font-bold mt-0.5">{{ employee?.name || "—" }}</h2>
        <p class="text-xs text-white/80 mt-0.5">
          {{ employeeCountryLabel }} · ID #{{ employee?.id ?? "—" }}
        </p>
      </div>
      <div class="text-left sm:text-right">
        <p class="text-xs uppercase tracking-wider text-white/70">
          {{ t("admin.payroll.preview.period") }}
        </p>
        <p class="text-lg font-semibold">{{ monthLabel }}</p>
      </div>
    </header>

    <!-- Corps -->
    <div class="p-6 space-y-6">
      <!-- Gains -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
            {{ t("admin.payroll.preview.earnings") }}
          </h3>
          <span
            class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {{ t("admin.payroll.preview.lines", { count: gains.length }) }}
          </span>
        </div>
        <ul class="divide-y divide-neutral-100 border border-neutral-100 rounded-xl overflow-hidden">
          <li
            v-for="g in gains"
            :key="g.code"
            class="flex items-center justify-between px-4 py-3 bg-white hover:bg-green-50/40 transition-colors"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span
                class="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0"
              >
                +
              </span>
              <div class="min-w-0">
                <p class="font-medium text-neutral-900 truncate">{{ g.name }}</p>
                <p class="text-xs text-neutral-500 font-mono">{{ g.code }}</p>
              </div>
            </div>
            <span class="font-semibold text-green-700 tabular-nums">
              {{ formatMoney(g.value) }}
            </span>
          </li>
          <li v-if="!gains.length" class="px-4 py-6 text-sm text-neutral-500 text-center">
            {{ t("admin.payroll.preview.emptyEarnings") }}
          </li>
        </ul>
        <div
          class="mt-3 flex items-center justify-between px-4 py-2 rounded-lg bg-green-50 border border-green-100"
        >
          <span class="text-sm font-semibold text-green-800">
            {{ t("admin.payroll.preview.gross") }}
          </span>
          <span class="text-lg font-bold text-green-800 tabular-nums">
            {{ formatMoney(gross) }}
          </span>
        </div>
      </section>

      <!-- Déductions -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
            {{ t("admin.payroll.preview.deductions") }}
          </h3>
          <span
            class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-800"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {{ t("admin.payroll.preview.lines", { count: deductions.length }) }}
          </span>
        </div>
        <ul class="divide-y divide-neutral-100 border border-neutral-100 rounded-xl overflow-hidden">
          <li
            v-for="d in deductions"
            :key="d.code"
            class="flex items-center justify-between px-4 py-3 bg-white hover:bg-red-50/40 transition-colors"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span
                class="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold flex-shrink-0"
              >
                −
              </span>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <p class="font-medium text-neutral-900 truncate">{{ d.name }}</p>
                  <span
                    v-if="d.auto"
                    class="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600"
                  >
                    {{ t("admin.payroll.preview.automatic") }}
                  </span>
                </div>
                <p class="text-xs text-neutral-500 font-mono">{{ d.code }}</p>
              </div>
            </div>
            <span class="font-semibold text-red-700 tabular-nums">
              − {{ formatMoney(d.value) }}
            </span>
          </li>
          <li v-if="!deductions.length" class="px-4 py-6 text-sm text-neutral-500 text-center">
            {{ t("admin.payroll.preview.emptyDeductions") }}
          </li>
        </ul>
        <div
          class="mt-3 flex items-center justify-between px-4 py-2 rounded-lg bg-red-50 border border-red-100"
        >
          <span class="text-sm font-semibold text-red-800">
            {{ t("admin.payroll.preview.totalDeductions") }}
          </span>
          <span class="text-lg font-bold text-red-800 tabular-nums">
            − {{ formatMoney(totalDeductions) }}
          </span>
        </div>
      </section>

      <!-- Récap -->
      <section
        class="rounded-xl bg-neutral-50 border border-neutral-200 p-4 grid gap-3 sm:grid-cols-3 text-sm"
      >
        <div>
          <p class="text-xs uppercase tracking-wide text-neutral-500">
            {{ t("admin.payroll.preview.gross") }}
          </p>
          <p class="font-bold text-neutral-900 tabular-nums mt-0.5">
            {{ formatMoney(gross) }}
          </p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-neutral-500">
            {{ t("admin.payroll.preview.totalDeductions") }}
          </p>
          <p class="font-bold text-red-700 tabular-nums mt-0.5">
            − {{ formatMoney(totalDeductions) }}
          </p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wide text-neutral-500">
            {{ t("admin.payroll.preview.taxableBase") }}
          </p>
          <p class="font-bold text-neutral-900 tabular-nums mt-0.5">
            {{ formatMoney(taxable) }}
          </p>
        </div>
      </section>

      <!-- Net -->
      <section
        class="rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div>
          <p class="text-xs uppercase tracking-wider text-white/80">
            {{ t("admin.payroll.preview.net") }}
          </p>
          <p class="text-[11px] text-white/70">
            {{ t("admin.payroll.preview.netFormula") }}
          </p>
        </div>
        <p class="text-3xl font-bold tabular-nums">{{ formatMoney(net) }}</p>
      </section>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  employee: {
    type: Object,
    default: () => ({}),
  },
  month: {
    type: [String, Date],
    default: () => new Date(),
  },
  gains: {
    type: Array,
    default: () => [],
  },
  deductions: {
    type: Array,
    default: () => [],
  },
  gross: {
    type: Number,
    default: 0,
  },
  totalDeductions: {
    type: Number,
    default: 0,
  },
  net: {
    type: Number,
    default: 0,
  },
  taxable: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "MAD",
  },
  locale: {
    type: String,
    default: "fr-MA",
  },
});

const COUNTRY_LABELS = {
  MAR: { fr: "Maroc", en: "Morocco" },
  MA: { fr: "Maroc", en: "Morocco" },
  CI: { fr: "Côte d’Ivoire", en: "Côte d’Ivoire" },
  CIV: { fr: "Côte d’Ivoire", en: "Côte d’Ivoire" },
  SN: { fr: "Sénégal", en: "Senegal" },
  CD: { fr: "République démocratique du Congo", en: "Democratic Republic of the Congo" },
  CG: { fr: "République du Congo", en: "Republic of the Congo" },
  FR: { fr: "France", en: "France" },
  US: { fr: "États-Unis", en: "United States" },
};

const employeeCountryLabel = computed(() => {
  const code = props.employee?.country;
  const language = props.locale.startsWith("en") ? "en" : "fr";
  return COUNTRY_LABELS[code]?.[language] || code || "—";
});

const monthLabel = computed(() => {
  const d = props.month instanceof Date ? props.month : new Date(props.month);
  if (Number.isNaN(d.getTime())) return String(props.month);
  return d.toLocaleDateString(props.locale, { month: "long", year: "numeric" });
});

function formatMoney(value) {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat(props.locale, {
      style: "currency",
      currency: props.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch (e) {
    return `${n.toFixed(2)} ${props.currency}`;
  }
}
</script>
