<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.payroll.modifiers.title") }}</h1>
        <p class="text-sm text-neutral-600 mt-1">
          {{ t("admin.payroll.modifiers.subtitle") }}
        </p>
      </div>
      <div class="flex flex-col items-end gap-3">
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
          <span class="text-neutral-800 font-medium">{{ t("admin.payroll.modifiers.breadcrumb") }}</span>
        </nav>
        <button type="button" class="btn-secondary inline-flex items-center gap-2" @click="openAddModal">
          <span class="text-lg leading-none">+</span>
          {{ t("admin.payroll.modifiers.add") }}
        </button>
      </div>
    </div>

    <div
      v-if="storeError"
      class="mb-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ storeError }}
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <div
        class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-sm text-neutral-500">{{ t("admin.payroll.modifiers.kpi.total") }}</p>
          <div v-if="loading" class="mt-1 flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ stats.total }}</p>
        </div>
      </div>
      <div
        class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-error-50 text-error-600 flex items-center justify-center text-xl font-bold"
        >
          −
        </div>
        <div class="min-w-0">
          <p class="text-sm text-neutral-500">{{ t("admin.payroll.modifiers.kpi.deductions") }}</p>
          <div v-if="loading" class="mt-1 flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-error-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ stats.deductions }}</p>
        </div>
      </div>
      <div
        class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-success-50 text-success-600 flex items-center justify-center text-xl font-bold"
        >
          +
        </div>
        <div class="min-w-0">
          <p class="text-sm text-neutral-500">{{ t("admin.payroll.modifiers.kpi.earnings") }}</p>
          <div v-if="loading" class="mt-1 flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-success-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ stats.earnings }}</p>
        </div>
      </div>
      <div
        class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-sm text-neutral-500 leading-tight">
            {{ t("admin.payroll.modifiers.kpi.allEmployees") }}
          </p>
          <div v-if="loading" class="mt-1 flex h-8 items-center" aria-busy="true">
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
              aria-hidden="true"
            />
          </div>
          <p v-else class="text-2xl font-bold text-neutral-900">{{ stats.allEmployees }}</p>
        </div>
      </div>
    </div>

    <!-- Tableau -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-neutral-200">
        <h2 class="text-lg font-semibold text-neutral-900">{{ t("admin.payroll.modifiers.tableTitle") }}</h2>
      </div>
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-neutral-200"
      >
        <div class="flex items-center gap-2 text-sm text-neutral-600">
          <span>{{ t("common.show") }}</span>
          <select
            v-model.number="itemsPerPage"
            class="input-base py-1.5 w-auto text-sm"
            @change="currentPage = 1"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>{{ t("common.entries") }}</span>
        </div>
        <div class="relative w-full sm:max-w-xs">
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="t('admin.payroll.modifiers.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <svg
            class="absolute left-3 top-3 w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div class="overflow-x-auto relative" :class="{ 'min-h-[200px]': loading }">
        <table class="w-full text-sm min-w-[900px]">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-left text-neutral-600">
              <th class="px-4 py-3 font-medium w-14">{{ t("admin.payroll.col.id") }}</th>
              <th class="px-4 py-3 font-medium min-w-[180px]">{{ t("common.name") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("common.code") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("common.type") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.modifiers.col.applicability") }}</th>
              <th class="px-4 py-3 font-medium min-w-[200px]">{{ t("common.employee") }}</th>
              <th class="px-4 py-3 font-medium">{{ t("admin.payroll.modifiers.col.amount") }}</th>
              <th class="px-4 py-3 font-medium w-24 text-right">{{ t("common.actions") }}</th>
            </tr>
          </thead>
          <tbody v-if="loading" class="divide-y divide-neutral-100" aria-busy="true">
            <tr v-for="n in 6" :key="`sk-${n}`">
              <td class="px-4 py-4">
                <div class="h-4 w-6 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-4 w-36 animate-pulse rounded bg-neutral-100" />
                <div class="mt-2 h-3 w-24 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-4 w-20 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-5 w-16 animate-pulse rounded-full bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-5 w-24 animate-pulse rounded-full bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-4 w-28 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="h-4 w-16 animate-pulse rounded bg-neutral-100" />
              </td>
              <td class="px-4 py-4">
                <div class="ml-auto h-8 w-8 animate-pulse rounded bg-neutral-100" />
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="filteredRows.length === 0">
            <tr>
              <td
                colspan="8"
                class="px-6 py-10 text-center text-sm text-neutral-500"
              >
                {{
                  searchQuery.trim()
                    ? t("admin.payroll.modifiers.emptySearch")
                    : t("admin.payroll.modifiers.empty")
                }}
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y divide-neutral-100">
            <tr
              v-for="row in paginatedRows"
              :key="row.id"
              class="hover:bg-neutral-50/80 transition-colors"
            >
              <td class="px-4 py-4 text-neutral-700">{{ row.id }}</td>
              <td class="px-4 py-4">
                <div class="font-medium text-neutral-900">{{ row.name }}</div>
                <div class="text-xs text-neutral-500 mt-0.5">
                  <span v-if="row.duration === 'permanent'">{{ t("admin.payroll.modifiers.permanent") }}</span>
                  <span v-else>
                    {{ t("admin.payroll.modifiers.temporary") }}
                    <template v-if="row.validTo">
                      · {{ t("admin.payroll.modifiers.until", { date: formatDate(row.validTo) }) }}
                    </template>
                  </span>
                </div>
              </td>
              <td class="px-4 py-4">
                <span
                  class="inline-flex font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700"
                >
                  {{ row.code }}
                </span>
              </td>
              <td class="px-4 py-4">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    row.type === 'earning'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ row.type === "earning" ? t("admin.payroll.earning") : t("admin.payroll.deduction") }}
                </span>
              </td>
              <td class="px-4 py-4">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    row.applicability === 'all'
                      ? 'bg-secondary-100 text-secondary-800'
                      : 'bg-primary-100 text-primary-800',
                  ]"
                >
                  {{
                    row.applicability === "all"
                      ? t("admin.payroll.modifiers.allEmployees")
                      : t("admin.payroll.modifiers.individual")
                  }}
                </span>
              </td>
              <td class="px-4 py-4">
                <template v-if="row.applicability === 'all'">
                  <span class="text-neutral-400">—</span>
                </template>
                <template v-else-if="row.employee">
                  <div class="flex items-center gap-2">
                    <EmployeeAvatar
                      :name="row.employee.name"
                      :avatar-url="row.employee.avatarUrl"
                      size-class="h-9 w-9 text-xs font-semibold"
                      fallback-class="text-white"
                      :style="{ backgroundColor: avatarColor(row.employee.name) }"
                    />
                    <div class="min-w-0">
                      <p class="font-medium text-neutral-900 truncate">
                        {{ row.employee.name }}
                      </p>
                      <p class="text-xs text-neutral-500">{{ row.employee.empCode }}</p>
                    </div>
                  </div>
                </template>
                <span v-else class="text-neutral-400">—</span>
              </td>
              <td class="px-4 py-4 font-medium text-neutral-900 whitespace-nowrap">
                {{ formatAmount(row) }}
              </td>
              <td class="px-4 py-4 text-right">
                <TableRowMenu
                  :open="openMenuId === row.id"
                  :aria-label="t('common.actions')"
                  width-class="w-36"
                  @toggle="toggleMenu(row.id)"
                  @close="openMenuId = null"
                >
                  <button
                    type="button"
                    role="menuitem"
                    class="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                    @click="openEdit(row)"
                  >
                    {{ t("common.edit") }}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    class="w-full px-3 py-2 text-left text-sm text-error-600 hover:bg-error-50"
                    @click="removeRow(row)"
                  >
                    {{ t("common.delete") }}
                  </button>
                </TableRowMenu>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="loading"
          class="pointer-events-none absolute inset-x-0 top-12 bottom-0 flex items-center justify-center bg-white/40"
          aria-hidden="true"
        >
          <span
            class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-500"
          />
        </div>
      </div>

      <div
        v-if="!loading && filteredRows.length > 0"
        class="px-6 py-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-600"
      >
        <span>{{
          t("common.rangeOf", {
            start: rangeStart,
            end: rangeEnd,
            total: filteredRows.length,
          })
        }}</span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-neutral-300 disabled:opacity-40"
            :disabled="currentPage <= 1"
            @click="currentPage--"
          >
            {{ t("common.previous") }}
          </button>
          <span class="text-neutral-500">{{
            t("common.pageOf", { current: currentPage, total: totalPages })
          }}</span>
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg border border-neutral-300 disabled:opacity-40"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            {{ t("common.next") }}
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-center justify-between px-5 py-3 border-b border-neutral-200">
            <h2 class="text-lg font-bold text-neutral-900">
              {{ editingId ? t("admin.payroll.modifiers.modal.edit") : t("admin.payroll.modifiers.modal.add") }}
            </h2>
            <button
              type="button"
              class="text-neutral-500 hover:text-neutral-700 text-2xl leading-none"
              :aria-label="t('common.close')"
              @click="closeModal"
            >
              ×
            </button>
          </div>
          <form class="px-5 py-4" @submit.prevent="submitForm">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("common.name") }}</label>
                <input v-model.trim="form.name" required class="input-base text-sm" type="text" />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("common.code") }}</label>
                <input
                  v-model.trim="form.code"
                  required
                  class="input-base text-sm font-mono uppercase"
                  type="text"
                  :placeholder="t('admin.payroll.modifiers.codePlaceholder')"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("common.type") }}</label>
                <select v-model="form.type" required class="input-base text-sm">
                  <option value="earning">{{ t("admin.payroll.earning") }}</option>
                  <option value="deduction">{{ t("admin.payroll.deduction") }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">
                  {{ t("admin.payroll.modifiers.col.applicability") }}
                </label>
                <select v-model="form.applicability" required class="input-base text-sm">
                  <option value="all">{{ t("admin.payroll.modifiers.allEmployees") }}</option>
                  <option value="individual">{{ t("admin.payroll.modifiers.individual") }}</option>
                </select>
              </div>

              <div
                v-if="form.applicability === 'individual'"
                class="sm:col-span-2"
              >
                <label class="block text-sm font-medium text-neutral-700 mb-1">{{ t("common.employee") }}</label>
                <select v-model="form.employeeId" required class="input-base text-sm">
                  <option disabled value="">{{ t("admin.payroll.modifiers.form.selectEmployee") }}</option>
                  <option v-for="e in employeeOptions" :key="e.id" :value="String(e.id)">
                    {{ e.name }} ({{ e.empCode }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">
                  {{ t("admin.payroll.modifiers.form.mode") }}
                </label>
                <select v-model="form.valueKind" class="input-base text-sm">
                  <option value="amount">{{ t("admin.payroll.modifiers.form.amount") }}</option>
                  <option value="percent">{{ t("admin.payroll.modifiers.form.percent") }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">
                  {{ t("admin.payroll.modifiers.form.value") }}
                </label>
                <input
                  v-model.number="form.value"
                  required
                  class="input-base text-sm"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>

              <div
                class="sm:col-span-2 grid grid-cols-1 gap-x-4 gap-y-3"
                :class="form.duration === 'temporary' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'"
              >
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-1">
                    {{ t("admin.payroll.modifiers.form.duration") }}
                  </label>
                  <select v-model="form.duration" class="input-base text-sm">
                    <option value="permanent">{{ t("admin.payroll.modifiers.permanent") }}</option>
                    <option value="temporary">{{ t("admin.payroll.modifiers.form.temporaryPeriod") }}</option>
                  </select>
                </div>
                <template v-if="form.duration === 'temporary'">
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-1">
                      {{ t("admin.payroll.modifiers.form.start") }}
                    </label>
                    <input v-model="form.validFrom" type="date" class="input-base text-sm" required />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-1">
                      {{ t("admin.payroll.modifiers.form.end") }}
                    </label>
                    <input v-model="form.validTo" type="date" class="input-base text-sm" required />
                  </div>
                </template>
              </div>
            </div>

            <p v-if="formError" class="text-sm text-error-600 mt-3">{{ formError }}</p>
            <div class="flex justify-end gap-3 pt-3 mt-4 border-t border-neutral-200">
              <button type="button" class="btn-outline" @click="closeModal">{{ t("common.cancel") }}</button>
              <button type="submit" class="btn-secondary" :disabled="saving">
                {{ saving ? t("common.saving") : t("common.save") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "../../i18n/index.js";
import TableRowMenu from "../../components/common/TableRowMenu.vue";
import EmployeeAvatar from "../../components/common/EmployeeAvatar.vue";
import { usePayrollModifierStore } from "./stores/payroll-modifier.store.js";
import { avatarColor } from "./utils/payroll-http.js";

const { t } = useI18n();

const store = usePayrollModifierStore();
const {
  items: modifiers,
  employeeOptions,
  loading,
  saving,
  error: storeError,
  stats,
} = storeToRefs(store);

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const openMenuId = ref(null);
const modalOpen = ref(false);
const editingId = ref(null);
const formError = ref("");

const form = ref({
  name: "",
  code: "",
  type: "deduction",
  applicability: "all",
  employeeId: "",
  valueKind: "amount",
  value: 0,
  duration: "permanent",
  validFrom: "",
  validTo: "",
  target: "NET",
});

watch(searchQuery, () => {
  currentPage.value = 1;
});

function employeeById(id) {
  const n = typeof id === "string" ? Number(id) : id;
  return employeeOptions.value.find((e) => e.id === n) || null;
}

function formatAmount(row) {
  if (row.valueKind === "percent") {
    return `${Number(row.value).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %`;
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(row.value);
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("fr-FR");
}

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const sorted = [...modifiers.value].sort((a, b) => a.id - b.id);
  if (!q) return sorted;
  return sorted.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      (m.employee && m.employee.name.toLowerCase().includes(q)) ||
      (m.employee && m.employee.empCode.toLowerCase().includes(q))
  );
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / itemsPerPage.value))
);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredRows.value.slice(start, start + itemsPerPage.value);
});

const rangeStart = computed(() => {
  if (!filteredRows.value.length) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const rangeEnd = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, filteredRows.value.length);
});

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id;
}

