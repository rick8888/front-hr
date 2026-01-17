<template>
  <div class="px-8 py-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-neutral-900 mb-1">Payroll</h1>
      <p class="text-sm text-neutral-600">All Employee Payroll</p>
    </div>

    <!-- Search and Export -->
    <div class="flex items-center gap-4 mb-6">
      <!-- Search Bar -->
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm bg-white"
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

      <!-- Export Button -->
      <button
        @click="exportPayroll"
        class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm whitespace-nowrap"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        Export
      </button>
    </div>

    <!-- Payroll Table -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200">
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Employee Name
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                CTC
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Salary Per Month
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Deduction
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr
              v-for="record in paginatedPayrolls"
              :key="record.id"
              class="hover:bg-neutral-50 transition-colors cursor-pointer"
              @click="$router.push(`/employees/${record.employeeId}`)"
            >
              <!-- Employee Name -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                    :style="{ backgroundColor: getAvatarColor(record.employee) }"
                  >
                    {{ getInitials(record.employee) }}
                  </div>
                  <span class="text-sm font-medium text-neutral-900">
                {{ record.employee }}
                  </span>
                </div>
              </td>

              <!-- CTC -->
              <td class="px-6 py-4 text-sm text-neutral-900">
                ${{ formatNumber(record.ctc) }}
              </td>

              <!-- Salary Per Month -->
              <td class="px-6 py-4 text-sm text-neutral-900">
                ${{ formatNumber(record.salaryPerMonth) }}
              </td>

              <!-- Deduction -->
              <td class="px-6 py-4 text-sm text-neutral-900">
                <span v-if="record.deduction > 0">
                  ${{ formatNumber(record.deduction) }}
                </span>
                <span v-else class="text-neutral-400">-</span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    record.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800',
                  ]"
                >
                  {{ record.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="px-6 py-4 border-t border-neutral-200 flex items-center justify-between"
      >
        <!-- Left Side - Showing and Records Info -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-neutral-600">Showing</span>
            <select
              v-model="itemsPerPage"
              @change="currentPage = 1"
              class="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
          <span class="text-sm text-neutral-600">
            Showing {{ startRecord }} to {{ endRecord }} out of
            {{ totalRecords }} records
          </span>
    </div>

        <!-- Right Side - Page Navigation -->
        <div class="flex items-center gap-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'p-2 rounded-lg border border-neutral-300 transition-colors',
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed text-neutral-400'
                : 'text-neutral-600 hover:bg-neutral-50 hover:border-primary-500',
            ]"
    >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
        />
            </svg>
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              currentPage === page
                ? 'bg-primary-600 text-white'
                : 'text-neutral-600 hover:bg-neutral-50 border border-neutral-300',
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'p-2 rounded-lg border border-neutral-300 transition-colors',
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed text-neutral-400'
                : 'text-neutral-600 hover:bg-neutral-50 hover:border-primary-500',
            ]"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Get initials from name
const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Get color for avatar based on name
const getAvatarColor = (name) => {
  if (!name) return "#6699FF";
  const colors = [
    "#6699FF",
    "#FF6699",
    "#66FF99",
    "#FF9966",
    "#9966FF",
    "#FFCC66",
    "#66CCFF",
    "#FF6666",
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Format number with commas
const formatNumber = (num) => {
  return Number(num).toLocaleString("en-US");
};

// Payroll data matching the image
const payrolls = ref([
  {
    id: 1,
    employee: "Leasie Watson",
    employeeId: 1,
    ctc: 45000,
    salaryPerMonth: 3500,
    deduction: 100,
    status: "Completed",
  },
  {
    id: 2,
    employee: "Darlene Robertson",
    employeeId: 2,
    ctc: 78000,
    salaryPerMonth: 6400,
    deduction: 250,
    status: "Completed",
  },
  {
    id: 3,
    employee: "Jacob Jones",
    employeeId: 3,
    ctc: 52000,
    salaryPerMonth: 4200,
    deduction: 150,
    status: "Pending",
  },
  {
    id: 4,
    employee: "Kathryn Murphy",
    employeeId: 4,
    ctc: 62000,
    salaryPerMonth: 5100,
    deduction: 0,
    status: "Completed",
  },
  {
    id: 5,
    employee: "Leslie Alexander",
    employeeId: 5,
    ctc: 86000,
    salaryPerMonth: 7100,
    deduction: 300,
    status: "Pending",
  },
  {
    id: 6,
    employee: "Ronald Richards",
    employeeId: 6,
    ctc: 48000,
    salaryPerMonth: 3900,
    deduction: 120,
    status: "Completed",
  },
  {
    id: 7,
    employee: "Guy Hawkins",
    employeeId: 7,
    ctc: 55000,
    salaryPerMonth: 4500,
    deduction: 180,
    status: "Pending",
  },
  {
    id: 8,
    employee: "Albert Flores",
    employeeId: 8,
    ctc: 59000,
    salaryPerMonth: 4800,
    deduction: 0,
    status: "Completed",
  },
  {
    id: 9,
    employee: "Savannah Nguyen",
    employeeId: 9,
    ctc: 74000,
    salaryPerMonth: 6100,
    deduction: 280,
    status: "Pending",
  },
  {
    id: 10,
    employee: "Marvin McKinney",
    employeeId: 10,
    ctc: 67000,
    salaryPerMonth: 5500,
    deduction: 200,
    status: "Completed",
  },
  {
    id: 11,
    employee: "Jerome Bell",
    employeeId: 11,
    ctc: 51000,
    salaryPerMonth: 4100,
    deduction: 140,
    status: "Completed",
  },
  {
    id: 12,
    employee: "Jenny Wilson",
    employeeId: 12,
    ctc: 72000,
    salaryPerMonth: 5900,
    deduction: 260,
    status: "Completed",
  },
]);

// Filter payrolls based on search
const filteredPayrolls = computed(() => {
  if (!searchQuery.value) {
    return payrolls.value;
  }

  const query = searchQuery.value.toLowerCase();
  return payrolls.value.filter(
    (payroll) =>
      payroll.employee.toLowerCase().includes(query) ||
      payroll.status.toLowerCase().includes(query)
  );
});

// Pagination calculations
const totalRecords = computed(() => filteredPayrolls.value.length);
const totalPages = computed(() =>
  Math.ceil(totalRecords.value / itemsPerPage.value)
);

const startRecord = computed(() => {
  if (totalRecords.value === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const endRecord = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return Math.min(end, totalRecords.value);
});

const paginatedPayrolls = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredPayrolls.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 4;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const exportPayroll = () => {
  // Export functionality - can be implemented later
  console.log("Exporting payroll data...");
  alert("Export functionality will be implemented");
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
