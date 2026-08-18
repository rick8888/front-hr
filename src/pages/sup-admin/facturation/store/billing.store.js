import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { billingApiService } from "../services/billing.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";

export const useBillingStore = defineStore("billing", () => {
  const invoices = ref([]);
  const payments = ref([]);
  const loading = ref(true);
  const paymentsLoading = ref(true);
  const saving = ref(false);
  const error = ref(null);

  const paidCount = computed(() => invoices.value.filter((i) => i.status === "paid").length);
  const partialCount = computed(() => invoices.value.filter((i) => i.status === "partial").length);
  const pendingCount = computed(() =>
    invoices.value.filter((i) => i.status === "pending" || i.status === "overdue").length
  );
  const totalPaidAmount = computed(() =>
    invoices.value.reduce((sum, i) => sum + (i.amount_paid ?? 0), 0)
  );

  async function fetchInvoices() {
    loading.value = true;
    error.value = null;
    try {
      invoices.value = await billingApiService.fetchInvoices();
    } catch (e) {
      error.value = parseApiError(e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchPayments(invoiceId = null) {
    paymentsLoading.value = true;
    error.value = null;
    try {
      payments.value = await billingApiService.fetchPayments(
        invoiceId ? { invoice_id: invoiceId } : {}
      );
    } catch (e) {
      error.value = parseApiError(e);
    } finally {
      paymentsLoading.value = false;
    }
  }

  async function createInvoice(payload) {
    saving.value = true;
    error.value = null;
    try {
      const created = await billingApiService.createInvoice(payload);
      invoices.value.unshift(created);
      return created;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function updateInvoice(invoiceId, updates) {
    saving.value = true;
    error.value = null;
    try {
      const updated = await billingApiService.updateInvoice(invoiceId, updates);
      const index = invoices.value.findIndex((i) => i.id === invoiceId);
      if (index !== -1) invoices.value[index] = updated;
      return updated;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function recordPayment(invoiceId, payload) {
    saving.value = true;
    error.value = null;
    try {
      const { payment, invoice } = await billingApiService.recordPayment(invoiceId, payload);
      const index = invoices.value.findIndex((i) => i.id === invoiceId);
      if (index !== -1 && invoice) invoices.value[index] = invoice;
      if (payment) payments.value.unshift(payment);
      return { payment, invoice };
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function deletePayment(paymentId) {
    saving.value = true;
    error.value = null;
    try {
      await billingApiService.deletePayment(paymentId);
      payments.value = payments.value.filter((p) => p.id !== paymentId);
      invoices.value = await billingApiService.fetchInvoices();
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function markAsPaid(invoiceId) {
    saving.value = true;
    error.value = null;
    try {
      const updated = await billingApiService.settleInvoice(invoiceId);
      const index = invoices.value.findIndex((i) => i.id === invoiceId);
      if (index !== -1) invoices.value[index] = updated;
      await fetchPayments();
      return updated;
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function deleteInvoice(invoiceId) {
    saving.value = true;
    error.value = null;
    try {
      await billingApiService.deleteInvoice(invoiceId);
      invoices.value = invoices.value.filter((i) => i.id !== invoiceId);
      payments.value = payments.value.filter((p) => p.invoice_id !== invoiceId);
    } catch (e) {
      error.value = parseApiError(e);
      throw e;
    } finally {
      saving.value = false;
    }
  }

  return {
    invoices,
    payments,
    loading,
    paymentsLoading,
    saving,
    error,
    paidCount,
    partialCount,
    pendingCount,
    totalPaidAmount,
    fetchInvoices,
    fetchPayments,
    createInvoice,
    updateInvoice,
    recordPayment,
    deletePayment,
    markAsPaid,
    deleteInvoice,
  };
});
