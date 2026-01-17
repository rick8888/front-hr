<template>
  <div class="px-8 py-6">
    <!-- Header with Actions -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Employees</h1>
        <p class="text-sm text-neutral-600">Manage your team members</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="exportEmployees"
          class="flex items-center gap-2 btn-outline"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Export
        </button>
        <button
          @click="importEmployees"
          class="flex items-center gap-2 btn-outline"
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
            ></path>
          </svg>
          Import
        </button>
        <router-link
          to="/employees/new"
          class="flex items-center gap-2 btn-primary"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Add Employee
        </router-link>
      </div>
    </div>

    <!-- Bulk Actions Bar (shown when items selected) -->
    <div
      v-if="selectedEmployees.length > 0"
      class="flex items-center justify-between p-4 mb-6 border rounded-lg bg-primary-50 border-primary-200"
    >
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-primary-700"
          >{{ selectedEmployees.length }} employee(s) selected</span
        >
        <button
          @click="clearSelection"
          class="text-sm underline text-primary-600 hover:text-primary-700"
        >
          Clear selection
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button @click="bulkSendEmail" class="text-sm btn-outline">
          Send Email
        </button>
        <button @click="bulkChangeStatus" class="text-sm btn-outline">
          Change Status
        </button>
        <button @click="bulkExport" class="text-sm btn-outline">
          Export Selected
        </button>
        <button @click="bulkDelete" class="text-sm btn-error">
          Delete Selected
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 card">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email..."
            class="pl-10 input-base"
          />
          <svg
            class="absolute w-4 h-4 left-3 top-3 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <select v-model="selectedDepartment" class="input-base">
          <option value="">All Departments</option>
          <option value="Sales">Sales</option>
          <option value="Engineering">Engineering</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>
        <select v-model="selectedStatus" class="input-base">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on-leave">On Leave</option>
        </select>
        <select v-model="selectedRole" class="input-base">
          <option value="">All Roles</option>
          <option value="Manager">Manager</option>
          <option value="Developer">Developer</option>
          <option value="Executive">Executive</option>
          <option value="Specialist">Specialist</option>
          <option value="Accountant">Accountant</option>
          <option value="Lead">Lead</option>
          <option value="Representative">Representative</option>
        </select>
        <button @click="clearFilters" class="btn-outline">Clear Filters</button>
      </div>
    </div>

    <!-- Employees Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-200">
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  @change="selectAllEmployees"
                  :checked="
                    selectedEmployees.length === filteredEmployees.length &&
                    filteredEmployees.length > 0
                  "
                  class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                Employee
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                Contact
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                Department
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-left text-neutral-600"
              >
                Join Date
              </th>
              <th
                class="px-6 py-3 text-sm font-medium text-right text-neutral-600"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="employee in paginatedEmployees"
              :key="employee.id"
              class="transition-colors border-b border-neutral-100 hover:bg-neutral-50"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :checked="selectedEmployees.includes(employee.id)"
                  @change="toggleEmployeeSelection(employee.id)"
                  class="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full bg-primary-200 text-primary-700"
                  >
                    {{ getInitials(employee.name) }}
                  </div>
                  <div>
                    <div class="font-medium text-neutral-900">
                      {{ employee.name }}
                    </div>
                    <div class="text-sm text-neutral-500">
                      ID: {{ employee.id.toString().padStart(3, "0") }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm">
                  <div class="text-neutral-900">{{ employee.email }}</div>
                  <div class="text-neutral-500">
                    {{ employee.phone || "No phone" }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ employee.department }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ employee.role }}
              </td>
              <td class="px-6 py-4">
                <span :class="['badge', getStatusBadgeClass(employee.status)]">
                  {{ getStatusLabel(employee.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ employee.joinDate || "N/A" }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="viewEmployee(employee)"
                    class="p-1 transition-colors text-neutral-400 hover:text-neutral-600"
                    title="View Details"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    @click="editEmployee(employee)"
                    class="p-1 transition-colors text-neutral-400 hover:text-primary-600"
                    title="Edit Employee"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    @click="downloadProfile(employee)"
                    class="p-1 transition-colors text-neutral-400 hover:text-neutral-600"
                    title="Download Profile"
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
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </button>
                  <div class="relative">
                    <button
                      @click="toggleActionMenu(employee.id)"
                      class="p-1 transition-colors text-neutral-400 hover:text-neutral-600"
                      title="More Actions"
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
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        ></path>
                      </svg>
                    </button>
                    <div
                      v-if="actionMenuOpen === employee.id"
                      class="absolute right-0 z-10 w-48 mt-1 bg-white border rounded-md shadow-lg border-neutral-200"
                    >
                      <div class="py-1">
                        <button
                          @click="viewAttendance(employee)"
                          class="block w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-100"
                        >
                          View Attendance
                        </button>
                        <button
                          @click="viewPayroll(employee)"
                          class="block w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-100"
                        >
                          View Payroll
                        </button>
                        <button
                          @click="viewPerformance(employee)"
                          class="block w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-100"
                        >
                          Performance Review
                        </button>
                        <div class="border-t border-neutral-100"></div>
                        <button
                          @click="duplicateEmployee(employee)"
                          class="block w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-100"
                        >
                          Duplicate
                        </button>
                        <button
                          @click="archiveEmployee(employee)"
                          class="block w-full px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-100"
                        >
                          Archive
                        </button>
                        <div class="border-t border-neutral-100"></div>
                        <button
                          @click="confirmDelete(employee)"
                          class="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="flex items-center justify-between pt-6 mt-6 border-t border-neutral-200"
      >
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-neutral-600">Rows per page:</span>
            <select
              v-model="itemsPerPage"
              @change="currentPage = 1"
              class="px-2 py-1 text-sm border rounded border-neutral-300"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
          <p class="text-sm text-neutral-600">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{
              Math.min(currentPage * itemsPerPage, filteredEmployees.length)
            }}
            of {{ filteredEmployees.length }} employees
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="px-3 py-1 text-sm text-neutral-600">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal
      v-model="isDeleteModalOpen"
      title="Delete Employee"
      @confirm="handleDeleteEmployee"
    >
      <p class="text-neutral-600">
        Are you sure you want to delete
        <strong>{{ selectedEmployee?.name }}</strong
        >? This action cannot be undone.
      </p>
    </Modal>

    <!-- Bulk Delete Confirmation Modal -->
    <Modal
      v-model="isBulkDeleteModalOpen"
      title="Delete Selected Employees"
      @confirm="handleBulkDelete"
    >
      <p class="text-neutral-600">
        Are you sure you want to delete
        <strong>{{ selectedEmployees.length }}</strong> selected employees? This
        action cannot be undone.
      </p>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Modal from "../components/common/Modal.vue";

const router = useRouter();

// Reactive data
const employees = ref([
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    department: "Sales",
    role: "Manager",
    status: "active",
    joinDate: "2020-03-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 234-5678",
    department: "Engineering",
    role: "Developer",
    status: "active",
    joinDate: "2021-06-20",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 (555) 345-6789",
    department: "Sales",
    role: "Executive",
    status: "active",
    joinDate: "2019-11-10",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 (555) 456-7890",
    department: "HR",
    role: "Specialist",
    status: "inactive",
    joinDate: "2022-01-05",
  },
  {
    id: 5,
    name: "Tom Brown",
    email: "tom@example.com",
    phone: "+1 (555) 567-8901",
    department: "Finance",
    role: "Accountant",
    status: "active",
    joinDate: "2020-08-12",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa@example.com",
    phone: "+1 (555) 678-9012",
    department: "Engineering",
    role: "Lead",
    status: "active",
    joinDate: "2018-04-18",
  },
  {
    id: 7,
    name: "David Martinez",
    email: "david@example.com",
    phone: "+1 (555) 789-0123",
    department: "Sales",
    role: "Representative",
    status: "active",
    joinDate: "2023-02-28",
  },
  {
    id: 8,
    name: "Emma Davis",
    email: "emma@example.com",
    phone: "+1 (555) 890-1234",
    department: "Marketing",
    role: "Manager",
    status: "active",
    joinDate: "2021-09-14",
  },
  {
    id: 9,
    name: "James Wilson",
    email: "james@example.com",
    phone: "+1 (555) 901-2345",
    department: "Engineering",
    role: "Developer",
    status: "active",
    joinDate: "2022-07-22",
  },
  {
    id: 10,
    name: "Patricia Garcia",
    email: "patricia@example.com",
    phone: "+1 (555) 012-3456",
    department: "HR",
    role: "Manager",
    status: "active",
    joinDate: "2017-12-03",
  },
  {
    id: 11,
    name: "Robert Taylor",
    email: "robert@example.com",
    phone: "+1 (555) 123-4567",
    department: "Finance",
    role: "Senior Accountant",
    status: "active",
    joinDate: "2019-05-16",
  },
  {
    id: 12,
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    phone: "+1 (555) 234-5678",
    department: "Marketing",
    role: "Specialist",
    status: "on-leave",
    joinDate: "2023-01-10",
  },
]);

