<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="leave-modal-scroll fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/60 p-4 backdrop-blur-sm"
      @click.self="close"
    >
      <div
        class="my-8 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl"
        role="dialog"
        aria-labelledby="new-leave-title"
        @click.stop
      >
        <header
          class="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4"
        >
          <h2 id="new-leave-title" class="text-xl font-bold text-neutral-900">
            {{ t("admin.leave.modal.title") }}
          </h2>
          <button
            type="button"
            class="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            :aria-label="t('admin.leave.close')"
            @click="close"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div class="leave-modal-scroll min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {{ error }}
          </div>

          <form class="space-y-5" @submit.prevent="submit">
            <!-- Employee -->
            <div>
              <label for="leave-employee" class="mb-1.5 block text-sm font-medium text-neutral-800">
                {{ t("admin.leave.col.employee") }}<span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="leave-employee"
                v-model="form.employeeId"
                required
                class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 shadow-xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
              >
                <option disabled value="">{{ t("admin.leave.modal.selectEmployee") }}</option>
                <option v-for="e in employeeOptions" :key="e.id || e.code" :value="e.id">
                  {{ e.name }} ({{ e.code }})
                </option>
              </select>
            </div>

            <!-- Leave type -->
            <div>
              <label for="leave-type" class="mb-1.5 block text-sm font-medium text-neutral-800">
                {{ t("admin.leave.col.leaveType") }}<span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="leave-type"
                v-model="form.leaveType"
                required
                class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 shadow-xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
              >
                <option disabled value="">{{ t("admin.leave.modal.selectType") }}</option>
                <option v-for="t in leaveTypeOptions" :key="t.code" :value="t.code">
                  {{ t.name }}
                </option>
              </select>
              <p v-if="!leaveTypeOptions.length" class="mt-1 text-xs text-neutral-500">
                {{ t("admin.leave.modal.noTypes") }}
              </p>
            </div>

            <!-- Leave duration cards -->
            <fieldset>
              <legend class="mb-2 text-sm font-medium text-neutral-800">{{ t("admin.leave.modal.duration") }}</legend>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label
                  class="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors"
                  :class="
                    form.durationKind === 'full'
                      ? 'border-primary-500 bg-primary-50/50'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  "
                >
                  <input v-model="form.durationKind" type="radio" value="full" class="sr-only" />
                  <span
                    class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
                    :class="
                      form.durationKind === 'full'
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-neutral-300 bg-white'
                    "
                  >
                    <span
                      v-if="form.durationKind === 'full'"
                      class="h-1.5 w-1.5 rounded-full bg-white"
                    />
                  </span>
                  <span class="text-sm font-medium text-neutral-900">{{ t("admin.leave.modal.fullDay") }}</span>
                </label>
                <label
                  class="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors"
                  :class="
                    form.durationKind === 'half'
                      ? 'border-primary-500 bg-primary-50/50'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  "
                >
                  <input v-model="form.durationKind" type="radio" value="half" class="sr-only" />
                  <span
                    class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
                    :class="
                      form.durationKind === 'half'
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-neutral-300 bg-white'
                    "
                  >
                    <span
                      v-if="form.durationKind === 'half'"
                      class="h-1.5 w-1.5 rounded-full bg-white"
                    />
                  </span>
                  <span class="text-sm font-medium text-neutral-900">{{ t("admin.leave.modal.halfDay") }}</span>
                </label>
              </div>
            </fieldset>

            <!-- Dates: full = range, half = single day -->
            <div v-if="form.durationKind === 'full'" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="leave-from" class="mb-1.5 block text-sm font-medium text-neutral-800">
                  {{ t("admin.leave.modal.fromDate") }}<span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="leave-from"
                  v-model="form.startDate"
                  type="date"
                  required
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
                  :max="form.endDate || undefined"
                  @change="validateDates"
                />
                <p v-if="!form.startDate" class="mt-1 text-xs text-neutral-400">{{ t("admin.leave.modal.selectDate") }}</p>
              </div>
              <div>
                <label for="leave-to" class="mb-1.5 block text-sm font-medium text-neutral-800">
                  {{ t("admin.leave.modal.toDate") }}<span class="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="leave-to"
                  v-model="form.endDate"
                  type="date"
                  required
                  class="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
                  :min="form.startDate || undefined"
                  @change="validateDates"
                />
                <p v-if="!form.endDate" class="mt-1 text-xs text-neutral-400">{{ t("admin.leave.modal.selectDate") }}</p>
              </div>
            </div>
            <div v-else>
              <label for="leave-just-date" class="mb-1.5 block text-sm font-medium text-neutral-800">
                {{ t("admin.leave.modal.justDate") }}<span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="leave-just-date"
                v-model="form.halfDayDate"
                type="date"
                required
                class="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
                @change="validateDates"
              />
              <p v-if="!form.halfDayDate" class="mt-1 text-xs text-neutral-400">{{ t("admin.leave.modal.selectDate") }}</p>
            </div>

            <!-- Total days -->
            <div
              class="flex items-center gap-3 rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-900"
              role="status"
            >
              <span
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600"
                aria-hidden="true"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <span>
                {{ t("admin.leave.modal.totalDays") }}
                <strong class="font-semibold text-primary-950">{{ displayTotalDays }}</strong>
              </span>
            </div>

            <!-- Reason -->
            <div>
              <label for="leave-reason" class="mb-1.5 block text-sm font-medium text-neutral-800">
                {{ t("common.reason") }}<span class="text-red-500" aria-hidden="true">*</span>
              </label>
              <textarea
                id="leave-reason"
                v-model="form.reason"
                required
                rows="4"
                maxlength="1000"
                :placeholder="t('admin.leave.modal.reasonPlaceholder')"
                class="w-full resize-y rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
              />
            </div>

            <!-- Toggles -->
            <div class="space-y-4 border-t border-neutral-100 pt-2">
              <div class="flex items-center justify-between gap-4">
                <span class="text-sm font-medium text-neutral-800">{{ t("admin.leave.modal.emergencyContact") }}</span>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="form.emergencyContact"
                  class="relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  :class="form.emergencyContact ? 'bg-primary-500' : 'bg-neutral-200'"
                  @click="form.emergencyContact = !form.emergencyContact"
                >
                  <span
                    class="pointer-events-none absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform"
                    :class="form.emergencyContact ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-sm font-medium text-neutral-800">{{ t("admin.leave.modal.travelingAbroad") }}</span>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="form.travelingAbroad"
                  class="relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  :class="form.travelingAbroad ? 'bg-primary-500' : 'bg-neutral-200'"
                  @click="form.travelingAbroad = !form.travelingAbroad"
                >
                  <span
                    class="pointer-events-none absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform"
                    :class="form.travelingAbroad ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
              </div>
            </div>
          </form>
        </div>

        <footer
          class="flex shrink-0 flex-col-reverse gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 sm:flex-row sm:justify-end"
        >
          <button
            type="button"
            class="w-full rounded-lg border border-orange-100 bg-orange-50 px-5 py-2.5 text-sm font-medium text-orange-800 shadow-xs hover:bg-orange-100/90 sm:w-auto"
            @click="close"
          >
            {{ t("common.cancel") }}
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50 sm:w-auto"
            @click="submit"
          >
            <span
              v-if="saving"
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            {{ saving ? t("admin.leave.modal.sending") : t("common.submitRequest") }}
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  open: { type: Boolean, default: false },
  /** { id, code, name }[] */
  employeeOptions: {
    type: Array,
    default: () => [],
  },
  /** { code, name }[] — types issus de /leave-types */
  leaveTypeOptions: {
    type: Array,
    default: () => [],
  },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "created"]);

