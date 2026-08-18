<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      role="presentation"
      @click.self="close"
    >
      <div
        class="my-8 w-full max-w-lg rounded-xl bg-white shadow-xl border border-neutral-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-leave-title"
        @click.stop
      >
        <div class="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 id="reject-leave-title" class="text-lg font-semibold text-neutral-900">
            {{ t("admin.leave.rejectTitle") }}
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
        </div>
        <div class="px-6 py-5 space-y-4">
          <p v-if="request" class="text-sm text-neutral-600">
            {{ t("admin.leave.rejectMessage") }}
            <strong class="text-neutral-900">{{ request.employee }}</strong>
            (<span>{{ formatDates(request) }}</span>)?
          </p>
          <div>
            <label class="mb-2 block text-sm font-medium text-neutral-700">
              {{ t("admin.leave.rejectReason") }}
            </label>
            <textarea
              v-model="reason"
              rows="3"
              :placeholder="t('admin.leave.rejectPlaceholder')"
              class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-secondary-500 focus:outline-none focus:ring-1 focus:ring-secondary-500 resize-none"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <button
            type="button"
            class="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            @click="close"
          >
            {{ t("common.cancel") }}
          </button>
          <button
            type="button"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            @click="confirm"
          >
            {{ t("admin.leave.confirmReject") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useI18n } from "../../i18n/index.js";

const { t, bcp47 } = useI18n();

const props = defineProps({
  open: { type: Boolean, default: false },
  request: { type: Object, default: null },
});

const emit = defineEmits(["update:open", "confirm"]);

const reason = ref("");

watch(
  () => props.open,
  (v) => {
    if (v) reason.value = "";
  },
);

function close() {
  emit("update:open", false);
}

function confirm() {
  emit("confirm", { reason: reason.value });
  emit("update:open", false);
}

function formatDates(req) {
  if (!req) return "";
  const dateLocale = bcp47.value.startsWith("fr") ? fr : enUS;
  try {
    const a = format(new Date(req.from + "T12:00:00"), "dd MMM yyyy", {
      locale: dateLocale,
    });
    const b = format(new Date(req.to + "T12:00:00"), "dd MMM yyyy", {
      locale: dateLocale,
    });
    return `${a} → ${b}`;
  } catch {
    return `${req.from} → ${req.to}`;
  }
}
</script>
