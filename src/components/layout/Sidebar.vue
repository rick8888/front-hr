<template>
  <aside class="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen">
    <!-- Logo -->
    <div class="h-16 flex items-center px-6 border-b border-neutral-200">
      <div class="flex items-center gap-2">
        <div
          class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg"
        >
          HR
        </div>
        <span class="font-bold text-lg text-neutral-900">HRMS</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-4 py-6">
      <ul class="space-y-2">
        <li v-for="item in navigationItems" :key="item.id">
          <RouterLink
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-200',
              isActive(item.path)
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100',
            ]"
          >
            <span class="text-xl">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Theme Toggle -->
    <div class="border-t border-neutral-200 px-4 py-4">
      <div class="flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
        <button
          :class="[
            'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
            theme === 'light'
              ? 'bg-primary-500 text-white'
              : 'text-neutral-600 hover:text-neutral-900',
          ]"
          @click="theme = 'light'"
      >
          Light
        </button>
        <button
          :class="[
            'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
            theme === 'dark'
              ? 'bg-primary-500 text-white'
              : 'text-neutral-600 hover:text-neutral-900',
          ]"
          @click="theme = 'dark'"
        >
          Dark
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const route = useRoute();
const authStore = useAuthStore();
const theme = ref("light");

// Admin navigation items
const adminNavigationItems = [
  { id: 1, label: "Dashboard", path: "/", icon: "📊" },
  { id: 2, label: "All Employees", path: "/employees", icon: "👥" },
  { id: 3, label: "All Departments", path: "/departments", icon: "🏢" },
  { id: 4, label: "Attendance", path: "/attendance", icon: "📋" },
  { id: 5, label: "Payroll", path: "/payroll", icon: "💰" },
  { id: 6, label: "Jobs", path: "/recruitment", icon: "💼" },
  { id: 7, label: "Candidates", path: "/recruitment", icon: "👤" },
  { id: 8, label: "Leaves", path: "/leave-requests", icon: "🏖️" },
  { id: 9, label: "Holidays", path: "/holidays", icon: "🎉" },
  { id: 10, label: "Settings", path: "/settings", icon: "⚙️" },
];

// Employee navigation items (limited access)
const employeeNavigationItems = [
  { id: 1, label: "Dashboard", path: "/", icon: "📊" },
  { id: 2, label: "My Profile", path: "/profile", icon: "👤" },
  { id: 3, label: "Attendance", path: "/attendance", icon: "📋" },
  { id: 4, label: "Leave Requests", path: "/leave-requests", icon: "🏖️" },
  { id: 5, label: "Payslip", path: "/payslip", icon: "💰" },
];

const navigationItems = computed(() => {
  return authStore.isEmployee ? employeeNavigationItems : adminNavigationItems;
});

const isActive = (path) => route.path === path;
</script>

<style scoped></style>
