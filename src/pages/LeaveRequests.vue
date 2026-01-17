<template>
  <div class="px-8 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Leave Requests</h1>
        <p class="text-sm text-neutral-600">Manage employee leave requests</p>
      </div>
      <router-link to="/leave-requests/new" class="btn-primary"
        >+ New Request</router-link
      >
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="status in statuses"
        :key="status"
        @click="activeFilter = status"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          activeFilter === status
            ? 'bg-primary-500 text-white'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        ]"
      >
        {{ status }}
      </button>
    </div>

    <!-- Requests List -->
    <div class="space-y-4">
      <div v-for="request in filteredRequests" :key="request.id" class="card">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm"
              >
                {{ getInitials(request.employee) }}
              </div>
              <div>
                <p class="font-medium text-neutral-900">
                  {{ request.employee }}
                </p>
                <p class="text-sm text-neutral-600">{{ request.leaveType }}</p>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4 mt-3 text-sm">
              <div>
                <span class="text-neutral-600">From:</span>
                <p class="font-medium text-neutral-900">{{ request.from }}</p>
              </div>
              <div>
                <span class="text-neutral-600">To:</span>
                <p class="font-medium text-neutral-900">{{ request.to }}</p>
              </div>
              <div>
                <span class="text-neutral-600">Duration:</span>
                <p class="font-medium text-neutral-900">
                  {{ request.days }} days
                </p>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span :class="['badge', `badge-${getStatusClass(request.status)}`]">
              {{ request.status }}
            </span>
            <div v-if="request.status === 'Pending'" class="flex gap-2">
              <button
                @click="approveRequest(request)"
                class="btn-primary text-sm px-3 py-1"
              >
                Approve
              </button>
              <button
                @click="
                  selectedRequest = request;
                  isRejectModalOpen = true;
                "
                class="btn-outline text-sm px-3 py-1"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Request Modal -->
    <Modal
      v-model="isRequestModalOpen"
      title="Submit Leave Request"
      @confirm="submitRequest"
    >
      <div class="space-y-4">
        <input
          v-model="requestFormData.employee"
          type="text"
          placeholder="Employee Name"
          class="input-base"
        />
        <select v-model="requestFormData.leaveType" class="input-base">
          <option value="">Select Leave Type</option>
          <option value="Annual Leave">Annual Leave</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Unpaid Leave">Unpaid Leave</option>
          <option value="Maternity Leave">Maternity Leave</option>
        </select>
        <input v-model="requestFormData.from" type="date" class="input-base" />
        <input v-model="requestFormData.to" type="date" class="input-base" />
      </div>
    </Modal>

    <!-- Reject Modal -->
    <Modal
      v-model="isRejectModalOpen"
      title="Reject Request"
      @confirm="rejectRequest"
    >
      <p class="text-neutral-600 mb-4">
        Are you sure you want to reject
        <strong>{{ selectedRequest?.employee }}'s</strong> leave request from
        {{ selectedRequest?.from }} to {{ selectedRequest?.to }}?
      </p>
      <textarea
        v-model="rejectReason"
        placeholder="Reason for rejection (optional)"
        class="input-base"
        rows="3"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Modal from "../components/common/Modal.vue";

const activeFilter = ref("All");
const isRequestModalOpen = ref(false);
const isRejectModalOpen = ref(false);
const selectedRequest = ref(null);
const rejectReason = ref("");

const requestFormData = ref({ employee: "", leaveType: "", from: "", to: "" });

const statuses = ["All", "Pending", "Approved", "Rejected"];

const requests = ref([
  {
    id: 1,
    employee: "John Doe",
    leaveType: "Annual Leave",
    from: "2024-12-15",
    to: "2024-12-20",
    days: 5,
    status: "Pending",
  },
  {
    id: 2,
    employee: "Jane Smith",
    leaveType: "Sick Leave",
    from: "2024-12-09",
    to: "2024-12-10",
    days: 1,
    status: "Approved",
  },
  {
    id: 3,
    employee: "Mike Johnson",
    leaveType: "Annual Leave",
    from: "2024-12-25",
    to: "2024-12-31",
    days: 6,
    status: "Pending",
  },
  {
    id: 4,
    employee: "Sarah Williams",
    leaveType: "Unpaid Leave",
    from: "2024-12-01",
    to: "2024-12-05",
    days: 4,
    status: "Rejected",
  },
  {
    id: 5,
    employee: "Tom Brown",
    leaveType: "Maternity Leave",
    from: "2025-01-01",
    to: "2025-03-31",
    days: 89,
    status: "Approved",
  },
]);

const filteredRequests = computed(() => {
  if (activeFilter.value === "All") return requests.value;
  return requests.value.filter((r) => r.status === activeFilter.value);
});

const calculateDays = (from, to) => {
  const start = new Date(from);
  const end = new Date(to);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const submitRequest = () => {
  if (
    requestFormData.value.employee &&
    requestFormData.value.leaveType &&
    requestFormData.value.from &&
    requestFormData.value.to
  ) {
    requests.value.push({
      id: Math.max(...requests.value.map((r) => r.id)) + 1,
      ...requestFormData.value,
      days: calculateDays(requestFormData.value.from, requestFormData.value.to),
      status: "Pending",
    });
    isRequestModalOpen.value = false;
    requestFormData.value = { employee: "", leaveType: "", from: "", to: "" };
  }
};

const approveRequest = (request) => {
  const index = requests.value.findIndex((r) => r.id === request.id);
  if (index !== -1) {
    requests.value[index].status = "Approved";
  }
};

const rejectRequest = () => {
  const index = requests.value.findIndex(
    (r) => r.id === selectedRequest.value.id
  );
  if (index !== -1) {
    requests.value[index].status = "Rejected";
  }
  isRejectModalOpen.value = false;
  selectedRequest.value = null;
  rejectReason.value = "";
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getStatusClass = (status) => {
  const map = { Pending: "warning", Approved: "success", Rejected: "error" };
  return map[status] || "primary";
};
</script>

<style scoped></style>
