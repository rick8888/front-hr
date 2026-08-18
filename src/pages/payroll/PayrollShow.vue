<template>
  <div v-if="detail" class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto space-y-6 w-full min-w-0">
    <!-- En-tête -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.show.title") }}</h1>
        <p class="text-sm text-neutral-600 mt-1">{{ detail.employeeName }} — {{ detail.periodLabel }}</p>
      </div>
      <nav
        class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
        aria-label="Breadcrumb"
      >
        <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
        <span>/</span>
        <RouterLink to="/" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.dashboard") }}</RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">{{ t("admin.payroll.breadcrumb.payroll") }}</RouterLink>
        <span>/</span>
        <RouterLink :to="backToList" class="hover:text-secondary-600">
          {{ fromRegister ? t("admin.payroll.breadcrumb.reports") : t("admin.payroll.breadcrumb.records") }}
        </RouterLink>
        <span>/</span>
        <span class="text-neutral-800 font-medium">{{ t("admin.payroll.show.title") }}</span>
      </nav>
    </div>

    <div
      v-if="recalcSuccessVisible"
      class="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800 flex items-center gap-2"
      role="status"
    >
      <svg class="w-5 h-5 shrink-0 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>{{ t("admin.payroll.show.recalcSuccess") }}</span>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_minmax(280px,340px)] lg:items-start">
      <!-- Colonne principale -->
      <div class="space-y-6 min-w-0">
        <PayrollShowEmployeeCard
          :detail="detail"
          :status-key="displayStatus"
          :status-label="statusLabel(displayStatus)"
          :status-badge-class="statusBadgeClass(displayStatus)"
        />
        <PayrollShowAttendanceCard :attendance="detail.attendance" />
        <PayrollShowSalaryBreakdown
          :earnings="detail.earnings"
          :deductions="detail.deductions"
          :gross="salaryDisplay.gross"
          :net="salaryDisplay.net"
        />
        <PayrollShowModifiersTable :modifiers="detail.modifiers" />
      </div>

      <!-- Colonne droite -->
      <PayrollShowSidebar
        :detail="detail"
        :summary="salaryDisplay"
        :back-to="backToList"
        @download-pdf="onDownloadPdf"
        @download-payslip="onDownloadPayslip"
        @back="logTimelineNav('Retour à la liste des paies')"
      >
        <template #actions>
          <!-- Paie rejetée -->
          <section
            v-if="payrollRejected"
            class="rounded-xl border border-red-200 bg-red-50/40 shadow-sm overflow-hidden"
          >
            <div class="px-5 py-4 border-b border-red-100">
              <h2 class="text-sm font-semibold text-red-900">{{ t("admin.payroll.show.actions") }}</h2>
            </div>
            <div class="p-5">
              <p class="text-sm text-red-800">
                {{ t("admin.payroll.show.rejected") }}
              </p>
            </div>
          </section>

          <!-- Avant approbation -->
          <section
            v-else-if="!payrollApproved"
            class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
          >
            <div class="px-5 py-4 border-b border-neutral-200">
              <h2 class="text-sm font-semibold text-neutral-900">{{ t("admin.payroll.show.actions") }}</h2>
            </div>
            <div class="p-5 space-y-3">
              <RouterLink
                :to="`/payroll/${detail.id}/adjustments`"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-secondary-50 text-secondary-800 border border-secondary-200 hover:bg-secondary-100 transition-colors"
                @click="logTimelineNav('Ouverture de la page Ajustements')"
              >
                {{ t("admin.payroll.show.adjust") }}
              </RouterLink>
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
                @click="openRecalcConfirm"
              >
                {{ t("admin.payroll.show.recalculate") }}
              </button>
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-success-600 text-white hover:bg-success-700 transition-colors"
                @click="openApproveConfirm"
              >
                {{ t("admin.payroll.show.approveBtn") }}
              </button>
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-error-600 text-white hover:bg-error-700 transition-colors"
                @click="openRejectModal"
              >
                {{ t("admin.payroll.show.rejectBtn") }}
              </button>
            </div>
          </section>

          <!-- Après approbation -->
          <div v-else class="space-y-3">
            <p
              v-if="actionFeedback"
              class="rounded-lg border border-success-200 bg-success-50 px-3 py-2 text-xs text-success-800"
            >
              {{ actionFeedback }}
            </p>
            <section
              v-if="!markPaidDone"
              class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
            >
              <div class="px-5 py-4 border-b border-neutral-200">
                <h2 class="text-sm font-semibold text-neutral-900">{{ t("admin.payroll.show.actions") }}</h2>
              </div>
              <div class="p-5 space-y-3">
                <button
                  type="button"
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-secondary-600 text-white hover:bg-secondary-700 transition-colors shadow-sm"
                  @click="openMarkPaidConfirm"
                >
                  {{ t("admin.payroll.show.markPaidBtn") }}
                </button>
                <button
                  type="button"
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold border-2 border-red-500 text-red-600 bg-white hover:bg-red-50 transition-colors"
                  @click="onCancelPayroll"
                >
                  {{ t("admin.payroll.show.cancelBtn") }}
                </button>
              </div>
            </section>
          </div>
        </template>
      </PayrollShowSidebar>
    </div>
  </div>

  <div v-else class="px-4 py-10 sm:px-8 sm:py-16 max-w-lg mx-auto text-center">
    <p class="text-lg font-semibold text-neutral-900">{{ t("admin.payroll.show.notFound") }}</p>
    <p class="text-sm text-neutral-600 mt-2">{{ t("admin.payroll.show.notFoundHint") }}</p>
    <RouterLink :to="backToList" class="btn-secondary inline-flex mt-6">{{ t("admin.payroll.show.backToList") }}</RouterLink>
  </div>


  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="recalcConfirmOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-[1px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payroll-show-recalc-title"
        @click.self="closeRecalcConfirm"
      >
        <div
          class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden transform transition-all"
          @click.stop
        >
          <div class="px-6 pt-8 pb-2 flex flex-col items-center text-center">
            <div
              class="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 ring-4 ring-amber-50"
            >
              <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h2 id="payroll-show-recalc-title" class="text-xl font-bold text-neutral-900">{{ t("admin.payroll.show.recalcConfirmTitle") }}</h2>
            <p class="mt-3 text-sm text-neutral-600 leading-relaxed">
              {{ t("admin.payroll.show.recalcConfirmText") }}
            </p>
          </div>
          <div class="px-6 py-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-center border-t border-neutral-100 bg-neutral-50/80">
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors"
              @click="closeRecalcConfirm"
            >
              {{ t("common.cancel") }}
            </button>
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors"
              @click="confirmRecalculate"
            >
              {{ t("admin.payroll.show.recalcConfirmYes") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Loader pendant recalcul -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="recalcLoading"
        class="fixed inset-0 z-[205] flex items-center justify-center p-6 bg-neutral-900/60 backdrop-blur-sm"
        role="alertdialog"
        aria-busy="true"
        aria-live="polite"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl border border-neutral-200 px-10 py-9 max-w-sm w-full flex flex-col items-center text-center"
        >
          <div
            class="w-14 h-14 rounded-full border-4 border-amber-100 border-t-amber-600 animate-spin mb-5"
            aria-hidden="true"
          />
          <p class="text-base font-semibold text-neutral-900">{{ t("admin.payroll.show.recalcLoadingTitle") }}</p>
          <p class="text-sm text-neutral-500 mt-2">{{ t("admin.payroll.show.recalcLoadingHint") }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="approveConfirmOpen"
        class="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-[1px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payroll-show-approve-title"
        @click.self="closeApproveConfirm"
      >
        <div
          class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden transform transition-all"
          @click.stop
        >
          <div class="px-6 pt-8 pb-2 flex flex-col items-center text-center">
            <div
              class="w-16 h-16 rounded-full bg-success-100 text-success-600 flex items-center justify-center mb-4 ring-4 ring-success-50"
            >
              <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 id="payroll-show-approve-title" class="text-xl font-bold text-neutral-900">{{ t("admin.payroll.show.approveConfirmTitle") }}</h2>
            <p class="mt-3 text-sm text-neutral-600 leading-relaxed">
              {{ t("admin.payroll.show.approveConfirmText") }}
            </p>
          </div>
          <div class="px-6 py-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-center border-t border-neutral-100 bg-neutral-50/80">
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors"
              @click="closeApproveConfirm"
            >
              {{ t("common.cancel") }}
            </button>
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-success-600 hover:bg-success-700 shadow-sm transition-colors"
              @click="confirmApprovePayroll"
            >
              {{ t("admin.payroll.show.approveConfirmYes") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Loader pendant approbation -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="approveLoading"
        class="fixed inset-0 z-[212] flex items-center justify-center p-6 bg-neutral-900/60 backdrop-blur-sm"
        role="alertdialog"
        aria-busy="true"
        aria-live="polite"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl border border-neutral-200 px-10 py-9 max-w-sm w-full flex flex-col items-center text-center"
        >
          <div
            class="w-14 h-14 rounded-full border-4 border-success-100 border-t-success-600 animate-spin mb-5"
            aria-hidden="true"
          />
          <p class="text-base font-semibold text-neutral-900">{{ t("admin.payroll.show.approveLoadingTitle") }}</p>
          <p class="text-sm text-neutral-500 mt-2">{{ t("admin.payroll.show.approveLoadingHint") }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Confirmation Â« Mark as Paid Â» -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="markPaidConfirmOpen"
        class="fixed inset-0 z-[215] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-[1px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payroll-mark-paid-title"
        @click.self="closeMarkPaidConfirm"
      >
        <div
          class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden transform transition-all"
          @click.stop
        >
          <div class="px-6 pt-8 pb-2 flex flex-col items-center text-center">
            <div
              class="w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mb-4 ring-4 ring-secondary-50"
            >
              <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 id="payroll-mark-paid-title" class="text-xl font-bold text-neutral-900">{{ t("admin.payroll.show.markPaidConfirmTitle") }}</h2>
            <p class="mt-3 text-sm text-neutral-600 leading-relaxed">
              {{ t("admin.payroll.show.markPaidConfirmText") }}
            </p>
          </div>
          <div class="px-6 py-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-center border-t border-neutral-100 bg-neutral-50/80">
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors"
              @click="closeMarkPaidConfirm"
            >
              {{ t("common.cancel") }}
            </button>
            <button
              type="button"
              class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-secondary-600 hover:bg-secondary-700 shadow-sm transition-colors"
              @click="confirmMarkAsPaid"
            >
              {{ t("admin.payroll.show.markPaidConfirmYes") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Loader pendant enregistrement du paiement -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="markPaidLoading"
        class="fixed inset-0 z-[220] flex items-center justify-center p-6 bg-neutral-900/60 backdrop-blur-sm"
        role="alertdialog"
        aria-busy="true"
        aria-live="polite"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl border border-neutral-200 px-10 py-9 max-w-sm w-full flex flex-col items-center text-center"
        >
          <div
            class="w-14 h-14 rounded-full border-4 border-secondary-100 border-t-secondary-600 animate-spin mb-5"
            aria-hidden="true"
          />
          <p class="text-base font-semibold text-neutral-900">{{ t("admin.payroll.show.markPaidLoadingTitle") }}</p>
          <p class="text-sm text-neutral-500 mt-2">{{ t("admin.payroll.show.markPaidLoadingHint") }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Rejet : saisie du motif (maquette) -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="rejectModalOpen"
        class="fixed inset-0 z-[225] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-[1px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-reason-title"
        @click.self="closeRejectModal"
      >
        <div
          class="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-neutral-200 overflow-hidden"
          @click.stop
        >
          <div class="px-6 pt-6 pb-4">
            <h2 id="reject-reason-title" class="text-lg font-bold text-neutral-900">{{ t("admin.payroll.show.rejectTitle") }}</h2>
            <textarea
              v-model="rejectReason"
              rows="5"
              class="mt-4 w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-error-500/25 focus:border-error-500 resize-y min-h-[120px]"
              :placeholder="t('admin.payroll.show.rejectPlaceholder')"
            />
            <p v-if="rejectValidationError" class="mt-2 text-xs text-error-600">{{ rejectValidationError }}</p>
          </div>
          <div class="px-6 py-4 flex flex-row flex-wrap items-center justify-center gap-3 border-t border-neutral-100 bg-neutral-50/90">
            <button
              type="button"
              class="min-w-[120px] px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-sm transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
              :disabled="!rejectReason.trim()"
              @click="submitRejectFromModal"
            >
              {{ t("admin.payroll.show.rejectSubmit") }}
            </button>
            <button
              type="button"
              class="min-w-[120px] px-6 py-2.5 rounded-lg text-sm font-semibold text-neutral-800 bg-neutral-200 hover:bg-neutral-300 transition-colors"
              @click="closeRejectModal"
            >
              {{ t("common.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Loader pendant rejet -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="rejectLoading"
        class="fixed inset-0 z-[230] flex items-center justify-center p-6 bg-neutral-900/60 backdrop-blur-sm"
        role="alertdialog"
        aria-busy="true"
        aria-live="polite"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl border border-neutral-200 px-10 py-9 max-w-sm w-full flex flex-col items-center text-center"
        >
          <div
            class="w-14 h-14 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin mb-5"
            aria-hidden="true"
          />
          <p class="text-base font-semibold text-neutral-900">{{ t("admin.payroll.show.rejectLoadingTitle") }}</p>
          <p class="text-sm text-neutral-500 mt-2">{{ t("admin.payroll.show.rejectLoadingHint") }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "../../i18n/index.js";
import { getPayrollDetail } from "../../data/payrollRecordsDemo.js";
import { useAuthStore } from "../../stores/authStore.js";
import PayrollShowEmployeeCard from "../../components/payroll/show/PayrollShowEmployeeCard.vue";
import PayrollShowAttendanceCard from "../../components/payroll/show/PayrollShowAttendanceCard.vue";
import PayrollShowSalaryBreakdown from "../../components/payroll/show/PayrollShowSalaryBreakdown.vue";
import PayrollShowModifiersTable from "../../components/payroll/show/PayrollShowModifiersTable.vue";
import PayrollShowSidebar from "../../components/payroll/show/PayrollShowSidebar.vue";

const MANUAL_ADJUST_STORAGE_KEY = (id) => `payroll:manualAdjustTotals:${String(id)}`;
const APPROVED_STORAGE_KEY = (id) => `payroll:showApproved:${String(id)}`;
const MARK_PAID_DONE_KEY = (id) => `payroll:markPaidDone:${String(id)}`;
const REJECTED_STORAGE_KEY = (id) => `payroll:rejected:${String(id)}`;
const TIMELINE_STORAGE_KEY = (id) => `payroll:timeline:${String(id)}`;

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

const STATUS = {
  paid: { badge: "bg-green-100 text-green-800" },
  pending: { badge: "bg-amber-100 text-amber-800" },
  approved: { badge: "bg-sky-100 text-sky-800" },
  rejected: { badge: "bg-red-100 text-red-800" },
};

const route = useRoute();
const { t } = useI18n();
const authStore = useAuthStore();

const detail = computed(() => getPayrollDetail(route.params.id));

const fromRegister = computed(() => route.query.from === "register");
const backToList = computed(() =>
  fromRegister.value ? "/payroll/reports/payroll-register" : "/payroll/records"
);

function currentActorName() {
  const n = authStore.user?.name?.trim();
  return n || "Guest";
}

const payrollApproved = ref(false);
const payrollRejected = ref(false);
const approveConfirmOpen = ref(false);
const markPaidDone = ref(false);
const markPaidConfirmOpen = ref(false);
const markPaidLoading = ref(false);
const approveLoading = ref(false);
const actionFeedback = ref("");
let actionFeedbackTimer = null;
let markPaidProcessTimer = null;
let approveProcessTimer = null;

const timeline = ref([]);
const rejectModalOpen = ref(false);
const rejectReason = ref("");
const rejectValidationError = ref("");
const rejectLoading = ref(false);
let rejectProcessTimer = null;

const displayStatus = computed(() => {
  if (markPaidDone.value) return "paid";
  if (payrollRejected.value) return "rejected";
  // Statut métier source (ex. Pending) — distinct du badge d'approbation
  return detail.value?.status ?? "pending";
});

function formatTimelineAt() {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function loadTimeline() {
  try {
    const raw = sessionStorage.getItem(TIMELINE_STORAGE_KEY(route.params.id));
    timeline.value = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(timeline.value)) timeline.value = [];
  } catch {
    timeline.value = [];
  }
}

function saveTimeline() {
  try {
    sessionStorage.setItem(TIMELINE_STORAGE_KEY(route.params.id), JSON.stringify(timeline.value));
  } catch {
    /* ignore */
  }
}

function pushTimeline(title, detail = null) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: formatTimelineAt(),
    title,
    actor: currentActorName(),
    detail,
  };
  timeline.value = [entry, ...timeline.value].slice(0, 50);
  saveTimeline();
}

function logTimelineNav(title) {
  pushTimeline(title);
}

function openRejectModal() {
  rejectReason.value = "";
  rejectValidationError.value = "";
  rejectModalOpen.value = true;
}

function closeRejectModal() {
  rejectModalOpen.value = false;
  rejectReason.value = "";
  rejectValidationError.value = "";
}

function submitRejectFromModal() {
  const reason = rejectReason.value.trim();
  if (!reason) {
    rejectValidationError.value = t("admin.payroll.show.rejectRequired");
    return;
  }
  rejectValidationError.value = "";
  rejectModalOpen.value = false;
  rejectReason.value = "";
  rejectLoading.value = true;
  if (rejectProcessTimer) clearTimeout(rejectProcessTimer);
  rejectProcessTimer = setTimeout(() => {
    payrollRejected.value = true;
    payrollApproved.value = false;
    markPaidDone.value = false;
    try {
      sessionStorage.setItem(REJECTED_STORAGE_KEY(route.params.id), JSON.stringify({ reason }));
      sessionStorage.removeItem(APPROVED_STORAGE_KEY(route.params.id));
      sessionStorage.removeItem(MARK_PAID_DONE_KEY(route.params.id));
    } catch {
      /* ignore */
    }
    pushTimeline(t("admin.payroll.show.timeline.rejected"), reason);
    rejectLoading.value = false;
    rejectProcessTimer = null;
  }, 2200);
}

/** Après confirmation : même formule que la page ajustements (brut + gains manuels, retenues + déductions manuelles) */
const breakdownOverride = ref(null);

const salaryDisplay = computed(() => {
  const d = detail.value;
  if (!d) return { gross: 0, totalDeductions: 0, net: 0 };
  if (breakdownOverride.value) {
    return {
      gross: breakdownOverride.value.gross,
      totalDeductions: breakdownOverride.value.totalDeductions,
      net: breakdownOverride.value.net,
    };
  }
  return {
    gross: d.grossSalary,
    totalDeductions: d.totalDeductions,
    net: d.netSalary,
  };
});

const recalcConfirmOpen = ref(false);
const recalcSuccessVisible = ref(false);
const recalcLoading = ref(false);
let recalcSuccessTimer = null;
let recalcProcessTimer = null;

function openApproveConfirm() {
  approveConfirmOpen.value = true;
}

function closeApproveConfirm() {
  approveConfirmOpen.value = false;
}

function confirmApprovePayroll() {
  if (approveLoading.value) return;
  closeApproveConfirm();
  approveLoading.value = true;
  if (approveProcessTimer) clearTimeout(approveProcessTimer);
  approveProcessTimer = setTimeout(() => {
    payrollApproved.value = true;
    try {
      sessionStorage.setItem(APPROVED_STORAGE_KEY(route.params.id), "1");
    } catch {
      /* ignore */
    }
    pushTimeline(t("admin.payroll.show.timeline.approved"));
    approveLoading.value = false;
    approveProcessTimer = null;
  }, 2200);
}

function openMarkPaidConfirm() {
  markPaidConfirmOpen.value = true;
}

function closeMarkPaidConfirm() {
  markPaidConfirmOpen.value = false;
}

function confirmMarkAsPaid() {
  closeMarkPaidConfirm();
  markPaidLoading.value = true;
  if (markPaidProcessTimer) clearTimeout(markPaidProcessTimer);
  markPaidProcessTimer = setTimeout(() => {
    markPaidLoading.value = false;
    markPaidDone.value = true;
    try {
      sessionStorage.setItem(MARK_PAID_DONE_KEY(route.params.id), "1");
    } catch {
      /* ignore */
    }
    pushTimeline(t("admin.payroll.show.timeline.paid"));
    actionFeedback.value = t("admin.payroll.show.paidFeedback");
    if (actionFeedbackTimer) clearTimeout(actionFeedbackTimer);
    actionFeedbackTimer = setTimeout(() => {
      actionFeedback.value = "";
      actionFeedbackTimer = null;
    }, 4000);
    markPaidProcessTimer = null;
  }, 2200);
}

function onCancelPayroll() {
  if (!confirm(t("admin.payroll.show.cancelConfirm"))) return;
  payrollApproved.value = false;
  markPaidDone.value = false;
  try {
    sessionStorage.removeItem(APPROVED_STORAGE_KEY(route.params.id));
    sessionStorage.removeItem(MARK_PAID_DONE_KEY(route.params.id));
  } catch {
    /* ignore */
  }
  actionFeedback.value = "";
  pushTimeline(t("admin.payroll.show.timeline.cancelled"), t("admin.payroll.show.cancelNote"));
}

function onDownloadPayslip() {
  pushTimeline(t("admin.payroll.show.timeline.downloadPayslip"), t("admin.payroll.show.demoNoFile"));
  actionFeedback.value = t("admin.payroll.show.downloadDemo");
  if (actionFeedbackTimer) clearTimeout(actionFeedbackTimer);
  actionFeedbackTimer = setTimeout(() => {
    actionFeedback.value = "";
    actionFeedbackTimer = null;
  }, 4000);
}

function onDownloadPdf() {
  pushTimeline(t("admin.payroll.show.timeline.downloadPdf"), t("admin.payroll.show.demoNoFile"));
  window.print();
}

function readManualAdjustTotals() {
  try {
    const raw = sessionStorage.getItem(MANUAL_ADJUST_STORAGE_KEY(route.params.id));
    if (!raw) return { e: 0, ded: 0 };
    const o = JSON.parse(raw);
    return { e: Number(o.e) || 0, ded: Number(o.ded) || 0 };
  } catch {
    return { e: 0, ded: 0 };
  }
}

function openRecalcConfirm() {
  recalcConfirmOpen.value = true;
}

function closeRecalcConfirm() {
  recalcConfirmOpen.value = false;
}

function confirmRecalculate() {
  if (recalcLoading.value) return;
  const d = detail.value;
  if (!d) return;
  const { e, ded } = readManualAdjustTotals();
  closeRecalcConfirm();
  recalcLoading.value = true;
  if (recalcProcessTimer) clearTimeout(recalcProcessTimer);
  recalcProcessTimer = setTimeout(() => {
    breakdownOverride.value = {
      gross: round2(d.grossSalary + e),
      totalDeductions: round2(d.totalDeductions + ded),
      net: round2(d.grossSalary + e - (d.totalDeductions + ded)),
    };
    pushTimeline(
      t("admin.payroll.show.timeline.recalculated"),
      t("admin.payroll.show.timeline.recalcDetail", {
        earnings: formatMoney(e),
        deductions: formatMoney(ded),
      })
    );
    recalcSuccessVisible.value = true;
    if (recalcSuccessTimer) clearTimeout(recalcSuccessTimer);
    recalcSuccessTimer = setTimeout(() => {
      recalcSuccessVisible.value = false;
      recalcSuccessTimer = null;
    }, 4000);
    recalcLoading.value = false;
    recalcProcessTimer = null;
  }, 2200);
}

function formatMoney(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(n) || 0);
}

function statusLabel(key) {
  const translated = t(`admin.payroll.status.${key}`);
  if (translated !== `admin.payroll.status.${key}`) return translated;
  return key;
}

function statusBadgeClass(key) {
  return STATUS[key]?.badge ?? "bg-neutral-100 text-neutral-700";
}

function initials(name) {
  if (!name) return "??";
  const p = name.split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function avatarColor(name) {
  const colors = ["#6366f1", "#8b5cf6", "#0ea5e9", "#059669", "#d97706", "#7c3aed", "#ec4899"];
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h += name.charCodeAt(i);
  return colors[h % colors.length];
}

watch(
  () => route.params.id,
  () => {
    breakdownOverride.value = null;
    recalcConfirmOpen.value = false;
    recalcLoading.value = false;
    if (recalcProcessTimer) {
      clearTimeout(recalcProcessTimer);
      recalcProcessTimer = null;
    }
    approveConfirmOpen.value = false;
    markPaidConfirmOpen.value = false;
    markPaidLoading.value = false;
    approveLoading.value = false;
    if (approveProcessTimer) {
      clearTimeout(approveProcessTimer);
      approveProcessTimer = null;
    }
    rejectModalOpen.value = false;
    rejectReason.value = "";
    rejectValidationError.value = "";
    rejectLoading.value = false;
    if (rejectProcessTimer) {
      clearTimeout(rejectProcessTimer);
      rejectProcessTimer = null;
    }
    recalcSuccessVisible.value = false;
    if (recalcSuccessTimer) {
      clearTimeout(recalcSuccessTimer);
      recalcSuccessTimer = null;
    }
    if (markPaidProcessTimer) {
      clearTimeout(markPaidProcessTimer);
      markPaidProcessTimer = null;
    }
    if (actionFeedbackTimer) {
      clearTimeout(actionFeedbackTimer);
      actionFeedbackTimer = null;
    }
    actionFeedback.value = "";
    try {
      const rejectedRaw = sessionStorage.getItem(REJECTED_STORAGE_KEY(route.params.id));
      payrollRejected.value = Boolean(rejectedRaw);
      if (payrollRejected.value) {
        payrollApproved.value = false;
        markPaidDone.value = false;
      } else {
        const storedApproved = sessionStorage.getItem(APPROVED_STORAGE_KEY(route.params.id)) === "1";
        const storedPaid = sessionStorage.getItem(MARK_PAID_DONE_KEY(route.params.id)) === "1";
        const d = getPayrollDetail(route.params.id);
        payrollApproved.value = storedApproved || Boolean(d?.defaultApproved);
        markPaidDone.value = storedPaid;
      }
    } catch {
      const d = getPayrollDetail(route.params.id);
      payrollApproved.value = Boolean(d?.defaultApproved);
      markPaidDone.value = false;
      payrollRejected.value = false;
    }
    loadTimeline();
  },
  { immediate: true }
);

watch(
  () => [route.params.id, detail.value],
  () => {
    if (detail.value?.employeeName) {
      document.title = `Payroll — ${detail.value.employeeName}`;
    } else {
      document.title = t("admin.payroll.show.title");
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (recalcSuccessTimer) clearTimeout(recalcSuccessTimer);
  if (recalcProcessTimer) clearTimeout(recalcProcessTimer);
  if (markPaidProcessTimer) clearTimeout(markPaidProcessTimer);
  if (approveProcessTimer) clearTimeout(approveProcessTimer);
  if (rejectProcessTimer) clearTimeout(rejectProcessTimer);
  if (actionFeedbackTimer) clearTimeout(actionFeedbackTimer);
});
</script>
