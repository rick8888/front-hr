<template>
  <div class="px-8 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">
          Training & Development
        </h1>
        <p class="text-sm text-neutral-600">
          Manage employee training programs
        </p>
      </div>
      <button @click="isAddModalOpen = true" class="btn-primary">
        + Create Program
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="card text-center">
        <p class="text-neutral-600 text-sm">Active Programs</p>
        <p class="text-3xl font-bold text-primary-600 mt-2">12</p>
      </div>
      <div class="card text-center">
        <p class="text-neutral-600 text-sm">Employees Enrolled</p>
        <p class="text-3xl font-bold text-success-600 mt-2">245</p>
      </div>
      <div class="card text-center">
        <p class="text-neutral-600 text-sm">Completed</p>
        <p class="text-3xl font-bold text-info-600 mt-2">189</p>
      </div>
      <div class="card text-center">
        <p class="text-neutral-600 text-sm">Completion Rate</p>
        <p class="text-3xl font-bold text-secondary-600 mt-2">77%</p>
      </div>
    </div>

    <!-- Programs Table -->
    <div class="card">
      <h2 class="text-lg font-bold text-neutral-900 mb-4">Training Programs</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-200">
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Program Name
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Category
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Duration
              </th>
              <th
                class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
              >
                Enrolled
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
              v-for="program in programs"
              :key="program.id"
              class="border-b border-neutral-100 hover:bg-neutral-50"
            >
              <td class="px-6 py-4 text-sm font-medium text-neutral-900">
                {{ program.name }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ program.category }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ program.duration }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-600">
                {{ program.enrolled }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'badge',
                    program.status === 'Active'
                      ? 'badge-success'
                      : 'badge-warning',
                  ]"
                >
                  {{ program.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="editProgram(program)"
                  class="text-primary-600 hover:text-primary-700 font-medium text-sm mr-3"
                >
                  Manage
                </button>
                <button
                  @click="
                    selectedProgram = program;
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
      :title="editingProgram ? 'Edit Program' : 'Create Program'"
      @confirm="saveProgram"
    >
      <div class="space-y-4">
        <input
          v-model="formData.name"
          type="text"
          placeholder="Program Name"
          class="input-base"
        />
        <select v-model="formData.category" class="input-base">
          <option value="">Select Category</option>
          <option value="Technical">Technical</option>
          <option value="Management">Management</option>
          <option value="Soft Skills">Soft Skills</option>
          <option value="Sales">Sales</option>
        </select>
        <input
          v-model="formData.duration"
          type="text"
          placeholder="Duration (e.g., 8 weeks)"
          class="input-base"
        />
        <input
          v-model.number="formData.enrolled"
          type="number"
          placeholder="Enrolled"
          class="input-base"
        />
        <select v-model="formData.status" class="input-base">
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </Modal>

    <!-- Delete Modal -->
    <Modal
      v-model="isDeleteModalOpen"
      title="Delete Program"
      @confirm="deleteProgram"
    >
      <p class="text-neutral-600">
        Are you sure you want to delete
        <strong>{{ selectedProgram?.name }}</strong
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
const editingProgram = ref(null);
const selectedProgram = ref(null);

const formData = ref({
  name: "",
  category: "",
  duration: "",
  enrolled: 0,
  status: "Active",
});

const programs = ref([
  {
    id: 1,
    name: "Leadership Skills",
    category: "Management",
    duration: "8 weeks",
    enrolled: 24,
    status: "Active",
  },
  {
    id: 2,
    name: "Advanced Excel",
    category: "Technical",
    duration: "4 weeks",
    enrolled: 56,
    status: "Active",
  },
  {
    id: 3,
    name: "Sales Techniques",
    category: "Sales",
    duration: "6 weeks",
    enrolled: 45,
    status: "Active",
  },
  {
    id: 4,
    name: "Python Programming",
    category: "Technical",
    duration: "12 weeks",
    enrolled: 32,
    status: "Completed",
  },
  {
    id: 5,
    name: "Customer Service",
    category: "Soft Skills",
    duration: "5 weeks",
    enrolled: 38,
    status: "Active",
  },
]);

const editProgram = (program) => {
  editingProgram.value = program;
  formData.value = { ...program };
  isAddModalOpen.value = true;
};

const saveProgram = () => {
  if (editingProgram.value) {
    const index = programs.value.findIndex(
      (p) => p.id === editingProgram.value.id
    );
    if (index !== -1) {
      programs.value[index] = { ...editingProgram.value, ...formData.value };
    }
  } else {
    programs.value.push({
      id: Math.max(...programs.value.map((p) => p.id)) + 1,
      ...formData.value,
    });
  }
  isAddModalOpen.value = false;
  editingProgram.value = null;
  formData.value = {
    name: "",
    category: "",
    duration: "",
    enrolled: 0,
    status: "Active",
  };
};

const deleteProgram = () => {
  programs.value = programs.value.filter(
    (p) => p.id !== selectedProgram.value.id
  );
  isDeleteModalOpen.value = false;
  selectedProgram.value = null;
};
</script>

<style scoped></style>