// Search and filters
const searchQuery = ref("");
const selectedDepartment = ref("");
const selectedStatus = ref("");
const selectedRole = ref("");

// Selection
const selectedEmployees = ref([]);
const actionMenuOpen = ref(null);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Modals
const isDeleteModalOpen = ref(false);
const isBulkDeleteModalOpen = ref(false);
const selectedEmployee = ref(null);

// Computed properties
const filteredEmployees = computed(() => {
  let filtered = employees.value;

  if (searchQuery.value) {
    filtered = filtered.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedDepartment.value) {
    filtered = filtered.filter(
      (employee) => employee.department === selectedDepartment.value
    );
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(
      (employee) => employee.status === selectedStatus.value
    );
  }

  if (selectedRole.value) {
    filtered = filtered.filter(
      (employee) => employee.role === selectedRole.value
    );
  }

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredEmployees.value.length / itemsPerPage.value)
);

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredEmployees.value.slice(start, end);
});

// Helper functions
const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "active":
      return "badge-success";
    case "inactive":
      return "badge-warning";
    case "on-leave":
      return "badge-info";
    default:
      return "badge-neutral";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "on-leave":
      return "On Leave";
    default:
      return status;
  }
};

// Selection functions
const selectAllEmployees = (event) => {
  if (event.target.checked) {
    selectedEmployees.value = paginatedEmployees.value.map((emp) => emp.id);
  } else {
    selectedEmployees.value = [];
  }
};

