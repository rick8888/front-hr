<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <button
          @click="$router.back()"
          class="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-2 transition-colors"
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
          {{ t("common.back") }}
        </button>
        <h1 class="text-2xl font-bold text-neutral-900">{{ department?.name }}</h1>
        <p class="text-sm text-neutral-600">
          {{ t("admin.org.departments.members", { count: department?.memberCount ?? 0 }) }}
        </p>
      </div>
    </div>

    <!-- Members Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="member in department?.members"
        :key="member.id"
        class="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
        @click="$router.push(`/employees/${member.id}`)"
      >
        <div class="flex items-center gap-3">
          <!-- Avatar -->
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
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
            class="w-4 h-4 text-neutral-400 flex-shrink-0"
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
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "../i18n/index.js";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

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

// Departments data (should match Departments.vue)
const departmentsData = [
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
];

const department = computed(() => {
  const id = parseInt(route.params.id);
  return departmentsData.find((d) => d.id === id);
});

onMounted(() => {
  if (!department.value) {
    // Redirect to departments list if not found
    router.push("/organization/departments");
  }
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

