<template>
  <div class="relative inline-block" ref="containerRef">
    <!-- Notification Button -->
    <button
      @click.stop="toggleNotifications"
      class="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
      :class="{ 'bg-neutral-100': isOpen }"
      ref="buttonRef"
    >
      <svg
        class="w-6 h-6 text-neutral-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      
      <!-- Circular Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Notifications Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0 translate-y-2"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 max-h-96 overflow-hidden flex flex-col"
        ref="dropdownRef"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h3 class="text-sm font-semibold text-neutral-900">Notifications</h3>
          <div class="flex items-center gap-2">
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Tout marquer comme lu
            </button>
            <button
              @click="closeNotifications"
              class="p-1 hover:bg-neutral-200 rounded transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="overflow-y-auto flex-1">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg
                class="w-8 h-8 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <p class="text-sm text-neutral-500">Aucune notification</p>
          </div>

          <div v-else class="divide-y divide-neutral-100">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              @click="handleNotificationClick(notification)"
              :class="[
                'px-4 py-3 cursor-pointer transition-colors hover:bg-neutral-50',
                !notification.read ? 'bg-primary-50/30' : '',
              ]"
            >
              <div class="flex items-start gap-3">
                <!-- Circular Icon -->
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    getNotificationIconClass(notification.type),
                  ]"
                >
                  <svg
                    class="w-5 h-5"
                    :class="getNotificationIconColor(notification.type)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      v-if="notification.type === 'info'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      v-else-if="notification.type === 'success'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      v-else-if="notification.type === 'warning'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                    <path
                      v-else-if="notification.type === 'error'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      v-else-if="notification.type === 'leave'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                    <path
                      v-else-if="notification.type === 'payslip'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      v-else-if="notification.type === 'attendance'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <p
                      :class="[
                        'text-sm font-medium',
                        !notification.read ? 'text-neutral-900' : 'text-neutral-700',
                      ]"
                    >
                      {{ notification.title }}
                    </p>
                    <span
                      v-if="!notification.read"
                      class="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1"
                    ></span>
                  </div>
                  <p class="text-xs text-neutral-500 mt-1 line-clamp-2">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-neutral-400 mt-1">
                    {{ formatTime(notification.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          v-if="notifications.length > 0"
          class="px-4 py-3 border-t border-neutral-200 bg-neutral-50"
        >
          <button
            @click="viewAllNotifications"
            class="w-full text-sm text-primary-600 hover:text-primary-700 font-medium text-center"
          >
            Voir toutes les notifications
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { formatDistanceToNow } from "date-fns";
import fr from "date-fns/locale/fr";

const props = defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["mark-read", "click", "view-all"]);

const router = useRouter();
const isOpen = ref(false);
const dropdownRef = ref(null);
const containerRef = ref(null);
const buttonRef = ref(null);

const unreadCount = computed(() => {
  return props.notifications.filter((n) => !n.read).length;
});

const toggleNotifications = () => {
  isOpen.value = !isOpen.value;
};

const closeNotifications = () => {
  isOpen.value = false;
};

const markAllAsRead = () => {
  emit("mark-read", null); // null means mark all
  closeNotifications();
};

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    emit("mark-read", notification.id);
  }
  emit("click", notification);
  closeNotifications();
};

const viewAllNotifications = () => {
  emit("view-all");
  closeNotifications();
  router.push("/notifications");
};

const formatTime = (date) => {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: fr,
    });
  } catch (error) {
    return "Récemment";
  }
};


const getNotificationIconClass = (type) => {
  const classes = {
    info: "bg-blue-100",
    success: "bg-green-100",
    warning: "bg-yellow-100",
    error: "bg-red-100",
    leave: "bg-purple-100",
    payslip: "bg-indigo-100",
    attendance: "bg-cyan-100",
    default: "bg-neutral-100",
  };
  return classes[type] || classes.default;
};

const getNotificationIconColor = (type) => {
  const colors = {
    info: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
    leave: "text-purple-600",
    payslip: "text-indigo-600",
    attendance: "text-cyan-600",
    default: "text-neutral-600",
  };
  return colors[type] || colors.default;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target)
  ) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>


<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