const toggleEmployeeSelection = (employeeId) => {
  const index = selectedEmployees.value.indexOf(employeeId);
  if (index > -1) {
    selectedEmployees.value.splice(index, 1);
  } else {
    selectedEmployees.value.push(employeeId);
  }
};

const clearSelection = () => {
  selectedEmployees.value = [];
};

// Filter functions
const clearFilters = () => {
  searchQuery.value = "";
  selectedDepartment.value = "";
  selectedStatus.value = "";
  selectedRole.value = "";
  currentPage.value = 1;
};

// Action functions
const viewEmployee = (employee) => {
  router.push(`/employees/${employee.id}`);
};

const editEmployee = (employee) => {
  router.push(`/employees/edit/${employee.id}`);
};

const sendEmail = (employee) => {
  window.open(`mailto:${employee.email}`, "_blank");
};

const downloadProfile = (employee) => {
  // Simulate profile download
  console.log("Downloading profile for:", employee.name);
  // In real app, this would trigger a file download
};

const toggleActionMenu = (employeeId) => {
  actionMenuOpen.value =
    actionMenuOpen.value === employeeId ? null : employeeId;
};

// Close action menu when clicking outside
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative")) {
      actionMenuOpen.value = null;
    }
  });
});

// Additional action functions
const viewAttendance = (employee) => {
  router.push(`/attendance?employee=${employee.id}`);
};

const viewPayroll = (employee) => {
  router.push(`/payroll?employee=${employee.id}`);
};

const viewPerformance = (employee) => {
  router.push(`/performance/${employee.id}`);
};

const duplicateEmployee = (employee) => {
  const newEmployee = {
    ...employee,
    id: Math.max(...employees.value.map((e) => e.id)) + 1,
    name: `${employee.name} (Copy)`,
    email: `copy.${employee.email}`,
  };
  employees.value.push(newEmployee);
};

const archiveEmployee = (employee) => {
  employee.status = "inactive";
};

const confirmDelete = (employee) => {
  selectedEmployee.value = employee;
  isDeleteModalOpen.value = true;
  actionMenuOpen.value = null;
};

// Bulk actions
const bulkSendEmail = () => {
  const selectedEmails = employees.value
    .filter((emp) => selectedEmployees.value.includes(emp.id))
    .map((emp) => emp.email)
    .join(",");
  window.open(`mailto:${selectedEmails}`, "_blank");
};

const bulkChangeStatus = () => {
  // In real app, this would open a modal to select new status
  console.log("Bulk change status for:", selectedEmployees.value);
};

const bulkExport = () => {
  console.log("Exporting selected employees:", selectedEmployees.value);
};

const bulkDelete = () => {
  isBulkDeleteModalOpen.value = true;
};

// Header actions
const exportEmployees = () => {
  console.log("Exporting all employees");
  // In real app, this would trigger CSV/Excel download
};

const importEmployees = () => {
  console.log("Opening import modal");
  // In real app, this would open file upload modal
};

// Delete handlers
const handleDeleteEmployee = () => {
  employees.value = employees.value.filter(
    (e) => e.id !== selectedEmployee.value.id
  );
  isDeleteModalOpen.value = false;
  selectedEmployee.value = null;
};

const handleBulkDelete = () => {
  employees.value = employees.value.filter(
    (e) => !selectedEmployees.value.includes(e.id)
  );
  selectedEmployees.value = [];
  isBulkDeleteModalOpen.value = false;
};
</script>

<style scoped>
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-success {
  @apply bg-success-50 text-success-700;
}

.badge-warning {
  @apply bg-warning-50 text-warning-700;
}

.badge-info {
  @apply bg-info-50 text-info-700;
}

.badge-neutral {
  @apply bg-neutral-100 text-neutral-800;
}

.btn-error {
  @apply bg-error-600 hover:bg-error-700 text-white font-medium py-2 px-4 rounded-lg transition-colors;
}
</style>
