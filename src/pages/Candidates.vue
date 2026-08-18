<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <div class="flex items-start justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">Candidatures</h1>
        <p class="text-sm text-neutral-600">Suivi du pipeline de recrutement et gestion des actions</p>
      </div>
      <button
        @click="openCandidateModal()"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un candidat
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Nouvelles candidatures</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2">{{ stageCount("Applied") }}</p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">En entretien</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2">{{ stageCount("Interview") }}</p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Offres envoyées</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2">{{ stageCount("Offer") }}</p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Taux conversion</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2">{{ conversionRate }}%</p>
      </div>
    </div>

    <div class="bg-white border border-neutral-200 rounded-xl p-4 mb-6">
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative flex-1 min-w-[260px] max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par nom, poste, email..."
            class="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
          />
          <svg class="absolute left-3 top-3 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select v-model="stageFilter" class="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm">
          <option value="">Toutes les étapes</option>
          <option v-for="stage in stages" :key="stage" :value="stage">{{ stage }}</option>
        </select>
        <select v-model="jobFilter" class="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm">
          <option value="">Tous les postes</option>
          <option v-for="job in jobOptions" :key="job" :value="job">{{ job }}</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto border border-neutral-200 rounded-xl">
      <table class="w-full bg-white">
        <thead>
          <tr class="bg-neutral-50 border-b border-neutral-200">
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Candidat</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Poste</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Expérience</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Étape</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Dernière action</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-for="candidate in filteredCandidates" :key="candidate.id" class="hover:bg-neutral-50 transition-colors">
            <td class="px-6 py-4">
              <p class="text-sm font-semibold text-neutral-900">{{ candidate.name }}</p>
              <p class="text-xs text-neutral-500 mt-1">{{ candidate.email }}</p>
            </td>
            <td class="px-6 py-4 text-sm text-neutral-700">{{ candidate.position }}</td>
            <td class="px-6 py-4 text-sm text-neutral-700">{{ candidate.experience }}</td>
            <td class="px-6 py-4">
              <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', stageBadgeClass(candidate.stage)]">
                {{ candidate.stage }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-neutral-700">{{ candidate.lastAction }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="viewCandidate(candidate)" class="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3">Voir</button>
              <button @click="moveToNextStage(candidate.id)" class="text-success-600 hover:text-success-700 text-sm font-medium">Etape +</button>
            </td>
          </tr>
          <tr v-if="filteredCandidates.length === 0">
            <td colspan="6" class="px-6 py-10 text-center text-sm text-neutral-500">Aucune candidature trouvée.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedCandidate" class="mt-6 bg-white border border-neutral-200 rounded-xl p-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 class="text-lg font-bold text-neutral-900">{{ selectedCandidate.name }}</h2>
          <p class="text-sm text-neutral-600">{{ selectedCandidate.position }} · {{ selectedCandidate.email }}</p>
        </div>
        <button @click="selectedCandidate = null" class="text-sm text-neutral-600 hover:text-neutral-900">Fermer</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
        <div><span class="text-neutral-500">Téléphone:</span> <span class="text-neutral-900">{{ selectedCandidate.phone }}</span></div>
        <div><span class="text-neutral-500">Source:</span> <span class="text-neutral-900">{{ selectedCandidate.source }}</span></div>
        <div><span class="text-neutral-500">Disponibilité:</span> <span class="text-neutral-900">{{ selectedCandidate.availability }}</span></div>
      </div>
      <p class="text-sm text-neutral-700 mt-4">{{ selectedCandidate.summary }}</p>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeCandidateModal">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-xl mx-4" @click.stop>
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Nouveau candidat</h2>
        </div>
        <div class="px-6 py-5 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <input v-model="candidateForm.name" type="text" placeholder="Nom complet" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm" />
            <input v-model="candidateForm.email" type="email" placeholder="Email" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm" />
            <input v-model="candidateForm.phone" type="text" placeholder="Téléphone" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm" />
            <input v-model="candidateForm.position" type="text" placeholder="Poste" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm" />
            <input v-model="candidateForm.experience" type="text" placeholder="Expérience (ex: 5 ans)" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm" />
            <select v-model="candidateForm.source" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-sm">
              <option>LinkedIn</option>
              <option>Indeed</option>
              <option>Cooptation</option>
              <option>Site carrière</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button @click="closeCandidateModal" class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg">Annuler</button>
          <button @click="saveCandidate" class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700">Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const searchQuery = ref("");
const stageFilter = ref("");
const jobFilter = ref("");
const selectedCandidate = ref(null);
const isModalOpen = ref(false);

const stages = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

const candidates = ref([
  { id: 1, name: "Alex Johnson", email: "alex@example.com", phone: "+1 555 120 002", position: "Senior Frontend Developer", experience: "6 ans", stage: "Interview", lastAction: "Entretien RH planifié", source: "LinkedIn", availability: "30 jours", summary: "Très bonne maîtrise Vue/React, leadership technique." },
  { id: 2, name: "Maria Garcia", email: "maria@example.com", phone: "+1 555 120 118", position: "Product Designer", experience: "4 ans", stage: "Screening", lastAction: "Screening CV validé", source: "Indeed", availability: "Immédiate", summary: "Profil UX/UI solide, portfolio orienté SaaS B2B." },
  { id: 3, name: "James Wilson", email: "james@example.com", phone: "+1 555 120 229", position: "DevOps Engineer", experience: "7 ans", stage: "Offer", lastAction: "Offre envoyée", source: "Cooptation", availability: "45 jours", summary: "Expert CI/CD, infra cloud AWS." },
  { id: 4, name: "Patricia Lee", email: "patricia@example.com", phone: "+1 555 120 441", position: "Sales Manager", experience: "8 ans", stage: "Applied", lastAction: "Candidature reçue", source: "Site carrière", availability: "30 jours", summary: "Forte expérience en vente B2B enterprise." },
  { id: 5, name: "Robert Smith", email: "robert@example.com", phone: "+1 555 120 553", position: "Senior Frontend Developer", experience: "5 ans", stage: "Hired", lastAction: "Contrat signé", source: "LinkedIn", availability: "N/A", summary: "Très bon fit culturel et technique." },
]);

const candidateForm = ref({
  name: "",
  email: "",
  phone: "",
  position: "",
  experience: "",
  source: "LinkedIn",
});

const jobOptions = computed(() => [...new Set(candidates.value.map((c) => c.position))]);

const filteredCandidates = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return candidates.value.filter((candidate) => {
    const matchesSearch =
      !query ||
      [candidate.name, candidate.position, candidate.email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    const matchesStage = !stageFilter.value || candidate.stage === stageFilter.value;
    const matchesJob = !jobFilter.value || candidate.position === jobFilter.value;
    return matchesSearch && matchesStage && matchesJob;
  });
});

