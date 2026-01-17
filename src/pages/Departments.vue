<template>
  <div class="px-8 py-6">
    <!-- Header with Search and Add Button -->
    <div class="flex items-center justify-between mb-8 gap-4">
      <!-- Search Bar -->
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm bg-white"
        />
        <svg
          class="absolute left-3 top-3.5 w-4 h-4 text-neutral-400"
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

      <!-- Add New Department Button -->
      <button
        @click="openAddDepartmentModal"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add New Department
      </button>
    </div>

    <!-- Departments Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="department in filteredDepartments"
        :key="department.id"
        class="bg-white rounded-xl border border-neutral-200 shadow-sm p-6"
      >
        <!-- Department Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-neutral-900 mb-1">
              {{ department.name }}
            </h3>
            <p class="text-sm text-neutral-600">
              {{ department.memberCount }} Members
            </p>
          </div>
          <router-link
            :to="`/departments/${department.id}`"
            class="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
          >
            View All
          </router-link>
        </div>

        <!-- Members List -->
        <div class="space-y-3">
          <div
            v-for="member in department.members"
            :key="member.id"
            class="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer group"
            @click="$router.push(`/employees/${member.id}`)"
          >
            <!-- Avatar -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
              :style="{ backgroundColor: getAvatarColor(member.name) }"
            >
              {{ getInitials(member.name) }}
            </div>

            <!-- Member Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-neutral-900 truncate">
                {{ member.name }}
              </p>
              <p class="text-xs text-neutral-600 truncate">{{ member.role }}</p>
            </div>

            <!-- Arrow Icon -->
            <svg
              class="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors flex-shrink-0"
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
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredDepartments.length === 0" class="text-center py-12">
      <p class="text-neutral-500 text-sm">No departments found</p>
    </div>

    <!-- Add Department Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white">
          <h2 class="text-lg font-bold text-neutral-900">Add New Department</h2>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Department Name <span class="text-error-600">*</span>
            </label>
            <input
              v-model="newDepartment.name"
              type="text"
              placeholder="e.g., Engineering Department"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
            <p v-if="errors.name" class="text-xs text-error-600 mt-1">
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Initial Members Count
            </label>
            <input
              v-model.number="newDepartment.memberCount"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
            <p class="text-xs text-neutral-500 mt-1">
              You can add members later
            </p>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="addDepartment"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Department
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const isModalOpen = ref(false);
const errors = ref({});

const newDepartment = ref({
  name: "",
  memberCount: 0,
});

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

// Departments data matching the image
const departments = ref([
  {
    id: 1,
    name: "Design Department",
    memberCount: 20,
    members: [
      {
        id: 1,
        name: "Dianne Russell",
        role: "Lead UI/UX Designer",
      },
      {
        id: 2,
        name: "Arlene McCoy",
        role: "Sr. UI/UX Designer",
      },
      {
        id: 3,
        name: "Cody Fisher",
        role: "Sr. UI/UX Designer",
      },
      {
        id: 4,
        name: "Theresa Webb",
        role: "UI/UX Designer",
      },
      {
        id: 5,
        name: "Ronald Richards",
        role: "UI/UX Designer",
      },
    ],
  },
  {
    id: 2,
    name: "Sales Department",
    memberCount: 14,
    members: [
      {
        id: 6,
        name: "Darrell Steward",
        role: "Sr. Sales Manager",
      },
      {
        id: 7,
        name: "Kristin Watson",
        role: "Sr. Sales Manager",
      },
      {
        id: 8,
        name: "Courtney Henry",
        role: "BDM",
      },
      {
        id: 9,
        name: "Kathryn Murphy",
        role: "BDE",
      },
      {
        id: 10,
        name: "Albert Flores",
        role: "Sales",
      },
    ],
  },
  {
    id: 3,
    name: "Project Manager Department",
    memberCount: 18,
    members: [
      {
        id: 11,
        name: "Leslie Alexander",
        role: "Sr. Project Manager",
      },
      {
        id: 12,
        name: "Ronald Richards",
        role: "Sr. Project Manager",
      },
      {
        id: 13,
        name: "Savannah Nguyen",
        role: "Project Manager",
      },
      {
        id: 14,
        name: "Eleanor Pena",
        role: "Project Manager",
      },
      {
        id: 15,
        name: "Esther Howard",
        role: "Project Manager",
      },
    ],
  },
  {
    id: 4,
    name: "Marketing Department",
    memberCount: 10,
    members: [
      {
        id: 16,
        name: "Wade Warren",
        role: "Sr. Marketing Manager",
  },
  {
        id: 17,
        name: "Brooklyn Simmons",
        role: "Sr. Marketing Manager",
      },
      {
        id: 18,
        name: "Kristin Watson",
        role: "Marketing Coordinator",
  },
  {
        id: 19,
        name: "Jacob Jones",
        role: "Marketing Coordinator",
      },
      {
        id: 20,
        name: "Cody Fisher",
        role: "Marketing",
      },
    ],
  },
]);

// Filter departments based on search
const filteredDepartments = computed(() => {
  if (!searchQuery.value) {
    return departments.value;
  }

  const query = searchQuery.value.toLowerCase();
  return departments.value
    .map((dept) => {
      const matchingMembers = dept.members.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          dept.name.toLowerCase().includes(query)
      );

      if (matchingMembers.length > 0 || dept.name.toLowerCase().includes(query)) {
        return {
          ...dept,
          members: dept.name.toLowerCase().includes(query)
            ? dept.members
            : matchingMembers,
        };
      }
      return null;
    })
    .filter((dept) => dept !== null);
});

const openAddDepartmentModal = () => {
  isModalOpen.value = true;
  newDepartment.value = {
    name: "",
    memberCount: 0,
  };
  errors.value = {};
};

const closeModal = () => {
  isModalOpen.value = false;
  newDepartment.value = {
    name: "",
    memberCount: 0,
  };
  errors.value = {};
};

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!newDepartment.value.name || newDepartment.value.name.trim() === "") {
    errors.value.name = "Department name is required";
    isValid = false;
  }

  if (newDepartment.value.memberCount < 0) {
    errors.value.memberCount = "Member count cannot be negative";
    isValid = false;
  }

  return isValid;
};

const addDepartment = () => {
  if (!validateForm()) {
    return;
  }

  const newId =
    departments.value.length > 0
      ? Math.max(...departments.value.map((d) => d.id)) + 1
      : 1;

  departments.value.push({
    id: newId,
    name: newDepartment.value.name.trim(),
    memberCount: newDepartment.value.memberCount || 0,
    members: [],
  });

  closeModal();
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
