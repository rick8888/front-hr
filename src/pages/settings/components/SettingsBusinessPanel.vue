<template>
  <div class="p-8 space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-neutral-900">{{ t('settings.business.title') }}</h2>
        <p class="text-sm text-neutral-600 mt-1">
          {{ t('settings.business.subtitle') }}
        </p>
      </div>
      <button
        type="button"
        class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold disabled:opacity-50 shrink-0"
        :disabled="saving"
        @click="saveRules"
      >
        {{ saving ? t('settings.business.saving') : t('settings.business.save') }}
      </button>
    </div>

    <div
      v-if="error"
      class="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ error }}
    </div>
    <div
      v-if="message"
      class="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800"
    >
      {{ message }}
    </div>

    <!-- Compteurs catalogues (API) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <div
        v-for="card in catalogCards"
        :key="card.labelKey"
        class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4"
      >
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">
          {{ card.label }}
        </p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 tabular-nums">
          {{ loading ? "…" : card.active }}
        </p>
        <p class="text-xs text-neutral-500 mt-1">
          {{ loading ? t('common.loading') : t('settings.business.catalogTotal', { n: card.total }) }}
        </p>
      </div>
    </div>

    <!-- Règles globales -->
    <section class="rounded-xl border border-neutral-200 p-6">
      <h3 class="text-base font-semibold text-neutral-900 mb-1">{{ t('settings.business.globalRules') }}</h3>
      <p class="text-xs text-neutral-500 mb-4">
        {{ t('settings.business.globalRulesHint') }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1.5">
            {{ t('settings.business.defaultContract') }}
          </label>
          <select v-model="rules.defaultContractType" class="input-base text-sm w-full">
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Temps Partiel">Temps partiel</option>
            <option value="Stage">Stage</option>
            <option value="Interimaire">Intérimaire</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1.5">
            {{ t('settings.business.payrollCutoff') }}
          </label>
          <input
            v-model.number="rules.payrollCutoffDay"
            type="number"
            min="1"
            max="31"
            class="input-base text-sm w-full"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
        <label class="flex items-start gap-2.5 text-sm text-neutral-700 cursor-pointer">
          <input
            v-model="rules.enforceUniqueTypeCode"
            type="checkbox"
            class="mt-0.5 w-4 h-4 text-primary-600 rounded border-neutral-300"
          />
          <span>{{ t('settings.business.rule.enforceUniqueTypeCode') }}</span>
        </label>
        <label class="flex items-start gap-2.5 text-sm text-neutral-700 cursor-pointer">
          <input
            v-model="rules.allowNegativeLeaveBalance"
            type="checkbox"
            class="mt-0.5 w-4 h-4 text-primary-600 rounded border-neutral-300"
          />
          <span>{{ t('settings.business.rule.allowNegativeLeaveBalance') }}</span>
        </label>
        <label class="flex items-start gap-2.5 text-sm text-neutral-700 cursor-pointer">
          <input
            v-model="rules.requireValidationForCompensation"
            type="checkbox"
            class="mt-0.5 w-4 h-4 text-primary-600 rounded border-neutral-300"
          />
          <span>{{ t('settings.business.rule.requireValidationForCompensation') }}</span>
        </label>
      </div>
    </section>

    <!-- Accès rapides -->
    <section class="rounded-xl border border-neutral-200 p-6">
      <h3 class="text-base font-semibold text-neutral-900 mb-4">{{ t('settings.business.detailedConfig') }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 transition-colors"
        >
          <span>{{ link.label }}</span>
          <svg class="w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
        <button
          type="button"
          class="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 transition-colors text-left"
          @click="$emit('go-tab', 'departments')"
        >
          <span>{{ t('settings.tabs.departments') }}</span>
          <svg class="w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          class="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 transition-colors text-left"
          @click="$emit('go-tab', 'holidays')"
        >
          <span>{{ t('settings.tabs.holidays') }}</span>
          <svg class="w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          type="button"
          class="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800 transition-colors text-left"
          @click="$emit('go-tab', 'whatsapp')"
        >
          <span>{{ t('settings.whatsapp.title') }}</span>
          <svg class="w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "../../../i18n/index.js";
import { useBusinessSettings } from "../composables/useBusinessSettings.js";

defineEmits(["go-tab"]);

const { t, locale } = useI18n();
const { loading, saving, error, message, rules, stats, saveRules } = useBusinessSettings();

const catalogCards = computed(() => {
  void locale.value;
  return [
    {
      labelKey: "settings.business.catalog.leaveTypes",
      label: t("settings.business.catalog.leaveTypes"),
      active: stats.value.leaveTypesActive,
      total: stats.value.leaveTypes,
    },
    {
      labelKey: "settings.business.catalog.shifts",
      label: t("settings.business.catalog.shifts"),
      active: stats.value.shiftsActive,
      total: stats.value.shifts,
    },
    {
      labelKey: "settings.business.catalog.payrollComponents",
      label: t("settings.business.catalog.payrollComponents"),
      active: stats.value.payrollComponentsActive,
      total: stats.value.payrollComponents,
    },
    {
      labelKey: "settings.business.catalog.departments",
      label: t("settings.business.catalog.departments"),
      active: stats.value.departmentsActive,
      total: stats.value.departments,
    },
    {
      labelKey: "settings.business.catalog.holidays",
      label: t("settings.business.catalog.holidays"),
      active: stats.value.holidaysActive,
      total: stats.value.holidays,
    },
  ];
});

const quickLinks = computed(() => {
  void locale.value;
  return [
    { label: t("settings.business.quickLinks.leaveTypes"), to: "/leave-management/types" },
    { label: t("settings.business.quickLinks.shifts"), to: "/attendance/shifts" },
    { label: t("settings.business.quickLinks.payrollComponents"), to: "/payroll/components" },
    { label: t("settings.business.quickLinks.salaryStructures"), to: "/payroll/salary-structures" },
    { label: t("settings.business.quickLinks.payrollSettings"), to: "/payroll/settings" },
  ];
});
</script>
