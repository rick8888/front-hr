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
        @click.self="onBackdrop"
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
            class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div class="px-6 pt-8 pb-6 text-center">
              <!-- Icon -->
              <div
                :class="[
                  'w-16 h-16 mx-auto rounded-full flex items-center justify-center',
                  iconBg,
                ]"
              >
                <svg
                  v-if="variant === 'danger'"
                  class="w-8 h-8"
                  :class="iconText"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
                <svg
                  v-else-if="variant === 'warning'"
                  class="w-8 h-8"
                  :class="iconText"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                  />
                </svg>
                <svg
                  v-else-if="variant === 'success'"
                  class="w-8 h-8"
                  :class="iconText"
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
                <svg
                  v-else
                  class="w-8 h-8"
                  :class="iconText"
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
              </div>

              <h3 class="mt-5 text-lg font-semibold text-neutral-900">
                {{ title }}
              </h3>
              <p v-if="message" class="mt-2 text-sm text-neutral-600">
                {{ message }}
              </p>
            </div>

            <!-- Footer -->
            <div class="flex gap-3 px-6 pb-6">
              <button
                type="button"
                class="flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="busy"
                @click="onCancel"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                :class="[
                  'flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-80 disabled:cursor-not-allowed',
                  confirmBtn,
                ]"
                :disabled="busy"
                @click="onConfirm"
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
                {{ busy ? loadingText : confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "Are you sure?" },
  message: { type: String, default: "" },
  /** 'danger' | 'warning' | 'info' | 'success' */
  variant: { type: String, default: "warning" },
  confirmText: { type: String, default: "Yes, confirm" },
  cancelText: { type: String, default: "Cancel" },
  loadingText: { type: String, default: "Processing..." },
  busy: { type: Boolean, default: false },
  /** Bloque la fermeture par clic extérieur / Échap pendant le traitement. */
  closeOnBackdrop: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

const iconBg = computed(
  () =>
    ({
      danger: "bg-error-50",
      warning: "bg-warning-50",
      success: "bg-success-50",
      info: "bg-info-50",
    }[props.variant] || "bg-warning-50")
);
const iconText = computed(
  () =>
    ({
      danger: "text-error-600",
      warning: "text-warning-600",
      success: "text-success-600",
      info: "text-info-600",
    }[props.variant] || "text-warning-600")
);
const confirmBtn = computed(
  () =>
    ({
      danger: "bg-error-600 hover:bg-error-700",
      warning: "bg-warning-600 hover:bg-warning-700",
      success: "bg-success-600 hover:bg-success-700",
      info: "bg-info-600 hover:bg-info-700",
    }[props.variant] || "bg-secondary-500 hover:bg-secondary-600")
);

function onBackdrop() {
  if (props.busy || !props.closeOnBackdrop) return;
  onCancel();
}

function onCancel() {
  if (props.busy) return;
  emit("cancel");
  emit("update:modelValue", false);
}

function onConfirm() {
  if (props.busy) return;
  emit("confirm");
}

// Échap pour fermer (si pas busy)
function onKey(e) {
  if (e.key === "Escape" && props.modelValue && !props.busy) {
    onCancel();
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) document.addEventListener("keydown", onKey);
    else document.removeEventListener("keydown", onKey);
  },
  { immediate: true }
);
</script>
