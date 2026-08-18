<template>
  <div class="px-6 py-6">
    <div class="max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-neutral-900 mb-2">Équipements</h1>
      <p class="text-sm text-neutral-600">
        Consultez et demandez du matériel professionnel
      </p>
    </div>

    <div
      v-if="error"
      class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- Tabs Navigation -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm mb-6">
      <div class="border-b border-neutral-200">
        <div class="flex items-center gap-1 px-6 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900',
            ]"
            @click="activeTab = tab.id"
          >
            <span class="text-lg">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
            <span
              v-if="getEquipmentCount(tab.id) > 0"
              class="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600"
            >
              {{ getEquipmentCount(tab.id) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Equipment Content -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <!-- Available Equipment Tab -->
      <div v-if="activeTab === 'available'" class="p-6">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-neutral-900">Équipements Disponibles</h2>
            <div class="flex items-center gap-3">
              <select
                v-model="filterCategory"
                class="px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          </div>
        </div>

        <!-- Equipment Cards Grid -->
        <div v-if="loading" class="py-12 text-center text-sm text-neutral-500">
          Chargement des équipements...
        </div>
        <div
          v-else-if="filteredAvailableEquipment.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="equipment in filteredAvailableEquipment"
            :key="equipment.id"
            class="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-neutral-900 mb-2">
                  {{ equipment.name }}
                </h3>
                <span
                  class="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  :class="getCategoryClass(equipment.category)"
                >
                  {{ getCategoryLabel(equipment.category) }}
                </span>
              </div>
            </div>

            <p class="text-sm text-neutral-600 mb-4 line-clamp-2">
              {{ equipment.description }}
            </p>

            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm text-neutral-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Stock: {{ equipment.stock }} disponible(s)</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-neutral-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span v-if="equipment.brand">{{ equipment.brand }}</span>
                <span v-else class="text-neutral-400">Marque non spécifiée</span>
              </div>
              <div v-if="equipment.model" class="flex items-center gap-2 text-sm text-neutral-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Modèle: {{ equipment.model }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3 mt-4">
              <button
                @click="viewEquipmentDetails(equipment)"
                class="flex-1 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Détails
              </button>
              <button
                @click="requestEquipment(equipment)"
                :disabled="equipment.stock === 0"
                :class="[
                  'flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  equipment.stock === 0
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'text-white bg-primary-600 hover:bg-primary-700',
                ]"
              >
                {{ equipment.stock === 0 ? 'Indisponible' : 'Demander' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <svg
            class="w-16 h-16 mx-auto text-neutral-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p class="text-neutral-600">Aucun équipement disponible pour le moment</p>
        </div>
      </div>

      <!-- My Requests Tab -->
      <div v-if="activeTab === 'my-requests'" class="p-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-6">Mes Demandes</h2>

        <div v-if="loading" class="py-12 text-center text-sm text-neutral-500">
          Chargement...
        </div>
        <div v-else-if="myRequests.length > 0" class="space-y-4">
          <div
            v-for="request in myRequests"
            :key="request.id"
            class="bg-neutral-50 border border-neutral-200 rounded-xl p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-neutral-900 mb-2">
                  {{ request.equipmentName }}
                </h3>
                <span
                  class="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(request.status)"
                >
                  {{ getStatusLabel(request.status) }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p class="text-xs text-neutral-600 mb-1">Date de demande</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ formatDate(request.requestDate) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Quantité</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ request.quantity }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Priorité</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ getPriorityLabel(request.priority) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Date prévue</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ request.expectedDate ? formatDate(request.expectedDate) : 'N/A' }}
                </p>
              </div>
            </div>

            <div v-if="request.reason" class="mb-4">
              <p class="text-xs text-neutral-600 mb-1">Raison de la demande</p>
              <p class="text-sm text-neutral-900">{{ request.reason }}</p>
            </div>

            <div v-if="request.status === 'pending'" class="flex items-center gap-3">
              <button
                @click="onCancelRequest(request)"
                class="px-4 py-2 text-sm font-medium text-error-600 border border-error-600 rounded-lg hover:bg-error-50 transition-colors"
                :disabled="saving"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <svg
            class="w-16 h-16 mx-auto text-neutral-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="text-neutral-600 mb-2">Vous n'avez aucune demande d'équipement</p>
          <button
            @click="activeTab = 'available'"
            class="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Parcourir les équipements disponibles
          </button>
        </div>
      </div>

      <!-- My Equipment Tab -->
      <div v-if="activeTab === 'my-equipment'" class="p-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-6">Mes Équipements</h2>

        <div v-if="loading" class="py-12 text-center text-sm text-neutral-500">
          Chargement...
        </div>
        <div v-else-if="myEquipment.length > 0" class="space-y-4">
          <div
            v-for="item in myEquipment"
            :key="item.id"
            class="bg-neutral-50 border border-neutral-200 rounded-xl p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-neutral-900 mb-2">
                  {{ item.name }}
                </h3>
                <span
                  class="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(item.status)"
                >
                  {{ getStatusLabel(item.status) }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p class="text-xs text-neutral-600 mb-1">Numéro de série</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ item.serialNumber || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Date d'attribution</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ formatDate(item.assignedDate) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Marque</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ item.brand || 'N/A' }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Modèle</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ item.model || 'N/A' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                @click="viewEquipmentDetails(item)"
                class="flex-1 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Détails
              </button>
              <button
                v-if="item.status === 'assigned'"
                @click="onReportIssue(item)"
                class="px-4 py-2 text-sm font-medium text-warning-600 border border-warning-600 rounded-lg hover:bg-warning-50 transition-colors"
                :disabled="saving"
              >
                Signaler un problème
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <svg
            class="w-16 h-16 mx-auto text-neutral-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p class="text-neutral-600">Vous n'avez aucun équipement attribué</p>
        </div>
      </div>
    </div>

    <!-- Equipment Details Modal -->
    <Modal
      v-model="isDetailsModalOpen"
      :title="selectedEquipment?.name || 'Détails de l\'équipement'"
      @confirm="isDetailsModalOpen = false"
      confirm-label="Fermer"
      :show-cancel="false"
    >
      <div v-if="selectedEquipment" class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-neutral-600 mb-2">Description</h3>
          <p class="text-sm text-neutral-900">{{ selectedEquipment.description }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="text-sm font-medium text-neutral-600 mb-1">Catégorie</h3>
            <p class="text-sm text-neutral-900">
              {{ getCategoryLabel(selectedEquipment.category) }}
            </p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-neutral-600 mb-1">Stock disponible</h3>
            <p class="text-sm text-neutral-900">{{ selectedEquipment.stock ?? 'N/A' }}</p>
          </div>
          <div v-if="selectedEquipment.brand">
            <h3 class="text-sm font-medium text-neutral-600 mb-1">Marque</h3>
            <p class="text-sm text-neutral-900">{{ selectedEquipment.brand }}</p>
          </div>
          <div v-if="selectedEquipment.model">
            <h3 class="text-sm font-medium text-neutral-600 mb-1">Modèle</h3>
            <p class="text-sm text-neutral-900">{{ selectedEquipment.model }}</p>
          </div>
        </div>
        <div v-if="selectedEquipment.specifications && selectedEquipment.specifications.length > 0">
          <h3 class="text-sm font-medium text-neutral-600 mb-2">Spécifications</h3>
          <ul class="list-disc list-inside space-y-1">
            <li
              v-for="(spec, index) in selectedEquipment.specifications"
              :key="index"
              class="text-sm text-neutral-900"
            >
              {{ spec }}
            </li>
          </ul>
        </div>
      </div>
    </Modal>

    <!-- Request Equipment Modal -->
    <Modal
      v-model="isRequestModalOpen"
      title="Demander un équipement"
      @confirm="confirmRequest"
      confirm-label="Envoyer la demande"
    >
      <div v-if="requestingEquipment" class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-neutral-900 mb-2">
            {{ requestingEquipment.name }}
          </h3>
          <p class="text-sm text-neutral-600">{{ requestingEquipment.description }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Quantité
          </label>
          <input
            v-model.number="requestForm.quantity"
            type="number"
            min="1"
            :max="requestingEquipment.stock"
            class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Priorité
          </label>
          <select
            v-model="requestForm.priority"
            class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Raison de la demande
          </label>
          <textarea
            v-model="requestForm.reason"
            rows="3"
            placeholder="Expliquez pourquoi vous avez besoin de cet équipement..."
            class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Date souhaitée
          </label>
          <input
            v-model="requestForm.expectedDate"
            type="date"
            :min="new Date().toISOString().split('T')[0]"
            class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../components/common/Modal.vue";
import { useEquipment } from "./equipment/composables/useEquipment.js";

const {
  activeTab,
  filterCategory,
  loading,
  saving,
  error,
  myRequests,
  myEquipment,
  filteredAvailableEquipment,
  categoryOptions,
  getEquipmentCount,
  getCategoryClass,
  getCategoryLabel,
  getStatusClass,
  getStatusLabel,
  getPriorityLabel,
  formatDate,
  createRequest,
  cancelRequest,
  reportIssue,
} = useEquipment();

const isDetailsModalOpen = ref(false);
const isRequestModalOpen = ref(false);
const selectedEquipment = ref(null);
const requestingEquipment = ref(null);

const requestForm = ref({
  quantity: 1,
  priority: "medium",
  reason: "",
  expectedDate: "",
});

const tabs = [
  { id: "available", label: "Disponibles", icon: "💻" },
  { id: "my-requests", label: "Mes demandes", icon: "📋" },
  { id: "my-equipment", label: "Mes équipements", icon: "🖥️" },
];

function viewEquipmentDetails(equipment) {
  selectedEquipment.value = equipment;
  isDetailsModalOpen.value = true;
}

function requestEquipment(equipment) {
  requestingEquipment.value = equipment;
  requestForm.value = {
    quantity: 1,
    priority: "medium",
    reason: "",
    expectedDate: "",
  };
  isRequestModalOpen.value = true;
}

async function confirmRequest() {
  if (!requestingEquipment.value || saving.value) return;
  const ok = await createRequest({
    equipmentId: requestingEquipment.value.id,
    quantity: requestForm.value.quantity,
    priority: requestForm.value.priority,
    reason: requestForm.value.reason,
    expectedDate: requestForm.value.expectedDate || null,
  });
  if (ok) {
    isRequestModalOpen.value = false;
    requestingEquipment.value = null;
  }
}

async function onCancelRequest(request) {
  if (!confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) return;
  await cancelRequest(request.id);
}

async function onReportIssue(item) {
  const note = prompt(`Décrivez le problème pour ${item.name} :`);
  if (!note || !note.trim()) return;
  await reportIssue(item.id, note.trim());
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>



