<template>
  <div>
    <h2 class="text-base font-bold text-neutral-900">Select Payment Method</h2>

    <div class="mt-4">
      <TenantPaymentMethodSelector
        :methods="methods"
        :model-value="selectedMethodCode"
        @update:model-value="selectedMethodCode = $event"
      />
    </div>

    <div v-if="isBankTransfer" class="mt-4">
      <TenantPaymentBankTransferForm
        :file="receiptFile"
        :model-reference="bankReference"
        :error="errors.receipt_file"
        @select="setReceiptFile"
        @remove="removeReceiptFile"
        @update:model-reference="bankReference = $event"
      />
    </div>

    <div v-else-if="isMobileMoney" class="mt-4">
      <TenantPaymentMobileMoneyForm
        :operators="operators"
        :model-operator="mobileOperator"
        :model-phone="phoneNumber"
        :operator-error="errors.mobile_operator"
        :phone-error="errors.phone_number"
        @update:model-operator="mobileOperator = $event"
        @update:model-phone="phoneNumber = $event"
      />
    </div>

    <div v-else-if="isCash" class="mt-4">
      <TenantPaymentCashForm
        :model-reference="cashReference"
        @update:model-reference="cashReference = $event"
      />
    </div>

    <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-200"
        :disabled="isBusy"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="button"
        class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#7c7cf8] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#6b6be8] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[240px] sm:flex-none"
        :disabled="isBusy"
        @click="onProceed"
      >
        <svg
          v-if="isBusy"
          class="h-4 w-4 animate-spin"
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
        {{ isBusy ? "Processing…" : "Proceed to Payment" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, toRef } from "vue";
import { usePaymentSimulation } from "../../../composables/usePaymentSimulation.js";
import TenantPaymentBankTransferForm from "./TenantPaymentBankTransferForm.vue";
import TenantPaymentCashForm from "./TenantPaymentCashForm.vue";
import TenantPaymentMethodSelector from "./TenantPaymentMethodSelector.vue";
import TenantPaymentMobileMoneyForm from "./TenantPaymentMobileMoneyForm.vue";

const props = defineProps({
  methods: { type: Array, required: true },
  context: { type: Object, default: () => ({}) },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["cancel", "proceed"]);

const methodsRef = toRef(props, "methods");

const {
  selectedMethodCode,
  receiptFile,
  bankReference,
  mobileOperator,
  phoneNumber,
  cashReference,
  errors,
  submitting,
  operators,
  isBankTransfer,
  isMobileMoney,
  isCash,
  setReceiptFile,
  removeReceiptFile,
  simulateSubmit,
} = usePaymentSimulation(methodsRef);

const isBusy = computed(() => props.busy || submitting.value);

async function onProceed() {
  const payload = await simulateSubmit(props.context);
  if (payload) {
    emit("proceed", payload);
  }
}
</script>
