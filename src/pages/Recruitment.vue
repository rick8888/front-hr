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
                <button
                  type="button"
                  class="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  :disabled="saving"
                  @click="openCandidateStatusModal(candidate)"
                >
                  {{ t("common.update") }}
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
      :title="editingJob ? t('admin.recruitment.modal.editTitle') : t('admin.recruitment.modal.postTitle')"
      @confirm="saveJob"
    >
      <div class="space-y-4">
        <select v-model="jobFormData.designationId" class="input-base">
          <option value="">{{ t("admin.recruitment.modal.selectDesignation") }}</option>
          <option
            v-for="opt in designationOptions"
            :key="opt.id"
            :value="opt.id"
          >
            {{ opt.name }}
          </option>
        </select>
        <input
          v-model="jobFormData.department"
          type="text"
          :placeholder="t('common.department')"
          class="input-base"
          readonly
        />
        <input
          v-model="jobFormData.location"
          type="text"
          :placeholder="t('common.location')"
          class="input-base"
        />
        <select v-model="jobFormData.type" class="input-base">
          <option
            v-for="opt in jobTypeOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <select v-model="jobFormData.status" class="input-base">
          <option
            v-for="opt in jobStatusOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>
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
  </div>
</template>

<script setup>
import Modal from "../components/common/Modal.vue";
import { useI18n } from "../i18n/index.js";
import { useRecruitment } from "./recruitment/composables/useRecruitment.js";
import {
  catalogStatusBadgeClass,
  catalogStatusLabel,
} from "../stores/entityStatusCatalog.store.js";

const { t } = useI18n();

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
  editingJob,
  selectedJob,
  selectedCandidate,
  jobFormData,
  candidateStatusFormData,
  jobTypeOptions,
  jobStatusOptions,
  candidateStatusOptions,
  openCreateJobModal,
  editJob,
  saveJob,
  askDeleteJob,
  deleteJob,
  openCandidateStatusModal,
  saveCandidateStatus,
  getCandidateStatusClass,
  jobTypeLabel,
  jobStatusFallbackLabel,
  candidateStatusFallbackLabel,
} = useRecruitment();
</script>

<style scoped></style>
