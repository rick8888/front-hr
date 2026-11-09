<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-6xl mx-auto">
    <div class="flex items-start justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">Gestion des formations</h1>
        <p class="text-sm text-neutral-600">Planifiez, publiez et suivez le catalogue de formation</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold"
        @click="openAddTrainingModal"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouvelle formation
      </button>
    </div>

    <div
      v-if="error"
      class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Actives</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2">
          {{ loading ? "—" : activeTrainingsCount }}
        </p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Brouillons</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2">
          {{ loading ? "—" : draftTrainingsCount }}
        </p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Inscriptions</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2">
          {{ loading ? "—" : totalEnrollments }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3 mb-6 flex-wrap">
      <div class="relative flex-1 min-w-[260px] max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une formation..."
          class="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
        />
        <svg class="absolute left-3 top-3 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <select
        v-model="categoryFilter"
        class="px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
      >
        <option value="">Toutes les catégories</option>
        <option
          v-for="opt in categoryOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div class="overflow-x-auto border border-neutral-200 rounded-xl">
      <table class="w-full bg-white">
        <thead>
          <tr class="bg-neutral-50 border-b border-neutral-200">
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Formation</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Catégorie</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Durée</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Inscriptions</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Statut</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-10 text-center text-sm text-neutral-500">
              Chargement...
            </td>
          </tr>
          <tr
            v-for="training in filteredTrainings"
            v-else
            :key="training.id"
            class="hover:bg-neutral-50 transition-colors"
          >
            <td class="px-6 py-4">
              <p class="text-sm font-semibold text-neutral-900">{{ training.name }}</p>
              <p v-if="training.description" class="text-xs text-neutral-500 mt-1 line-clamp-1">
                {{ training.description }}
              </p>
            </td>
            <td class="px-6 py-4 text-sm text-neutral-700">{{ training.categoryLabel }}</td>
            <td class="px-6 py-4 text-sm text-neutral-700">{{ training.duration }}</td>
            <td class="px-6 py-4 text-sm text-neutral-900">{{ training.enrolled }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                  training.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-neutral-100 text-neutral-700',
                ]"
              >
                {{ training.statusLabel }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="inline-flex items-center justify-end gap-1">
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                :disabled="saving"
                title="Modifier"
                aria-label="Modifier"
                @click="editTraining(training)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-error-600 transition-colors hover:bg-error-50 hover:text-error-700 focus:outline-none focus:ring-2 focus:ring-error-500 disabled:opacity-50"
                :disabled="saving"
                title="Supprimer"
                aria-label="Supprimer"
                @click="deleteTraining(training.id)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && filteredTrainings.length === 0">
            <td colspan="6" class="px-6 py-10 text-center text-sm text-neutral-500">
              Aucune formation trouvée.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      @click.self="closeModal"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="training-modal-title"
        class="my-auto flex max-h-[calc(100vh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]"
        @click.stop
      >
        <div class="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-violet-50/60 px-5 py-4 sm:px-7">
          <h2 id="training-modal-title" class="text-xl font-bold tracking-tight text-slate-900">
            {{ editingTraining ? "Modifier la formation" : "Nouvelle formation" }}
          </h2>
          <button
            type="button"
            class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            aria-label="Fermer"
            :disabled="saving"
            @click="closeModal"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="min-h-0 space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">
              Nom <span class="text-error-600">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Catégorie</label>
              <select
                v-model="form.category"
                class="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              >
                <option
                  v-for="opt in categoryOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Durée</label>
              <input
                v-model="form.duration"
                type="text"
                placeholder="6 semaines"
                class="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Date de début</label>
              <input
                v-model="form.startDate"
                type="date"
                class="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Statut</label>
              <select
                v-model="form.status"
                class="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              >
                <option value="published">Active (publiée)</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              placeholder="Objectifs et contenu de la formation..."
            />
          </div>
        </div>
        <div class="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-7">
          <button
            type="button"
            class="w-full rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 sm:w-auto"
            :disabled="saving"
            @click="closeModal"
          >
            Annuler
          </button>
          <button
            type="button"
            class="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            :disabled="saving"
            @click="saveTraining"
          >
            {{ saving ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdminTrainings } from "./training/composables/useAdminTrainings.js";

const {
  loading,
  saving,
  error,
  searchQuery,
  categoryFilter,
  isModalOpen,
  editingTraining,
  form,
  filteredTrainings,
  activeTrainingsCount,
  draftTrainingsCount,
  totalEnrollments,
  categoryOptions,
  openAddTrainingModal,
  editTraining,
  closeModal,
  saveTraining,
  deleteTraining,
} = useAdminTrainings();
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
