<template>
  <ul class="space-y-2">
    <li v-for="item in SUPER_ADMIN_NAV" :key="item.id">
      <RouterLink
        :to="item.path"
        :class="[
          'flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm',
          isActive(item.path)
            ? 'bg-primary-100 text-primary-700'
            : 'text-neutral-600 hover:bg-neutral-100',
        ]"
      >
        <span class="text-xl" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </li>
  </ul>
</template>

<script setup>
import { useRoute } from "vue-router";
import { SUPER_ADMIN_NAV } from "../../config/superAdminNav.js";

const route = useRoute();

function isActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`);
}
</script>
