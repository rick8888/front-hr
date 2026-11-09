<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.recruitment.title") }}</h1>
        <p class="text-sm text-neutral-600">
          {{ t("admin.recruitment.subtitle") }}
        </p>
      </div>
      <button
        type="button"
        class="btn-primary"
        :disabled="saving"
        @click="openCreateJobModal"
      >
        {{ t("admin.recruitment.postJob") }}
      </button>
    </div>

    <div
      v-if="error"
      class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- Job Openings -->
    <div v-if="loading" class="mb-6 text-sm text-neutral-500">{{ t("common.loading") }}</div>
    <div
      v-else-if="jobOpenings.length === 0"
      class="card mb-6 text-sm text-neutral-500"
    >
      {{ t("admin.recruitment.emptyJobs") }}
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div v-for="job in jobOpenings" :key="job.id" class="card">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="text-lg font-bold text-neutral-900">{{ job.title }}</h3>
            <p class="text-sm text-neutral-600">{{ job.department || "—" }}</p>
          </div>
          <span
            :class="['badge', catalogStatusBadgeClass('job_openings', job.status)]"
          >
            {{ catalogStatusLabel("job_openings", job.status, jobStatusFallbackLabel(job.status)) }}
          </span>
        </div>

        <div class="space-y-2 text-sm mb-4">
          <div class="flex items-center gap-2 text-neutral-600">
            <span>📍</span>
            <span>{{ job.location || "—" }}</span>
          </div>
          <div class="flex items-center gap-2 text-neutral-600">
            <span>💼</span>
            <span>{{ jobTypeLabel(job.type) }}</span>
          </div>
          <div class="flex items-center gap-2 text-neutral-600">
            <span>📋</span>
            <span>{{ t("admin.recruitment.applicationsCount", { n: job.applications }) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            class="btn-outline flex-1 text-sm"
            :disabled="saving"
            @click="editJob(job)"
          >
            {{ t("common.edit") }}
          </button>
          <button
            type="button"
            class="btn-outline flex-1 text-sm text-error-600"
            :disabled="saving"
            @click="askDeleteJob(job)"
          >
            {{ t("common.delete") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Candidates -->
    <div class="card">
      <h2 class="text-lg font-bold text-neutral-900 mb-4">{{ t("admin.recruitment.recentCandidates") }}</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-200">
              <th class="text-left px-6 py-3 text-sm font-medium text-neutral-600">
                {{ t("admin.recruitment.col.candidate") }}
              </th>
              <th class="text-left px-6 py-3 text-sm font-medium text-neutral-600">
                {{ t("admin.recruitment.col.position") }}
              </th>
              <th class="text-left px-6 py-3 text-sm font-medium text-neutral-600">
                {{ t("admin.recruitment.col.email") }}
              </th>
              <th class="text-left px-6 py-3 text-sm font-medium text-neutral-600">
                {{ t("admin.recruitment.col.appliedDate") }}
              </th>
              <th class="text-left px-6 py-3 text-sm font-medium text-neutral-600">
                {{ t("common.status") }}
              </th>
              <th class="text-right px-6 py-3 text-sm font-medium text-neutral-600">
                {{ t("common.actions") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-neutral-500">
                {{ t("common.loading") }}
              </td>
            </tr>
            <tr v-else-if="candidates.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-neutral-500">
                {{ t("admin.recruitment.emptyCandidates") }}
              </td>
            </tr>
            <tr
              v-for="candidate in candidates"
              v-else
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
                {{ candidate.appliedDate || "—" }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'badge',
                    `badge-${getCandidateStatusClass(candidate.status)}`,
                  ]"
                >
                  {{ catalogStatusLabel("candidates", candidate.status, candidateStatusFallbackLabel(candidate.status)) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    v-if="candidate.hiredEmployeeId && canManageEmployees"
                    type="button"
                    class="btn-outline text-xs"
                    :disabled="saving"
                    @click="openOnboarding(candidate.hiredEmployeeId)"
                  >
                    {{ t("admin.recruitment.onboardingAction") }}
                  </button>
                  <button
                    v-else-if="!candidate.hiredEmployeeId && candidate.stageKey === 'offer' && canManageEmployees"
                    type="button"
                    class="btn-primary text-xs"
                    :disabled="saving"
                    @click="openHireModal(candidate)"
                  >
                    {{ t("admin.recruitment.hireAction") }}
                  </button>
                  <button
                    v-else-if="!candidate.hiredEmployeeId"
                    type="button"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    :disabled="saving"
                    :title="t('common.update')"
                    :aria-label="t('common.update')"
                    @click="openCandidateStatusModal(candidate)"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.824-1M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.824-1M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Job Modal -->
    <Modal
      v-model="isJobModalOpen"
      :title="editingJob ? t('admin.recruitment.modal.editTitle') : t('admin.recruitment.modal.postTitle')"
      size="lg"
      backdrop-class="bg-neutral-950/60 backdrop-blur-sm"
      panel-class="max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border border-white/60 shadow-2xl sm:mx-6"
      header-class="px-6 py-5 sm:px-7"
      title-class="text-xl"
      close-button-class="rounded-lg px-2 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
      body-class="px-6 py-6 sm:px-7"
    >
      <div class="space-y-5">
        <div
          v-if="error"
          role="alert"
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ error }}
        </div>
        <div>
          <label for="job-designation" class="mb-2 block text-sm font-semibold text-neutral-700">
            {{ t("admin.recruitment.modal.designation") }}
            <span class="text-error-600">*</span>
          </label>
          <select
            id="job-designation"
            v-model="jobFormData.designationId"
            class="input-base w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            required
          >
            <option value="">{{ t("admin.recruitment.modal.selectDesignation") }}</option>
            <option
              v-for="opt in designationOptions"
              :key="opt.id"
              :value="opt.id"
            >
              {{ opt.name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label for="job-department" class="mb-2 block text-sm font-semibold text-neutral-700">
              {{ t("common.department") }}
            </label>
            <input
              id="job-department"
              v-model="jobFormData.department"
              type="text"
              class="input-base w-full cursor-not-allowed bg-neutral-50 text-neutral-500"
              readonly
            />
          </div>
          <div>
            <label for="job-location" class="mb-2 block text-sm font-semibold text-neutral-700">
              {{ t("common.location") }}
            </label>
            <input
              id="job-location"
              v-model="jobFormData.location"
              type="text"
              class="input-base w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label for="job-type" class="mb-2 block text-sm font-semibold text-neutral-700">
              {{ t("admin.recruitment.modal.type") }}
            </label>
            <select
              id="job-type"
              v-model="jobFormData.type"
              class="input-base w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option
                v-for="opt in jobTypeOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ jobTypeLabel(opt.value) }}
              </option>
            </select>
          </div>
          <div>
            <label for="job-status" class="mb-2 block text-sm font-semibold text-neutral-700">
              {{ t("admin.recruitment.modal.status") }}
            </label>
            <select
              id="job-status"
              v-model="jobFormData.status"
              class="input-base w-full focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option
                v-for="opt in jobStatusOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ jobStatusFallbackLabel(opt.value) }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex flex-col-reverse gap-3 border-t border-neutral-200 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            class="btn-outline"
            :disabled="saving"
            @click="closeJobModal"
          >
            {{ t("common.cancel") }}
          </button>
          <button
            type="button"
            class="btn-primary"
            :disabled="saving"
            @click="saveJob"
          >
            {{ t("common.save") }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Delete Job Modal -->
    <Modal
      v-model="isJobDeleteModalOpen"
      :title="t('admin.recruitment.modal.deleteTitle')"
      @confirm="deleteJob"
    >
      <p class="text-neutral-600">
        {{ t("admin.recruitment.modal.deleteText", { title: selectedJob?.title || "" }) }}
      </p>
    </Modal>

    <!-- Candidate Status Modal -->
    <Modal
      v-model="isCandidateModalOpen"
      :title="t('admin.recruitment.modal.updateStatus')"
      @confirm="saveCandidateStatus"
    >
      <div class="space-y-4">
        <input
          :value="selectedCandidate?.name || ''"
          type="text"
          :placeholder="t('admin.recruitment.modal.candidateName')"
          class="input-base"
          disabled
        />
        <select v-model="candidateStatusFormData.status" class="input-base">
          <option
            v-for="opt in candidateStatusOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>
    </Modal>

    <Modal
      v-model="isHireModalOpen"
      :title="t('admin.recruitment.hireTitle')"
      size="lg"
      backdrop-class="bg-neutral-950/60 backdrop-blur-sm"
      panel-class="max-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border border-white/60 shadow-2xl sm:mx-6"
      @confirm="hireCandidate"
    >
      <div class="space-y-4">
        <p class="text-sm text-neutral-600">
          {{ t("admin.recruitment.hireIntro", { name: selectedCandidate?.name || "" }) }}
        </p>
        <div
          v-if="error"
          role="alert"
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ error }}
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="text-sm font-medium text-neutral-700">
            {{ t("admin.recruitment.firstName") }} *
            <input v-model="hireFormData.firstName" class="input-base mt-1 w-full" required maxlength="120" />
          </label>
          <label class="text-sm font-medium text-neutral-700">
            {{ t("admin.recruitment.lastName") }} *
            <input v-model="hireFormData.lastName" class="input-base mt-1 w-full" required maxlength="120" />
          </label>
          <label class="text-sm font-medium text-neutral-700">
            {{ t("admin.recruitment.employeeCode") }} *
            <input v-model="hireFormData.matricule" class="input-base mt-1 w-full" required maxlength="64" />
          </label>
          <label class="text-sm font-medium text-neutral-700">
            {{ t("admin.recruitment.hireDate") }} *
            <input v-model="hireFormData.hiredAt" type="date" class="input-base mt-1 w-full" required />
          </label>
          <label class="text-sm font-medium text-neutral-700">
            {{ t("admin.recruitment.contractType") }} *
            <select v-model="hireFormData.contractType" class="input-base mt-1 w-full" required>
              <option value="Permanent">{{ t("admin.recruitment.contractPermanent") }}</option>
              <option value="Fixed-term">{{ t("admin.recruitment.contractFixedTerm") }}</option>
              <option value="Internship">{{ t("admin.recruitment.contractInternship") }}</option>
              <option value="Contractor">{{ t("admin.recruitment.contractContractor") }}</option>
              <option value="Other">{{ t("admin.recruitment.contractOther") }}</option>
            </select>
          </label>
          <label class="text-sm font-medium text-neutral-700">
            {{ t("admin.recruitment.baseSalary") }}
            <input v-model="hireFormData.baseSalary" type="number" min="0" step="0.01" class="input-base mt-1 w-full" />
          </label>
          <label class="text-sm font-medium text-neutral-700 sm:col-span-2">
            {{ t("admin.recruitment.currency") }}
            <input v-model="hireFormData.currency" type="text" minlength="3" maxlength="3" class="input-base mt-1 w-full uppercase" />
          </label>
        </div>
      </div>
      <template #footer>
        <div class="flex flex-col-reverse gap-3 border-t border-neutral-200 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button type="button" class="btn-outline" :disabled="saving" @click="isHireModalOpen = false">
            {{ t("common.cancel") }}
          </button>
          <button
            type="button"
            class="btn-primary"
            :disabled="saving || !hireFormData.firstName.trim() || !hireFormData.lastName.trim() || !hireFormData.matricule.trim() || !hireFormData.hiredAt"
            @click="hireCandidate"
          >
            {{ saving ? t("admin.recruitment.hiring") : t("admin.recruitment.hireAction") }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import Modal from "../components/common/Modal.vue";
import { useI18n } from "../i18n/index.js";
import { useAuthStore } from "../stores/authStore.js";
import { useRecruitment } from "./recruitment/composables/useRecruitment.js";
import {
  catalogStatusBadgeClass,
  catalogStatusLabel,
} from "../stores/entityStatusCatalog.store.js";

const { t } = useI18n();
const authStore = useAuthStore();
const canManageEmployees = authStore.can("employees.manage");

const {
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
  jobTypeOptions,
  jobStatusOptions,
  candidateStatusOptions,
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
} = useRecruitment();
</script>

<style scoped></style>