const defaultForm = () => ({
  employeeId: "",
  leaveType: "",
  durationKind: "full",
  startDate: "",
  endDate: "",
  halfDayDate: "",
  reason: "",
  emergencyContact: false,
  travelingAbroad: false,
});

const form = ref(defaultForm());
const error = ref("");

const inclusiveCalendarDays = computed(() => {
  if (form.value.durationKind === "half") {
    return form.value.halfDayDate ? 1 : 0;
  }
  const { startDate, endDate } = form.value;
  if (!startDate || !endDate) return 0;
  const a = new Date(startDate + "T12:00:00");
  const b = new Date(endDate + "T12:00:00");
  if (b < a) return 0;
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24)) + 1;
});

const effectiveTotalDays = computed(() => {
  const n = inclusiveCalendarDays.value;
  if (n <= 0) return 0;
  return form.value.durationKind === "half" ? n * 0.5 : n;
});

const displayTotalDays = computed(() => {
  const v = effectiveTotalDays.value;
  if (v === 0) return "0";
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
});

watch(
  () => props.open,
  (v) => {
    if (v) {
      form.value = defaultForm();
      error.value = "";
    }
  },
);

watch(
  () => form.value.durationKind,
  (mode) => {
    error.value = "";
    if (mode === "half") {
      const d =
        form.value.startDate ||
        form.value.endDate ||
        form.value.halfDayDate;
      if (d && !form.value.halfDayDate) form.value.halfDayDate = d;
    } else {
      const d =
        form.value.halfDayDate ||
        form.value.startDate ||
        form.value.endDate;
      if (d) {
        if (!form.value.startDate) form.value.startDate = d;
        if (!form.value.endDate) form.value.endDate = d;
      }
    }
  },
);

