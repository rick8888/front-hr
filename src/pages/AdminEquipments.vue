<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-6xl mx-auto">
    <div class="flex items-start justify-between mb-8 gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">Gestion des matériels</h1>
        <p class="text-sm text-neutral-600">
          Gérez le catalogue d'équipements disponibles pour les employés
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold"
        @click="openAddModal"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouvel équipement
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
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Actifs</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2">
          {{ loading ? "—" : activeCount }}
        </p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Inactifs</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2">
          {{ loading ? "—" : inactiveCount }}
        </p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Stock total</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2">
          {{ loading ? "—" : totalStock }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3 mb-6 flex-wrap">
      <div class="relative flex-1 min-w-[260px] max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un équipement..."
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
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Équipement</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Catégorie</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Marque / Modèle</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Stock</th>
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
            v-for="item in filteredEquipments"
            v-else
            :key="item.id"
            class="hover:bg-neutral-50 transition-colors"
          >
            <td class="px-6 py-4">
              <p class="text-sm font-semibold text-neutral-900">{{ item.name }}</p>
              <p v-if="item.description" class="text-xs text-neutral-500 mt-1 line-clamp-1">
                {{ item.description }}
              </p>
            </td>
            <td class="px-6 py-4 text-sm text-neutral-700">{{ item.categoryLabel }}</td>
            <td class="px-6 py-4 text-sm text-neutral-700">
              <span v-if="item.brand || item.model">
                {{ [item.brand, item.model].filter(Boolean).join(" · ") }}
              </span>
              <span v-else class="text-neutral-400">—</span>
            </td>
            <td class="px-6 py-4 text-sm text-neutral-900">{{ item.stock }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                  item.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-neutral-100 text-neutral-700',
                ]"
              >
                {{ item.statusLabel }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button
                type="button"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3"
                :disabled="saving"
                @click="editEquipment(item)"
              >
                Modifier
              </button>
              <button
                type="button"
                class="text-error-600 hover:text-error-700 text-sm font-medium"
                :disabled="saving"
                @click="deleteEquipment(item.id)"
              >
                Supprimer
              </button>
            </td>
          </tr>
          <tr v-if="!loading && filteredEquipments.length === 0">
            <td colspan="6" class="px-6 py-10 text-center text-sm text-neutral-500">
              Aucun équipement trouvé.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">
            {{ editingEquipment ? "Modifier l'équipement" : "Nouvel équipement" }}
          </h2>
        </div>
        <div class="px-6 py-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Nom <span class="text-error-600">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Catégorie</label>
              <select
                v-model="form.category"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
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
              <label class="block text-sm font-medium text-neutral-700 mb-2">Stock</label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Marque</label>
              <input
                v-model="form.brand"
                type="text"
                placeholder="Dell, Apple..."
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Modèle</label>
              <input
                v-model="form.model"
                type="text"
                placeholder="Latitude 5540..."
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
              <select
                v-model="form.isActive"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              >
                <option :value="true">Actif (visible employés)</option>
                <option :value="false">Inactif</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              placeholder="Description de l'équipement..."
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Spécifications
              <span class="font-normal text-neutral-500">(une par ligne)</span>
            </label>
            <textarea
              v-model="form.specificationsText"
              rows="3"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              placeholder="16 Go RAM&#10;512 Go SSD&#10;Écran 14&quot;"
            />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
            :disabled="saving"
            @click="closeModal"
          >
            Annuler
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            :disabled="saving"
            @click="saveEquipment"
          >
            {{ saving ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdminEquipments } from "./equipment/composables/useAdminEquipments.js";

const {
  loading,
  saving,
  error,
  searchQuery,
  categoryFilter,
  isModalOpen,
  editingEquipment,
  form,
  filteredEquipments,
  activeCount,
  inactiveCount,
  totalStock,
  categoryOptions,
  openAddModal,
  editEquipment,
  closeModal,
  saveEquipment,
  deleteEquipment,
} = useAdminEquipments();
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
