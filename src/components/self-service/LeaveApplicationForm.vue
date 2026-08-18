<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs" :aria-busy="loading">
    <header class="border-b border-neutral-100 px-5 py-4 md:px-6">
      <h2 class="text-base font-semibold text-neutral-900">
        {{ readOnly ? t("ss.form.leave.detailsTitle") : t("ss.form.leave.formTitle") }}
      </h2>
    </header>

    <form class="space-y-5 px-5 py-6 md:px-6" @submit.prevent="onSubmit">
      <!-- Leave Type -->
      <div>
        <label for="leave-type" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.leave.type") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <div class="relative">
          <select
            id="leave-type"
            v-model="form.leaveTypeId"
            required
            :disabled="readOnly || saving || loading"
            :class="inputClass"
          >
            <option value="" disabled>{{ loading ? t("common.loading") : t("common.selectOption") }}</option>
            <option v-for="p in policies" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
          <span
            v-if="loading"
            class="pointer-events-none absolute inset-y-0 right-8 flex items-center"
            aria-hidden="true"
          >
            <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600" />
          </span>
        </div>
      </div>

      <!-- From / To dates -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="leave-from" class="mb-1.5 block text-sm font-medium text-neutral-800">
            {{ t("ss.form.leave.fromDate") }}<span class="text-red-500" aria-hidden="true"> *</span>
          </label>
          <input
            id="leave-from"
            v-model="form.fromDate"
            type="date"
            required
            :disabled="readOnly || saving || loading"
            placeholder="YYYY-MM-DD"
            :class="inputClass"
          />
        </div>
        <div>
          <label for="leave-to" class="mb-1.5 block text-sm font-medium text-neutral-800">
            {{ t("ss.form.leave.toDate") }}<span class="text-red-500" aria-hidden="true"> *</span>
          </label>
          <input
            id="leave-to"
            v-model="form.toDate"
            type="date"
            required
            :min="form.fromDate || undefined"
            :disabled="readOnly || saving || loading || form.halfDay"
            placeholder="YYYY-MM-DD"
            :class="inputClass"
          />
        </div>
      </div>

      <!-- Half Day toggle -->
      <InlineToggle
        v-model="form.halfDay"
        :label="t('ss.form.leave.halfDay')"
        :disabled="readOnly || saving || loading"
      />

      <!-- Total Days (auto) -->
      <div>
        <label for="leave-days" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.leave.totalDays") }}
        </label>
        <input
          id="leave-days"
          :value="totalDaysLabel"
          type="text"
          readonly
          :class="[inputClass, 'bg-neutral-50']"
        />
      </div>

      <!-- Reason -->
      <div>
        <label for="leave-reason" class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.leave.reason") }}<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <textarea
          id="leave-reason"
          v-model="form.reason"
          required
          rows="4"
          :disabled="readOnly || saving || loading"
          :placeholder="t('ss.form.leave.reasonPlaceholder')"
          :class="[inputClass, 'resize-y']"
        />
      </div>

      <!-- Emergency contact -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label for="leave-contact" class="mb-1.5 block text-sm font-medium text-neutral-800">
            {{ t("ss.form.leave.emergencyContact") }}
          </label>
          <input
            id="leave-contact"
            v-model="form.contactName"
            type="text"
            :disabled="readOnly || saving || loading"
            :placeholder="t('ss.form.leave.contactNamePlaceholder')"
            :class="inputClass"
          />
        </div>
        <div>
          <label for="leave-phone" class="mb-1.5 block text-sm font-medium text-neutral-800">
            {{ t("ss.form.leave.emergencyPhone") }}
          </label>
          <input
            id="leave-phone"
            v-model="form.contactPhone"
            type="tel"
            :disabled="readOnly || saving || loading"
            :placeholder="t('ss.form.leave.phonePlaceholder')"
            :class="inputClass"
          />
        </div>
      </div>

      <!-- Traveling abroad -->
      <InlineToggle
        v-model="form.travelingAbroad"
        :label="t('ss.form.leave.travelingAbroad')"
        :disabled="readOnly || saving || loading"
      />

      <!-- Document -->
      <div>
        <label class="mb-1.5 block text-sm font-medium text-neutral-800">
          {{ t("ss.form.leave.supportingDoc") }}
        </label>
        <div class="flex">
          <button
            type="button"
            class="rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
            :disabled="readOnly || saving || loading"
            @click="$refs.fileInput.click()"
          >
            {{ t("common.chooseFile") }}
          </button>
          <span
            class="flex-1 truncate rounded-r-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-500"
          >
            {{ fileLabel }}
          </span>
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            class="hidden"
            :disabled="readOnly || saving || loading"
            @change="onFile"
          />
        </div>
        <p class="mt-1.5 text-xs text-neutral-500">
          {{ t("ss.form.leave.docHint") }}
        </p>
      </div>

      <!-- Balance summary -->
      <div class="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3">
        <p class="text-sm font-medium text-sky-700">{{ t("ss.form.leave.balanceSummary") }}</p>
        <div
          v-if="loading"
          class="mt-2 flex h-8 items-center"
          aria-busy="true"
        >
          <span
            class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600"
            aria-hidden="true"
          />
        </div>
        <p v-else-if="!selectedPolicy" class="mt-0.5 text-sm text-sky-600">
          {{ t("ss.form.leave.selectTypeHint") }}
        </p>
        <dl
          v-else
          class="mt-2 grid grid-cols-3 gap-3 text-xs"
        >
          <div>
            <dt class="text-sky-600">{{ t("ss.leave.col.entitlement") }}</dt>
            <dd class="text-sm font-semibold text-sky-800">
              {{ totalEntitlement(selectedPolicy) }} {{ t("common.days") }}
            </dd>
          </div>
          <div>
            <dt class="text-sky-600">{{ t("ss.leave.col.used") }}</dt>
            <dd class="text-sm font-semibold text-amber-600">
              {{ formatNumber(selectedPolicy.used) }} {{ t("common.days") }}
            </dd>
          </div>
          <div>
            <dt class="text-sky-600">{{ t("ss.leave.col.available") }}</dt>
            <dd class="text-sm font-semibold text-emerald-600">
              {{ formatNumber(getPolicyAvailable(selectedPolicy)) }} {{ t("common.days") }}
            </dd>
          </div>
        </dl>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap items-center gap-3 pt-2">
        <button
          v-if="!readOnly"
          type="submit"
          class="inline-flex items-center gap-2 rounded-lg bg-secondary-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-50"
          :disabled="!formIsValid || saving || loading"
        >
          <span
            v-if="saving"
            class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12l5 5L20 7" />
          </svg>
          {{ saving ? t("common.submitting") : submitLabel }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-200 disabled:opacity-50"
          :disabled="saving"
          @click="$emit('cancel')"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ readOnly ? t("common.back") : t("common.cancel") }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { differenceInCalendarDays, isValid as isValidDate, parseISO } from "date-fns";
