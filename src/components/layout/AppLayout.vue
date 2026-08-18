<template>
  <!-- items-start : la colonne droite n’est pas étirée à h-screen → pas de zone vide scrollable dans <main> -->
  <div class="flex min-h-screen items-start overflow-x-hidden bg-neutral-50">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 top-16 z-30 bg-neutral-900/40 lg:hidden"
      @click="closeSidebar"
    />
    <Sidebar class="print:hidden" />

    <div class="flex min-w-0 w-full flex-1 flex-col">
      <Header class="sticky top-0 z-50 shrink-0 print:hidden" />
      <main class="w-full min-w-0 overflow-x-auto pb-8 print:pb-0">
        <slot />
      </main>
    </div>

    <EmployeeWorkTimerFab v-if="authStore.isEmployee" class="print:hidden" />
  </div>
</template>

<script setup>
import { watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { useAppShell } from "../../composables/useAppShell.js";
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";
import EmployeeWorkTimerFab from "./EmployeeWorkTimerFab.vue";

const authStore = useAuthStore();
const route = useRoute();
const { sidebarOpen, closeSidebar } = useAppShell();

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
</script>

<style scoped></style>
