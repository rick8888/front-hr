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
            class="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header (orange) -->
            <div
              class="flex items-center justify-between px-6 py-4 bg-[#e8614e] text-white"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 class="text-lg font-semibold">{{ t("admin.employees.view.suspend.title") }}</h3>
              </div>
              <button
                type="button"
                class="w-8 h-8 rounded-md bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors disabled:opacity-50"
                :disabled="busy"
                @click="onClose"
                :aria-label="t('common.close')"
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

            <!-- Body -->
            <form class="px-6 py-5 space-y-4" @submit.prevent="onSubmit">
              <div
                v-if="saveError"
                class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {{ saveError }}
              </div>
              <!-- Info banner -->
              <div
                class="flex items-start gap-3 rounded-lg bg-warning-50 border border-warning-500/30 px-4 py-3 text-sm text-warning-700"
              >
                <svg
                  class="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {{ t("admin.employees.view.suspend.banner") }}
                </span>
              </div>

              <!-- Suspension Date -->
              <div>
                <label class="block text-sm font-medium text-neutral-800 mb-1.5">
                  {{ t("admin.employees.view.suspend.date") }} <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="form.suspensionDate"
                  type="date"
                  class="input-base text-sm"
                  :class="{ 'border-error-500 ring-1 ring-error-500': errors.suspensionDate }"
                  :disabled="busy"
                />
                <p v-if="errors.suspensionDate" class="text-xs text-error-600 mt-1">
                  {{ errors.suspensionDate }}
                </p>
                <p v-else class="text-xs text-neutral-500 mt-1">
                  {{ t("admin.employees.view.suspend.dateHint") }}
                </p>
              </div>

              <!-- Duration -->
              <div>
                <label class="block text-sm font-medium text-neutral-800 mb-1.5">
                  {{ t("admin.employees.view.suspend.duration") }}
                </label>
                <input
                  v-model.number="form.duration"
                  type="number"
                  min="1"
                  :placeholder="t('admin.employees.view.suspend.durationPlaceholder')"
                  class="input-base text-sm"
                  :disabled="busy"
                />
                <p class="text-xs text-neutral-500 mt-1">
                  {{ t("admin.employees.view.suspend.durationHint") }}
                </p>
              </div>

              <!-- Reason -->
              <div>
                <label class="block text-sm font-medium text-neutral-800 mb-1.5">
                  {{ t("admin.employees.view.suspend.reason") }} <span class="text-error-600">*</span>
                </label>
                <textarea
                  v-model="form.reason"
                  rows="3"
                  :placeholder="t('admin.employees.view.suspend.reasonPlaceholder')"
                  class="input-base text-sm resize-none"
                  :class="{ 'border-error-500 ring-1 ring-error-500': errors.reason }"
                  :disabled="busy"
                ></textarea>
                <p v-if="errors.reason" class="text-xs text-error-600 mt-1">
                  {{ errors.reason }}
                </p>
                <p v-else class="text-xs text-neutral-500 mt-1">
                  {{ t("admin.employees.view.suspend.reasonHint") }}
                </p>
              </div>

              <!-- Notify -->
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  v-model="form.notifyByEmail"
                  type="checkbox"
                  class="w-4 h-4 rounded border-neutral-300 text-secondary-500 focus:ring-secondary-500"
                  :disabled="busy"
                />
                <span class="text-sm text-neutral-800">{{ t("admin.employees.view.suspend.notify") }}</span>
              </label>
              <p class="text-xs text-neutral-500 -mt-2">
                {{ t("admin.employees.view.lifecycleEmailTemplateHint") }}
              </p>
            </form>

            <!-- Footer -->
            <div class="flex justify-end gap-3 px-6 pb-5">
              <button
                type="button"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="busy"
                @click="onClose"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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
                <svg
                  v-else
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ busy ? t("admin.employees.view.suspend.submitting") : t("admin.employees.view.suspend.title") }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  employee: { type: Object, required: true },
  busy: { type: Boolean, default: false },
  saveError: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "confirm"]);

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function defaultForm() {
  return {
    suspensionDate: todayISO(),
    duration: null,
    reason: "",
    notifyByEmail: true,
  };
}

const form = ref(defaultForm());
const errors = ref({});

// Réinitialise le formulaire à chaque ouverture (évite un état stale)
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
  if (!form.value.suspensionDate) e.suspensionDate = t("admin.employees.view.suspend.error.date");
  if (!form.value.reason?.trim()) e.reason = t("admin.employees.view.suspend.error.reason");
  errors.value = e;
  return Object.keys(e).length === 0;
}

function onSubmit() {
  if (props.busy) return;
  if (!validate()) return;
  emit("confirm", {
    suspensionDate: form.value.suspensionDate,
    duration: form.value.duration || null,
    reason: form.value.reason.trim(),
    notifyByEmail: !!form.value.notifyByEmail,
  });
}

function onClose() {
  if (props.busy) return;
  emit("update:modelValue", false);
}
</script>
