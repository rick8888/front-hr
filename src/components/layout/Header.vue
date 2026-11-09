<template>
  <header
    class="flex h-16 min-w-0 items-center justify-between gap-2 border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-8"
  >
    <!-- Left - Menu + Greeting -->
    <div class="flex min-w-0 items-center gap-2">
      <button
        type="button"
        class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 lg:hidden"
        :aria-label="sidebarOpen ? t('header.close') : t('header.menu')"
        :aria-expanded="sidebarOpen"
        @click="toggleSidebar"
      >
        <svg v-if="!sidebarOpen" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="min-w-0">
        <h1 class="truncate text-base font-semibold text-neutral-900 sm:text-lg">
          {{ t("header.hello", { name: firstName }) }}
          <span class="hidden font-normal text-neutral-600 sm:inline"> 👋 {{ greeting }}</span>
        </h1>
      </div>
    </div>

    <!-- Center - Search -->
    <div class="hidden min-w-0 flex-1 justify-center px-4 lg:flex lg:px-8">
      <div class="relative w-full max-w-md">
        <input
          type="text"
          :placeholder="t('header.searchPlaceholder')"
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
    <div class="flex shrink-0 items-center gap-2 sm:gap-4">
      <!-- Notifications -->
      <CircularNotification
        :notifications="notifications"
        @mark-read="handleMarkAsRead"
        @click="handleNotificationClick"
        @view-all="handleViewAll"
      />

      <!-- Profile Dropdown -->
      <div class="relative" ref="profileDropdownRef">
        <button
          @click="toggleProfileDropdown"
          class="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 px-1 py-1 rounded-lg transition-colors sm:px-2"
        >
          <EmployeeAvatar
            :name="authStore.user?.name || 'User'"
            :avatar-url="authStore.user?.avatar_url || authStore.user?.avatarUrl"
            size-class="h-10 w-10 text-sm font-semibold"
            fallback-class="text-white"
            :style="{ backgroundColor: getUserInitialsColor() }"
          />
          <div class="hidden md:block">
            <p class="text-sm font-medium text-neutral-900">{{ authStore.user?.name || 'User' }}</p>
            <p class="text-xs text-neutral-500">{{ authStore.user?.company || authStore.user?.designation || authStore.user?.role || 'User' }}</p>
          </div>
          <svg
            :class="[
              'hidden w-4 h-4 text-neutral-400 transition-transform duration-200 sm:block',
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
                {{ t("header.profile") }}
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
                {{ t("header.settings") }}
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
                {{ t("header.logout") }}
      </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { useI18n } from "../../i18n/index.js";
import { useAppShell } from "../../composables/useAppShell.js";
import CircularNotification from "../common/CircularNotification.vue";
import EmployeeAvatar from "../common/EmployeeAvatar.vue";

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();
const { sidebarOpen, toggleSidebar } = useAppShell();
const isProfileDropdownOpen = ref(false);
const profileDropdownRef = ref(null);

// Notifications data
const notifications = ref([
  {
    id: 1,
    type: "leave",
    title: "Demande de congé approuvée",
    message: "Votre demande de congé du 15 au 20 janvier a été approuvée",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    type: "payslip",
    title: "Nouvelle fiche de paie disponible",
    message: "Votre fiche de paie de décembre 2025 est maintenant disponible",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 3,
    type: "attendance",
    title: "Rappel de pointage",
    message: "N'oubliez pas de pointer votre arrivée aujourd'hui",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 4,
    type: "info",
    title: "Mise à jour du système",
    message: "Une nouvelle version de l'application est disponible",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
]);

const handleMarkAsRead = (notificationId) => {
  if (notificationId === null) {
    // Mark all as read
    notifications.value.forEach((n) => (n.read = true));
  } else {
    // Mark specific notification as read
    const notification = notifications.value.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
};

const handleNotificationClick = (notification) => {
  // Handle notification click - navigate to relevant page
  console.log("Notification clicked:", notification);
  // Example: router.push(`/notifications/${notification.id}`);
};

const handleViewAll = () => {
  // Navigate to all notifications page
  router.push("/notifications");
};

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

const handleLogout = async () => {
  await authStore.logout();
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

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return t("header.greeting.morning");
  if (hour < 18) return t("header.greeting.afternoon");
  return t("header.greeting.evening");
});

const firstName = computed(
  () => authStore.user?.name?.split(" ")[0] || "User"
);
</script>

<style scoped></style>
