<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <div class="mb-4 flex flex-wrap items-start justify-between gap-4">
      <PageHero
        title="Plans d'abonnement"
        :breadcrumbs="[{ label: 'Super Admin' }, { label: 'Plans' }]"
      />
      <button
        type="button"
        class="btn-primary shrink-0 text-sm px-4 py-2"
        :disabled="store.loading || store.saving"
        @click="openCreate"
      >
        + Ajouter un plan
      </button>
    </div>

    <p class="mb-4 text-sm text-neutral-500">
      Grille tarifaire synchronisée avec l'API HR
      <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs">/api/v1/subscription-plans</code>.
    </p>

    <div
      v-if="store.error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ store.error }}
    </div>

    <div class="mb-6 grid gap-4 sm:grid-cols-3">
      <KpiCard
        title="Plans actifs"
        :value="store.activePlans.length"
        unit-label="Plans"
        tone="green"
        :loading="store.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="Plan mis en avant"
        :value="highlightedName"
        unit-label=""
        tone="violet"
        :loading="store.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </template>
      </KpiCard>
      <KpiCard
        title="Catalogue services"
        :value="serviceCount"
        unit-label="Modules"
        tone="blue"
        :loading="store.loading"
      >
        <template #icon>
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </template>
      </KpiCard>
    </div>

    <div class="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <template v-if="store.loading">
        <div
          v-for="n in 4"
          :key="n"
          class="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white p-5 text-sm text-neutral-500 shadow-xs"
        >
          <span
            class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
            aria-hidden="true"
          />
          Chargement…
        </div>
      </template>
      <template v-else-if="store.plans.length">
        <PlanCard
          v-for="plan in store.plans"
          :key="plan.id"
          :plan="plan"
          :disabled="store.saving"
          @edit="openEdit"
        />
      </template>
      <p
        v-else
        class="col-span-full rounded-xl border border-neutral-200 bg-white py-12 text-center text-sm text-neutral-500"
      >
        Aucun plan pour le moment.
      </p>
    </div>

    <ServicesComparisonTable
      :plans="store.plans"
      :services="store.services"
      :loading="store.loading"
    />

    <PlanFormModal
      v-model:open="modalOpen"
      :plan="editingPlan"
      :services="store.services"
      :disabled="store.saving"
      @save="onSave"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import PageHero from "../../../components/common/PageHero.vue";
import KpiCard from "../../../components/common/KpiCard.vue";
import PlanCard from "./components/PlanCard.vue";
import PlanFormModal from "./components/PlanFormModal.vue";
import ServicesComparisonTable from "./components/ServicesComparisonTable.vue";
import { usePlansStore } from "./store/plans.store.js";

const store = usePlansStore();
const modalOpen = ref(false);
const editingPlan = ref(null);

const serviceCount = computed(() => store.services.length);
const highlightedName = computed(() => store.highlightedPlan?.name ?? "—");

function openCreate() {
  editingPlan.value = null;
  modalOpen.value = true;
}

function openEdit(plan) {
  editingPlan.value = plan;
  modalOpen.value = true;
}

async function onSave(updates) {
  if (editingPlan.value?.id) {
    await store.updatePlan(editingPlan.value.id, updates);
  } else {
    await store.createPlan(updates);
  }
}

onMounted(() => store.init());
</script>
