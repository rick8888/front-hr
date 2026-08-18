<template>
  <Teleport to="body">
    <div
      v-if="modelValue && profile"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="close"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comp-details-title"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between gap-3 px-6 py-4 border-b border-neutral-200 flex-shrink-0"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <span
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600 flex-shrink-0"
              aria-hidden="true"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <h2
              id="comp-details-title"
              class="text-lg font-semibold text-neutral-900 truncate"
            >
              {{ t("admin.payroll.compensation.title") }}
            </h2>
          </div>
          <button
            type="button"
            class="text-neutral-400 hover:text-neutral-700 text-2xl leading-none p-1"
            :aria-label="t('common.close')"
            @click="close"
          >
            ×
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 overflow-y-auto space-y-5 flex-1 min-h-0">
          <!-- Profile -->
          <div
            class="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-secondary-700 font-semibold text-sm flex-shrink-0 bg-secondary-100"
              >
                {{ profile.initials }}
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-neutral-900 truncate">{{ profile.name }}</p>
                <p class="text-sm text-neutral-500 truncate">{{ profile.email }}</p>
              </div>
            </div>
            <span
              class="inline-flex self-start sm:self-center px-2.5 py-1 rounded-md bg-secondary-50 text-secondary-700 text-xs font-semibold tracking-wide"
            >
              {{ profile.empCode }}
            </span>
          </div>

          <!-- KPIs -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              class="rounded-xl border border-neutral-200 bg-white p-4 flex items-start gap-3 shadow-sm"
            >
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-50 text-secondary-600 flex-shrink-0"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 10h16M4 14h10M4 18h8"
                  />
                </svg>
              </span>
              <div>
                <p class="text-xs font-medium text-neutral-500">{{ t("admin.payroll.compensation.total") }}</p>
                <p class="text-2xl font-bold text-neutral-900 mt-0.5">
                  {{ kpis.totalComponents }}
                </p>
              </div>
            </div>
            <div
              class="rounded-xl border border-neutral-200 bg-white p-4 flex items-start gap-3 shadow-sm"
            >
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-success-50 text-success-600 flex-shrink-0"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <div>
                <p class="text-xs font-medium text-neutral-500">{{ t("admin.payroll.compensation.active") }}</p>
                <p class="text-2xl font-bold text-neutral-900 mt-0.5">
                  {{ kpis.activeComponents }}
                </p>
              </div>
            </div>
            <div
              class="rounded-xl border border-neutral-200 bg-white p-4 flex items-start gap-3 shadow-sm"
            >
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-success-50 text-success-600 flex-shrink-0"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <div>
                <p class="text-xs font-medium text-neutral-500">{{ t("admin.payroll.compensation.base") }}</p>
                <span
                  class="inline-flex mt-1.5 px-2 py-0.5 rounded text-xs font-semibold"
                  :class="
                    kpis.baseConfigured
                      ? 'bg-success-50 text-success-700'
                      : 'bg-warning-50 text-warning-700'
                  "
                >
                  {{
                    kpis.baseConfigured
                      ? t("admin.payroll.compensation.configured")
                      : t("admin.payroll.compensation.missing")
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead class="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                  <tr>
                    <th class="px-4 py-3 text-left font-medium">{{ t("admin.payroll.builder.component") }}</th>
                    <th class="px-4 py-3 text-left font-medium">{{ t("common.type") }}</th>
                    <th class="px-4 py-3 text-left font-medium">{{ t("admin.payroll.builder.value") }}</th>
                    <th class="px-4 py-3 text-left font-medium">{{ t("admin.payroll.compensation.effectivePeriod") }}</th>
                    <th class="px-4 py-3 text-left font-medium">{{ t("common.status") }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100 bg-white">
                  <tr v-if="!lines.length">
                    <td
                      colspan="5"
                      class="px-4 py-10 text-center text-sm text-neutral-500"
                    >
                      {{ t("admin.payroll.compensation.empty") }}
                    </td>
                  </tr>
                  <tr
                    v-for="line in lines"
                    :key="line.id || line.componentCode"
                    class="hover:bg-neutral-50/80"
                  >
                    <td class="px-4 py-3.5">
                      <div class="flex flex-wrap items-center gap-2">
                        <div>
                          <p class="font-semibold text-neutral-900">
                            {{ line.name || line.componentCode }}
                          </p>
                          <p class="text-[11px] font-medium uppercase tracking-wide text-neutral-400 mt-0.5">
                            {{ line.componentCode }}
                          </p>
                        </div>
                        <span
                          v-if="line.base || line.componentCode === 'BASE_SALARY'"
                          class="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-secondary-50 text-secondary-600"
                        >
                          {{ t("admin.payroll.compensation.base") }}
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3.5">
                      <span
                        class="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide"
                        :class="
                          typeLabel(line) === 'DEDUCTION'
                            ? 'bg-warning-50 text-warning-700'
                            : 'bg-success-50 text-success-700'
                        "
                      >
                        {{ typeLabel(line) }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 font-medium text-neutral-800 tabular-nums">
                      {{ formatLineValue(line, profile.currency) }}
                    </td>
                    <td class="px-4 py-3.5 text-neutral-600">
                      {{ formatEffectivePeriod(line) }}
                    </td>
                    <td class="px-4 py-3.5">
                      <span
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
                        :class="
                          line.active !== false
                            ? 'bg-success-50 text-success-700'
                            : 'bg-neutral-100 text-neutral-500'
                        "
                      >
                        <svg
                          v-if="line.active !== false"
                          class="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {{ line.active !== false ? t("common.active") : t("common.inactive") }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 px-6 py-4 border-t border-neutral-200 flex-shrink-0 bg-white"
        >
          <button type="button" class="btn-outline text-sm" @click="close">
            {{ t("common.close") }}
          </button>
          <button
            type="button"
            class="btn-secondary text-sm inline-flex items-center justify-center gap-1.5"
            @click="$emit('add-component')"
          >
            <span class="text-base leading-none">+</span>
            {{ t("admin.payroll.compensation.add") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useI18n } from "../../../i18n/index.js";

const { t } = useI18n();

defineProps({
  modelValue: { type: Boolean, default: false },
  profile: { type: Object, default: null },
  lines: { type: Array, default: () => [] },
  kpis: {
    type: Object,
    default: () => ({
      totalComponents: 0,
      activeComponents: 0,
      baseConfigured: false,
    }),
  },
  formatLineValue: { type: Function, required: true },
  formatEffectivePeriod: { type: Function, required: true },
  typeLabel: { type: Function, required: true },
});

const emit = defineEmits(["update:modelValue", "add-component"]);

function close() {
  emit("update:modelValue", false);
}
</script>
