<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">
          {{
            props.audience === "company_admin"
              ? "Rapport des déclarations fiscales et sociales"
              : "Mes déclarations fiscales et sociales"
          }}
        </h1>
        <p class="mt-2 text-sm text-neutral-500">
          Échéances passées et à venir basées sur le calendrier officiel
          <template v-if="store.company">
            — <strong class="text-neutral-700">{{ store.company.name }}</strong>
            <span v-if="store.company.country"> ({{ store.company.country }})</span>
          </template>
        </p>
      </header>

      <div
        v-if="store.error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ store.error }}
      </div>

      <section class="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-base font-semibold text-neutral-900">Montants estimés à reverser</h2>
            <p class="mt-1 text-xs text-neutral-500">
              Retenues salariales et cotisations patronales issues des bulletins du mois.
            </p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label for="declaration-period" class="text-sm font-medium text-neutral-700">Mois</label>
            <input
              id="declaration-period"
              v-model="store.reportPeriod"
              type="month"
              class="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              :disabled="store.reportLoading || store.pdfLoading"
              @change="store.loadReport()"
            />
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="store.reportLoading || store.pdfLoading || !store.report"
              @click="store.downloadReportPdf()"
            >
              {{ store.pdfLoading ? "Préparation…" : "Télécharger le PDF" }}
            </button>
          </div>
        </div>

        <div
          v-if="store.reportError"
          class="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ store.reportError }}
        </div>
        <div v-if="store.reportLoading" class="py-8 text-center text-sm text-neutral-500">
          Chargement des montants…
        </div>
        <template v-else-if="store.report">
          <p class="mt-4 text-xs text-neutral-500">
            {{ store.report.payroll_count }} bulletin(s) calculé(s), validé(s) ou payé(s) pris en compte.
          </p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="row in store.report.obligations"
              :key="row.id"
              class="rounded-lg border border-neutral-200 bg-neutral-50/60 p-4"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="text-sm font-semibold text-neutral-800">{{ row.authority || row.name }}</h3>
                  <p class="mt-0.5 text-xs text-neutral-500">{{ row.name }}</p>
                </div>
                <span
                  class="rounded-md px-2 py-0.5 text-xs font-semibold"
                  :class="row.type === 'fiscal' ? 'bg-violet-50 text-violet-800' : 'bg-sky-50 text-sky-800'"
                >
                  {{ typeLabel(row.type) }}
                </span>
              </div>
              <div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-3">
                <p
                  class="text-xs font-medium"
                  :class="row.payment.is_paid ? 'text-emerald-700' : 'text-neutral-500'"
                >
                  {{ row.payment.is_paid ? `Payée le ${formatDateTime(row.payment.paid_at)}` : "Paiement non enregistré" }}
                  <span v-if="row.payment.paid_by"> par {{ row.payment.paid_by }}</span>
                </p>
                <button
                  type="button"
                  class="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  :class="row.payment.is_paid
                    ? 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'"
                  :disabled="store.paymentUpdating[row.id]"
                  @click="store.updateDeclarationPayment(row)"
                >
                  {{
                    store.paymentUpdating[row.id]
                      ? "Enregistrement…"
                      : row.payment.is_paid
                        ? "Annuler le paiement"
                        : "Marquer comme payée"
                  }}
                </button>
              </div>
              <template v-if="row.is_calculable">
                <div v-for="amount in row.amounts" :key="amount.currency" class="mt-3">
                  <p class="text-lg font-bold text-neutral-900">
                    {{ amount.is_complete ? formatAmount(amount.total, amount.currency) : `Partiel : ${formatAmount(amount.known_total, amount.currency)}` }}
                  </p>
                  <p class="mt-1 text-xs text-neutral-500">
                    Salarié : {{ formatAmount(amount.employee, amount.currency) }}
                    <span aria-hidden="true">·</span>
                    Employeur : {{ formatAmount(amount.employer, amount.currency) }}
                  </p>
                  <p v-if="amount.missing_employer_codes.length" class="mt-1 text-xs text-amber-700">
                    Part patronale absente des lignes de paie pour : {{ amount.missing_employer_codes.join(", ") }}.
                  </p>
                </div>
              </template>
              <p v-else class="mt-3 text-xs font-medium text-amber-700">
                Montant non calculable : aucun code de paie n’est lié à cette obligation.
              </p>
              <p v-if="row.is_calculable && !row.amounts.length" class="mt-3 text-xs text-neutral-500">
                Aucune paie disponible pour ce mois.
              </p>
            </article>
          </div>
          <div class="mt-4 border-t border-neutral-200 pt-4">
            <h3 class="text-sm font-semibold text-neutral-800">Synthèse des montants par devise</h3>
            <p
              v-for="total in store.report.totals_by_currency"
              :key="total.currency"
              class="mt-1 text-lg font-bold text-primary-700"
            >
              {{ total.is_complete ? formatAmount(total.total, total.currency) : `Sous-total connu : ${formatAmount(total.known_total, total.currency)}` }}
              <span class="text-xs font-normal text-neutral-500">
                (salariés {{ formatAmount(total.employee, total.currency) }} + employeur
                {{ formatAmount(total.employer, total.currency) }})
              </span>
            </p>
            <p v-if="!store.report.totals_by_currency.length" class="mt-1 text-sm text-neutral-500">
              Aucun bulletin de paie disponible sur cette période.
            </p>
          </div>
          <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {{ store.report.notice }} Les obligations sans code lié et les parts patronales manquantes ne sont pas présentées comme des totaux complets.
          </p>
        </template>
      </section>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          title="Ce mois-ci"
          :value="store.thisMonthCount"
          unit-label="Échéances"
          tone="blue"
          :loading="store.loading"
        >
          <template #icon>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </template>
        </KpiCard>
        <KpiCard
          title="À traiter bientôt"
          :value="store.dueSoonCount"
          unit-label="Sous 7 jours"
          tone="violet"
          :loading="store.loading"
        >
          <template #icon>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
        </KpiCard>
        <KpiCard
          title="En retard"
          :value="store.overdueCount"
          unit-label="Déclarations"
          tone="red"
          :loading="store.loading"
        >
          <template #icon>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </template>
        </KpiCard>
      </section>

      <TableCard>
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-semibold text-neutral-800">Suivi des échéances</h2>
              <p class="text-xs text-neutral-500">Dernière échéance et prochaine date limite par obligation</p>
            </div>
            <div class="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
              <button
                v-for="tab in typeTabs"
                :key="tab.id"
                type="button"
                class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                :class="store.typeFilter === tab.id ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-700'"
                :disabled="store.loading"
                @click="store.typeFilter = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
        </template>

        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50/80">
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Obligation</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Type</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Organisme</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Période visée</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Échéance</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Délai</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Statut</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-neutral-100">
          <tr v-if="store.loading">
            <td colspan="7" class="px-6 py-16 text-center text-sm text-neutral-600">
              <span class="inline-flex items-center gap-2">
                <span
                  class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
                  aria-hidden="true"
                />
                Chargement…
              </span>
            </td>
          </tr>
          <tr v-else-if="!store.filteredDeadlines.length">
            <td colspan="7" class="px-6 py-12 text-center text-sm text-neutral-500">
              <template v-if="!store.company">
                Aucune entreprise associée à votre compte.
              </template>
              <template v-else>
                Aucune obligation de déclaration active pour ce pays.
              </template>
            </td>
          </tr>
          <template v-else>
            <tr
              v-for="row in store.filteredDeadlines"
              :key="`${row.obligation_id}-${row.due_date}`"
              class="hover:bg-neutral-50/60"
            >
              <td class="px-4 py-3">
                <p class="text-sm font-medium text-neutral-800">{{ row.name }}</p>
                <p class="mt-0.5 font-mono text-xs text-neutral-500">{{ row.code }}</p>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold"
                  :class="row.type === 'fiscal' ? 'bg-violet-50 text-violet-800' : 'bg-sky-50 text-sky-800'"
                >
                  {{ typeLabel(row.type) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-neutral-600">{{ row.authority || "—" }}</td>
              <td class="px-4 py-3 text-sm text-neutral-800">{{ row.reference_period_label }}</td>
              <td class="px-4 py-3 text-sm font-medium text-neutral-800">
                {{ formatFrenchDate(row.due_date) }}
                <p v-if="row.grace_end_date !== row.due_date" class="text-xs font-normal text-neutral-500">
                  Grâce jusqu'au {{ formatFrenchDate(row.grace_end_date) }}
                </p>
              </td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="row.days_until < 0 ? 'text-red-600 font-medium' : row.days_until <= 7 ? 'text-amber-700 font-medium' : 'text-neutral-600'"
                >
                  <template v-if="row.days_until < 0">J+{{ Math.abs(row.days_until) }} de retard</template>
                  <template v-else-if="row.days_until === 0">Aujourd'hui</template>
                  <template v-else>J-{{ row.days_until }}</template>
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold"
                  :class="statusClass(row.status)"
                >
                  {{ deadlineStatusLabel(row.status) }}
                </span>
              </td>
            </tr>
          </template>
        </tbody>
      </TableCard>

      <div
        v-if="!store.loading && store.obligations.length"
        class="rounded-lg border border-neutral-200 bg-neutral-50/60 px-4 py-3 text-xs text-neutral-500"
      >
        Les statuts sont calculés à partir des échéances configurées pour le pays de l’entreprise.
        Ce rapport ne confirme pas le dépôt effectif des déclarations.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import KpiCard from "../../components/common/KpiCard.vue";
import TableCard from "../../components/common/TableCard.vue";
import { typeLabel } from "../../data/compliance-obligation/index.js";
import {
  deadlineStatusLabel,
  formatFrenchDate,
} from "../../data/compliance-obligation/deadlines.js";
import { useMyDeadlinesStore } from "./store/my-deadlines.store.js";

const props = defineProps({
  audience: { type: String, default: "tenant" },
});

const store = useMyDeadlinesStore();

const typeTabs = [
  { id: "all", label: "Toutes" },
  { id: "fiscal", label: "Fiscales" },
  { id: "social", label: "Sociales" },
];

function statusClass(status) {
  return {
    overdue: "bg-red-50 text-red-800",
    grace: "bg-orange-50 text-orange-800",
    due_soon: "bg-amber-50 text-amber-800",
    upcoming: "bg-emerald-50 text-emerald-800",
  }[status] ?? "bg-neutral-100 text-neutral-600";
}

function formatAmount(amount, currency) {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(amount)} ${currency}`;
  }
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

onMounted(() => store.init({ tenantPortal: props.audience === "tenant" }));
</script>
