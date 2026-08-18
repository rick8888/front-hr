<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      @click.self="close"
    >
      <div
        class="my-8 flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.stop
      >
        <header
          class="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4"
        >
          <h2 :id="titleId" class="text-lg font-semibold text-neutral-900">
            {{ t("admin.leave.balances.setInitial") }}
          </h2>
          <button
            type="button"
            class="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            :aria-label="t('common.close')"
            @click="close"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <form class="space-y-5 px-6 py-6" @submit.prevent="submit">
          <div
            v-if="error"
            class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            {{ error }}
          </div>

          <TextField
            id="set-initial-leave-type"
            :model-value="leaveTypeName"
            :label="t('admin.leave.col.leaveType')"
            disabled
          />

          <TextField
            id="set-initial-entitled"
            v-model="entitledLeaves"
            :label="t('admin.leave.balances.entitledLeaves')"
            type="number"
            inputmode="decimal"
            min="0"
            step="0.5"
            placeholder=""
          />
        </form>

        <footer
          class="flex shrink-0 justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4"
        >
          <button
            type="button"
            class="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            @click="close"
          >
            {{ t("common.cancel") }}
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
            @click="submit"
          >
            <span
              v-if="saving"
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            {{ saving ? t("common.saving") : t("admin.leave.balances.setBalance") }}
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import TextField from "../common/TextField.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  /** Row from `buildLeaveBalanceDetails` (or `{ code, name, entitled }`). */
  leaveRow: { type: Object, default: null },
  titleId: { type: String, default: "set-initial-balance-title" },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "submit"]);

const { t } = useI18n();

const entitledLeaves = ref("");
const error = ref("");

const leaveTypeName = computed(() => props.leaveRow?.name ?? "");

watch(
  () => props.open,
  (v) => {
    if (v) {
      entitledLeaves.value =
        props.leaveRow?.entitled != null && props.leaveRow.entitled !== 0
          ? String(props.leaveRow.entitled)
          : "";
      error.value = "";
    }
  },
);

function close() {
  emit("update:open", false);
}

async function submit() {
  error.value = "";
  const raw = String(entitledLeaves.value).trim();
  if (raw === "") {
    error.value = t("admin.leave.balances.entitledRequired");
    return;
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    error.value = t("admin.leave.balances.entitledPositive");
    return;
  }

  emit("submit", {
    leaveTypeId: props.leaveRow?.id ?? null,
    code: props.leaveRow?.code ?? null,
    entitled: value,
  });
}
</script>
