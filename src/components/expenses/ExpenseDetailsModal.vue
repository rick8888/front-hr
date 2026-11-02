<template>
  <Modal
    :model-value="modelValue"
    :title="title"
    size="md"
    hide-footer
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="record" class="space-y-4">
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div v-if="showEmployee">
          <dt class="text-xs font-medium text-neutral-500">{{ t("common.employee") }}</dt>
          <dd class="mt-1 text-sm font-semibold text-neutral-900">
            {{ record.employee || "—" }}
            <span v-if="record.employeeCode" class="block text-xs font-normal text-neutral-500">
              {{ record.employeeCode }}
            </span>
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-neutral-500">{{ t("admin.leave.expenses.col.id") }}</dt>
          <dd class="mt-1 text-sm font-semibold text-neutral-900">#{{ record.id }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-neutral-500">{{ t("common.type") }}</dt>
          <dd class="mt-1 text-sm text-neutral-800">{{ record.type || "—" }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-neutral-500">{{ t("common.date") }}</dt>
          <dd class="mt-1 text-sm text-neutral-800">{{ formatDate(record.expenseDate) }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-neutral-500">{{ t("common.amount") }}</dt>
          <dd class="mt-1 text-base font-bold text-neutral-900">
            {{ formatAmount(record.amount, record.currency) }}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-neutral-500">{{ t("common.status") }}</dt>
          <dd class="mt-1">
            <span
              class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
              :class="statusClass(record)"
            >
              {{ record.status || "—" }}
            </span>
          </dd>
        </div>
      </dl>

      <div>
        <p class="text-xs font-medium text-neutral-500">{{ t("common.description") }}</p>
        <p class="mt-1 whitespace-pre-wrap text-sm text-neutral-800">
          {{ record.description?.trim() || "—" }}
        </p>
      </div>

      <div v-if="record.rejectReason">
        <p class="text-xs font-medium text-rose-600">{{ t("admin.leave.expenses.rejectReason") }}</p>
        <p class="mt-1 text-sm text-rose-800">{{ record.rejectReason }}</p>
      </div>

      <div>
        <p class="text-xs font-medium text-neutral-500">{{ t("admin.leave.expenses.col.receipt") }}</p>
        <a
          v-if="record.receiptUrl"
          :href="record.receiptUrl"
          target="_blank"
          rel="noopener"
          class="mt-1 inline-flex items-center gap-1 text-sm font-medium text-secondary-600 hover:text-secondary-700"
        >
          {{ t("common.view") }}
        </a>
        <p v-else class="mt-1 text-sm text-neutral-400">—</p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 px-6 py-4 border-t border-neutral-200">
        <button type="button" class="btn-primary" @click="$emit('update:modelValue', false)">
          {{ t("common.close") }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import Modal from "../common/Modal.vue";
import { useI18n } from "../../i18n/index.js";

defineProps({
  modelValue: { type: Boolean, default: false },
  record: { type: Object, default: null },
  title: { type: String, default: "" },
  showEmployee: { type: Boolean, default: true },
});

defineEmits(["update:modelValue"]);

const { t, bcp47 } = useI18n();

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString(bcp47.value || "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAmount(amount, currency = "MAD") {
  const n = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(bcp47.value || "fr-FR", {
      style: "currency",
      currency: currency || "MAD",
      minimumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n} ${currency || ""}`.trim();
  }
}

function statusClass(record) {
  const key = String(record?.statusValue || record?.status || "").toLowerCase();
  if (key === "approved" || key.includes("approuv")) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/15";
  }
  if (key === "pending" || key.includes("attente")) {
    return "bg-amber-50 text-amber-700 ring-amber-600/15";
  }
  if (key === "rejected" || key.includes("rejet")) {
    return "bg-rose-50 text-rose-700 ring-rose-600/15";
  }
  if (key === "reimbursed" || key.includes("rembours")) {
    return "bg-sky-50 text-sky-700 ring-sky-600/15";
  }
  return "bg-neutral-100 text-neutral-700 ring-neutral-500/15";
}
</script>
