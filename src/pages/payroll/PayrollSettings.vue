<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto space-y-6 w-full">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.settings.title") }}</h1>
      <nav
        class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
        :aria-label="t('common.breadcrumb')"
      >
        <RouterLink
          to="/"
          class="inline-flex items-center gap-1 hover:text-secondary-600"
          :aria-label="t('common.home')"
        >
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
            />
          </svg>
          <span>{{ t("common.home") }}</span>
        </RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">
          {{ t("admin.payroll.breadcrumb.payroll") }}
        </RouterLink>
        <span>/</span>
        <span class="text-neutral-800 font-medium">{{ t("admin.payroll.settings.title") }}</span>
      </nav>
    </header>

    <div
      v-if="errorMessage"
      class="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="successMessage"
      class="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700"
    >
      {{ successMessage }}
    </div>
    <div
      v-if="loading"
      class="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 inline-flex items-center gap-2"
    >
      <span
        class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
        aria-hidden="true"
      />
      {{ t("admin.payroll.settings.loading") }}
    </div>

    <div
      class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
      :class="{ 'opacity-70 pointer-events-none': loading }"
    >
      <div class="p-6 pb-4 space-y-8">
      <div class="flex gap-3 pb-6 border-b border-neutral-100">
        <div
          class="w-12 h-12 shrink-0 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-neutral-900">{{ t("admin.payroll.settings.heading") }}</h2>
          <p class="text-sm text-neutral-500 mt-0.5">{{ t("admin.payroll.settings.configure") }}</p>
        </div>
      </div>

      <div class="space-y-6">
        <PayrollSettingsSection
          :title="t('admin.payroll.settings.statutory.title')"
          :subtitle="t('admin.payroll.settings.statutory.subtitle')"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-neutral-600">
              <strong class="text-neutral-800">{{ t("admin.payroll.settings.statutory.auto") }}</strong>
              : {{ t("admin.payroll.settings.statutory.helpAutoBody") }}
              <br />
              <strong class="text-neutral-800">{{ t("admin.payroll.settings.statutory.manual") }}</strong>
              : {{ t("admin.payroll.settings.statutory.helpManualBody") }}
            </p>

            <div class="grid gap-3 sm:grid-cols-2">
              <label
                class="relative flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors"
                :class="
                  form.statutory_mode === 'automatic'
                    ? 'border-secondary-500 bg-secondary-50 ring-1 ring-secondary-500/30'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                "
              >
                <input
                  v-model="form.statutory_mode"
                  type="radio"
                  value="automatic"
                  class="mt-1 text-secondary-600 focus:ring-secondary-500"
                />
                <span>
                  <span class="block text-sm font-semibold text-neutral-900">
                    {{ t("admin.payroll.settings.statutory.auto") }}
                  </span>
                  <span class="mt-0.5 block text-xs text-neutral-500">
                    {{ t("admin.payroll.settings.statutory.autoHint") }}
                  </span>
                </span>
              </label>

              <label
                class="relative flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors"
                :class="
                  form.statutory_mode === 'manual'
                    ? 'border-secondary-500 bg-secondary-50 ring-1 ring-secondary-500/30'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                "
              >
                <input
                  v-model="form.statutory_mode"
                  type="radio"
                  value="manual"
                  class="mt-1 text-secondary-600 focus:ring-secondary-500"
                />
                <span>
                  <span class="block text-sm font-semibold text-neutral-900">
                    {{ t("admin.payroll.settings.statutory.manual") }}
                  </span>
                  <span class="mt-0.5 block text-xs text-neutral-500">
                    {{ t("admin.payroll.settings.statutory.manualHint") }}
                  </span>
                </span>
              </label>
            </div>

            <div
              v-if="lastSync"
              class="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600"
            >
              {{ t("admin.payroll.settings.statutory.lastSync") }}
              <span v-if="lastSync.mode === 'manual'">
                {{
                  t("admin.payroll.settings.statutory.syncManual", {
                    created: lastSync.created,
                    restored: lastSync.restored,
                    total: lastSync.total_visible,
                  })
                }}
              </span>
              <span v-else>
                {{
                  t("admin.payroll.settings.statutory.syncAuto", {
                    hidden: lastSync.hidden,
                  })
                }}
              </span>
            </div>
          </div>
        </PayrollSettingsSection>

        <PayrollSettingsSection
          :title="t('admin.payroll.settings.general.title')"
          :subtitle="t('admin.payroll.settings.general.subtitle')"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </template>
          <div class="grid md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-neutral-800">
                {{ t("admin.payroll.settings.prefix") }}
              </label>
              <input
                v-model="form.payroll_prefix"
                type="text"
                class="input-base mt-1"
                :placeholder="t('admin.payroll.settings.prefixPlaceholder')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-800">
                {{ t("admin.payroll.settings.defaultPeriod") }}
              </label>
              <select v-model="form.default_pay_period" class="input-base mt-1">
                <option value="" disabled>{{ t("admin.payroll.settings.choosePeriod") }}</option>
                <option
                  v-for="opt in cycleOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-800">
                {{ t("admin.payroll.settings.startDay") }}
              </label>
              <input
                v-model.number="form.payroll_start_day"
                type="number"
                min="1"
                max="31"
                class="input-base mt-1"
                placeholder="ex. 1"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-800">
                {{ t("admin.payroll.settings.endDay") }}
              </label>
              <input
                v-model.number="form.payroll_end_day"
                type="number"
                min="1"
                max="31"
                class="input-base mt-1"
                placeholder="ex. 31"
              />
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-neutral-800">
                {{ t("admin.payroll.settings.payDateOffset") }}
              </label>
              <input
                v-model.number="form.pay_date_offset_days"
                type="number"
                min="0"
                class="input-base mt-1 max-w-full md:max-w-xs"
                placeholder="ex. 5"
              />
            </div>
          </div>
        </PayrollSettingsSection>

        <PayrollSettingsSection
          :title="t('admin.payroll.settings.calc.title')"
          :subtitle="t('admin.payroll.settings.calc.subtitle')"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </template>
          <div class="max-w-md">
            <label class="block text-sm font-medium text-neutral-800">
              {{ t("admin.payroll.settings.workingDays") }}
            </label>
            <input
              v-model.number="form.working_days_per_month"
              type="number"
              min="1"
              max="31"
              class="input-base mt-1"
              placeholder="ex. 22"
            />
          </div>
        </PayrollSettingsSection>

        <PayrollSettingsSection
          :title="t('admin.payroll.settings.lop.title')"
          :subtitle="t('admin.payroll.settings.lop.subtitle')"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 14h6"
              />
            </svg>
          </template>
          <div class="space-y-5">
            <PayrollSettingsToggle
              v-model="form.lop_deduction_enabled"
              :label="t('admin.payroll.settings.lop.enable')"
              :description="t('admin.payroll.settings.lop.enableDesc')"
            />
            <div class="max-w-xl">
              <label class="block text-sm font-medium text-neutral-800">
                {{ t("admin.payroll.settings.lop.method") }}
              </label>
              <select v-model="form.lop_calculation_method" class="input-base mt-1">
                <option value="" disabled>{{ t("admin.payroll.settings.lop.chooseMethod") }}</option>
                <option value="working_days">{{ t("admin.payroll.settings.lop.workingDays") }}</option>
                <option value="calendar_days">{{ t("admin.payroll.settings.lop.calendarDays") }}</option>
              </select>
            </div>
            <PayrollSettingsToggle
              v-model="form.lop_include_weekends"
              :label="t('admin.payroll.settings.lop.weekends')"
              :description="t('admin.payroll.settings.lop.weekendsDesc')"
            />
            <PayrollSettingsToggle
              v-model="form.lop_include_holidays"
              :label="t('admin.payroll.settings.lop.holidays')"
              :description="t('admin.payroll.settings.lop.holidaysDesc')"
            />
            <div class="max-w-xl">
              <label class="block text-sm font-medium text-neutral-800">
                {{ t("admin.payroll.settings.lop.round") }}
              </label>
              <select v-model="form.lop_round_mode" class="input-base mt-1">
                <option value="" disabled>{{ t("admin.payroll.settings.lop.chooseRound") }}</option>
                <option value="none">{{ t("admin.payroll.settings.lop.roundNone") }}</option>
                <option value="half">{{ t("admin.payroll.settings.lop.roundHalf") }}</option>
                <option value="whole">{{ t("admin.payroll.settings.lop.roundWhole") }}</option>
              </select>
            </div>
          </div>
        </PayrollSettingsSection>

        <PayrollSettingsSection
          :title="t('admin.payroll.settings.features.title')"
          :subtitle="t('admin.payroll.settings.features.subtitle')"
        >
          <template #icon>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </template>
          <div class="space-y-5">
            <PayrollSettingsToggle
              v-model="form.expense_reimbursement_enabled"
              :label="t('admin.payroll.settings.features.expenses')"
              :description="t('admin.payroll.settings.features.expensesDesc')"
            />
            <PayrollSettingsToggle
              v-model="form.loan_deductions_enabled"
              :label="t('admin.payroll.settings.features.loans')"
              :description="t('admin.payroll.settings.features.loansDesc')"
            />
          </div>
        </PayrollSettingsSection>
      </div>
      </div>

      <div
        class="flex flex-wrap items-center gap-3 px-6 py-3 border-t border-neutral-100 bg-white"
      >
        <button
          type="button"
          class="btn-secondary inline-flex items-center gap-2"
          :disabled="saving || loading"
          @click="save"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-.293-.707l-2-2A1 1 0 0014 9z"
            />
          </svg>
          {{ saving ? t("common.saving") : t("common.save") }}
        </button>
        <button
          type="button"
          class="btn-outline inline-flex items-center gap-2"
          :disabled="saving || loading"
          @click="reset"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ t("common.reset") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "../../i18n/index.js";