function close() {
  if (props.saving) return;
  emit("update:open", false);
}

function validateDates() {
  if (form.value.durationKind === "half") {
    error.value = "";
    return true;
  }
  const { startDate, endDate } = form.value;
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    error.value = t("admin.leave.modal.dateOrderError");
    return false;
  }
  error.value = "";
  return true;
}

function selectedEmployee() {
  return props.employeeOptions.find(
    (e) => String(e.id) === String(form.value.employeeId)
  );
}

async function submit() {
  error.value = "";
  if (!validateDates()) return;

  if (!form.value.employeeId) {
    error.value = t("admin.leave.modal.selectEmployeeError");
    return;
  }
  if (!form.value.leaveType) {
    error.value = t("admin.leave.modal.requiredFieldsError");
    return;
  }
  if (form.value.durationKind === "half") {
    if (!form.value.halfDayDate) {
      error.value = t("admin.leave.modal.selectDateError");
      return;
    }
  } else {
    if (!form.value.startDate || !form.value.endDate) {
      error.value = t("admin.leave.modal.requiredFieldsError");
      return;
    }
  }
  if (!form.value.reason.trim()) {
    error.value = t("admin.leave.modal.reasonError");
    return;
  }

  const emp = selectedEmployee();
  if (!emp) {
    error.value = t("admin.leave.modal.invalidEmployeeError");
    return;
  }

  const fromDay =
    form.value.durationKind === "half"
      ? form.value.halfDayDate
      : form.value.startDate;
  const toDay =
    form.value.durationKind === "half"
      ? form.value.halfDayDate
      : form.value.endDate;

  emit("created", {
    employeeId: emp.id,
    employee: emp.name,
    employeeCode: emp.code,
    leaveType: form.value.leaveType,
    from: fromDay,
    to: toDay,
    days: effectiveTotalDays.value,
    durationKind: form.value.durationKind,
    reason: form.value.reason.trim(),
    emergencyContact: form.value.emergencyContact,
    travelingAbroad: form.value.travelingAbroad,
    document: null,
  });
}
</script>

<style scoped>
.leave-modal-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.leave-modal-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}
</style>
