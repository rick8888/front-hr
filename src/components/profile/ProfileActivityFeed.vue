<template>
  <article class="rounded-2xl bg-white border border-neutral-200 shadow-sm">
    <header class="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-100">
      <div class="flex items-center gap-2 text-neutral-900">
        <ProfileIcon name="chart" size="sm" class="text-neutral-500" />
        <h2 class="text-base font-semibold">{{ t("ss.profile.activity.title") }}</h2>
      </div>
      <span
        v-if="!loading"
        class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-secondary-50 text-secondary-700 text-xs font-medium"
      >
        {{ totalLabel }}
      </span>
      <span
        v-else
        class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
        aria-hidden="true"
      />
    </header>

    <div
      v-if="loading"
      class="flex min-h-[160px] items-center justify-center"
      aria-busy="true"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-secondary-600"
        aria-hidden="true"
      />
    </div>
    <ul
      v-else-if="activities.length"
      class="max-h-[360px] overflow-y-auto divide-y divide-neutral-100"
    >
      <li
        v-for="activity in activities"
        :key="activity.id"
        class="flex gap-3 px-5 sm:px-6 py-3.5"
      >
        <span
          class="mt-1 h-2 w-2 rounded-full bg-secondary-500 flex-shrink-0"
          aria-hidden="true"
        />
        <div class="flex-1 min-w-0 space-y-1">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary-50 text-secondary-700 text-[11px] font-medium"
          >
            {{ activity.type }}
          </span>
          <p class="flex items-center gap-1.5 text-sm text-neutral-700 truncate">
            <ProfileIcon name="link" size="xs" class="text-neutral-400 flex-shrink-0" />
            <span class="truncate">{{ activity.url }}</span>
          </p>
          <p class="flex items-center gap-1.5 text-xs text-neutral-500">
            <ProfileIcon name="pin" size="xs" class="flex-shrink-0" />
            <span class="truncate">{{ activity.ip }}</span>
          </p>
        </div>
        <span class="text-xs text-neutral-400 whitespace-nowrap mt-0.5">
          {{ activity.relative }}
        </span>
      </li>
    </ul>
    <p
      v-else
      class="px-5 sm:px-6 py-8 text-sm text-neutral-500 text-center"
    >
      {{ t("ss.profile.activity.empty") }}
    </p>
  </article>
</template>

<script setup>
import { computed } from "vue";
import ProfileIcon from "./ProfileIcon.vue";
import { useI18n } from "../../i18n/index.js";

const props = defineProps({
  activities: { type: Array, required: true },
  total: { type: [Number, String], default: null },
  loading: { type: Boolean, default: false },
});

const { t, locale } = useI18n();

const totalLabel = computed(() => {
  void locale.value;
  const value = props.total ?? props.activities.length;
  return t("ss.profile.activity.total", { n: value });
});
</script>
