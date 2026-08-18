<template>
  <div v-if="detail" class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto space-y-6">
    <!-- En-tête : titre à gauche ; fil d’Ariane puis retour empilés à droite (comme la maquette) -->
    <header class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <h1 class="text-2xl font-bold text-neutral-900 shrink-0">{{ t("admin.payroll.adjustments.title") }}</h1>
      <div class="flex flex-col items-stretch gap-2 sm:items-end">
        <nav
          class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
          :aria-label="t('common.breadcrumb')"
        >
          <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
          <span>/</span>
          <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.dashboard") }}</RouterLink>
          <span>/</span>
          <RouterLink to="/payroll/records" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.payroll") }}</RouterLink>
          <span>/</span>
          <RouterLink :to="`/payroll/show/${detail.id}`" class="hover:text-secondary-600">
            {{ detail.payrollNumber }}
          </RouterLink>
          <span>/</span>
          <span class="text-neutral-800 font-medium">{{ t("admin.payroll.adjustments.breadcrumb") }}</span>
        </nav>
        <RouterLink
          :to="`/payroll/show/${detail.id}`"
          class="btn-outline inline-flex items-center justify-center gap-2 text-sm w-full sm:w-auto self-end"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {{ t("admin.payroll.adjustments.back") }}
        </RouterLink>
      </div>
    </header>

    <div
      v-if="recalcSuccessVisible"
      class="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800 flex items-center gap-2"
      role="status"
    >
      <svg class="w-5 h-5 shrink-0 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>{{ t("admin.payroll.adjustments.recalcSuccess") }}</span>
    </div>

    <p
      v-if="pendingRecalcHint"
      class="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2"
    >
      {{ pendingHintText }}
    </p>

    <!-- Carte 1 : infos paie | décomposition salaire (deux colonnes nettes) -->
    <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="flex flex-col lg:flex-row lg:divide-x divide-neutral-200">
        <div class="p-6 lg:w-1/2 lg:min-h-[1px]">
          <h2 class="text-base font-semibold text-neutral-900 mb-4">{{ t("admin.payroll.adjustments.info") }}</h2>
          <dl class="space-y-4 text-sm">
            <div>
              <dt class="text-neutral-500">{{ t("admin.payroll.adjustments.payrollNumber") }}</dt>
              <dd class="mt-1 font-medium text-neutral-900">{{ detail.payrollNumber }}</dd>
            </div>
            <div>
              <dt class="text-neutral-500">{{ t("common.employee") }}</dt>
              <dd class="mt-1 font-medium text-neutral-900">{{ detail.employeeName }}</dd>
            </div>
            <div>
              <dt class="text-neutral-500">{{ t("admin.payroll.col.period") }}</dt>
              <dd class="mt-1 font-medium text-neutral-900">{{ detail.periodLabel }}</dd>
            </div>
            <div>
              <dt class="text-neutral-500">{{ t("common.status") }}</dt>
              <dd class="mt-2">
                <span :class="['inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium', statusBadgeClass(detail.status)]">
                  {{ statusLabel(detail.status) }}
                </span>
              </dd>
            </div>
          </dl>
        </div>
        <div class="p-6 lg:w-1/2 lg:min-h-[1px]">
          <h2 class="text-base font-semibold text-neutral-900 mb-4">{{ t("admin.payroll.adjustments.breakdown") }}</h2>
          <dl class="space-y-4 text-sm">
            <div class="flex justify-between gap-4 items-baseline">
              <dt class="text-neutral-500">{{ t("admin.payroll.col.basicSalary") }}</dt>
              <dd class="font-semibold text-neutral-900 tabular-nums">{{ formatMoney(breakdown.basic) }}</dd>
            </div>
            <div class="flex justify-between gap-4 items-baseline">
              <dt class="text-neutral-500">{{ t("admin.payroll.col.grossSalary") }}</dt>
              <dd class="font-semibold text-neutral-900 tabular-nums">{{ formatMoney(breakdown.gross) }}</dd>
            </div>
            <div class="flex justify-between gap-4 items-baseline">
              <dt class="text-neutral-500">{{ t("admin.payroll.adjustments.totalDeductions") }}</dt>
              <dd class="font-semibold text-red-600 tabular-nums">{{ formatMoney(breakdown.totalDeductions) }}</dd>
            </div>
            <div class="flex justify-between gap-4 items-baseline pt-4 border-t border-neutral-100">
              <dt class="text-neutral-500">{{ t("admin.payroll.col.netSalary") }}</dt>
              <dd class="text-base font-bold text-success-700 tabular-nums">{{ formatMoney(breakdown.net) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Carte 2 : formulaire — ligne 1 (Type, Name, Amount, bouton) ; ligne 2 (Reason) -->
    <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-neutral-200">
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.payroll.adjustments.addTitle") }}</h2>
        <p class="text-sm text-neutral-500 mt-1">{{ t("admin.payroll.adjustments.addSubtitle") }}</p>
      </div>
      <div class="p-6 space-y-5">
        <div class="flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-end">
          <div class="w-full xl:w-[200px] shrink-0">
            <label class="block text-xs font-medium text-neutral-600 mb-1">
              {{ t("common.type") }} <span class="text-error-500">*</span>
            </label>
            <select v-model="form.type" class="input-base text-sm">
              <option value="">{{ t("admin.payroll.adjustments.selectType") }}</option>
              <option value="earning">{{ t("admin.payroll.earning") }}</option>
              <option value="deduction">{{ t("admin.payroll.deduction") }}</option>
            </select>
          </div>
          <div class="w-full xl:flex-1 xl:min-w-[200px]">
            <label class="block text-xs font-medium text-neutral-600 mb-1">
              {{ t("common.name") }} <span class="text-error-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="input-base text-sm"
              :placeholder="t('admin.payroll.adjustments.namePlaceholder')"
            />
          </div>
          <div class="w-full xl:w-[200px] shrink-0">
            <label class="block text-xs font-medium text-neutral-600 mb-1">
              {{ t("common.amount") }} <span class="text-error-500">*</span>
            </label>
            <div
              class="flex rounded-lg overflow-hidden border border-neutral-300 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500"
            >
              <span class="px-3 py-2 text-sm text-neutral-500 bg-neutral-50 border-r border-neutral-300 shrink-0">$</span>
              <input
                v-model.number="form.amount"
                type="number"
                min="0"
                step="0.01"
                class="w-full min-w-0 px-3 py-2 text-sm focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
          <div class="w-full xl:w-auto shrink-0">
            <button
              type="button"
              class="btn-primary w-full xl:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5"
              @click="addAdjustment"
            >
              <span class="text-lg leading-none font-semibold">+</span>
              {{ t("admin.payroll.adjustments.addBtn") }}
            </button>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-neutral-600 mb-1">{{ t("common.reason") }}</label>
          <textarea
            v-model="form.reason"
            rows="4"
            class="input-base text-sm resize-y min-h-[100px]"
            :placeholder="t('admin.payroll.adjustments.reasonPlaceholder')"
          />
        </div>
        <p v-if="error" class="text-sm text-error-600">{{ error }}</p>
      </div>
    </section>

    <!-- Carte 3 : titre + sous-titre à gauche, Recalculate à droite ; tableau ; bandeau récap bleu clair -->
    <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-neutral-200 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.payroll.adjustments.historyTitle") }}</h2>
          <p class="text-sm text-neutral-500 mt-1">{{ t("admin.payroll.adjustments.historySubtitle") }}</p>
        </div>
        <button
          type="button"
          class="shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors inline-flex items-center justify-center gap-2 self-start sm:self-auto"
          @click="openRecalcConfirm"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ t("admin.payroll.show.recalculate") }}
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[960px]">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-left text-neutral-600">
              <th class="pl-6 pr-3 py-3 font-semibold uppercase text-[11px] tracking-wide text-neutral-500">
                {{ t("admin.payroll.adjustments.col.datetime") }}
              </th>
              <th class="px-3 py-3 font-semibold uppercase text-[11px] tracking-wide text-neutral-500">{{ t("common.type") }}</th>
              <th class="px-3 py-3 font-semibold uppercase text-[11px] tracking-wide text-neutral-500">{{ t("common.name") }}</th>
              <th class="px-3 py-3 font-semibold uppercase text-[11px] tracking-wide text-neutral-500 text-right">{{ t("common.amount") }}</th>
              <th class="px-3 py-3 font-semibold uppercase text-[11px] tracking-wide text-neutral-500">{{ t("common.reason") }}</th>
              <th class="px-3 py-3 font-semibold uppercase text-[11px] tracking-wide text-neutral-500">
                {{ t("admin.payroll.adjustments.col.addedBy") }}
              </th>
              <th class="pr-6 pl-3 py-3 font-semibold uppercase text-[11px] tracking-wide text-neutral-500 text-right w-24">
                {{ t("common.actions") }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="history.length === 0">
              <td colspan="7" class="px-6 py-10 text-center text-neutral-500 text-sm">{{ t("admin.payroll.adjustments.empty") }}</td>
            </tr>
            <template v-else>
              <tr v-for="a in history" :key="a.id" class="hover:bg-neutral-50/60">
              <td class="pl-6 pr-3 py-3.5 text-neutral-700 whitespace-nowrap">{{ a.datetime }}</td>
              <td class="px-3 py-3.5">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                    a.type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ a.type === "earning" ? t("admin.payroll.adjustments.earningBadge") : t("admin.payroll.adjustments.deductionBadge") }}
                </span>
              </td>
              <td class="px-3 py-3.5 font-medium text-neutral-900">{{ a.name }}</td>
              <td
                class="px-3 py-3.5 text-right font-semibold tabular-nums whitespace-nowrap"
                :class="a.type === 'earning' ? 'text-green-700' : 'text-red-600'"
              >
                {{ a.type === "earning" ? "+" : "−" }}{{ formatMoney(a.amount) }}
              </td>
              <td class="px-3 py-3.5 text-neutral-600 max-w-xs">{{ a.reason || "—" }}</td>
              <td class="px-3 py-3.5 text-neutral-600">{{ a.addedBy }}</td>
              <td class="pr-6 pl-3 py-3.5 text-right">
                <button
                  type="button"
                  class="inline-flex items-center justify-center p-2 rounded-lg text-error-600 hover:bg-error-50 transition-colors"
                  :title="t('admin.payroll.adjustments.deleteTitle')"
                  :aria-label="t('common.delete')"
                  @click="removeAdjustment(a)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 bg-sky-50 border-t border-sky-100 text-sm text-neutral-800">
        <p class="font-medium leading-relaxed">
          {{ t("admin.payroll.adjustments.impact") }}
          <span :class="netImpact >= 0 ? 'text-green-700' : 'text-red-600'" class="font-semibold tabular-nums">
            {{ netImpact >= 0 ? "+" : "−" }}{{ formatMoney(Math.abs(netImpact)) }}
          </span>
          <span class="text-neutral-600 font-normal">
            ({{ t("admin.payroll.adjustments.impactEarnings") }}
            <span class="text-green-700 font-semibold tabular-nums">+{{ formatMoney(earningsTotal) }}</span>,
            {{ t("admin.payroll.adjustments.impactDeductions") }}
            <span class="text-red-600 font-semibold tabular-nums">−{{ formatMoney(deductionsTotal) }}</span>)
          </span>
        </p>
      </div>
    </section>
  </div>

  <div v-else class="px-4 py-10 sm:px-8 sm:py-16 max-w-lg mx-auto text-center">
    <p class="text-lg font-semibold text-neutral-900">{{ t("admin.payroll.show.notFound") }}</p>
    <p class="text-sm text-neutral-600 mt-2">{{ t("admin.payroll.show.notFoundHint") }}</p>
    <RouterLink to="/payroll/records" class="btn-secondary inline-flex mt-6">{{ t("admin.payroll.show.backToList") }}</RouterLink>
  </div>

  <!-- Modale confirmation style SweetAlert -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="recalcConfirmOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-[1px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recalc-dialog-title"
        @click.self="closeRecalcConfirm"
      >
        <div
          class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden transform transition-all"
          @click.stop
        >
          <div class="px-6 pt-8 pb-2 flex flex-col items-center text-center">
            <div
              class="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 ring-4 ring-amber-50"
            >
              <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h2 id="recalc-dialog-title" class="text-xl font-bold text-neutral-900">{{ t("admin.payroll.adjustments.recalcConfirmTitle") }}</h2>
            <p class="mt-3 text-sm text-neutral-600 leading-relaxed">
              {{ recalcConfirmText }}
            </p>
          </div>
          <div class="px-6 py-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-center border-t border-neutral-100 bg-neutral-50/80">
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors"
              @click="closeRecalcConfirm"
            >
              {{ t("common.cancel") }}
            </button>
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors"
              @click="confirmRecalculate"
            >
              {{ t("admin.payroll.show.recalcConfirmYes") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Loader pendant recalcul (après confirmation) -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="recalcLoading"
        class="fixed inset-0 z-[205] flex items-center justify-center p-6 bg-neutral-900/60 backdrop-blur-sm"
        role="alertdialog"
        aria-busy="true"
        aria-live="polite"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl border border-neutral-200 px-10 py-9 max-w-sm w-full flex flex-col items-center text-center"
        >
          <div
            class="w-14 h-14 rounded-full border-4 border-amber-100 border-t-amber-600 animate-spin mb-5"
            aria-hidden="true"
          />
          <p class="text-base font-semibold text-neutral-900">{{ t("admin.payroll.show.recalcLoadingTitle") }}</p>
          <p class="text-sm text-neutral-500 mt-2">{{ t("admin.payroll.show.recalcLoadingHint") }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "../../i18n/index.js";
import { getPayrollDetail } from "../../data/payrollRecordsDemo.js";

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

const STATUS = {
  paid: { badge: "bg-green-100 text-green-800" },
  pending: { badge: "bg-orange-100 text-orange-800" },
  approved: { badge: "bg-sky-100 text-sky-800" },
};

const route = useRoute();
const { t, bcp47 } = useI18n();
const detail = computed(() => getPayrollDetail(route.params.id));

const pendingHintText = computed(() =>
  t("admin.payroll.adjustments.pendingHint", { action: t("admin.payroll.show.recalculate") })
);

const recalcConfirmText = computed(() =>
  t("admin.payroll.adjustments.recalcConfirmText", {
    gross: t("admin.payroll.adjustments.gross"),
    deductions: t("admin.payroll.adjustments.deductions"),
    net: t("admin.payroll.adjustments.net"),
  })
);

const error = ref("");
const form = ref({
  type: "",
  name: "",
  amount: 0,
  reason: "",
});

function formatDatetime() {
  return new Date().toLocaleString(bcp47.value, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function defaultHistoryRows() {
  return [
    {
      id: Date.now(),
      datetime: formatDatetime(),
      type: "earning",
      name: "carburant",
      amount: 500,
      reason: "une demonstration",
      addedBy: t("admin.payroll.adjustments.system"),
    },
  ];
}

const history = ref(defaultHistoryRows());

const earningsTotal = computed(() =>
  history.value.filter((h) => h.type === "earning").reduce((s, h) => s + (Number(h.amount) || 0), 0)
);
const deductionsTotal = computed(() =>
  history.value.filter((h) => h.type === "deduction").reduce((s, h) => s + (Number(h.amount) || 0), 0)
);
const netImpact = computed(() => earningsTotal.value - deductionsTotal.value);

/** Après confirmation : brut / retenues / net recalculés à partir des ajustements */
const breakdownOverride = ref(null);
/** Signature de l’historique au dernier recalcul — pour afficher l’alerte « en attente » */
const appliedHistorySignature = ref(null);

const breakdown = computed(() => {
  const d = detail.value;
  if (!d) return { basic: 0, gross: 0, totalDeductions: 0, net: 0 };
  if (breakdownOverride.value) {
    return {
      basic: d.basicSalary,
      gross: breakdownOverride.value.gross,
      totalDeductions: breakdownOverride.value.totalDeductions,
      net: breakdownOverride.value.net,
    };
  }
  return {
    basic: d.basicSalary,
    gross: d.grossSalary,
    totalDeductions: d.totalDeductions,
    net: d.netSalary,
  };
});

const historySignature = computed(() =>
  JSON.stringify(
    [...history.value]
      .slice()
      .sort((a, b) => a.id - b.id)
      .map((h) => `${h.id}:${h.type}:${h.amount}`)
  )
);

const pendingRecalcHint = computed(
  () =>
    appliedHistorySignature.value !== null &&
    historySignature.value !== appliedHistorySignature.value
);

const recalcConfirmOpen = ref(false);
const recalcSuccessVisible = ref(false);
const recalcLoading = ref(false);
let recalcSuccessTimer = null;
let recalcProcessTimer = null;

function openRecalcConfirm() {
  recalcConfirmOpen.value = true;
}

function closeRecalcConfirm() {
  recalcConfirmOpen.value = false;
}

function confirmRecalculate() {
  if (recalcLoading.value) return;
  const d = detail.value;
  if (!d) return;
  const e = earningsTotal.value;
  const ded = deductionsTotal.value;
  closeRecalcConfirm();
  recalcLoading.value = true;
  if (recalcProcessTimer) clearTimeout(recalcProcessTimer);
  recalcProcessTimer = setTimeout(() => {
    breakdownOverride.value = {
      gross: round2(d.grossSalary + e),
      totalDeductions: round2(d.totalDeductions + ded),
      net: round2(d.grossSalary + e - (d.totalDeductions + ded)),
    };
    try {
      sessionStorage.setItem(
        `payroll:manualAdjustTotals:${String(route.params.id)}`,
        JSON.stringify({ e, ded })
      );
    } catch {
      /* ignore quota / private mode */
    }
    appliedHistorySignature.value = historySignature.value;
    recalcSuccessVisible.value = true;
    if (recalcSuccessTimer) clearTimeout(recalcSuccessTimer);
    recalcSuccessTimer = setTimeout(() => {
      recalcSuccessVisible.value = false;
      recalcSuccessTimer = null;
    }, 4000);
    recalcLoading.value = false;
    recalcProcessTimer = null;
  }, 2200);
}

function formatMoney(n) {
  return new Intl.NumberFormat(bcp47.value, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);
}

function statusLabel(key) {
  const translated = t(`admin.payroll.status.${key}`);
  if (translated !== `admin.payroll.status.${key}`) return translated;
  return key;
}

function statusBadgeClass(key) {
  return STATUS[key]?.badge ?? "bg-neutral-100 text-neutral-700";
}

function addAdjustment() {
  error.value = "";
  const f = form.value;
  if (!f.type || !f.name?.trim() || !(Number(f.amount) > 0)) {
    error.value = t("admin.payroll.adjustments.formError");
    return;
  }
  history.value.unshift({
    id: Date.now(),
    datetime: formatDatetime(),
    type: f.type,
    name: f.name.trim(),
    amount: Number(f.amount),
    reason: (f.reason || "").trim(),
    addedBy: t("admin.payroll.adjustments.system"),
  });
  form.value = { type: "", name: "", amount: 0, reason: "" };
}

function removeAdjustment(row) {
  if (!confirm(t("admin.payroll.adjustments.deleteConfirm", { name: row.name }))) return;
  history.value = history.value.filter((h) => h.id !== row.id);
}

watch(
  () => route.params.id,
  () => {
    history.value = defaultHistoryRows();
    breakdownOverride.value = null;
    appliedHistorySignature.value = null;
    recalcConfirmOpen.value = false;
    recalcLoading.value = false;
    if (recalcProcessTimer) {
      clearTimeout(recalcProcessTimer);
      recalcProcessTimer = null;
    }
    recalcSuccessVisible.value = false;
    if (recalcSuccessTimer) {
      clearTimeout(recalcSuccessTimer);
      recalcSuccessTimer = null;
    }
  }
);

watch(
  () => [route.params.id, detail.value],
  () => {
    if (detail.value?.payrollNumber) {
      document.title = t("admin.payroll.adjustments.docTitle", { number: detail.value.payrollNumber });
    } else {
      document.title = t("admin.payroll.adjustments.title");
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (recalcSuccessTimer) clearTimeout(recalcSuccessTimer);
  if (recalcProcessTimer) clearTimeout(recalcProcessTimer);
});
</script>
