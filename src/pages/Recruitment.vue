<template>
  <div class="px-8 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Recruitment</h1>
        <p class="text-sm text-neutral-600">
          Manage job openings and applications
        </p>
      </div>
      <button @click="isJobModalOpen = true" class="btn-primary">
        + Post Job
      </button>
    </div>

    <!-- Job Openings -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div v-for="job in jobOpenings" :key="job.id" class="card">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="text-lg font-bold text-neutral-900">{{ job.title }}</h3>
            <p class="text-sm text-neutral-600">{{ job.department }}</p>
          </div>
          <span class="badge-primary">{{ job.status }}</span>
        </div>

        <div class="space-y-2 text-sm mb-4">
          <div class="flex items-center gap-2 text-neutral-600">
            <span>📍</span>
            <span>{{ job.location }}</span>
          </div>
          <div class="flex items-center gap-2 text-neutral-600">
            <span>💼</span>
            <span>{{ job.type }}</span>
          </div>
          <div class="flex items-center gap-2 text-neutral-600">
            <span>📋</span>
            <span>{{ job.applications }} applications</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="editJob(job)" class="btn-outline flex-1 text-sm">
            Edit
          </button>
          <button
            @click="
              selectedJob = job;
              isJobDeleteModalOpen = true;
            "
            class="btn-outline flex-1 text-sm text-error-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Candidates -->
    <div class="card">
      <h2 class="text-lg font-bold text-neutral-900 mb-4">Recent Candidates</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-200">
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Candidate
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Position
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Email
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Applied Date
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Status
              </th>
              <th
                class="text-right px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="candidate in candidates"
              :key="candidate.id"
              class="border-b border-neutral-100 hover:bg-neutral-50"
            >
              <td class="px-6 py-4 text-sm font-medium text-neutral-900">
                {{ candidate.name }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ candidate.position }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ candidate.email }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ candidate.appliedDate }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'badge',
                    `badge-${getStatusClass(candidate.status)}`,
                  ]"
                >
                  {{ candidate.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="
                    selectedCandidate = candidate;
                    candidateStatusFormData.status = candidate.status;
                    isCandidateModalOpen = true;
                  "
                  class="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Update
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Job Modal -->
    <Modal
      v-model="isJobModalOpen"
      :title="editingJob ? 'Edit Job Opening' : 'Post New Job'"
      @confirm="saveJob"
    >
      <div class="space-y-4">
        <input
          v-model="jobFormData.title"
          type="text"
          placeholder="Job Title"
          class="input-base"
        />
        <input
          v-model="jobFormData.department"
          type="text"
          placeholder="Department"
          class="input-base"
        />
        <input
          v-model="jobFormData.location"
          type="text"
          placeholder="Location"
          class="input-base"
        />
        <select v-model="jobFormData.type" class="input-base">
          <option value="">Select Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>
        <select v-model="jobFormData.status" class="input-base">
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
    </Modal>

    <!-- Delete Job Modal -->
    <Modal
      v-model="isJobDeleteModalOpen"
      title="Delete Job Opening"
      @confirm="deleteJob"
    >
      <p class="text-neutral-600">
        Are you sure you want to delete <strong>{{ selectedJob?.title }}</strong
        >? This action cannot be undone.
      </p>
    </Modal>

    <!-- Candidate Status Modal -->
    <Modal
      v-model="isCandidateModalOpen"
      title="Update Candidate Status"
      @confirm="saveCandidateStatus"
    >
      <div class="space-y-4">
        <input
          v-model="selectedCandidate.name"
          type="text"
          placeholder="Candidate Name"
          class="input-base"
          disabled
        />
        <select v-model="candidateStatusFormData.status" class="input-base">
          <option value="Applied">Applied</option>
          <option value="Screening">Screening</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../components/common/Modal.vue";

const isJobModalOpen = ref(false);
const isJobDeleteModalOpen = ref(false);
const isCandidateModalOpen = ref(false);
const editingJob = ref(null);
const selectedJob = ref(null);
const selectedCandidate = ref(null);

const jobFormData = ref({
  title: "",
  department: "",
  location: "",
  type: "",
  status: "Open",
});
const candidateStatusFormData = ref({ status: "Applied" });

const jobOpenings = ref([
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    applications: 24,
    status: "Open",
  },
  {
    id: 2,
    title: "Sales Manager",
    department: "Sales",
    location: "New York",
    type: "Full-time",
    applications: 18,
    status: "Open",
  },
  {
    id: 3,
    title: "HR Specialist",
    department: "HR",
    location: "Chicago",
    type: "Full-time",
    applications: 12,
    status: "Closed",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "San Francisco",
    type: "Full-time",
    applications: 31,
    status: "Open",
  },
]);

const candidates = ref([
  {
    id: 1,
    name: "Alex Johnson",
    position: "Senior Frontend Developer",
    email: "alex@example.com",
    appliedDate: "2024-12-08",
    status: "Interview",
  },
  {
    id: 2,
    name: "Maria Garcia",
    position: "Sales Manager",
    email: "maria@example.com",
    appliedDate: "2024-12-07",
    status: "Applied",
  },
  {
    id: 3,
    name: "James Wilson",
    position: "DevOps Engineer",
    email: "james@example.com",
    appliedDate: "2024-12-06",
    status: "Screening",
  },
  {
    id: 4,
    name: "Patricia Lee",
    position: "Senior Frontend Developer",
    email: "patricia@example.com",
    appliedDate: "2024-12-05",
    status: "Rejected",
  },
  {
    id: 5,
    name: "Robert Smith",
    position: "Sales Manager",
    email: "robert@example.com",
    appliedDate: "2024-12-04",
    status: "Offer",
  },
]);

const editJob = (job) => {
  editingJob.value = job;
  jobFormData.value = { ...job };
  isJobModalOpen.value = true;
};

const saveJob = () => {
  if (editingJob.value) {
    const index = jobOpenings.value.findIndex(
      (j) => j.id === editingJob.value.id
    );
    if (index !== -1) {
      jobOpenings.value[index] = { ...editingJob.value, ...jobFormData.value };
    }
  } else {
    jobOpenings.value.push({
      id: Math.max(...jobOpenings.value.map((j) => j.id)) + 1,
      ...jobFormData.value,
      applications: 0,
    });
  }
  isJobModalOpen.value = false;
  editingJob.value = null;
  jobFormData.value = {
    title: "",
    department: "",
    location: "",
    type: "",
    status: "Open",
  };
};

const deleteJob = () => {
  jobOpenings.value = jobOpenings.value.filter(
    (j) => j.id !== selectedJob.value.id
  );
  isJobDeleteModalOpen.value = false;
  selectedJob.value = null;
};

const saveCandidateStatus = () => {
  const index = candidates.value.findIndex(
    (c) => c.id === selectedCandidate.value.id
  );
  if (index !== -1) {
    candidates.value[index].status = candidateStatusFormData.value.status;
  }
  isCandidateModalOpen.value = false;
  selectedCandidate.value = null;
};

const getStatusClass = (status) => {
  const map = {
    Applied: "primary",
    Screening: "info",
    Interview: "warning",
    Offer: "success",
    Rejected: "error",
  };
  return map[status] || "primary";
};
</script>

<style scoped></style>
