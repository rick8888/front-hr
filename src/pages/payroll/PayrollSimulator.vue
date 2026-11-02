<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">
          {{ t("admin.payroll.simulator.title") }}
        </h1>
        <p class="text-sm text-neutral-600 mt-1">
          {{ t("admin.payroll.simulator.subtitle") }}
        </p>
      </div>
      <nav
        class="text-xs text-neutral-500 flex flex-wrap items-center justify-end gap-1"
        :aria-label="t('common.breadcrumb')"
      >
        <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">
          {{ t("admin.payroll.breadcrumb.dashboard") }}
        </RouterLink>
        <span>/</span>
        <RouterLink to="/payroll/dashboard" class="hover:text-secondary-600">
          {{ t("admin.payroll.breadcrumb.payroll") }}
        </RouterLink>
        <span>/</span>
        <span class="text-neutral-800 font-medium">
          {{ t("admin.payroll.simulator.breadcrumb") }}
        </span>
      </nav>
    </div>

    <div class="mb-6 flex gap-3 rounded-xl border border-info-500/20 bg-info-50 px-4 py-3 text-sm text-neutral-700">
      <span class="flex-shrink-0 text-info-600 mt-0.5" aria-hidden="true">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <p>
        <strong class="text-neutral-900">{{ t("admin.payroll.simulator.modeTitle") }}</strong>
        {{ t("admin.payroll.simulator.modeText") }}
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-5">
      <section class="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 class="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-4">
          {{ t("admin.payroll.simulator.employeePeriod") }}
        </h2>
        <div class="space-y-4">
          <div>
            <label
              for="simulator-employee"
              class="block text-sm font-medium text-neutral-700 mb-1"
            >
              {{ t("admin.payroll.simulator.employee") }}
            </label>
            <select
              id="simulator-employee"
              v-model="selectedEmployeeId"
              class="input-base text-sm"
              :disabled="loadingEmployees || !employees.length"
            >
              <option value="">{{ t("admin.payroll.simulator.chooseEmployee") }}</option>
              <option v-for="item in employees" :key="item.id" :value="String(item.id)">
                {{ item.name }} — {{ item.matricule || item.id }}
              </option>
            </select>
            <p v-if="loadingEmployees" class="mt-1 text-xs text-neutral-500">
              {{ t("admin.payroll.simulator.loadingEmployees") }}
            </p>
            <p v-else-if="!employees.length && !employeesError" class="mt-1 text-xs text-neutral-500">
              {{ t("admin.payroll.simulator.noEmployees") }}
            </p>
            <p v-if="employeesError" role="alert" class="mt-1 text-xs text-error-700">
              {{ employeesError }}
            </p>
          </div>

          <div>
            <label for="simulator-period" class="block text-sm font-medium text-neutral-700 mb-1">
              {{ t("admin.payroll.simulator.month") }}
            </label>
            <input id="simulator-period" v-model="period" type="month" class="input-base text-sm" />
          </div>

          <div v-if="selectedEmployee" class="rounded-lg bg-neutral-50 border border-neutral-100 p-3 text-sm">
            <p class="font-medium text-neutral-900">{{ selectedEmployee.name }}</p>
            <p class="text-xs text-neutral-500 mt-1">
              {{ selectedEmployee.job_title || selectedEmployee.department || "—" }}
              <span v-if="selectedEmployee.currency"> · {{ selectedEmployee.currency }}</span>
            </p>
          </div>

          <button
            type="button"
            class="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!selectedEmployeeId || !period || loadingPreview || loadingEmployees"
            @click="loadPreview"
          >
            {{
              loadingPreview
                ? t("admin.payroll.simulator.calculating")
                : t("admin.payroll.simulator.calculate")
            }}
          </button>
        </div>
      </section>

      <div class="lg:col-span-3 space-y-4">
        <p
          v-if="previewError"
          role="alert"
          class="rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-800"
        >
          {{ previewError }}
        </p>
        <p
          v-else-if="!preview && !loadingPreview"
          class="rounded-xl border border-neutral-200 bg-white px-5 py-8 text-center text-sm text-neutral-500"
        >
          {{ t("admin.payroll.simulator.emptyPreview") }}
        </p>
        <p
          v-if="loadingPreview"
          class="rounded-xl border border-neutral-200 bg-white px-5 py-8 text-center text-sm text-neutral-500"
          role="status"
        >
          {{ t("admin.payroll.simulator.calculating") }}
        </p>

        <PayrollPreview
          v-if="preview && previewEmployee"
          :employee="previewEmployee"
          :month="periodDate"
          :gains="preview.gains"
          :deductions="preview.deductions"
          :gross="preview.summary.gross"
          :total-deductions="preview.summary.total_deductions"
          :taxable="preview.summary.taxable"
          :net="preview.summary.net"
          :currency="preview.currency"
          :locale="preview.locale"
        />

        <section
          v-if="preview?.attendance"
          class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <h2 class="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-4">
            {{ t("admin.payroll.attendance.title") }}
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="item in attendanceItems"
              :key="item.label"
              class="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3"
            >
              <p class="text-xs text-neutral-500">{{ item.label }}</p>
              <p class="text-lg font-bold mt-1 tabular-nums" :class="item.valueClass">
                {{ item.value }}
              </p>
            </div>
          </div>
        </section>

        <div
          v-if="preview"
          role="alert"
          class="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          {{ t("admin.payroll.simulator.rulesNotValidated") }}
        </div>
        <div
          v-if="preview?.countryCode === 'FR'"
          role="alert"
          class="rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-800"
        >
          {{ t("admin.payroll.simulator.noCountryRules") }}
        </div>
        <div
          v-if="preview?.countryCode === 'CI' || preview?.countryCode === 'SN' || preview?.countryCode === 'CD' || preview?.countryCode === 'CG'"
          role="alert"
          class="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          {{ t("admin.payroll.simulator.provisionalCountryRules") }}
        </div>
        <div
          v-if="preview?.countryCode === 'CG'"
          role="alert"
          class="rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-800"
        >
          {{ t("admin.payroll.simulator.noCongoIncomeTaxRules") }}
        </div>

        <div
          v-if="preview?.attendance.pending_attendance_days > 0"
          role="status"
          class="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          {{
            t("admin.payroll.simulator.pendingAttendance", {
              count: preview.attendance.pending_attendance_days,
            })
          }}
        </div>
        <div
          v-if="preview?.attendance.recorded_absent_days > 0"
          role="status"
          class="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
        >
          {{
            t("admin.payroll.simulator.recordedAbsences", {
              count: preview.attendance.recorded_absent_days,
            })
          }}
        </div>
        <div
          v-if="preview?.attendance.no_show_days > 0"
          role="status"
          class="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
        >
          {{
            t("admin.payroll.simulator.missingPastAttendance", {
              count: preview.attendance.no_show_days,
            })
          }}
        </div>

        <section
          v-if="preview"
          class="rounded-xl border border-neutral-200 bg-white px-5 py-4 text-sm"
        >
          <div class="flex items-center justify-between gap-4">
            <span class="text-neutral-600">{{ t("admin.payroll.simulator.employerCharges") }}</span>
            <span class="font-semibold text-neutral-900 tabular-nums">
              {{ formatMoney(preview.summary.total_employer_charges, preview.currency, preview.locale) }}
            </span>
          </div>
          <p class="mt-2 text-xs text-neutral-500">
            {{ t("admin.payroll.simulator.notSaved") }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "../../i18n/index.js";
import { parseApiError } from "../../utils/apiErrors.js";
import PayrollPreview from "../../components/payroll/PayrollPreview.vue";
import { employeesApiService } from "../employees/services/employees.api.service.js";
import { payrollApiService } from "./services/payroll.api.service.js";

const { t, locale: uiLocale } = useI18n();
const employees = ref([]);
const selectedEmployeeId = ref("");
const today = new Date();
const period = ref(
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
);
const loadingEmployees = ref(false);
const loadingPreview = ref(false);
const employeesError = ref("");
const previewError = ref("");
const preview = ref(null);
let previewRequest = 0;

const selectedEmployee = computed(
  () => employees.value.find((employee) => String(employee.id) === selectedEmployeeId.value) ?? null,
);

const periodDate = computed(() => {
  const [year, month] = period.value.split("-").map(Number);
  return year && month ? new Date(year, month - 1, 1) : new Date();
});

const previewEmployee = computed(() => {
  if (!selectedEmployee.value || !preview.value) return null;
  return {
    ...selectedEmployee.value,
    country: preview.value.countryCode,
  };
});

const attendanceItems = computed(() => {
  const attendance = preview.value?.attendance ?? {};
  const days = (value) => `${Number(value ?? 0).toFixed(1)} j`;
  return [
    {
      label: t("admin.payroll.attendance.workingDays"),
      value: days(attendance.working_days),
      valueClass: "text-neutral-900",
    },
    {
      label: t("admin.payroll.attendance.daysWorked"),
      value: days(attendance.days_worked),
      valueClass: "text-green-700",
    },
    {
      label: t("admin.payroll.attendance.paidLeave"),
      value: days(attendance.leave_days),
      valueClass: "text-amber-700",
    },
    {
      label: t("admin.payroll.attendance.recordedAbsences"),
      value: days(attendance.recorded_absent_days),
      valueClass: "text-red-600",
    },
    {
      label: t("admin.payroll.attendance.noShows"),
      value: days(attendance.no_show_days),
      valueClass: "text-red-600",
    },
    {
      label: t("admin.payroll.attendance.pending"),
      value: days(attendance.pending_attendance_days),
      valueClass: "text-amber-700",
    },
    {
      label: t("admin.payroll.attendance.unpaidLeave"),
      value: days(attendance.unpaid_leave_days),
      valueClass: "text-neutral-700",
    },
    {
      label: t("admin.payroll.attendance.payableDays"),
      value: days(attendance.payable_days),
      valueClass: "text-primary-700",
    },
    {
      label: t("admin.payroll.attendance.overtime"),
      value: `${Number(attendance.overtime_hours ?? 0).toFixed(1)} h`,
      valueClass: "text-sky-700",
    },
  ];
});

watch([selectedEmployeeId, period], () => {
  previewRequest += 1;
  preview.value = null;
  previewError.value = "";
  loadingPreview.value = false;
});

onMounted(loadEmployees);

async function loadEmployees() {
  loadingEmployees.value = true;
  employeesError.value = "";
  try {
    const list = await employeesApiService.fetchAll();
    employees.value = list
      .filter((employee) => employee?.is_active !== false)
      .map((employee) => ({
        ...employee,
        name:
          employee.full_name ||
          employee.name ||
          [employee.first_name, employee.last_name].filter(Boolean).join(" "),
      }))
      .filter((employee) => employee.id && employee.name)
      .sort((left, right) => left.name.localeCompare(right.name));
  } catch (error) {
    employeesError.value = parseApiError(error);
  } finally {
    loadingEmployees.value = false;
  }
}

async function loadPreview() {
  if (!selectedEmployeeId.value || !period.value) return;

  const request = ++previewRequest;
  loadingPreview.value = true;
  previewError.value = "";
  preview.value = null;

  try {
    const result = await payrollApiService.preview({
      employee_id: Number(selectedEmployeeId.value),
      period: period.value,
    });
    if (request !== previewRequest) return;

    if (!result?.summary || !Array.isArray(result.lines)) {
      throw new Error(t("admin.payroll.simulator.invalidResponse"));
    }
    if (!result.attendance || typeof result.attendance !== "object") {
      throw new Error(t("admin.payroll.simulator.invalidResponse"));
    }

    const lines = result.lines.filter((line) => line.type !== "info" && line.kind !== "summary");
    const countryCode = normalizeCountryCode(result.country_code);
    const currency = result.currency;
    if (!currency) {
      throw new Error(t("admin.payroll.simulator.invalidResponse"));
    }
    const region = (countryCode || "FR").replace("MAR", "MA");
    const locale = `${uiLocale.value}-${region}`;

    preview.value = {
      summary: result.summary,
      attendance: result.attendance,
      currency,
      countryCode,
      locale,
      gains: lines
        .filter((line) => line.type === "earning")
        .map((line) => ({
          code: line.code,
          name: line.label || line.code,
          value: Number(line.amount) || 0,
        })),
      deductions: lines
        .filter((line) => line.type === "deduction")
        .map((line) => ({
          code: line.code,
          name: line.label || line.code,
          value: Number(line.amount) || 0,
          auto: line.kind === "tax_employee" || line.kind === "tax_employer",
        })),
    };
  } catch (error) {
    if (request === previewRequest) {
      previewError.value = parseApiError(error);
    }
  } finally {
    if (request === previewRequest) loadingPreview.value = false;
  }
}

function normalizeCountryCode(code) {
  if (!code) return null;
  return code === "CIV" ? "CI" : code;
}

function formatMoney(value, currency, locale) {
  const amount = Number(value) || 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}
</script>
