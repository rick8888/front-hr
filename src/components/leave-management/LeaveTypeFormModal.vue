<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="leave-type-modal-scroll fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      @click.self="close"
    >
      <div
        class="my-auto flex max-h-[calc(100vh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.stop
      >
        <header
          class="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-violet-50/60 px-5 py-4 sm:px-7"
        >
          <h2 :id="titleId" class="text-xl font-bold tracking-tight text-slate-900">
            {{ resolvedHeaderTitle }}
          </h2>
          <button
            type="button"
            class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50"
            :aria-label="t('common.close')"
            :disabled="saving"
            @click="close"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div class="leave-type-modal-scroll min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
          <div
            v-if="error"
            class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            {{ error }}
          </div>

          <FormSection
            :title="t('admin.leave.types.section.basic')"
            body-class="space-y-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
          >
            <TextField
              id="leave-type-name"
              v-model="form.name"
              :label="t('common.name')"
              :placeholder="t('admin.leave.types.namePlaceholder')"
              required
            />
            <TextField
              id="leave-type-code"
              v-model="form.code"
              :label="t('common.code')"
              :placeholder="t('admin.leave.types.codePlaceholder')"
              required
            />
            <TextField
              id="leave-type-description"
              v-model="form.description"
              :label="t('common.description')"
              :placeholder="t('admin.leave.types.descriptionPlaceholder')"
              multiline
              :rows="3"
            />
            <SwitchField v-model="form.isProofRequired" :label="t('admin.leave.types.proofSwitch')" />
            <SwitchField
              v-model="form.isCompensatoryOffType"
              :label="t('admin.leave.types.compOffSwitch')"
            />
          </FormSection>

          <FormSection
            :title="t('admin.leave.types.section.accrual')"
            body-class="space-y-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
          >
            <SwitchField
              v-model="form.enableAutomaticAccrual"
              :label="t('admin.leave.types.enableAccrual')"
            />
            <div v-if="form.enableAutomaticAccrual" class="space-y-4">
              <div>
                <label
                  for="leave-type-frequency"
                  class="mb-1.5 block text-sm font-medium text-neutral-800"
                  >{{ t("admin.leave.types.accrualFrequency") }}</label
                >
                <select
                  id="leave-type-frequency"
                  v-model="form.accrualFrequency"
                  class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
                >
                  <option v-for="opt in accrualFrequencyOptions" :key="opt" :value="opt">
                    {{ t(`admin.leave.types.frequency.${opt}`) }}
                  </option>
                </select>
              </div>
              <TextField
                id="leave-type-rate"
                v-model="form.accrualRate"
                :label="t('admin.leave.types.accrualRate')"
                :placeholder="t('admin.leave.types.accrualRatePlaceholder')"
                :hint="t('admin.leave.types.accrualRateHint')"
                type="number"
                inputmode="decimal"
                min="0"
                step="0.5"
              />
              <TextField
                id="leave-type-max-accrual"
                v-model="form.maxAccrualLimit"
                :label="t('admin.leave.types.maxAccrual')"
                :placeholder="t('admin.leave.types.maxDaysPlaceholder')"
                :hint="t('admin.leave.types.maxAccrualHint')"
                type="number"
                inputmode="numeric"
                min="0"
              />
            </div>
          </FormSection>

          <FormSection
            :title="t('admin.leave.types.section.carryForward')"
            body-class="space-y-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
          >
            <SwitchField v-model="form.allowCarryForward" :label="t('admin.leave.types.allowCarryForward')" />
            <div v-if="form.allowCarryForward" class="space-y-4">
              <TextField
                id="leave-type-cf-days"
                v-model="form.maxCarryForwardDays"
                :label="t('admin.leave.types.maxCarryForward')"
                :placeholder="t('admin.leave.types.maxDaysPlaceholder')"
                :hint="t('admin.leave.types.maxCarryForwardHint')"
                type="number"
                inputmode="numeric"
                min="0"
              />
              <TextField
                id="leave-type-cf-expiry"
                v-model="form.carryForwardExpiry"
                :label="t('admin.leave.types.carryForwardExpiry')"
                :placeholder="t('admin.leave.types.monthsPlaceholder')"
                :hint="t('admin.leave.types.carryForwardExpiryHint')"
                type="number"
                inputmode="numeric"
                min="0"
              />
            </div>
          </FormSection>

          <FormSection
            :title="t('admin.leave.types.section.encashment')"
            body-class="space-y-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
          >
            <SwitchField v-model="form.allowEncashment" :label="t('admin.leave.types.allowEncashment')" />
            <div v-if="form.allowEncashment">
              <TextField
                id="leave-type-encash-days"
                v-model="form.maxEncashmentDays"
                :label="t('admin.leave.types.maxEncashment')"
                :placeholder="t('admin.leave.types.maxDaysPlaceholder')"
                :hint="t('admin.leave.types.maxEncashmentHint')"
                type="number"
                inputmode="numeric"
                min="0"
              />
            </div>
          </FormSection>
        </div>

        <footer
          class="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-7"
        >
          <button
            type="button"
            :disabled="saving"
            class="w-full rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            @click="close"
          >
            {{ t("common.cancel") }}
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            @click="submit"
          >
            <span
              v-if="saving"
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            {{ saving ? t("common.saving") : resolvedSubmitLabel }}
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import FormSection from "../common/FormSection.vue";
import SwitchField from "../common/SwitchField.vue";
import TextField from "../common/TextField.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  headerTitle: { type: String, default: "" },
  submitLabel: { type: String, default: "" },
  titleId: { type: String, default: "leave-type-form-title" },
  accrualFrequencyOptions: {
    type: Array,
    default: () => ["Monthly", "Quarterly", "Yearly"],
  },
  /** Ligne existante pour l'édition (null = création). */
  initial: { type: Object, default: null },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "submit"]);