import InlineToggle from "../common/InlineToggle.vue";
import { getPolicyAvailable } from "../../data/leavePoliciesDemo.js";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  policies: { type: Array, required: true },
  initial: { type: Object, default: null },
  saving: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  readOnly: { type: Boolean, default: false },
  submitLabel: { type: String, default: "Submit Application" },
});

const emit = defineEmits(["submit", "cancel"]);
const { t } = useI18n();

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500";

const fileInput = ref(null);
const fileName = ref("");

const form = reactive({
  leaveTypeId: "",
  fromDate: "",
  toDate: "",
  halfDay: false,
  reason: "",
  contactName: "",
  contactPhone: "",
  travelingAbroad: false,
});

function applyInitial(value) {
  if (!value) return;
  form.leaveTypeId = value.leaveTypeId ?? "";
  form.fromDate = value.fromDate ?? "";
  form.toDate = value.toDate ?? "";
  form.halfDay = Boolean(value.halfDay);
  form.reason = value.reason ?? "";
  form.contactName = value.contactName ?? "";
  form.contactPhone = value.contactPhone ?? "";
  form.travelingAbroad = Boolean(value.travelingAbroad);
  fileName.value = value.fileName ?? "";
}

watch(
  () => props.initial,
  (value) => applyInitial(value),
  { immediate: true, deep: true }
);

watch(
  () => [form.halfDay, form.fromDate],
  ([half, from]) => {
    if (half && from) form.toDate = from;
  }
);

const selectedPolicy = computed(
  () => props.policies.find((p) => p.id === form.leaveTypeId) || null,
);

const totalDays = computed(() => {
  if (!form.fromDate || !form.toDate) return 0;
  if (form.halfDay) return 0.5;
  const start = parseISO(form.fromDate);
  const end = parseISO(form.toDate);
  if (!isValidDate(start) || !isValidDate(end)) return 0;
  const diff = differenceInCalendarDays(end, start);
  if (diff < 0) return 0;
  return diff + 1;
});

const totalDaysLabel = computed(() => {
  if (!totalDays.value) return "";
  return t("ss.form.leave.daysLabel", { n: totalDays.value });
});

const fileLabel = computed(() => fileName.value || t("common.noFileChosen"));

const formIsValid = computed(
  () =>
    !!form.leaveTypeId &&
    !!form.fromDate &&
    !!form.toDate &&
    form.reason.trim().length > 0,
);

function onFile(event) {
  const file = event.target.files?.[0];
  fileName.value = file?.name || "";
}

function onSubmit() {
  if (props.readOnly || !formIsValid.value || props.saving) return;
  emit("submit", {
    ...form,
    totalDays: totalDays.value,
    fileName: fileName.value,
  });
}

function totalEntitlement(p) {
  return Number(p.annualEntitlement || 0) + Number(p.additional || 0);
}

function formatNumber(n) {
  const v = Number(n) || 0;
  return Number.isInteger(v) ? v.toString() : v.toFixed(1);
}
</script>