import PayrollSettingsSection from "../../components/payroll/PayrollSettingsSection.vue";
import PayrollSettingsToggle from "../../components/payroll/PayrollSettingsToggle.vue";
import { usePayrollSettingsStore } from "./stores/payroll-settings.store.js";
import {
  fallbackPayrollCycles,
  payrollCyclesApiService,
} from "./services/payrollCycles.api.service.js";

const { t } = useI18n();

const store = usePayrollSettingsStore();
const {
  form,
  loading,
  saving,
  error: errorMessage,
  successMessage,
  lastSync,
} = storeToRefs(store);

async function save() {
  try {
    await store.saveSettings();
  } catch {
    /* message déjà dans store.error */
  }
}

function reset() {
  store.resetToSnapshot();
}

const cycleCatalog = ref(fallbackPayrollCycles());
const cycleOptions = computed(() =>
  cycleCatalog.value
    .filter((item) => item.isActive)
    .map((item) => ({ value: item.code, label: item.name }))
);

onMounted(() => {
  store.fetchSettings().catch(() => {});
  payrollCyclesApiService
    .fetchAll({ activeOnly: true })
    .then((list) => {
      cycleCatalog.value = list.length ? list : fallbackPayrollCycles();
    })
    .catch(() => {
      cycleCatalog.value = fallbackPayrollCycles();
    });
});
</script>
