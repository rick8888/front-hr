<template>
  <div class="premium-shell premium-shell--sup-admin flex min-h-screen flex-col overflow-x-hidden bg-neutral-50 lg:flex-row lg:items-start">
    <header
      class="sticky top-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 lg:hidden"
    >
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100"
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
      <span class="truncate font-semibold text-neutral-900">Super Admin</span>
      <span class="w-10" />
    </header>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 top-16 z-30 bg-neutral-900/40 lg:hidden"
      @click="closeSidebar"
    />

    <aside
      :class="[
        'flex w-64 shrink-0 flex-col border-r border-neutral-200 bg-white',
        'fixed bottom-0 left-0 top-16 z-40 h-[calc(100vh-4rem)] transform transition-transform duration-200 ease-out',
        'lg:static lg:top-auto lg:z-0 lg:h-screen lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="hidden h-16 items-center border-b border-neutral-200 px-6 lg:flex">
        <div class="flex items-center gap-2">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-lg font-bold text-white"
          >
            SA
          </div>
          <div>
            <span class="block leading-tight text-lg font-bold text-neutral-900">Super Admin</span>
            <span class="text-xs text-neutral-500">Plateforme</span>
          </div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-3.5 py-5">
        <SuperAdminSidebarNav />
      </nav>

      <div class="border-t border-neutral-200 px-3.5 py-4">
        <div class="mb-3 flex min-w-0 items-center gap-3">
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-neutral-200"
            aria-hidden="true"
          >
            {{ userInitial }}
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-neutral-100">{{ authStore.user?.name }}</p>
            <p class="truncate text-xs text-neutral-400">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          @click="handleLogout"
        >
          <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
    </aside>

    <div class="min-w-0 flex-1">
      <main class="min-w-0 w-full overflow-x-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { useI18n } from "../../i18n/index.js";
import { useAppShell } from "../../composables/useAppShell.js";
import SuperAdminSidebarNav from "./SuperAdminSidebarNav.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { t } = useI18n();
const { sidebarOpen, closeSidebar, toggleSidebar } = useAppShell();
const userInitial = authStore.user?.name?.trim()?.charAt(0)?.toUpperCase() || "S";

watch(
  () => route.path,
  () => closeSidebar()
);

watch(sidebarOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

async function handleLogout() {
  await authStore.logout();
  router.push("/login");
}
</script>
