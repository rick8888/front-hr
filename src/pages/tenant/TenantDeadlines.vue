<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">Mes échéances</h1>
        <p class="mt-2 text-sm text-neutral-500">
          Calendrier des déclarations fiscales et sociales
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
              <h2 class="text-base font-semibold text-neutral-800">Référentiel des échéances</h2>
              <p class="text-xs text-neutral-500">Prochaines dates limites par obligation déclarative</p>
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
              :key="row.obligation_id"
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
        Les échéances sont calculées à partir du référentiel pays configuré par la plateforme.
        La soumission et le suivi des déclarations seront disponibles prochainement.
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

onMounted(() => store.init());
</script>
