<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Reports & Analytics</h1>
        <p class="text-sm text-neutral-600">
          Detailed HR analytics and insights
        </p>
      </div>
      <button @click="isExportModalOpen = true" class="btn-primary">
        + Export Report
      </button>
    </div>

    <!-- Date Range Filter -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2"
            >From Date</label
          >
          <input type="date" class="input-base" />
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2"
            >To Date</label
          >
          <input type="date" class="input-base" />
        </div>
        <div class="flex items-end">
          <button class="btn-primary w-full">Generate</button>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="card">
        <h3 class="text-lg font-bold text-neutral-900 mb-4">
          Employee Distribution
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-neutral-600">Full-time</span>
            <div class="flex items-center gap-2">
              <div class="w-32 h-2 bg-neutral-200 rounded-full">
                <div class="w-3/4 h-full bg-success-500 rounded-full"></div>
              </div>
              <span class="font-medium text-neutral-900">75%</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-neutral-600">Part-time</span>
            <div class="flex items-center gap-2">
              <div class="w-32 h-2 bg-neutral-200 rounded-full">
                <div class="w-1/4 h-full bg-info-500 rounded-full"></div>
              </div>
              <span class="font-medium text-neutral-900">20%</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-neutral-600">Contract</span>
            <div class="flex items-center gap-2">
              <div class="w-32 h-2 bg-neutral-200 rounded-full">
                <div class="w-1/12 h-full bg-warning-500 rounded-full"></div>
              </div>
              <span class="font-medium text-neutral-900">5%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-bold text-neutral-900 mb-4">Turnover Rate</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-neutral-600">This Month</span>
              <span class="font-medium text-neutral-900">2.1%</span>
            </div>
            <div class="w-full h-2 bg-neutral-200 rounded-full">
              <div class="w-1/12 h-full bg-warning-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-neutral-600">This Quarter</span>
              <span class="font-medium text-neutral-900">5.8%</span>
            </div>
            <div class="w-full h-2 bg-neutral-200 rounded-full">
              <div class="w-1/6 h-full bg-warning-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-neutral-600">This Year</span>
              <span class="font-medium text-neutral-900">12.3%</span>
            </div>
            <div class="w-full h-2 bg-neutral-200 rounded-full">
              <div class="w-1/4 h-full bg-error-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Department Performance -->
    <div class="card">
      <h3 class="text-lg font-bold text-neutral-900 mb-4">
        Department Performance
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-200">
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Department
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Employees
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Avg Performance
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Attendance
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Budget Utilization
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="dept in departments"
              :key="dept.id"
              class="border-b border-neutral-100 hover:bg-neutral-50"
            >
              <td class="px-6 py-4 text-sm font-medium text-neutral-900">
                {{ dept.name }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ dept.employees }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'badge',
                    dept.performance >= 4 ? 'badge-success' : 'badge-warning',
                  ]"
                >
                  {{ dept.performance }}/5
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ dept.attendance }}%
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ dept.budget }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Export Report Modal -->
    <Modal
      v-model="isExportModalOpen"
      title="Export Report"
      @confirm="exportReport"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-2"
            >Report Type</label
          >
          <select v-model="exportForm.type" class="input-base">
            <option value="">Select Report Type</option>
            <option value="Employee Summary">Employee Summary</option>
            <option value="Payroll">Payroll</option>
            <option value="Attendance">Attendance</option>
            <option value="Performance">Performance</option>
            <option value="Department Analytics">Department Analytics</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-2"
            >Export Format</label
          >
          <select v-model="exportForm.format" class="input-base">
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
            <option value="Excel">Excel</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-2"
            >From Date</label
          >
          <input v-model="exportForm.fromDate" type="date" class="input-base" />
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-2"
            >To Date</label
          >
          <input v-model="exportForm.toDate" type="date" class="input-base" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../components/common/Modal.vue";

const isExportModalOpen = ref(false);

const exportForm = ref({
  type: "",
  format: "PDF",
  fromDate: "",
  toDate: "",
});

const departments = ref([
  {
    id: 1,
    name: "Sales",
    employees: 245,
    performance: 4.2,
    attendance: 96,
    budget: "85%",
  },
  {
    id: 2,
    name: "Engineering",
    employees: 189,
    performance: 4.5,
    attendance: 98,
    budget: "92%",
  },
  {
    id: 3,
    name: "HR",
    employees: 45,
    performance: 4.1,
    attendance: 97,
    budget: "78%",
  },
  {
    id: 4,
    name: "Finance",
    employees: 67,
    performance: 4.3,
    attendance: 99,
    budget: "88%",
  },
  {
    id: 5,
    name: "Marketing",
    employees: 78,
    performance: 4.0,
    attendance: 95,
    budget: "81%",
  },
]);

const exportReport = () => {
  if (
    exportForm.value.type &&
    exportForm.value.fromDate &&
    exportForm.value.toDate
  ) {
    // Simuler l'export du rapport
    console.log("Exporting report:", exportForm.value);

    // Réinitialiser le formulaire
    exportForm.value = {
      type: "",
      format: "PDF",
      fromDate: "",
      toDate: "",
    };
    isExportModalOpen.value = false;

    // En production, cela déclencher le téléchargement du fichier
    // window.open(`/api/reports/export?type=${exportForm.value.type}&format=${exportForm.value.format}...`)
  }
};
</script>

<style scoped></style>
