<template>
  <div class="px-6 py-6">
    <div class="max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-neutral-900 mb-2">Formation</h1>
      <p class="text-sm text-neutral-600">
        Découvrez et inscrivez-vous aux formations disponibles
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
              v-if="getTrainingCount(tab.id) > 0"
              class="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600"
            >
              {{ getTrainingCount(tab.id) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Training Content -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <!-- Available Trainings Tab -->
      <div v-if="activeTab === 'available'" class="p-6">
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-neutral-900">Formations Disponibles</h2>
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

        <!-- Training Cards Grid -->
        <div v-if="loading" class="py-12 text-center text-sm text-neutral-500">
          Chargement des formations...
        </div>
        <div
          v-else-if="filteredAvailableTrainings.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="training in filteredAvailableTrainings"
            :key="training.id"
            class="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-neutral-900 mb-2">
                  {{ training.name }}
                </h3>
                <span
                  class="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  :class="getCategoryClass(training.category)"
                >
                  {{ getCategoryLabel(training.category) }}
                </span>
              </div>
            </div>

            <p class="text-sm text-neutral-600 mb-4 line-clamp-2">
              {{ training.description }}
            </p>

            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm text-neutral-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ training.duration }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-neutral-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{{ training.enrolled }} inscrits</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-neutral-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Début: {{ formatDate(training.startDate) }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3 mt-4">
              <button
                @click="viewTrainingDetails(training)"
                class="flex-1 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Détails
              </button>
              <button
                @click="enrollInTraining(training)"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                :disabled="saving"
              >
                S'inscrire
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p class="text-neutral-600">Aucune formation disponible pour le moment</p>
        </div>
      </div>

      <!-- My Trainings Tab -->
      <div v-if="activeTab === 'my-trainings'" class="p-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-6">Mes Formations</h2>

        <div v-if="loading" class="py-12 text-center text-sm text-neutral-500">
          Chargement...
        </div>
        <div v-else-if="myTrainings.length > 0" class="space-y-4">
          <div
            v-for="training in myTrainings"
            :key="training.id"
            class="bg-neutral-50 border border-neutral-200 rounded-xl p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-neutral-900 mb-2">
                  {{ training.name }}
                </h3>
                <span
                  class="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(training.status)"
                >
                  {{ getStatusLabel(training.status) }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p class="text-xs text-neutral-600 mb-1">Début</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ formatDate(training.startDate) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Fin</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ formatDate(training.endDate) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Progression</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ training.progress }}%
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Durée</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ training.duration }}
                </p>
              </div>
            </div>

            <div class="mb-4">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-neutral-600">Progression</span>
                <span class="text-xs font-medium text-neutral-900">{{ training.progress }}%</span>
              </div>
              <div class="w-full bg-neutral-200 rounded-full h-2">
                <div
                  class="bg-primary-600 h-2 rounded-full transition-all"
                  :style="{ width: training.progress + '%' }"
                ></div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button
                @click="viewTrainingDetails(training)"
                class="flex-1 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Continuer
              </button>
              <button
                v-if="training.status === 'enrolled'"
                @click="onCancelEnrollment(training)"
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p class="text-neutral-600 mb-2">Vous n'êtes inscrit à aucune formation</p>
          <button
            @click="activeTab = 'available'"
            class="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Parcourir les formations disponibles
          </button>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="p-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-6">Historique</h2>

        <div v-if="loading" class="py-12 text-center text-sm text-neutral-500">
          Chargement...
        </div>
        <div v-else-if="completedTrainings.length > 0" class="space-y-4">
          <div
            v-for="training in completedTrainings"
            :key="training.id"
            class="bg-neutral-50 border border-neutral-200 rounded-xl p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-neutral-900 mb-2">
                  {{ training.name }}
                </h3>
                <span
                  class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700"
                >
                  Terminée
                </span>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-neutral-900">
                  {{ training.score || 'N/A' }}
                </p>
                <p class="text-xs text-neutral-600">Note</p>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p class="text-xs text-neutral-600 mb-1">Date de fin</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ formatDate(training.completedDate) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Durée</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ training.duration }}
                </p>
              </div>
              <div>
                <p class="text-xs text-neutral-600 mb-1">Certificat</p>
                <button
                  v-if="training.certificate && training.certificateUrl"
                  @click="downloadCertificate(training)"
                  class="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Télécharger
                </button>
                <span v-else-if="training.certificate" class="text-sm text-neutral-500">Disponible</span>
                <span v-else class="text-sm text-neutral-500">Non disponible</span>
              </div>
            </div>

            <button
              @click="viewTrainingDetails(training)"
              class="w-full px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Voir les détails
            </button>
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
          <p class="text-neutral-600">Aucune formation terminée</p>
        </div>
      </div>
    </div>

    <!-- Training Details Modal -->
    <Modal
      v-model="isDetailsModalOpen"
      :title="selectedTraining?.name || 'Détails de la formation'"
      @confirm="isDetailsModalOpen = false"
      confirm-label="Fermer"
      :show-cancel="false"
    >
      <div v-if="selectedTraining" class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-neutral-600 mb-2">Description</h3>
          <p class="text-sm text-neutral-900">{{ selectedTraining.description }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="text-sm font-medium text-neutral-600 mb-1">Catégorie</h3>
            <p class="text-sm text-neutral-900">
              {{ getCategoryLabel(selectedTraining.category) }}
            </p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-neutral-600 mb-1">Durée</h3>
            <p class="text-sm text-neutral-900">{{ selectedTraining.duration }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-neutral-600 mb-1">Date de début</h3>
            <p class="text-sm text-neutral-900">
              {{ formatDate(selectedTraining.startDate) }}
            </p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-neutral-600 mb-1">Inscrits</h3>
            <p class="text-sm text-neutral-900">{{ selectedTraining.enrolled }}</p>
          </div>
        </div>
        <div v-if="selectedTraining.objectives && selectedTraining.objectives.length > 0">
          <h3 class="text-sm font-medium text-neutral-600 mb-2">Objectifs</h3>
          <ul class="list-disc list-inside space-y-1">
            <li
              v-for="(objective, index) in selectedTraining.objectives"
              :key="index"
              class="text-sm text-neutral-900"
            >
              {{ objective }}
            </li>
          </ul>
        </div>
      </div>
    </Modal>

    <!-- Enrollment Confirmation Modal -->
    <Modal
      v-model="isEnrollModalOpen"
      title="Confirmer l'inscription"
      @confirm="confirmEnrollment"
      confirm-label="Confirmer"
    >
      <p class="text-neutral-600">
        Êtes-vous sûr de vouloir vous inscrire à la formation
        <strong>{{ enrollmentTraining?.name }}</strong> ?
      </p>
    </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../components/common/Modal.vue";
import { useTraining } from "./training/composables/useTraining.js";

const {
  activeTab,
  filterCategory,
  loading,
  saving,
  error,
  myTrainings,
  completedTrainings,
  filteredAvailableTrainings,
  categoryOptions,
  getTrainingCount,
  getCategoryClass,
  getCategoryLabel,
  getStatusClass,
  getStatusLabel,
  formatDate,
  enroll,
  cancelEnrollment,
} = useTraining();

const isDetailsModalOpen = ref(false);
const isEnrollModalOpen = ref(false);
const selectedTraining = ref(null);
const enrollmentTraining = ref(null);

const tabs = [
  { id: "available", label: "Disponibles", icon: "📚" },
  { id: "my-trainings", label: "Mes formations", icon: "🎓" },
  { id: "history", label: "Historique", icon: "📜" },
];

function viewTrainingDetails(training) {
  selectedTraining.value = training;
  isDetailsModalOpen.value = true;
}

function enrollInTraining(training) {
  enrollmentTraining.value = training;
  isEnrollModalOpen.value = true;
}

async function confirmEnrollment() {
  if (!enrollmentTraining.value || saving.value) return;
  const ok = await enroll(enrollmentTraining.value.id);
  if (ok) {
    isEnrollModalOpen.value = false;
    enrollmentTraining.value = null;
  }
}

async function onCancelEnrollment(training) {
  if (!confirm("Êtes-vous sûr de vouloir annuler votre inscription ?")) return;
  await cancelEnrollment(training.enrollmentId || training.id);
}

function downloadCertificate(training) {
  if (training.certificateUrl) {
    window.open(training.certificateUrl, "_blank", "noopener,noreferrer");
  }
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
