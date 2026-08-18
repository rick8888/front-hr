<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
        @click.self="onClose"
      >
        <Transition
          appear
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div class="flex items-start justify-between px-6 pt-6 pb-2">
              <h3 class="text-lg font-semibold text-neutral-900">
                {{ t("admin.employees.view.terminate.title", { name: employee?.name || t("common.employee") }) }}
              </h3>
              <button
                type="button"
                class="text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
                :disabled="busy"
                @click="onClose"
                :aria-label="t('common.close')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <form class="px-6 py-4 space-y-4" @submit.prevent="onSubmit">
              <!-- Termination Type + Eligible for Re-hire -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label class="block text-sm font-medium text-neutral-800 mb-1.5">
                    {{ t("admin.employees.view.terminate.type") }} <span class="text-error-600">*</span>
                  </label>
                  <select
                    v-model="form.type"
                    class="input-base text-sm"
                    :class="{ 'border-error-500 ring-1 ring-error-500': errors.type }"
                    :disabled="busy"
                  >
                    <option value="">{{ t("admin.employees.view.terminate.selectType") }}</option>
                    <option v-for="termType in types" :key="termType.value" :value="termType.value">{{ termType.label }}</option>
                  </select>
                  <p v-if="errors.type" class="text-xs text-error-600 mt-1">
                    {{ errors.type }}
                  </p>
                </div>

                <!-- Toggle Eligible for Re-hire -->
                <div class="flex items-center gap-3 pb-2">
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="form.rehireEligible"
                    :disabled="busy"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
                      form.rehireEligible ? 'bg-secondary-500' : 'bg-neutral-300',
                    ]"
                    @click="form.rehireEligible = !form.rehireEligible"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200',
                        form.rehireEligible ? 'translate-x-5' : 'translate-x-0',
                      ]"
                    />
                  </button>
                  <span class="text-sm text-neutral-800">{{ t("admin.employees.view.terminate.rehire") }}</span>
                </div>
              </div>

              <!-- Exit Date + Last Working Day -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-neutral-800 mb-1.5">
                    {{ t("admin.employees.view.terminate.exitDate") }} <span class="text-error-600">*</span>
                  </label>
                  <input
                    v-model="form.exitDate"
                    type="date"
                    class="input-base text-sm"
                    :class="{ 'border-error-500 ring-1 ring-error-500': errors.exitDate }"
                    :disabled="busy"
                  />
                  <p v-if="errors.exitDate" class="text-xs text-error-600 mt-1">
                    {{ errors.exitDate }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-neutral-800 mb-1.5">
                    {{ t("admin.employees.view.terminate.lastDay") }} <span class="text-error-600">*</span>
                  </label>
                  <input
                    v-model="form.lastWorkingDay"
                    type="date"
                    class="input-base text-sm"
                    :class="{ 'border-error-500 ring-1 ring-error-500': errors.lastWorkingDay }"
                    :disabled="busy"
                  />
                  <p v-if="errors.lastWorkingDay" class="text-xs text-error-600 mt-1">
                    {{ errors.lastWorkingDay }}
                  </p>
                </div>
              </div>

              <!-- Reason -->
              <div>
                <label class="block text-sm font-medium text-neutral-800 mb-1.5">
                  {{ t("common.reason") }} <span class="text-error-600">*</span>
                </label>
                <textarea
                  v-model="form.reason"
                  rows="3"
                  :placeholder="t('admin.employees.view.terminate.reasonPlaceholder')"
                  class="input-base text-sm resize-none"
                  :class="{ 'border-error-500 ring-1 ring-error-500': errors.reason }"
                  :disabled="busy"
                ></textarea>
                <p v-if="errors.reason" class="text-xs text-error-600 mt-1">
                  {{ errors.reason }}
                </p>
              </div>
            </form>

            <!-- Footer -->
            <div class="flex justify-end gap-3 px-6 pb-5">
              <button
                type="button"
                class="inline-flex items-center px-5 py-2 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="busy"
                @click="onClose"
              >
                {{ t("common.cancel") }}
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#e8614e] hover:bg-[#d5503e] text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-80 disabled:cursor-not-allowed"
                :disabled="busy"
                @click="onSubmit"
              >
                <svg
                  v-if="busy"
                  class="animate-spin w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                {{ busy ? t("admin.employees.view.terminate.processing") : t("admin.employees.view.terminate.confirm") }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  employee: { type: Object, required: true },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const types = computed(() => [
  { value: "Resignation", label: t("admin.employees.view.terminate.type.resignation") },
  { value: "Termination", label: t("admin.employees.view.terminate.type.termination") },
  { value: "Contract End", label: t("admin.employees.view.terminate.type.contractEnd") },
  { value: "Redundancy", label: t("admin.employees.view.terminate.type.redundancy") },
  { value: "Retirement", label: t("admin.employees.view.terminate.type.retirement") },
  { value: "Other", label: t("admin.employees.view.terminate.type.other") },
]);

function defaultForm() {
  return {
    type: "",
    rehireEligible: true,
    exitDate: "",
    lastWorkingDay: "",
    reason: "",
  };
}

const form = ref(defaultForm());
const errors = ref({});

// Réinit à chaque ouverture
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.value = defaultForm();
      errors.value = {};
    }
  }
);

// Échap pour fermer (si pas busy)
function onKey(e) {
  if (e.key === "Escape" && props.modelValue && !props.busy) onClose();
}
watch(
  () => props.modelValue,
  (open) => {
    if (open) document.addEventListener("keydown", onKey);
    else document.removeEventListener("keydown", onKey);
  },
  { immediate: true }
);

function validate() {
  const e = {};
  if (!form.value.type) e.type = t("admin.employees.view.terminate.error.type");
  if (!form.value.exitDate) e.exitDate = t("admin.employees.view.terminate.error.exitDate");
  if (!form.value.lastWorkingDay) e.lastWorkingDay = t("admin.employees.view.terminate.error.lastDay");
  if (!form.value.reason?.trim()) e.reason = t("admin.employees.view.terminate.error.reason");

  // Cohérence : last working day ≤ exit date
  if (
    !e.exitDate &&
    !e.lastWorkingDay &&
    form.value.lastWorkingDay > form.value.exitDate
  ) {
    e.lastWorkingDay = t("admin.employees.view.terminate.error.lastDayAfter");
  }

  errors.value = e;
  return Object.keys(e).length === 0;
}

function onSubmit() {
  if (props.busy) return;
  if (!validate()) return;
  emit("confirm", {
    type: form.value.type,
    rehireEligible: !!form.value.rehireEligible,
    exitDate: form.value.exitDate,
    lastWorkingDay: form.value.lastWorkingDay,
    reason: form.value.reason.trim(),
  });
}

function onClose() {
  if (props.busy) return;
  emit("update:modelValue", false);
}
</script>
