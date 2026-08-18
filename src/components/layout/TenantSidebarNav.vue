<template>
  <ul class="space-y-0.5">
    <li v-for="item in TENANT_NAV" :key="item.id">
      <RouterLink
        :to="item.path"
        :class="[
          'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors',
          isActive(item.path)
            ? 'bg-primary-50 text-primary-700'
            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
        ]"
      >
        <span class="text-neutral-500 w-[18px] text-center shrink-0" aria-hidden="true">·</span>
        <span>{{ t(item.labelKey) }}</span>
      </RouterLink>
    </li>
  </ul>
</template>

<script setup>
import { useRoute } from "vue-router";
import { TENANT_NAV } from "../../config/tenantNav.js";
import { useI18n } from "../../i18n/index.js";

const route = useRoute();
const { t } = useI18n();

function isActive(path) {
  return route.path === path || route.path.startsWith(`${path}/`);
}
</script>
