<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">Notifications</h1>
        <p class="text-sm text-neutral-600">
          Gérez et consultez toutes vos notifications
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
        >
          Tout marquer comme lu
        </button>
        <select
          v-model="filterType"
          class="input-base min-w-[160px]"
          @change="applyFilters"
        >
          <option value="all">Toutes</option>
          <option value="unread">Non lues</option>
          <option value="read">Lues</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card text-center">
        <p class="text-neutral-600 text-sm">Total</p>
        <p class="text-3xl font-bold text-neutral-900 mt-2">
          {{ notifications.length }}
        </p>
      </div>
      <div class="card text-center">
        <p class="text-neutral-600 text-sm">Non lues</p>
        <p class="text-3xl font-bold text-primary-600 mt-2">
          {{ unreadCount }}
        </p>
      </div>
      <div class="card text-center">
        <p class="text-neutral-600 text-sm">Lues</p>
        <p class="text-3xl font-bold text-success-600 mt-2">
          {{ readCount }}
        </p>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="card">
      <div v-if="filteredNotifications.length === 0" class="p-12 text-center">
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
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">
          Aucune notification
        </h3>
        <p class="text-sm text-neutral-600">
          {{ filterType === 'unread' ? 'Aucune notification non lue' : filterType === 'read' ? 'Aucune notification lue' : 'Vous n\'avez aucune notification pour le moment' }}
        </p>
      </div>

      <div v-else class="divide-y divide-neutral-100">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          :class="[
            'px-6 py-4 cursor-pointer transition-colors hover:bg-neutral-50',
            !notification.read ? 'bg-primary-50/30' : '',
          ]"
        >
          <div class="flex items-start gap-4">
            <!-- Circular Icon -->
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                getNotificationIconClass(notification.type),
              ]"
            >
              <svg
                class="w-6 h-6"
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
              <div class="flex items-start justify-between gap-2 mb-2">
                <h3
                  :class="[
                    'text-base font-semibold',
                    !notification.read ? 'text-neutral-900' : 'text-neutral-700',
                  ]"
                >
                  {{ notification.title }}
                </h3>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span
                    v-if="!notification.read"
                    class="w-2.5 h-2.5 bg-primary-500 rounded-full"
                  ></span>
                  <button
                    @click.stop="toggleReadStatus(notification)"
                    class="p-1.5 hover:bg-neutral-200 rounded-lg transition-colors"
                    :title="notification.read ? 'Marquer comme non lu' : 'Marquer comme lu'"
                  >
                    <svg
                      v-if="notification.read"
                      class="w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-neutral-600 mb-2">
                {{ notification.message }}
              </p>
              <div class="flex items-center gap-4 text-xs text-neutral-400">
                <span class="flex items-center gap-1">
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ formatTime(notification.createdAt) }}
                </span>
                <span
                  v-if="notification.category"
                  class="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium"
                >
                  {{ notification.category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { formatDistanceToNow } from "date-fns";
import fr from "date-fns/locale/fr";

const filterType = ref("all");

// Mock notifications data - In a real app, this would come from an API
const notifications = ref([
  {
    id: 1,
    type: "leave",
    title: "Demande de congé approuvée",
    message: "Votre demande de congé du 15 au 20 janvier 2026 a été approuvée par votre responsable.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    category: "Congés",
  },
  {
    id: 2,
    type: "payslip",
    title: "Nouvelle fiche de paie disponible",
    message: "Votre fiche de paie de décembre 2025 est maintenant disponible dans votre espace documents.",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    category: "Paie",
  },
  {
    id: 3,
    type: "attendance",
    title: "Rappel de pointage",
    message: "N'oubliez pas de pointer votre arrivée aujourd'hui. Votre pointage est requis avant 9h30.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    category: "Présence",
  },
  {
    id: 4,
    type: "info",
    title: "Mise à jour du système",
    message: "Une nouvelle version de l'application est disponible. Découvrez les nouvelles fonctionnalités.",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    category: "Système",
  },
  {
    id: 5,
    type: "success",
    title: "Document validé",
    message: "Votre certificat de travail a été validé et est maintenant disponible dans vos documents.",
    read: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    category: "Documents",
  },
  {
    id: 6,
    type: "warning",
    title: "Échéance de contrat",
    message: "Votre contrat arrive à échéance dans 30 jours. Veuillez contacter les RH pour le renouvellement.",
    read: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    category: "Contrat",
  },
  {
    id: 7,
    type: "leave",
    title: "Nouvelle demande de congé",
    message: "Une nouvelle demande de congé a été soumise et nécessite votre validation.",
    read: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    category: "Congés",
  },
  {
    id: 8,
    type: "attendance",
    title: "Pointage manquant",
    message: "Vous avez oublié de pointer votre départ hier. Veuillez corriger votre pointage.",
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    category: "Présence",
  },
]);

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

const readCount = computed(() => {
  return notifications.value.filter((n) => n.read).length;
});

const filteredNotifications = computed(() => {
  if (filterType.value === "unread") {
    return notifications.value.filter((n) => !n.read);
  } else if (filterType.value === "read") {
    return notifications.value.filter((n) => n.read);
  }
  return notifications.value;
});

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

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.read = true));
};

const toggleReadStatus = (notification) => {
  notification.read = !notification.read;
};

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    notification.read = true;
  }
  // In a real app, navigate to relevant page based on notification type
  console.log("Notification clicked:", notification);
};

const applyFilters = () => {
  // Filter is applied automatically via computed property
};

onMounted(() => {
  // In a real app, fetch notifications from API
});
</script>

<style scoped></style>



