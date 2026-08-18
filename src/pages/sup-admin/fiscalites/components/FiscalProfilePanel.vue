<template>
  <section class="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs md:p-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex items-start gap-4 min-w-0">
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
          aria-hidden="true"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="min-w-0">
          <h2 class="text-lg font-semibold text-neutral-900">{{ profile?.country_name ?? "—" }}</h2>
          <p class="text-sm text-neutral-500">
            {{ profile?.country_code ?? "—" }} · {{ profile?.locale ?? "—" }}
          </p>
          <p v-if="profile?.legal_framework" class="mt-1 text-xs text-blue-700 bg-blue-50 inline-block px-2 py-0.5 rounded-md">
            {{ profile.legal_framework }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-neutral-500">v{{ profile?.version ?? 1 }}</span>
        <span
          class="inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
          :class="profile?.status === 'active' ? 'bg-green-50 text-green-800 ring-green-600/15' : 'bg-red-50 text-red-700 ring-red-600/15'"
        >
          {{ profile?.status === "active" ? "Actif" : "Inactif" }}
        </span>
        <button type="button" class="btn-outline text-sm px-3 py-1.5" :disabled="disabled" @click="$emit('toggle-status')">
          {{ profile?.status === "active" ? "Désactiver" : "Activer" }}
        </button>
      </div>
    </div>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border border-neutral-100 bg-neutral-50/80 px-4 py-3">
        <p class="text-xs font-medium uppercase text-neutral-500">Devise</p>
        <p class="mt-1 text-lg font-semibold">{{ profile?.currency ?? "—" }}</p>
      </div>
      <div class="rounded-lg border border-neutral-100 bg-neutral-50/80 px-4 py-3">
        <p class="text-xs font-medium uppercase text-neutral-500">Exercice fiscal</p>
        <p class="mt-1 text-sm font-medium">{{ profile?.fiscal_year_start ?? "—" }}</p>
      </div>
      <div class="rounded-lg border border-neutral-100 bg-neutral-50/80 px-4 py-3">
        <p class="text-xs font-medium uppercase text-neutral-500">Règles actives</p>
        <p class="mt-1 text-lg font-semibold text-green-700">{{ activeRulesCount }}</p>
      </div>
      <div class="rounded-lg border border-neutral-100 bg-neutral-50/80 px-4 py-3">
        <p class="text-xs font-medium uppercase text-neutral-500">Dernière MAJ</p>
        <p class="mt-1 text-sm font-medium">{{ formattedDate }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  profile: { type: Object, default: null },
  activeRulesCount: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
});
defineEmits(["toggle-status"]);

const formattedDate = computed(() =>
  props.profile?.last_updated
    ? new Date(props.profile.last_updated).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })
    : "—"
);
</script>
