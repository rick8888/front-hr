<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.simulator.title") }}</h1>
        <p class="text-sm text-neutral-600 mt-1">
          {{ t("admin.payroll.simulator.subtitle") }}
        </p>
      </div>
      <nav
        class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
        :aria-label="t('common.breadcrumb')"
      >
        <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">
          {{ t("admin.payroll.breadcrumb.dashboard") }}
        </RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.payroll") }}</RouterLink>
        <span>/</span>
        <span class="text-neutral-800 font-medium">{{ t("admin.payroll.simulator.breadcrumb") }}</span>
      </nav>
    </div>

    <!-- Bandeau info -->
    <div
      class="mb-6 flex gap-3 rounded-xl border border-info-500/20 bg-info-50 px-4 py-3 text-sm text-neutral-700"
    >
      <span class="flex-shrink-0 text-info-600 mt-0.5" aria-hidden="true">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <p>
        <strong class="text-neutral-900">{{ t("admin.payroll.simulator.modeTitle") }}</strong>
        {{ t("admin.payroll.simulator.modeText") }}
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-5">
      <!-- Colonne gauche : form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Employé & période -->
        <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 class="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-4">
            {{ t("admin.payroll.simulator.employeePeriod") }}
          </h2>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("common.name") }}</label>
              <input v-model="employee.name" type="text" class="input-base text-sm" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("common.country") }}</label>
                <select v-model="employee.country" class="input-base text-sm">
                  <option value="MAR">{{ t("admin.payroll.simulator.morocco") }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("admin.payroll.simulator.month") }}</label>
                <input v-model="month" type="month" class="input-base text-sm" />
              </div>
            </div>
          </div>
        </div>

        <!-- Gains éditables -->
        <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
              {{ t("admin.payroll.simulator.earnings") }}
            </h2>
            <button
              type="button"
              class="text-xs font-semibold text-secondary-600 hover:text-secondary-700"
              @click="addGain"
            >
              {{ t("admin.payroll.simulator.addGain") }}
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="(g, idx) in gainComponents"
              :key="g.code"
              class="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50/40 px-3 py-2"
            >
              <span
                class="w-7 h-7 rounded-md bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0"
              >
                +
              </span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-neutral-900 truncate">{{ g.name }}</p>
                <p class="text-xs text-neutral-500 font-mono">{{ g.code }}</p>
              </div>
              <div class="relative w-32">
                <input
                  v-model.number="g.value"
                  type="number"
                  min="0"
                  step="50"
                  class="input-base text-sm pr-12 text-right tabular-nums"
                />
                <span
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 pointer-events-none"
                >
                  MAD
                </span>
              </div>
              <button
                type="button"
                class="p-1.5 rounded text-neutral-400 hover:text-error-600 hover:bg-error-50"
                :aria-label="t('common.delete')"
                @click="removeComponent(idx, 'gain')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Déductions automatiques -->
        <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
              {{ t("admin.payroll.simulator.deductions") }}
            </h2>
            <span class="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              {{ t("admin.payroll.simulator.autoCalc") }}
            </span>
          </div>
          <div class="space-y-2">
            <div
              v-for="d in computedDeductions"
              :key="d.code"
              class="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/40 px-3 py-2"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span
                  class="w-7 h-7 rounded-md bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold flex-shrink-0"
                >
                  −
                </span>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <p class="text-sm font-medium text-neutral-900 truncate">
                      {{ d.name }}
                    </p>
                    <span
                      v-if="d.auto"
                      class="inline-flex items-center text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600"
                    >
                      {{ t("admin.payroll.simulator.auto") }}
                    </span>
                  </div>
                  <p class="text-xs text-neutral-500 font-mono">{{ d.code }}</p>
                </div>
              </div>
              <span class="font-semibold text-red-700 text-sm tabular-nums">
                − {{ formatMAD(d.value) }}
              </span>
            </div>
          </div>

          <!-- Détails calcul -->
          <dl
            class="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-y-2 gap-x-4 text-xs"
          >
            <dt class="text-neutral-500">{{ t("admin.payroll.simulator.cnssBase") }}</dt>
            <dd class="font-mono text-right text-neutral-800">
              {{ t("admin.payroll.simulator.cnssBaseFormula", { gross: formatMAD(gross) }) }}
            </dd>
            <dt class="text-neutral-500">{{ t("admin.payroll.simulator.amoBase") }}</dt>
            <dd class="font-mono text-right text-neutral-800">{{ formatMAD(gross) }}</dd>
            <dt class="text-neutral-500">{{ t("admin.payroll.simulator.irBase") }}</dt>
            <dd class="font-mono text-right text-neutral-800">{{ formatMAD(taxable) }}</dd>
          </dl>
        </div>

        <!-- Totaux rapides -->
        <div class="rounded-xl bg-neutral-900 text-white p-5 shadow-sm space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-white/70">GROSS</span>
            <span class="font-semibold tabular-nums">{{ formatMAD(gross) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-white/70">CNSS</span>
            <span class="font-semibold tabular-nums text-red-300">
              − {{ formatMAD(cnss) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-white/70">AMO</span>
            <span class="font-semibold tabular-nums text-red-300">
              − {{ formatMAD(amo) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-white/70">IR</span>
            <span class="font-semibold tabular-nums text-red-300">
              − {{ formatMAD(ir) }}
            </span>
          </div>
          <div
            class="flex justify-between pt-2 mt-2 border-t border-white/10 text-base"
          >
            <span class="font-semibold">NET</span>
            <span class="font-bold tabular-nums text-green-300">{{ formatMAD(net) }}</span>
          </div>
        </div>
      </div>

      <!-- Colonne droite : bulletin -->
      <div class="lg:col-span-3">
        <PayrollPreview
          :employee="employee"
          :month="monthDate"
          :gains="gains"
          :deductions="computedDeductions"
          :gross="gross"
          :total-deductions="totalDeductions"
          :taxable="taxable"
          :net="net"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "../../i18n/index.js";
import PayrollPreview from "../../components/payroll/PayrollPreview.vue";
import { usePayrollSimulator } from "../../composables/usePayrollSimulator";

const { t } = useI18n();

const employee = ref({
  id: 1,
  name: "John Doe",
  country: "MAR",
});

const components = ref([
  { code: "BASE_SALARY", name: "Base Salary", type: "gain", value: 10000 },
  { code: "HRA", name: "House Rent Allowance", type: "gain", value: 2000 },
  { code: "TRANSPORT", name: "Transport", type: "gain", value: 500 },
  { code: "CNSS", name: "CNSS", type: "deduction", source_type: "tax" },
  { code: "AMO", name: "AMO", type: "deduction", source_type: "tax" },
  { code: "IR", name: "Income Tax", type: "deduction", source_type: "tax" },
]);

const month = ref(new Date().toISOString().slice(0, 7));

const monthDate = computed(() => {
  const [y, m] = month.value.split("-").map(Number);
  if (!y || !m) return new Date();
  return new Date(y, m - 1, 1);
});

const {
  gains,
  computedDeductions,
  gross,
  cnss,
  amo,
  ir,
  taxable,
  totalDeductions,
  net,
} = usePayrollSimulator(components);

const gainComponents = computed(() =>
  components.value.filter((c) => c.type === "gain")
);

function addGain() {
  const idx = components.value.filter((c) => c.type === "gain").length + 1;
  components.value.push({
    code: `GAIN_${idx}`,
    name: `Gain ${idx}`,
    type: "gain",
    value: 0,
  });
}

function removeComponent(index, type) {
  const list = components.value.filter((c) => c.type === type);
  const target = list[index];
  if (!target) return;
  const realIdx = components.value.findIndex((c) => c === target);
  if (realIdx !== -1) components.value.splice(realIdx, 1);
}

function formatMAD(value) {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch (e) {
    return `${n.toFixed(2)} MAD`;
  }
}
</script>
