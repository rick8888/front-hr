<template>
  <div class="px-8 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Attendance</h1>
        <p class="text-sm text-neutral-600">
          Track employee attendance and working hours
        </p>
      </div>
      <button @click="isAddModalOpen = true" class="btn-primary">
        + Add Record
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card text-center">
        <p class="text-neutral-600 text-sm">Present Today</p>
        <p class="text-3xl font-bold text-success-600 mt-2">892</p>
        <p class="text-xs text-neutral-500 mt-1">+8% from yesterday</p>
      </div>
      <div class="card text-center">
        <p class="text-neutral-600 text-sm">On Leave</p>
        <p class="text-3xl font-bold text-warning-600 mt-2">245</p>
        <p class="text-xs text-neutral-500 mt-1">Approved absences</p>
      </div>
      <div class="card text-center">
        <p class="text-neutral-600 text-sm">Late Arrivals</p>
        <p class="text-3xl font-bold text-error-600 mt-2">47</p>
        <p class="text-xs text-neutral-500 mt-1">-5% from yesterday</p>
      </div>
    </div>

    <!-- Attendance Table -->
    <div class="card">
      <h2 class="text-lg font-bold text-neutral-900 mb-4">Daily Attendance</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-200">
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Employee
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Check-in
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Check-out
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Hours
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
              v-for="record in attendanceRecords"
              :key="record.id"
              class="border-b border-neutral-100 hover:bg-neutral-50"
            >
              <td class="px-6 py-4 text-sm font-medium text-neutral-900">
                {{ record.employee }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ record.checkIn }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ record.checkOut }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ record.hours }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="['badge', `badge-${getStatusClass(record.status)}`]"
                >
                  {{ record.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="editRecord(record)"
                  class="text-primary-600 hover:text-primary-700 font-medium text-sm mr-3"
                >
                  Edit
                </button>
                <button
                  @click="
                    selectedRecord = record;
                    isDeleteModalOpen = true;
                  "
                  class="text-error-600 hover:text-error-700 font-medium text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal
      v-model="isAddModalOpen"
      :title="editingRecord ? 'Edit Record' : 'Add Record'"
      @confirm="saveRecord"
    >
      <div class="space-y-4">
        <input
          v-model="formData.employee"
          type="text"
          placeholder="Employee Name"
          class="input-base"
        />
        <input
          v-model="formData.checkIn"
          type="time"
          placeholder="Check-in Time"
          class="input-base"
        />
        <input
          v-model="formData.checkOut"
          type="time"
          placeholder="Check-out Time"
          class="input-base"
        />
        <select v-model="formData.status" class="input-base">
          <option value="On Time">On Time</option>
          <option value="Late">Late</option>
          <option value="Leave">Leave</option>
        </select>
      </div>
    </Modal>

    <!-- Delete Modal -->
    <Modal
      v-model="isDeleteModalOpen"
      title="Delete Record"
      @confirm="deleteRecord"
    >
      <p class="text-neutral-600">
        Are you sure you want to delete the attendance record for
        <strong>{{ selectedRecord?.employee }}</strong
        >? This action cannot be undone.
      </p>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "../components/common/Modal.vue";

const isAddModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const editingRecord = ref(null);
const selectedRecord = ref(null);

const formData = ref({
  employee: "",
  checkIn: "",
  checkOut: "",
  status: "On Time",
});

const attendanceRecords = ref([
  {
    id: 1,
    employee: "John Doe",
    checkIn: "09:00",
    checkOut: "18:00",
    hours: "8h",
    status: "On Time",
  },
  {
    id: 2,
    employee: "Jane Smith",
    checkIn: "09:15",
    checkOut: "18:15",
    hours: "8h",
    status: "Late",
  },
  {
    id: 3,
    employee: "Mike Johnson",
    checkIn: "08:45",
    checkOut: "17:45",
    hours: "8h",
    status: "On Time",
  },
  {
    id: 4,
    employee: "Sarah Williams",
    checkIn: "-",
    checkOut: "-",
    hours: "-",
    status: "Leave",
  },
  {
    id: 5,
    employee: "Tom Brown",
    checkIn: "09:00",
    checkOut: "18:00",
    hours: "8h",
    status: "On Time",
  },
]);

const calculateHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return "-";
  const [hIn, mIn] = checkIn.split(":").map(Number);
  const [hOut, mOut] = checkOut.split(":").map(Number);
  const diff = hOut * 60 + mOut - (hIn * 60 + mIn);
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours}h${minutes > 0 ? `${minutes}m` : ""}`;
};

const editRecord = (record) => {
  editingRecord.value = record;
  formData.value = { ...record };
  isAddModalOpen.value = true;
};

const saveRecord = () => {
  if (editingRecord.value) {
    const index = attendanceRecords.value.findIndex(
      (r) => r.id === editingRecord.value.id
    );
    if (index !== -1) {
      attendanceRecords.value[index] = {
        ...editingRecord.value,
        ...formData.value,
        hours: calculateHours(formData.value.checkIn, formData.value.checkOut),
      };
    }
  } else {
    attendanceRecords.value.push({
      id: Math.max(...attendanceRecords.value.map((r) => r.id)) + 1,
      ...formData.value,
      hours: calculateHours(formData.value.checkIn, formData.value.checkOut),
    });
  }
  isAddModalOpen.value = false;
  editingRecord.value = null;
  formData.value = {
    employee: "",
    checkIn: "",
    checkOut: "",
    status: "On Time",
  };
};

const deleteRecord = () => {
  attendanceRecords.value = attendanceRecords.value.filter(
    (r) => r.id !== selectedRecord.value.id
  );
  isDeleteModalOpen.value = false;
  selectedRecord.value = null;
};

const getStatusClass = (status) => {
  const map = {
    "On Time": "success",
    Late: "warning",
    Leave: "primary",
  };
  return map[status] || "primary";
};
</script>

<style scoped></style>
