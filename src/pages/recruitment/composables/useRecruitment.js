import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  jobOpeningsApiService,
  candidatesApiService,
} from "../services/recruitment.api.service.js";
import { designationsApiService } from "../../organization/services/designations.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { t } from "../../../i18n/index.js";
import {
  catalogStatusOptions,
  useEntityStatusCatalogStore,
} from "../../../stores/entityStatusCatalog.store.js";

const JOB_TYPE_VALUES = ["Full-time", "Part-time", "Contract"];

function jobTypeLabel(type) {
  const map = {
    "Full-time": t("admin.recruitment.type.fullTime"),
    "Part-time": t("admin.recruitment.type.partTime"),
    Contract: t("admin.recruitment.type.contract"),
  };
  return map[type] || type || "—";
}

function jobStatusFallbackLabel(status) {
  const map = {
    Open: t("admin.recruitment.status.open"),
    Closed: t("admin.recruitment.status.closed"),
  };
  return map[status] || status;
}

function candidateStatusFallbackLabel(status) {
  const map = {
    Applied: t("admin.recruitment.candidate.applied"),
    Screening: t("admin.recruitment.candidate.screening"),
    Interview: t("admin.recruitment.candidate.interview"),
    Offer: t("admin.recruitment.candidate.offer"),
    Hired: t("admin.recruitment.candidate.hired"),
    Rejected: t("admin.recruitment.candidate.rejected"),
  };
  return map[status] || status;
}

export const JOB_TYPE_OPTIONS = JOB_TYPE_VALUES.map((value) => ({
  value,
  label: value,
}));

export const JOB_STATUS_OPTIONS = [
  { value: "Open", label: "Open" },
  { value: "Closed", label: "Closed" },
];