const stageCount = (stage) => candidates.value.filter((candidate) => candidate.stage === stage).length;

const conversionRate = computed(() => {
  const total = candidates.value.filter((candidate) => candidate.stage !== "Rejected").length;
  const hired = stageCount("Hired");
  if (!total) return 0;
  return Math.round((hired / total) * 100);
});

const stageBadgeClass = (stage) => {
  const map = {
    Applied: "bg-blue-100 text-blue-700",
    Screening: "bg-indigo-100 text-indigo-700",
    Interview: "bg-yellow-100 text-yellow-700",
    Offer: "bg-purple-100 text-purple-700",
    Hired: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return map[stage] || "bg-neutral-100 text-neutral-700";
};

const stageOrder = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

const viewCandidate = (candidate) => {
  selectedCandidate.value = candidate;
};

const moveToNextStage = (candidateId) => {
  const index = candidates.value.findIndex((candidate) => candidate.id === candidateId);
  if (index === -1) return;
  const current = candidates.value[index].stage;
  const orderIndex = stageOrder.indexOf(current);
  if (orderIndex === -1 || orderIndex >= stageOrder.length - 1) return;
  candidates.value[index].stage = stageOrder[orderIndex + 1];
  candidates.value[index].lastAction = `Passé à l'étape ${stageOrder[orderIndex + 1]}`;
};

const openCandidateModal = () => {
  candidateForm.value = {
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    source: "LinkedIn",
  };
  isModalOpen.value = true;
};

const closeCandidateModal = () => {
  isModalOpen.value = false;
};

const saveCandidate = () => {
  if (!candidateForm.value.name.trim() || !candidateForm.value.email.trim() || !candidateForm.value.position.trim()) {
    alert("Nom, email et poste sont obligatoires.");
    return;
  }
  const newId = candidates.value.length ? Math.max(...candidates.value.map((c) => c.id)) + 1 : 1;
  candidates.value.unshift({
    id: newId,
    ...candidateForm.value,
    stage: "Applied",
    lastAction: "Candidature ajoutée",
    availability: "À confirmer",
    summary: "Profil à qualifier.",
  });
  closeCandidateModal();
};
</script>
