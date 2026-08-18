<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-neutral-900 mb-2">Mes Documents</h1>
      <p class="text-sm text-neutral-600">
        Consultez et téléchargez vos documents RH
      </p>
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
              v-if="getDocumentCount(tab.id) > 0"
              class="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600"
            >
              {{ getDocumentCount(tab.id) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Documents Content -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <!-- Requests Tab Content -->
      <div v-if="activeTab === 'requests'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-neutral-900">Mes Demandes</h2>
          <button
            @click="newRequestModalOpen = true"
            class="btn-primary flex items-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Déposer une demande
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p class="mt-4 text-sm text-neutral-600">Chargement des demandes...</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="requests.length === 0"
          class="p-12 text-center"
        >
          <div class="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
            <svg
              class="w-8 h-8 text-neutral-400"
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
          </div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-2">
            Aucune demande
          </h3>
          <p class="text-sm text-neutral-600 mb-4">
            Vous n'avez pas encore déposé de demande.
          </p>
          <button
            @click="newRequestModalOpen = true"
            class="btn-primary"
          >
            Déposer une demande
          </button>
        </div>

        <!-- Requests List -->
        <div v-else class="space-y-4">
          <div
            v-for="request in requests"
            :key="request.id"
            class="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start gap-4 flex-1">
                <!-- Status Badge -->
                <div
                  :class="[
                    'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                    getRequestStatusClass(request.status),
                  ]"
                >
                  <svg
                    class="w-6 h-6"
                    :class="getRequestStatusIconColor(request.status)"
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
                </div>

                <!-- Request Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-base font-semibold text-neutral-900">
                      {{ request.title }}
                    </h3>
                    <span
                      :class="[
                        'px-2.5 py-0.5 text-xs font-medium rounded-full',
                        getRequestStatusBadgeClass(request.status),
                      ]"
                    >
                      {{ getRequestStatusLabel(request.status) }}
                    </span>
                    <span
                      v-if="request.priority === 'high'"
                      class="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700"
                    >
                      Urgent
                    </span>
                  </div>
                  <p class="text-sm text-neutral-600 mb-2">
                    {{ request.description }}
                  </p>
                  <div class="flex items-center gap-4 text-xs text-neutral-500">
                    <span class="flex items-center gap-1">
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      {{ request.type }}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ formatDate(request.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <button
                  v-if="request.status === 'pending'"
                  @click="cancelRequest(request)"
                  class="p-2 text-neutral-600 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                  title="Annuler la demande"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Tabs Content -->
      <div v-else>
        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p class="mt-4 text-sm text-neutral-600">Chargement des documents...</p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="getCurrentDocuments().length === 0"
          class="p-12 text-center"
        >
        <div class="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
          <svg
            class="w-8 h-8 text-neutral-400"
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
        </div>
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">
          Aucun document
        </h3>
        <p class="text-sm text-neutral-600">
          Aucun document disponible dans cette catégorie pour le moment.
        </p>
      </div>

      <!-- Documents List -->
      <div v-else class="divide-y divide-neutral-200">
        <div
          v-for="document in getCurrentDocuments()"
          :key="document.id"
          class="p-6 hover:bg-neutral-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 flex-1">
              <!-- Document Icon -->
              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center"
                :class="getDocumentIconClass(document.type)"
              >
                <svg
                  class="w-6 h-6"
                  :class="getDocumentIconColor(document.type)"
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
              </div>

              <!-- Document Info -->
              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-neutral-900 mb-1">
                  {{ document.name }}
                </h3>
                <div class="flex items-center gap-4 text-sm text-neutral-600">
                  <span class="flex items-center gap-1">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {{ formatDate(document.date) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                      />
                    </svg>
                    {{ document.size }}
                  </span>
                  <span
                    v-if="document.category"
                    class="px-2 py-0.5 text-xs font-medium rounded bg-neutral-100 text-neutral-700"
                  >
                    {{ document.category }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button
                @click="previewDocument(document)"
                class="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Aperçu"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                @click="downloadDocument(document)"
                class="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Télécharger"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="previewModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="previewModalOpen = false"
    >
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 class="text-lg font-semibold text-neutral-900">
            {{ selectedDocument?.name }}
          </h3>
          <button
            @click="previewModalOpen = false"
            class="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-auto p-4">
          <div class="text-center py-12">
            <div class="w-24 h-24 mx-auto mb-4 bg-neutral-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-12 h-12 text-neutral-400"
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
            </div>
            <p class="text-neutral-600 mb-4">
              Aperçu du document : {{ selectedDocument?.name }}
            </p>
            <p class="text-sm text-neutral-500 mb-6">
              Dans une application réelle, un visualiseur PDF serait intégré ici
            </p>
            <button
              @click="downloadDocument(selectedDocument)"
              class="btn-primary px-4 py-2 text-sm font-medium"
            >
              Télécharger le document
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Request Modal -->
    <div
      v-if="newRequestModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="newRequestModalOpen = false"
    >
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-6 border-b border-neutral-200">
          <h3 class="text-lg font-semibold text-neutral-900">
            Déposer une demande
          </h3>
          <button
            @click="newRequestModalOpen = false"
            class="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-auto p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Type de demande <span class="text-error-500">*</span>
              </label>
              <select
                v-model="requestForm.type"
                class="input-base w-full"
                required
              >
                <option value="">Sélectionner un type</option>
                <option value="Certificat de travail">Certificat de travail</option>
                <option value="Attestation employeur">Attestation employeur</option>
                <option value="Duplicata de fiche de paie">Duplicata de fiche de paie</option>
                <option value="Copie de contrat">Copie de contrat</option>
                <option value="Autre document">Autre document</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Description <span class="text-error-500">*</span>
              </label>
              <textarea
                v-model="requestForm.description"
                rows="4"
                class="input-base w-full"
                placeholder="Décrivez votre demande en détail..."
                required
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Priorité
              </label>
              <select v-model="requestForm.priority" class="input-base w-full">
                <option value="normal">Normale</option>
                <option value="high">Urgente</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
          <button
            @click="newRequestModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="submitRequest"
            class="btn-primary px-4 py-2 text-sm font-medium"
          >
            Envoyer la demande
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

const activeTab = ref("requests");
const loading = ref(false);
const previewModalOpen = ref(false);
const selectedDocument = ref(null);
const newRequestModalOpen = ref(false);
const requestForm = ref({
  type: "",
  description: "",
  priority: "normal",
});

// Tabs configuration
const tabs = [
  {
    id: "requests",
    label: "Demandes",
    icon: "📝",
  },
  {
    id: "payslips",
    label: "Fiches de paie",
    icon: "💰",
  },
  {
    id: "work-certificates",
    label: "Certificats de travail",
    icon: "📜",
  },
  {
    id: "contracts",
    label: "Contrats",
    icon: "📄",
  },
  {
    id: "other",
    label: "Autres documents RH",
    icon: "📁",
  },
];

// Requests data
const requests = ref([
  {
    id: 1,
    type: "Certificat de travail",
    title: "Demande de certificat de travail",
    description: "Je souhaite obtenir un certificat de travail pour mon dossier administratif.",
    status: "pending",
    priority: "normal",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 2,
    type: "Attestation employeur",
    title: "Demande d'attestation employeur",
    description: "Besoin d'une attestation employeur pour un prêt immobilier.",
    status: "approved",
    priority: "high",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: 3,
    type: "Duplicata de fiche de paie",
    title: "Demande de duplicata de fiche de paie",
    description: "J'ai besoin d'un duplicata de ma fiche de paie de novembre 2025.",
    status: "processing",
    priority: "normal",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 4,
    type: "Autre document",
    title: "Demande de document RH",
    description: "Je souhaite obtenir une copie de mon contrat de travail.",
    status: "rejected",
    priority: "normal",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
]);

// Mock documents data - In a real app, this would come from an API
const documents = ref([
  // Payslips
  {
    id: 1,
    name: "Fiche de paie - Décembre 2025",
    type: "payslip",
    category: "Fiche de paie",
    date: "2025-12-31",
    size: "245 KB",
    url: "/documents/payslip-2025-12.pdf",
  },
  {
    id: 2,
    name: "Fiche de paie - Novembre 2025",
    type: "payslip",
    category: "Fiche de paie",
    date: "2025-11-30",
    size: "238 KB",
    url: "/documents/payslip-2025-11.pdf",
  },
  {
    id: 3,
    name: "Fiche de paie - Octobre 2025",
    type: "payslip",
    category: "Fiche de paie",
    date: "2025-10-31",
    size: "241 KB",
    url: "/documents/payslip-2025-10.pdf",
  },
  // Work Certificates
  {
    id: 4,
    name: "Certificat de travail - 2025",
    type: "work-certificate",
    category: "Certificat de travail",
    date: "2025-12-15",
    size: "156 KB",
    url: "/documents/work-certificate-2025.pdf",
  },
  {
    id: 5,
    name: "Attestation employeur",
    type: "work-certificate",
    category: "Certificat de travail",
    date: "2025-11-20",
    size: "142 KB",
    url: "/documents/employer-attestation.pdf",
  },
  // Contracts
  {
    id: 6,
    name: "Contrat de travail - CDI",
    type: "contract",
    category: "Contrat",
    date: "2020-05-15",
    size: "312 KB",
    url: "/documents/employment-contract.pdf",
  },
  {
    id: 7,
    name: "Avenant au contrat - Promotion",
    type: "contract",
    category: "Contrat",
    date: "2023-03-10",
    size: "198 KB",
    url: "/documents/contract-amendment.pdf",
  },
  // Other HR Documents
  {
    id: 8,
    name: "Règlement intérieur",
    type: "other",
    category: "Document RH",
    date: "2024-01-01",
    size: "456 KB",
    url: "/documents/internal-regulations.pdf",
  },
  {
    id: 9,
    name: "Charte de confidentialité",
    type: "other",
    category: "Document RH",
    date: "2024-01-01",
    size: "234 KB",
    url: "/documents/confidentiality-charter.pdf",
  },
  {
    id: 10,
    name: "Guide de l'employé",
    type: "other",
    category: "Document RH",
    date: "2024-01-01",
    size: "678 KB",
    url: "/documents/employee-guide.pdf",
  },
]);

// Get documents for current tab
const getCurrentDocuments = () => {
  if (activeTab.value === "payslips") {
    return documents.value.filter((doc) => doc.type === "payslip");
  } else if (activeTab.value === "work-certificates") {
    return documents.value.filter((doc) => doc.type === "work-certificate");
  } else if (activeTab.value === "contracts") {
    return documents.value.filter((doc) => doc.type === "contract");
  } else if (activeTab.value === "other") {
    return documents.value.filter((doc) => doc.type === "other");
  }
  return [];
};

// Get document count for a tab
const getDocumentCount = (tabId) => {
  if (tabId === "requests") {
    return requests.value.length;
  } else if (tabId === "payslips") {
    return documents.value.filter((doc) => doc.type === "payslip").length;
  } else if (tabId === "work-certificates") {
    return documents.value.filter((doc) => doc.type === "work-certificate")
      .length;
  } else if (tabId === "contracts") {
    return documents.value.filter((doc) => doc.type === "contract").length;
  } else if (tabId === "other") {
    return documents.value.filter((doc) => doc.type === "other").length;
  }
  return 0;
};

// Get document icon class based on type
const getDocumentIconClass = (type) => {
  const classes = {
    payslip: "bg-green-50",
    "work-certificate": "bg-blue-50",
    contract: "bg-purple-50",
    other: "bg-orange-50",
  };
  return classes[type] || "bg-neutral-50";
};

// Get document icon color based on type
const getDocumentIconColor = (type) => {
  const colors = {
    payslip: "text-green-600",
    "work-certificate": "text-blue-600",
    contract: "text-purple-600",
    other: "text-orange-600",
  };
  return colors[type] || "text-neutral-600";
};

// Format date
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  } catch (error) {
    return dateString;
  }
};

// Preview document
const previewDocument = (document) => {
  selectedDocument.value = document;
  previewModalOpen.value = true;
};

// Download document
const downloadDocument = (doc) => {
  // In a real app, this would download the actual file
  console.log("Downloading document:", doc);
  // Simulate download
  if (doc?.url) {
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Fallback: open in new tab or show message
    alert(`Téléchargement de ${doc?.name || "le document"}`);
  }
};

// Load documents from API
const loadDocuments = async () => {
  loading.value = true;
  try {
    // In a real app, fetch documents from API
    // const response = await api.get('/documents');
    // documents.value = response.data;
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error("Error loading documents:", error);
  } finally {
    loading.value = false;
  }
};

// Request functions
const getRequestStatusClass = (status) => {
  const classes = {
    pending: "bg-yellow-100",
    processing: "bg-blue-100",
    approved: "bg-green-100",
    rejected: "bg-red-100",
    completed: "bg-neutral-100",
  };
  return classes[status] || classes.pending;
};

const getRequestStatusIconColor = (status) => {
  const colors = {
    pending: "text-yellow-600",
    processing: "text-blue-600",
    approved: "text-green-600",
    rejected: "text-red-600",
    completed: "text-neutral-600",
  };
  return colors[status] || colors.pending;
};

const getRequestStatusBadgeClass = (status) => {
  const classes = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    completed: "bg-neutral-100 text-neutral-700",
  };
  return classes[status] || classes.pending;
};

const getRequestStatusLabel = (status) => {
  const labels = {
    pending: "En attente",
    processing: "En traitement",
    approved: "Approuvée",
    rejected: "Refusée",
    completed: "Terminée",
  };
  return labels[status] || "En attente";
};

const cancelRequest = (request) => {
  if (confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) {
    const index = requests.value.findIndex((r) => r.id === request.id);
    if (index !== -1) {
      requests.value.splice(index, 1);
    }
  }
};

const submitRequest = () => {
  if (!requestForm.value.type || !requestForm.value.description) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  const newRequest = {
    id: requests.value.length > 0 ? Math.max(...requests.value.map((r) => r.id)) + 1 : 1,
    type: requestForm.value.type,
    title: `Demande de ${requestForm.value.type}`,
    description: requestForm.value.description,
    status: "pending",
    priority: requestForm.value.priority,
    createdAt: new Date(),
  };

  requests.value.unshift(newRequest);
  newRequestModalOpen.value = false;
  requestForm.value = {
    type: "",
    description: "",
    priority: "normal",
  };
};

onMounted(() => {
  loadDocuments();
});
</script>

<style scoped>
/* Additional styles if needed */
</style>