function closeMenus() {
  openMenuId.value = null;
}

function openAddModal() {
  editingId.value = null;
  formError.value = "";
  form.value = {
    name: "",
    code: "",
    type: "deduction",
    applicability: "all",
    employeeId: "",
    valueKind: "amount",
    value: 0,
    duration: "permanent",
    validFrom: "",
    validTo: "",
    target: "NET",
  };
  modalOpen.value = true;
}

function openEdit(row) {
  closeMenus();
  editingId.value = row.id;
  formError.value = "";
  form.value = {
    name: row.name,
    code: row.code,
    type: row.type,
    applicability: row.applicability,
    employeeId: row.employee ? String(row.employee.id) : "",
    valueKind: row.valueKind,
    value: row.value,
    duration: row.duration,
    validFrom: row.validFrom || "",
    validTo: row.validTo || "",
    target: row.target || "NET",
  };
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  editingId.value = null;
  formError.value = "";
}

async function submitForm() {
  formError.value = "";
  if (form.value.applicability === "individual" && !form.value.employeeId) {
    formError.value = t("admin.payroll.modifiers.error.selectEmployee");
    return;
  }
  if (form.value.duration === "temporary") {
    if (!form.value.validFrom || !form.value.validTo) {
      formError.value = t("admin.payroll.modifiers.error.datesRequired");
      return;
    }
    if (form.value.validFrom > form.value.validTo) {
      formError.value = t("admin.payroll.modifiers.error.dateOrder");
      return;
    }
  }

  const code = form.value.code.replace(/\s+/g, "_").toUpperCase();
  const duplicate = modifiers.value.some(
    (m) => m.code === code && m.id !== editingId.value
  );
  if (duplicate) {
    formError.value = t("admin.payroll.modifiers.error.codeUsed");
    return;
  }

  try {
    if (editingId.value) {
      await store.update(editingId.value, form.value);
    } else {
      await store.create(form.value);
    }
    closeModal();
  } catch {
    formError.value = storeError.value || t("admin.payroll.modifiers.error.save");
  }
}

async function removeRow(row) {
  closeMenus();
  if (!confirm(t("admin.payroll.modifiers.deleteConfirm", { name: row.name }))) return;
  try {
    await store.remove(row.id);
  } catch {
    alert(storeError.value || t("admin.payroll.modifiers.error.delete"));
  }
}

function onDocClick() {
  closeMenus();
}

onMounted(async () => {
  document.addEventListener("click", onDocClick);
  await store.fetchAll();
});
onUnmounted(() => document.removeEventListener("click", onDocClick));
</script>
