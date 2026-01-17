<template>
  <header
    class="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8"
  >
    <!-- Left - Greeting or Employee Name -->
    <div>
      <template v-if="employeeName">
        <h1 class="text-xl font-bold text-neutral-900 mb-1">{{ employeeName }}</h1>
        <div class="flex items-center gap-2 text-sm text-neutral-600">
          <span>All Employee</span>
          <span>›</span>
          <span class="text-neutral-900 font-medium">{{ employeeName }}</span>
        </div>
      </template>
      <template v-else>
        <h1 class="text-lg font-semibold text-neutral-900">
          Hello {{ authStore.user?.name?.split(' ')[0] || 'User' }} 👋
          <span class="text-neutral-600 font-normal">{{ getGreeting() }}</span>
        </h1>
      </template>
    </div>

    <!-- Center - Search -->
    <div class="flex-1 flex justify-center px-8">
      <div class="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search"
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
        />
        <svg
          class="absolute left-3 top-2.5 w-4 h-4 text-neutral-400"
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
    </div>

    <!-- Right - Notifications & Profile -->
    <div class="flex items-center gap-4">
      <!-- Notifications -->
      <button
        class="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
      >
        <svg
          class="w-5 h-5 text-neutral-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        <span
          class="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"
        ></span>
      </button>

      <!-- Profile Dropdown -->
      <div class="relative" ref="profileDropdownRef">
        <button
          @click="toggleProfileDropdown"
          class="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded-lg transition-colors"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            :style="{ backgroundColor: getUserInitialsColor() }"
          >
            {{ getUserInitials() }}
          </div>
          <div class="hidden md:block">
            <p class="text-sm font-medium text-neutral-900">{{ authStore.user?.name || 'User' }}</p>
            <p class="text-xs text-neutral-500">{{ authStore.user?.designation || authStore.user?.role || 'User' }}</p>
          </div>
          <svg
            :class="[
              'w-4 h-4 text-neutral-400 transition-transform duration-200',
              isProfileDropdownOpen ? 'rotate-180' : '',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
      </button>

        <!-- Dropdown Menu -->
        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="isProfileDropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50"
          >
            <!-- User Info -->
            <div class="px-4 py-3 border-b border-neutral-200">
              <p class="text-sm font-medium text-neutral-900">{{ authStore.user?.name || 'User' }}</p>
              <p class="text-xs text-neutral-500 mt-0.5">{{ authStore.user?.email || '' }}</p>
            </div>

            <!-- Menu Items -->
            <div class="py-1">
              <button
                @click="goToProfile"
                class="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
              >
                <svg
                  class="w-4 h-4 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </button>
              <router-link
                v-if="authStore.isAdmin"
                to="/settings"
                @click="closeDropdown"
                class="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <svg
                  class="w-4 h-4 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </router-link>
            </div>

            <!-- Divider -->
            <div class="border-t border-neutral-200 my-1"></div>

      <!-- Logout -->
            <div class="py-1">
      <button
                @click="handleLogout"
                class="flex items-center gap-3 w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
      </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const isProfileDropdownOpen = ref(false);
const profileDropdownRef = ref(null);
const employeeName = ref(null);

// Watch route changes to update employee name
watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith("/employees/") && newPath !== "/employees" && newPath !== "/employees/new") {
      // Extract employee name from route or set a default
      // In a real app, you would fetch this from the route params or store
      employeeName.value = "Brooklyn Simmons";
    } else {
      employeeName.value = null;
    }
  },
  { immediate: true }
);

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
};

const closeDropdown = () => {
  isProfileDropdownOpen.value = false;
};

const goToProfile = () => {
  closeDropdown();
  router.push("/profile");
};

const handleLogout = () => {
  // Clear local storage
  localStorage.removeItem("token");
  localStorage.removeItem("rememberMe");
  
  // Clear auth store
  authStore.logout();
  
  // Redirect to login
  router.push("/login");
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (
    profileDropdownRef.value &&
    !profileDropdownRef.value.contains(event.target)
  ) {
    isProfileDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Get user initials for avatar
const getUserInitials = () => {
  if (!authStore.user?.name) return "U";
  const names = authStore.user.name.split(" ");
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return names[0][0].toUpperCase();
};

// Get color for user initials based on name
const getUserInitialsColor = () => {
  // Use a simple hash to get consistent colors
  if (!authStore.user?.name) return "#6699FF";
  const name = authStore.user.name;
  const colors = [
    "#6699FF", "#FF6699", "#66FF99", "#FF9966", 
    "#9966FF", "#FFCC66", "#66CCFF", "#FF6666"
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};
</script>

<style scoped></style>
