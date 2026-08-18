<template>
  <div>
    <button
      type="button"
      :aria-expanded="open"
      aria-controls="self-service-submenu"
      :class="[
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors text-left',
        sectionActive
          ? 'bg-primary-50 text-primary-700'
          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
      ]"
      @click="emit('toggle')"
    >
      <svg
        class="w-[18px] h-[18px] shrink-0 opacity-80"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.75"
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span class="flex-1">{{ t("nav.selfService") }}</span>
      <svg
        class="w-3.5 h-3.5 shrink-0 text-neutral-400 transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <ul id="self-service-submenu" v-show="open" class="nav-sub">
      <li v-for="sub in SELF_SERVICE_MENU" :key="sub.path">
        <RouterLink
          :to="sub.path"
          :class="[
            'block px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors',
            isSubActive(sub.path)
              ? 'bg-primary-50 text-primary-700'
              : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800',
          ]"
        >
          {{ t(sub.labelKey) }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { SELF_SERVICE_MENU, pathMatchesSelfServiceMenu } from "../../config/selfServiceNav.js";
import { useI18n } from "../../i18n/index.js";

defineProps({
  open: { type: Boolean, default: false },
});
const emit = defineEmits(["toggle"]);

const route = useRoute();
const { t } = useI18n();

const sectionActive = computed(() => pathMatchesSelfServiceMenu(route.path));

function isSubActive(menuPath) {
  const p = route.path;
  if (p === menuPath) return true;
  if (!p.startsWith(menuPath + "/")) return false;
  return !SELF_SERVICE_MENU.some(
    (item) =>
      item.path !== menuPath &&
      item.path.startsWith(menuPath + "/") &&
      (p === item.path || p.startsWith(item.path + "/"))
  );
}
</script>

<style scoped>
.nav-sub {
  margin-top: 0.15rem;
  margin-left: 0.85rem;
  padding-left: 0.65rem;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
</style>