const { t } = useI18n();

const resolvedHeaderTitle = computed(
  () => props.headerTitle || t("admin.leave.types.modalAdd"),
);
const resolvedSubmitLabel = computed(
  () => props.submitLabel || t("common.create"),
);

const defaultForm = () => ({
  name: "",
  code: "",
  description: "",
  isProofRequired: false,
  isCompensatoryOffType: false,
  enableAutomaticAccrual: true,
  accrualFrequency: "Monthly",
  accrualRate: "",
  maxAccrualLimit: "",
  allowCarryForward: true,
  maxCarryForwardDays: "",
  carryForwardExpiry: "",
  allowEncashment: true,
  maxEncashmentDays: "",
});

const form = ref(defaultForm());
const error = ref("");

function formFromInitial(row) {
  return {
    name: row.name || "",
    code: row.code || "",
    description: row.description || "",
    isProofRequired: Boolean(row.proofRequired),
    isCompensatoryOffType: Boolean(row.isCompensatoryOffType),
    enableAutomaticAccrual: Boolean(row.accrual),
    accrualFrequency: row.accrual?.frequency || "Monthly",
    accrualRate: row.accrual?.rate ?? "",
    maxAccrualLimit: row.accrual?.maxLimit ?? "",
    allowCarryForward: Boolean(row.carryForward),
    maxCarryForwardDays: row.carryForward?.maxDays ?? "",
    carryForwardExpiry: row.carryForward?.expiryMonths ?? "",
    allowEncashment: Boolean(row.encashment),
    maxEncashmentDays: row.encashment?.maxDays ?? "",
  };
}

watch(
  () => props.open,
  (v) => {
    if (v) {
      form.value = props.initial ? formFromInitial(props.initial) : defaultForm();
      error.value = "";
    }
  },
);

function close() {
  if (props.saving) return;
  emit("update:open", false);
}

function toNumberOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function submit() {
  error.value = "";
  if (!form.value.name.trim()) {
    error.value = t("admin.leave.types.nameRequired");
    return;
  }
  if (!form.value.code.trim()) {
    error.value = t("admin.leave.types.codeRequired");
    return;
  }
  if (props.saving) return;

  emit("submit", {
    name: form.value.name.trim(),
    code: form.value.code.trim().toUpperCase(),
    description: form.value.description.trim(),
    proofRequired: form.value.isProofRequired,
    isCompensatoryOffType: form.value.isCompensatoryOffType,
    accrual: form.value.enableAutomaticAccrual
      ? {
          frequency: form.value.accrualFrequency,
          rate: toNumberOrNull(form.value.accrualRate),
          maxLimit: toNumberOrNull(form.value.maxAccrualLimit),
        }
      : null,
    carryForward: form.value.allowCarryForward
      ? {
          maxDays: toNumberOrNull(form.value.maxCarryForwardDays),
          expiryMonths: toNumberOrNull(form.value.carryForwardExpiry),
        }
      : null,
    encashment: form.value.allowEncashment
      ? { maxDays: toNumberOrNull(form.value.maxEncashmentDays) }
      : null,
    status: props.initial?.status || "Active",
  });
}
</script>

<style scoped>
.leave-type-modal-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.leave-type-modal-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}
</style>
