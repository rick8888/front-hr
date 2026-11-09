<template>
  <ul class="space-y-1.5">
    <li v-for="item in SUPER_ADMIN_NAV" :key="item.id">
      <RouterLink
        :to="item.path"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        :class="[
          'group flex min-h-12 items-center gap-3 rounded-xl px-3.5 py-2.5 font-medium text-sm',
          isActive(item.path)
            ? 'bg-primary-100 text-primary-700'
            : 'text-neutral-600 hover:bg-neutral-100',
        ]"
      >
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg transition-colors"
          aria-hidden="true"
        >
          {{ item.icon }}
        </span>
        <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
        <span
          v-if="isActive(item.path)"
          class="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
          aria-hidden="true"
        />
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
