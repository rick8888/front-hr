<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-6xl mx-auto">
    <div class="flex items-start justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">Candidatures</h1>
        <p class="text-sm text-neutral-600">Pipeline RH en mode Kanban avec synchronisation API</p>
      </div>
      <button
        :disabled="loading"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm disabled:opacity-50"
        @click="openCandidateModal"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un candidat
      </button>
    </div>

    <div
      v-if="loadError || actionError || jobsError"
      role="alert"
      class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <p>{{ loadError || actionError || jobsError }}</p>
      <button
        v-if="loadError || jobsError"
        type="button"
        class="mt-2 font-semibold underline disabled:opacity-50"
        :disabled="loading"
        @click="loadData"
      >
        Réessayer
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Nouvelles</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 min-h-[32px] flex items-center">
          <span
            v-if="loading"
            class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
            aria-hidden="true"
          />
          <template v-else>{{ loadError ? "—" : stageCount("Applied") }}</template>
        </p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Entretiens</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 min-h-[32px] flex items-center">
          <span
            v-if="loading"
            class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
            aria-hidden="true"
          />
          <template v-else>{{ loadError ? "—" : stageCount("Interview") }}</template>
        </p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Offres</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 min-h-[32px] flex items-center">
          <span
            v-if="loading"
            class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
            aria-hidden="true"
          />
          <template v-else>{{ loadError ? "—" : stageCount("Offer") }}</template>
        </p>
      </div>
      <div class="bg-white border border-neutral-200 rounded-xl p-4">
        <p class="text-xs uppercase tracking-wider font-semibold text-neutral-500">Conversion</p>
        <p class="text-2xl font-bold text-neutral-900 mt-2 min-h-[32px] flex items-center">
          <span
            v-if="loading"
            class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
            aria-hidden="true"
          />
          <template v-else>{{ loadError ? "—" : `${conversionRate}%` }}</template>
        </p>
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
        <select v-model="jobFilter" class="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm">
          <option value="">Tous les postes</option>
          <option v-for="job in jobOptions" :key="job" :value="job">{{ job }}</option>
        </select>
        <p class="text-xs text-neutral-500">
          Drag & drop entre colonnes: Applied -> Screening -> Interview -> Offer -> Hired
        </p>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex min-h-[520px] flex-col items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-500"
      aria-busy="true"
    >
      <span
        class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
        aria-hidden="true"
      />
      {{ t("common.loading") }}
    </div>

    <div
      v-else-if="loadError"
      class="flex min-h-[520px] items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 text-center text-sm text-neutral-500"
    >
      Les candidatures ne sont pas disponibles tant que le serveur ne répond pas.
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-5 gap-4">
      <section
        v-for="stage in stages"
        :key="stage"
        class="bg-white border border-neutral-200 rounded-xl min-h-[520px] flex flex-col"
        @dragover.prevent
        @drop="onDrop(stage)"
      >
        <div class="px-4 py-3 border-b border-neutral-200">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-neutral-900">{{ stage }}</h2>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
              {{ candidatesByStage(stage).length }}
            </span>
          </div>
        </div>

        <div class="p-3 space-y-3 flex-1 overflow-y-auto">
          <article
            v-for="candidate in candidatesByStage(stage)"
            :key="candidate.id"
            :draggable="!candidate.hiredEmployeeId"
            @dragstart="onDragStart(candidate.id)"
            class="border border-neutral-200 rounded-lg p-3 bg-neutral-50 hover:bg-white cursor-grab active:cursor-grabbing transition-colors"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-neutral-900 truncate">{{ candidate.name }}</p>
                <p class="text-xs text-neutral-600 truncate">{{ candidate.position }}</p>
              </div>
              <button @click="viewCandidate(candidate)" class="text-xs text-primary-600 hover:text-primary-700">Voir</button>
            </div>
            <p class="text-xs text-neutral-500 mt-2 truncate">{{ candidate.email }}</p>
            <p class="text-xs text-neutral-500 mt-1">{{ candidate.lastAction || "—" }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-if="canManageEmployees && candidate.stage === 'Offer' && !candidate.hiredEmployeeId"
                type="button"
                class="text-xs font-medium text-primary-700 hover:text-primary-800"
                @click="openHiring(candidate)"
              >
                {{ t("admin.recruitment.hireAction") }}
              </button>
              <button
                v-if="canManageEmployees && candidate.hiredEmployeeId"
                type="button"
                class="text-xs font-medium text-primary-700 hover:text-primary-800"
                @click="openOnboarding(candidate)"
              >
                {{ t("admin.recruitment.onboardingAction") }}
              </button>
            </div>
          </article>

          <div
            v-if="candidatesByStage(stage).length === 0"
            class="text-center text-xs text-neutral-400 py-8 border border-dashed border-neutral-200 rounded-lg"
          >
            Déposez une candidature ici
          </div>
        </div>
      </section>
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
        <div><span class="text-neutral-500">Téléphone:</span> <span class="text-neutral-900">{{ selectedCandidate.phone || "N/A" }}</span></div>
        <div><span class="text-neutral-500">Source:</span> <span class="text-neutral-900">{{ selectedCandidate.source || "N/A" }}</span></div>
        <div><span class="text-neutral-500">Disponibilité:</span> <span class="text-neutral-900">{{ selectedCandidate.availability || "N/A" }}</span></div>
      </div>
      <p class="text-sm text-neutral-700 mt-4">{{ selectedCandidate.summary || "Aucun résumé." }}</p>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      @click.self="closeCandidateModal"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-modal-title"
        class="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl"
        @click.stop
      >
        <div class="flex items-center justify-between border-b border-neutral-200 px-6 py-5 sm:px-7">
          <div>
            <h2 id="candidate-modal-title" class="text-xl font-bold text-neutral-900">Nouveau candidat</h2>
            <p class="mt-1 text-sm text-neutral-500">Renseignez les informations du candidat et son poste.</p>
          </div>
          <button
            type="button"
            :disabled="savingCandidate"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Fermer"
            @click="closeCandidateModal"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-6 sm:px-7">
          <p v-if="actionError" role="alert" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ actionError }}
          </p>
          <p v-if="jobsError" role="alert" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ jobsError }}
          </p>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label for="candidate-name" class="mb-2 block text-sm font-semibold text-neutral-700">
                Nom complet <span class="text-error-600">*</span>
              </label>
              <input
                id="candidate-name"
                v-model="candidateForm.name"
                type="text"
                placeholder="Ex. Nadia Amrani"
                class="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label for="candidate-email" class="mb-2 block text-sm font-semibold text-neutral-700">
                E-mail <span class="text-error-600">*</span>
              </label>
              <input
                id="candidate-email"
                v-model="candidateForm.email"
                type="email"
                placeholder="nom@exemple.com"
                class="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label for="candidate-phone" class="mb-2 block text-sm font-semibold text-neutral-700">Téléphone</label>
              <input
                id="candidate-phone"
                v-model="candidateForm.phone"
                type="text"
                placeholder="Numéro de téléphone"
                class="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label for="candidate-job" class="mb-2 block text-sm font-semibold text-neutral-700">
                Poste <span class="text-error-600">*</span>
              </label>
              <select
                id="candidate-job"
                v-model="candidateForm.jobOpeningId"
                class="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Sélectionner un poste</option>
                <option v-for="job in openJobs" :key="job.id" :value="job.id">
                  {{ job.title }}
                </option>
              </select>
            </div>
            <div>
              <label for="candidate-experience" class="mb-2 block text-sm font-semibold text-neutral-700">Expérience</label>
              <input
                id="candidate-experience"
                v-model="candidateForm.experience"
                type="text"
                placeholder="Ex. 5 ans"
                class="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label for="candidate-source" class="mb-2 block text-sm font-semibold text-neutral-700">Source</label>
              <select
                id="candidate-source"
                v-model="candidateForm.source"
                class="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option>LinkedIn</option>
                <option>Indeed</option>
                <option>Cooptation</option>
                <option>Site carrière</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex flex-col-reverse gap-3 border-t border-neutral-200 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            :disabled="savingCandidate"
            class="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            @click="closeCandidateModal"
          >
            Annuler
          </button>
          <button
            type="button"
            :disabled="savingCandidate || loading || openJobs.length === 0"
            class="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            @click="saveCandidate"
          >
            {{ savingCandidate ? t("common.saving") : "Enregistrer" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { candidatesApiService } from "./recruitment/services/recruitment.api.service.js";
import { jobOpeningsApiService } from "./recruitment/services/recruitment.api.service.js";
import { useI18n } from "../i18n/index.js";
import { useAuthStore } from "../stores/authStore.js";
import { parseApiError } from "../utils/apiErrors.js";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const canManageEmployees = authStore.can("employees.manage");
const stages = ["Applied", "Screening", "Interview", "Offer", "Rejected", "Hired"];

const loading = ref(true);
const savingCandidate = ref(false);
const loadError = ref("");
const jobsError = ref("");
const actionError = ref("");

const searchQuery = ref("");
const jobFilter = ref("");
const selectedCandidate = ref(null);
const isModalOpen = ref(false);
const draggedCandidateId = ref(null);
const candidates = ref([]);
const openJobs = ref([]);

const candidateForm = ref({
  name: "",
  email: "",
  phone: "",
  jobOpeningId: "",
  experience: "",
  source: "LinkedIn",
});

const jobOptions = computed(() => {
  const fromJobs = openJobs.value.map((j) => j.title).filter(Boolean);
  const fromCandidates = candidates.value.map((c) => c.position).filter(Boolean);
  return [...new Set([...fromJobs, ...fromCandidates])];
});

const filteredCandidates = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return candidates.value.filter((candidate) => {
    const matchesSearch =
      !query ||
      [candidate.name, candidate.position, candidate.email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    const matchesJob = !jobFilter.value || candidate.position === jobFilter.value;
    return matchesSearch && matchesJob;
  });
});

const candidatesByStage = (stage) =>
  filteredCandidates.value.filter((candidate) => candidate.stage === stage);

const stageCount = (stage) => candidates.value.filter((candidate) => candidate.stage === stage).length;

const conversionRate = computed(() => {
  const total = candidates.value.length;
  const hired = stageCount("Hired");
  if (!total) return 0;
  return Math.round((hired / total) * 100);
});

const normalizeCandidate = (candidate) => ({
  id: candidate.id,
  name: candidate.name ?? "",
  email: candidate.email ?? "",
  phone: candidate.phone ?? "",
  jobOpeningId: candidate.job_opening_id ?? candidate.jobOpeningId ?? null,
  position: candidate.position ?? "",
  experience: candidate.experience ?? "",
  source: candidate.source ?? "LinkedIn",
  availability: candidate.availability ?? "",
  summary: candidate.summary ?? "",
  lastAction: candidate.lastAction ?? candidate.last_action ?? "",
  stage: stages.includes(candidate.stage ?? candidate.status)
    ? (candidate.stage ?? candidate.status)
    : "Applied",
  hiredEmployeeId: candidate.hired_employee_id ?? candidate.hiredEmployeeId ?? null,
});

const loadOpenJobs = async () => {
  jobsError.value = "";
  try {
    const list = await jobOpeningsApiService.fetchAll({ status: "Open" });
    openJobs.value = (Array.isArray(list) ? list : [])
      .map((job) => ({
        id: job.id,
        title: job.title || job.designation_name || "—",
        status: job.status,
      }))
      .filter((job) => job.status === "Open" || !job.status);
  } catch (error) {
    openJobs.value = [];
    jobsError.value = parseApiError(error);
  }
};

const loadCandidates = async () => {
  loadError.value = "";
  try {
    const list = await candidatesApiService.fetchAll();
    candidates.value = list.map(normalizeCandidate);
  } catch (error) {
    candidates.value = [];
    loadError.value = parseApiError(error);
  }
};

const loadData = async () => {
  loading.value = true;
  actionError.value = "";
  try {
    await Promise.all([loadCandidates(), loadOpenJobs()]);
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

const onDragStart = (candidateId) => {
  draggedCandidateId.value = candidateId;
};

const onDrop = async (targetStage) => {
  const candidateId = draggedCandidateId.value;
  if (!candidateId) return;
  if (targetStage === "Hired") {
    alert("Utilisez l’action « Embaucher » depuis le candidat pour créer son dossier employé.");
    draggedCandidateId.value = null;
    return;
  }
  const index = candidates.value.findIndex((candidate) => candidate.id === candidateId);
  if (index === -1) return;

  const previousStage = candidates.value[index].stage;
  if (previousStage === targetStage) return;

  try {
    const updated = await candidatesApiService.updateStage(candidateId, targetStage);
    candidates.value[index] = normalizeCandidate(updated);
    actionError.value = "";
  } catch (error) {
    actionError.value = parseApiError(error);
  } finally {
    draggedCandidateId.value = null;
  }
};

const openHiring = (candidate) => {
  router.push({ path: "/recruitment", query: { hireCandidate: candidate.id } });
};

const openOnboarding = (candidate) => {
  router.push({ name: "EmployeeOnboarding", params: { id: candidate.hiredEmployeeId } });
};

const viewCandidate = (candidate) => {
  selectedCandidate.value = candidate;
};

const openCandidateModal = () => {
  actionError.value = "";
  candidateForm.value = {
    name: "",
    email: "",
    phone: "",
    jobOpeningId: "",
    experience: "",
    source: "LinkedIn",
  };
  isModalOpen.value = true;
};

const closeCandidateModal = () => {
  if (savingCandidate.value) return;
  isModalOpen.value = false;
};

const saveCandidate = async () => {
  if (savingCandidate.value) return;
  if (
    !candidateForm.value.name.trim() ||
    !candidateForm.value.email.trim() ||
    !candidateForm.value.jobOpeningId
  ) {
    alert("Nom, email et poste sont obligatoires.");
    return;
  }

  const selectedJob = openJobs.value.find(
    (job) => String(job.id) === String(candidateForm.value.jobOpeningId)
  );

  const payload = {
    name: candidateForm.value.name.trim(),
    email: candidateForm.value.email.trim(),
    phone: candidateForm.value.phone.trim() || null,
    job_opening_id: Number(candidateForm.value.jobOpeningId),
    position: selectedJob?.title || null,
    experience: candidateForm.value.experience.trim() || null,
    source: candidateForm.value.source,
    stage: "Applied",
    lastAction: "Candidature ajoutée",
    availability: "À confirmer",
    summary: "Profil à qualifier.",
  };

  savingCandidate.value = true;
  actionError.value = "";
  try {
    const created = await candidatesApiService.create(payload);
    candidates.value.unshift(normalizeCandidate(created));
    closeCandidateModal();
  } catch (error) {
    actionError.value = parseApiError(error);
  } finally {
    savingCandidate.value = false;
  }
};
</script>