export const CANDIDATE_STATUS_OPTIONS = [
  { value: "Applied", label: "Applied" },
  { value: "Screening", label: "Screening" },
  { value: "Interview", label: "Interview" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" },
];

function emptyJobForm() {
  return {
    designationId: "",
    department: "",
    location: "",
    type: "Full-time",
    status: "Open",
  };
}

export function normalizeJobOpening(raw = {}) {
  return {
    id: raw.id,
    designationId: raw.designation_id ?? raw.designationId ?? null,
    title: raw.title || raw.designation_name || "—",
    department: raw.department || "",
    location: raw.location || "",
    type: raw.type || "Full-time",
    status: raw.status || "Open",
    applications: Number(raw.applications ?? 0),
    description: raw.description || "",
  };
}

export function normalizeCandidate(raw = {}) {
  return {
    id: raw.id,
    name: raw.name || "—",
    jobOpeningId: raw.job_opening_id ?? raw.jobOpeningId ?? null,
    position: raw.position || "—",
    email: raw.email || "",
    appliedDate: raw.applied_date ?? raw.appliedDate ?? "",
    status: raw.status ?? raw.stage ?? "Applied",
    stageKey: raw.stage_key ?? String(raw.stage ?? raw.status ?? "applied").toLowerCase(),
    hiredEmployeeId: raw.hired_employee_id ?? raw.hiredEmployeeId ?? null,
  };
}

const CANDIDATE_TONE_TO_BADGE = {
  success: "success",
  warning: "warning",
  danger: "error",
  info: "info",
  secondary: "primary",
  neutral: "primary",
};

export function getCandidateStatusClass(status) {
  const store = useEntityStatusCatalogStore();
  const row = store.find("candidates", status);
  if (row) return CANDIDATE_TONE_TO_BADGE[row.tone] || "primary";
  const map = {
    Applied: "primary",
    applied: "primary",
    Screening: "info",
    screening: "info",
    Interview: "warning",
    interview: "warning",
    Offer: "success",
    offer: "success",
    Hired: "success",
    hired: "success",
    Rejected: "error",
    rejected: "error",
  };
  return map[status] || "primary";
}

export function useRecruitment() {
  const route = useRoute();
  const router = useRouter();
  const jobOpenings = ref([]);
  const candidates = ref([]);
  const designations = ref([]);
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");

  const isJobModalOpen = ref(false);
  const isJobDeleteModalOpen = ref(false);
  const isCandidateModalOpen = ref(false);
  const isHireModalOpen = ref(false);
  const editingJob = ref(null);
  const selectedJob = ref(null);
  const selectedCandidate = ref(null);
  const jobFormData = ref(emptyJobForm());
  const candidateStatusFormData = ref({ status: "Applied" });
  const hireFormData = ref({
    firstName: "",
    lastName: "",
    matricule: "",
    hiredAt: new Date().toISOString().slice(0, 10),
    contractType: "Permanent",
    baseSalary: "",
    currency: "",
  });

  const designationOptions = computed(() =>
    designations.value
      .filter((d) => d.active !== false)
      .map((d) => ({
        id: d.id,
        name: d.name,
        department: d.department_name || d.departmentName || "",
      }))
  );

  watch(
    () => jobFormData.value.designationId,
    (id) => {
      if (!id) return;
      const found = designationOptions.value.find(
        (d) => String(d.id) === String(id)
      );
      if (found?.department) {
        jobFormData.value.department = found.department;
      }
    }
  );

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const [jobs, recentCandidates, designationList] = await Promise.all([
        jobOpeningsApiService.fetchAll(),
        candidatesApiService.fetchAll({ limit: 20 }),
        designationsApiService.fetchAll(),
      ]);
      jobOpenings.value = jobs.map(normalizeJobOpening);
      candidates.value = recentCandidates.map(normalizeCandidate);
      designations.value = Array.isArray(designationList) ? designationList : [];
      if (route.query.hireCandidate) {
        await openCandidateForHiring(route.query.hireCandidate);
      }
    } catch (e) {
      error.value = parseApiError(e) || t("admin.recruitment.error.load");
      jobOpenings.value = [];
      candidates.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function openCandidateForHiring(candidateId) {
    try {
      const candidate = normalizeCandidate(
        await candidatesApiService.fetchById(candidateId),
      );
      if (candidate.stageKey !== "offer") {
        error.value = t("admin.recruitment.error.hireStage");
      } else {
        if (!candidates.value.some((row) => row.id === candidate.id)) {
          candidates.value.unshift(candidate);
        }
        openHireModal(candidate);
      }
    } catch (e) {
      error.value = parseApiError(e) || t("admin.recruitment.error.hire");
    } finally {
      const query = { ...route.query };
      delete query.hireCandidate;
      await router.replace({ query });
    }
  }

  function openCreateJobModal() {
    editingJob.value = null;
    jobFormData.value = emptyJobForm();
    isJobModalOpen.value = true;
  }

  function editJob(job) {
    editingJob.value = job;
    jobFormData.value = {
      designationId: job.designationId || "",
      department: job.department || "",
      location: job.location || "",
      type: job.type || "Full-time",
      status: job.status || "Open",
    };
    isJobModalOpen.value = true;
  }

  function closeJobModal() {
    if (saving.value) return;
    isJobModalOpen.value = false;
    editingJob.value = null;
    jobFormData.value = emptyJobForm();
  }

  async function saveJob() {
    if (!jobFormData.value.designationId) {
      error.value = t("admin.recruitment.error.designationRequired");
      return false;
    }
    if (saving.value) return false;

    saving.value = true;
    error.value = "";
    try {
      const payload = {
        designation_id: Number(jobFormData.value.designationId),
        department: jobFormData.value.department.trim() || null,
        location: jobFormData.value.location.trim() || null,
        type: jobFormData.value.type || "Full-time",
        status: jobFormData.value.status || "Open",
      };

      if (editingJob.value) {
        await jobOpeningsApiService.update(editingJob.value.id, payload);
      } else {
        await jobOpeningsApiService.create(payload);
      }

      await loadData();
      closeJobModal();
      return true;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.recruitment.error.save");
      return false;
    } finally {
      saving.value = false;
    }
  }

  function askDeleteJob(job) {
    selectedJob.value = job;
    isJobDeleteModalOpen.value = true;
  }

  async function deleteJob() {
    if (!selectedJob.value || saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await jobOpeningsApiService.remove(selectedJob.value.id);
      await loadData();
      isJobDeleteModalOpen.value = false;
      selectedJob.value = null;
      return true;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.recruitment.error.delete");
      return false;
    } finally {
      saving.value = false;
    }
  }

  function openCandidateStatusModal(candidate) {
    selectedCandidate.value = candidate;
    candidateStatusFormData.value = { status: candidate.status || "Applied" };
    isCandidateModalOpen.value = true;
  }

  function openHireModal(candidate) {
    selectedCandidate.value = candidate;
    const nameParts = String(candidate.name || "").trim().split(/\s+/).filter(Boolean);
    hireFormData.value = {
      firstName: nameParts.shift() || "",
      lastName: nameParts.join(" "),
      matricule: "",
      hiredAt: new Date().toISOString().slice(0, 10),
      contractType: "Permanent",
      baseSalary: "",
      currency: "",
    };
    isHireModalOpen.value = true;
  }

  async function hireCandidate() {
    if (!selectedCandidate.value || saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      const hired = await candidatesApiService.hire(selectedCandidate.value.id, {
        first_name: hireFormData.value.firstName.trim(),
        last_name: hireFormData.value.lastName.trim(),
        matricule: hireFormData.value.matricule.trim(),
        hired_at: hireFormData.value.hiredAt,
        contract_type: hireFormData.value.contractType,
        base_salary:
          hireFormData.value.baseSalary === ""
            ? null
            : Number(hireFormData.value.baseSalary),
        currency: hireFormData.value.currency.trim() || null,
      });
      const employeeId = hired?.hired_employee_id;
      if (!employeeId) {
        throw new Error(t("admin.recruitment.error.hire"));
      }

      isHireModalOpen.value = false;
      selectedCandidate.value = null;
      await router.push({ name: "EmployeeOnboarding", params: { id: employeeId } });
      return true;
    } catch (e) {
      error.value = parseApiError(e) || e.message || t("admin.recruitment.error.hire");
      return false;
    } finally {
      saving.value = false;
    }
  }

  function openOnboarding(employeeId) {
    return router.push({ name: "EmployeeOnboarding", params: { id: employeeId } });
  }

  async function saveCandidateStatus() {
    if (!selectedCandidate.value || saving.value) return false;
    saving.value = true;
    error.value = "";
    try {
      await candidatesApiService.updateStage(
        selectedCandidate.value.id,
        candidateStatusFormData.value.status
      );
      await loadData();
      isCandidateModalOpen.value = false;
      selectedCandidate.value = null;
      return true;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.recruitment.error.updateStatus");
      return false;
    } finally {
      saving.value = false;
    }
  }

  onMounted(loadData);
  watch(
    () => route.query.hireCandidate,
    (candidateId) => {
      if (candidateId) openCandidateForHiring(candidateId);
    },
  );

  return {
    jobOpenings,
    candidates,
    designationOptions,
    loading,
    saving,
    error,
    isJobModalOpen,
    isJobDeleteModalOpen,
    isCandidateModalOpen,
    isHireModalOpen,
    editingJob,
    selectedJob,
    selectedCandidate,
    jobFormData,
    candidateStatusFormData,
    hireFormData,
    jobTypeOptions: computed(() =>
      JOB_TYPE_VALUES.map((value) => ({
        value,
        label: jobTypeLabel(value),
      }))
    ),
    jobStatusOptions: computed(() =>
      catalogStatusOptions("job_openings", [
        { value: "Open", label: t("admin.recruitment.status.open") },
        { value: "Closed", label: t("admin.recruitment.status.closed") },
      ])
    ),
    candidateStatusOptions: computed(() =>
      catalogStatusOptions("candidates", [
        { value: "Applied", label: t("admin.recruitment.candidate.applied") },
        { value: "Screening", label: t("admin.recruitment.candidate.screening") },
        { value: "Interview", label: t("admin.recruitment.candidate.interview") },
        { value: "Offer", label: t("admin.recruitment.candidate.offer") },
        { value: "Rejected", label: t("admin.recruitment.candidate.rejected") },
      ])
    ),
    openCreateJobModal,
    editJob,
    closeJobModal,
    saveJob,
    askDeleteJob,
    deleteJob,
    openCandidateStatusModal,
    openHireModal,
    hireCandidate,
    openOnboarding,
    saveCandidateStatus,
    getCandidateStatusClass,
    jobTypeLabel,
    jobStatusFallbackLabel,
    candidateStatusFallbackLabel,
    loadData,
  };
}
