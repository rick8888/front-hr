<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto max-w-3xl space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          Changer de forfait
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          Vérifiez les changements et choisissez votre mode de paiement.
        </p>
      </header>

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-if="paymentSuccess"
        class="rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-5 text-sm text-emerald-800"
      >
        <h2 class="font-semibold">Demande envoyée</h2>
        <p class="mt-1">{{ paymentSuccess }}</p>
        <p v-if="submittedInvoiceNumber" class="mt-2">
          Référence de facture : <span class="font-mono font-semibold">{{ submittedInvoiceNumber }}</span>
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            class="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
            @click="router.push('/tenant/invoices')"
          >
            Voir mes factures
          </button>
          <button
            type="button"
            class="rounded-lg border border-emerald-700 px-4 py-2 font-semibold text-emerald-800 hover:bg-emerald-100"
            @click="onCancel"
          >
            Retour aux abonnements
          </button>
        </div>
      </div>

      <div
        v-if="!paymentSuccess && !loading && isInvalidSelection"
        class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        Le forfait sélectionné n'est pas disponible.
        <button
          type="button"
          class="ml-2 font-semibold text-[#7c7cf8] hover:underline"
          @click="onCancel"
        >
          Retour aux abonnements
        </button>
      </div>

      <div
        v-else-if="!paymentSuccess && !loading && !error && !isReady && !isInvalidSelection"
        class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        Impossible de charger les détails du changement de forfait.
        <button
          type="button"
          class="ml-2 font-semibold text-[#7c7cf8] hover:underline"
          @click="onCancel"
        >
          Retour aux abonnements
        </button>
      </div>

      <template v-else-if="!paymentSuccess">
        <section
          class="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div
            v-if="loading"
            class="flex min-h-[14rem] items-center justify-center"
          >
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
              aria-hidden="true"
            />
            <span class="ml-2 text-sm text-neutral-500">Chargement du forfait…</span>
          </div>
          <template v-else-if="isReady && flow">
            <TenantChangePlanComparison
              :current="flow.currentPlan"
              :next="flow.newPlan"
            />
            <TenantChangeBillingDetails
              :lines="flow.billingLines"
              :amount-due="flow.amountDueToday"
              :notice="flow.infoNotice"
            />
            <TenantChangeFeatureCompare
              :current-features="flow.currentFeatures"
              :new-features="flow.newFeatures"
            />
          </template>
        </section>

        <section
          class="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div
            v-if="loading || paymentMethodsLoading"
            class="flex min-h-[10rem] items-center justify-center"
          >
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
              aria-hidden="true"
            />
            <span class="ml-2 text-sm text-neutral-500">Chargement des modes de paiement…</span>
          </div>
          <div
            v-else-if="paymentMethodsError"
            class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            {{ paymentMethodsError }}
            <button type="button" class="ml-2 font-semibold underline" @click="loadPaymentMethods">
              Réessayer
            </button>
          </div>
          <TenantChangePaymentMethod
            v-else-if="isReady && flow"
            :methods="paymentMethods"
            :busy="submitting"
            :context="{ plan_id: planId, plan_code: planId, amount_due: flow.amountDueToday }"
            @cancel="onCancel"
            @proceed="onProceed"
          />
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TenantChangePlanComparison from "../../components/tenant/TenantChangePlanComparison.vue";
import TenantChangeBillingDetails from "../../components/tenant/TenantChangeBillingDetails.vue";
import TenantChangeFeatureCompare from "../../components/tenant/TenantChangeFeatureCompare.vue";
import TenantChangePaymentMethod from "../../components/tenant/TenantChangePaymentMethod.vue";
import { usePaymentMethods } from "../../composables/usePaymentMethods.js";
import { useTenantPlanChangeFlow } from "../../composables/useTenantPlanChangeFlow.js";
import { useTenantSubscription } from "../../composables/useTenantSubscription.js";

const router = useRouter();
const subscription = useTenantSubscription();
const { loading, error, load, changePlan } = subscription;
const { flow, isReady, isInvalidSelection, planId } = useTenantPlanChangeFlow(subscription);
const {
  methods: paymentMethods,
  loading: paymentMethodsLoading,
  error: paymentMethodsError,
  load: loadPaymentMethods,
} = usePaymentMethods();
const paymentSuccess = ref("");
const submittedInvoiceNumber = ref("");
const submitting = ref(false);

onMounted(async () => {
  await Promise.all([load(), loadPaymentMethods()]);
});

function onCancel() {
  router.push("/tenant/subscription");
}

async function onProceed(payload) {
  submitting.value = true;
  paymentSuccess.value = "";
  submittedInvoiceNumber.value = "";
  error.value = "";

  try {
    const result = await changePlan({
      plan_code: payload.plan_code || payload.plan_id || planId.value,
      payment_method: payload.payment_method,
      mobile_operator: payload.mobile_operator || null,
      phone_number: payload.phone_number || null,
      reference: payload.reference || null,
      receipt: payload.receipt || null,
    });

    paymentSuccess.value =
      result.message ||
      "Votre demande a été envoyée. Le forfait sera activé après vérification du paiement.";
    submittedInvoiceNumber.value = result.invoice_number || "";
  } catch {
    // error handled in composable
  } finally {
    submitting.value = false;
  }
}
</script>
