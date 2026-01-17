<template>
  <div id="app" class="min-h-screen bg-neutral-50">
    <AppLayout v-if="!isAuthPage">
      <RouterView />
    </AppLayout>
    <RouterView v-else />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "./stores/authStore";
import AppLayout from "./components/layout/AppLayout.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isAuthPage = computed(() => {
  return (
    route.path === "/login" ||
    route.path === "/register" ||
    route.path === "/forgot-password" ||
    route.path === "/reset-password"
  );
});

// Initialize auth on app mount
onMounted(() => {
  authStore.initAuth();
  
  // Redirect to login if not authenticated and not on auth page
  if (!authStore.isAuthenticated && !isAuthPage.value) {
    router.push("/login");
  }
});
</script>

<style scoped></style>
