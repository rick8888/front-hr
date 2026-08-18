<template>
  <div id="app" class="min-h-screen bg-neutral-50">
    <AppLayout v-if="usesStandardLayout">
      <RouterView />
    </AppLayout>
    <RouterView v-else />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "./stores/authStore";
import { useEntityStatusCatalogStore } from "./stores/entityStatusCatalog.store.js";
import { isPublicPath } from "./router/publicRoutes.js";
import AppLayout from "./components/layout/AppLayout.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const statusCatalog = useEntityStatusCatalogStore();

const isPublicPage = computed(() => isPublicPath(route.path));

const usesStandardLayout = computed(() => {
  return (
    authStore.isAuthenticated &&
    !isPublicPage.value &&
    !route.path.startsWith("/sup-admin")
  );
});

watch(
  () => authStore.isAuthenticated,
  (ok) => {
    if (ok) statusCatalog.load();
  }
);

onMounted(async () => {
  await authStore.initAuth();

  if (!authStore.isAuthenticated && !isPublicPage.value) {
    router.push("/login");
    return;
  }

  if (authStore.isAuthenticated) {
    await statusCatalog.load();
  }
});
</script>

<style scoped></style>
