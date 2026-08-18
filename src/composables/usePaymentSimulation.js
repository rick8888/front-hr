import { computed, reactive, ref, watch } from "vue";
import { MOBILE_MONEY_OPERATORS } from "../config/mobileMoneyOperators.js";

export const PAYMENT_METHOD_CODES = {
  BANK_TRANSFER: "bank_transfer",
  MOBILE_MONEY: "mobile_money",
  CASH: "cash",
};

const ACCEPTED_RECEIPT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_RECEIPT_SIZE_MB = 5;

export function usePaymentSimulation(methods) {
  const selectedMethodCode = ref("");
  const receiptFile = ref(null);
  const mobileOperator = ref("");
  const phoneNumber = ref("");
  const cashReference = ref("");
  const errors = reactive({});
  const submitting = ref(false);

  const operators = MOBILE_MONEY_OPERATORS;

  const selectedMethod = computed(
    () => methods.value?.find((m) => m.code === selectedMethodCode.value) ?? null
  );

  const isBankTransfer = computed(
    () => selectedMethodCode.value === PAYMENT_METHOD_CODES.BANK_TRANSFER
  );
  const isMobileMoney = computed(
    () => selectedMethodCode.value === PAYMENT_METHOD_CODES.MOBILE_MONEY
  );
  const isCash = computed(
    () => selectedMethodCode.value === PAYMENT_METHOD_CODES.CASH
  );

  const selectedOperator = computed(
    () => operators.find((op) => op.id === mobileOperator.value) ?? null
  );

  watch(
    () => methods.value,
    (list) => {
      if (!list?.length) return;
      if (!selectedMethodCode.value) {
        selectedMethodCode.value = list.find((m) => m.selected)?.code ?? list[0].code;
      }
    },
    { immediate: true, deep: true }
  );

  watch(selectedMethodCode, () => {
    resetMethodDetails();
    clearErrors();
  });

  watch(mobileOperator, () => {
    delete errors.mobile_operator;
    delete errors.phone_number;
  });

  function resetMethodDetails() {
    receiptFile.value = null;
    mobileOperator.value = "";
    phoneNumber.value = "";
    cashReference.value = "";
  }

  function clearErrors() {
    Object.keys(errors).forEach((k) => delete errors[k]);
  }

  function setReceiptFile(file) {
    receiptFile.value = file;
    delete errors.receipt_file;
  }

  function removeReceiptFile() {
    receiptFile.value = null;
    delete errors.receipt_file;
  }

  function validateReceipt(file) {
    if (!file) {
      errors.receipt_file = "Veuillez déposer une quittance.";
      return false;
    }
    if (!ACCEPTED_RECEIPT_TYPES.includes(file.type)) {
      errors.receipt_file = "Format accepté : PDF, JPG ou PNG.";
      return false;
    }
    if (file.size > MAX_RECEIPT_SIZE_MB * 1024 * 1024) {
      errors.receipt_file = `Fichier trop volumineux (max ${MAX_RECEIPT_SIZE_MB} Mo).`;
      return false;
    }
    return true;
  }

  function validatePhone(value) {
    const normalized = String(value || "").trim();
    if (!normalized) {
      errors.phone_number = "Le numéro de téléphone est obligatoire.";
      return false;
    }
    if (normalized.replace(/\D/g, "").length < 8) {
      errors.phone_number = "Numéro de téléphone invalide.";
      return false;
    }
    return true;
  }

  function validate() {
    clearErrors();
    let valid = true;

    if (!selectedMethodCode.value) {
      errors.payment_method = "Veuillez sélectionner un mode de paiement.";
      return false;
    }

    if (isBankTransfer.value) {
      if (!validateReceipt(receiptFile.value)) valid = false;
    }

    if (isMobileMoney.value) {
      if (!mobileOperator.value) {
        errors.mobile_operator = "Veuillez sélectionner un opérateur.";
        valid = false;
      }
      if (!validatePhone(phoneNumber.value)) valid = false;
    }

    return valid;
  }

  function buildPayload(extra = {}) {
    const base = {
      payment_method: selectedMethodCode.value,
      payment_method_label: selectedMethod.value?.title ?? null,
      ...extra,
    };

    if (isBankTransfer.value) {
      return {
        ...base,
        receipt: {
          name: receiptFile.value?.name ?? null,
          size: receiptFile.value?.size ?? null,
          type: receiptFile.value?.type ?? null,
        },
      };
    }

    if (isMobileMoney.value) {
      return {
        ...base,
        mobile_operator: mobileOperator.value,
        mobile_operator_label: selectedOperator.value?.label ?? null,
        phone_number: phoneNumber.value.trim(),
      };
    }

    if (isCash.value) {
      return {
        ...base,
        reference: cashReference.value.trim() || null,
      };
    }

    return base;
  }

  async function simulateSubmit(extra = {}) {
    if (!validate()) return null;
    return buildPayload(extra);
  }

  return {
    selectedMethodCode,
    receiptFile,
    mobileOperator,
    phoneNumber,
    cashReference,
    errors,
    submitting,
    operators,
    selectedMethod,
    selectedOperator,
    isBankTransfer,
    isMobileMoney,
    isCash,
    setReceiptFile,
    removeReceiptFile,
    validate,
    buildPayload,
    simulateSubmit,
  };
}
