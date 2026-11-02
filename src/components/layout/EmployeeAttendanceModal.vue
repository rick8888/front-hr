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
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
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
            class="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-attendance-modal-title"
          >
            <span class="block h-1 w-full bg-secondary-500" aria-hidden="true" />

            <header :class="['px-6 py-5 text-center', headerClass]">
              <span
                :class="[
                  'mx-auto flex h-9 w-9 items-center justify-center rounded-full',
                  iconWrapClass,
                ]"
                aria-hidden="true"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    :d="headerIconPath"
                  />
                </svg>
              </span>
              <h2
                id="employee-attendance-modal-title"
                class="mt-3 text-xl font-bold text-neutral-900"
              >
                {{ titleLabel }}
              </h2>
              <p class="mt-1 text-sm text-neutral-500">{{ todayLabel }}</p>
            </header>

            <div
              v-if="error"
              class="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              {{ error }}
            </div>

            <section class="px-6 pb-2 pt-5">
              <h3 class="text-sm font-semibold text-neutral-900">{{ t("ss.attendance.modal.summary") }}</h3>

              <div
                v-if="loading"
                class="mt-6 flex min-h-[120px] items-center justify-center gap-2 text-sm text-neutral-500"
              >
                <span
                  class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-emerald-500"
                  aria-hidden="true"
                />
                {{ t("common.loading") }}
              </div>

              <ul v-else class="mt-3 space-y-3">
                <li class="flex items-start gap-3">
                  <span
                    class="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600"
                    aria-hidden="true"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12H3m0 0l4-4m-4 4l4 4m6-12h6a2 2 0 012 2v12a2 2 0 01-2 2h-6"
                      />
                    </svg>
                  </span>
                  <div>
                    <p class="text-xs font-medium text-neutral-500">{{ t("ss.attendance.checkIn") }}</p>
                    <p class="text-sm font-semibold text-neutral-900">
                      {{ summary.checkIn }}
                    </p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span
                    class="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-600"
                    aria-hidden="true"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h12m0 0l-4-4m4 4l-4 4M3 4v16"
                      />
                    </svg>
                  </span>
                  <div>
                    <p class="text-xs font-medium text-neutral-500">{{ t("ss.attendance.checkOut") }}</p>
                    <p class="text-sm font-semibold text-neutral-900">
                      {{ summary.checkOut || "—" }}
                    </p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span
                    class="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-secondary-50 text-secondary-600"
                    aria-hidden="true"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 7v5l3 2"
                      />
                    </svg>
                  </span>
                  <div>
                    <p class="text-xs font-medium text-neutral-500">{{ t("ss.attendance.col.workHours") }}</p>
                    <p class="text-sm font-semibold text-neutral-900">
                      {{ summary.workingHours }}
                    </p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span
                    class="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600"
                    aria-hidden="true"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 2" />
                    </svg>
                  </span>
                  <div>
                    <p class="text-xs font-medium text-neutral-500">{{ t("ss.attendance.modal.breakDuration") }}</p>
                    <p class="text-sm font-semibold text-neutral-900">{{ summary.breakDuration }}</p>
                    <p class="mt-1 text-[11px] text-neutral-500">
                      {{ t("ss.attendance.modal.breakNoPayrollImpact") }}
                    </p>
                  </div>
                </li>
              </ul>
            </section>

            <footer class="space-y-2 px-6 pb-6 pt-4">
              <button
                v-if="phase === 'out'"
                type="button"
                class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                :disabled="acting || loading"
                @click="$emit('check-in')"
              >
                <span
                  v-if="acting"
                  class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
                {{ t("ss.attendance.modal.checkInNow") }}
              </button>

              <button
                v-if="phase === 'in' || phase === 'break'"
                type="button"
                class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-600 disabled:opacity-60"
                :disabled="acting || loading"
                @click="$emit('check-out')"
              >
                <span
                  v-if="acting"
                  class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
                <svg
                  v-else
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h12m0 0l-4-4m4 4l-4 4M3 4v16"
                  />
                </svg>
                {{ t("ss.attendance.modal.checkOutNow") }}
              </button>

              <button
                v-if="phase === 'in'"
                type="button"
                class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-500 disabled:opacity-60"
                :disabled="acting || loading"
                @click="$emit('start-break')"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h2M9 5l3-2 3 2"
                  />
                </svg>
                {{ t("ss.attendance.modal.startBreak") }}
              </button>
              <button
                v-if="phase === 'break'"
                type="button"
                class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 disabled:opacity-60"
                :disabled="acting || loading"
                @click="$emit('end-break')"
              >
                {{ t("ss.attendance.modal.endBreak") }}
              </button>

              <RouterLink
                :to="viewAttendanceTo"
                class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-200"
                @click="close"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 3v4M8 3v4M3 11h18"
                  />
                </svg>
                {{ t("ss.attendance.modal.viewFull") }}
              </RouterLink>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from "vue";
import { useI18n } from "../../i18n/index.js";

const { t, locale, bcp47 } = useI18n();

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  todayIso: { type: String, default: "" },
  title: { type: String, default: "" },
  phase: {
    type: String,
    default: "out",
    validator: (v) => ["out", "in", "break", "done"].includes(v),
  },
  loading: { type: Boolean, default: false },
  acting: { type: Boolean, default: false },
  error: { type: String, default: "" },
  summary: {
    type: Object,
    default: () => ({
      checkIn: "—",
      checkOut: "—",
      workingHours: "0m",
      breakDuration: "0m",
    }),
  },
  viewAttendanceTo: {
    type: [String, Object],
    default: "/self-service/my-attendance",
  },
});

const emit = defineEmits([
  "update:modelValue",
  "check-in",
  "check-out",
  "start-break",
  "end-break",
  "open",
]);

const titleLabel = computed(() => {
  void locale.value;
  if (props.title) return props.title;
  if (props.phase === "break") return t("ss.attendance.modal.titleBreak");
  if (props.phase === "in") return t("ss.attendance.modal.titleIn");
  if (props.phase === "done") return t("ss.attendance.modal.titleOut");
  return t("ss.attendance.modal.titleReady");
});

const todayLabel = computed(() => {
  void locale.value;
  const now = new Date();
  const localIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const iso = props.todayIso || localIso;
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(bcp47.value, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});

const headerClass = computed(() => {
  if (props.phase === "in") return "bg-emerald-50";
  if (props.phase === "break") return "bg-amber-50";
  if (props.phase === "done") return "bg-sky-50";
  return "bg-amber-50";
});

const iconWrapClass = computed(() => {
  if (props.phase === "in") return "bg-emerald-100 text-emerald-600";
  if (props.phase === "break") return "bg-amber-100 text-amber-600";
  if (props.phase === "done") return "bg-sky-100 text-sky-600";
  return "bg-amber-100 text-amber-600";
});

const headerIconPath = computed(() => {
  if (props.phase === "in") return "M5 13l4 4L19 7";
  if (props.phase === "break") return "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z";
  if (props.phase === "done") return "M9 12h12m0 0l-4-4m4 4l-4 4M3 4v16";
  return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";
});

function close() {
  emit("update:modelValue", false);
}

function onKey(e) {
  if (e.key === "Escape" && props.modelValue) close();
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.addEventListener("keydown", onKey);
      emit("open");
    } else {
      document.removeEventListener("keydown", onKey);
    }
  },
  { immediate: true }
);
</script>
