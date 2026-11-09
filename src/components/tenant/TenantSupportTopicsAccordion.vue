<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <h2 class="text-base font-bold text-neutral-900">{{ t("tenant.support.topicsTitle") }}</h2>

    <ul class="mt-4 divide-y divide-neutral-200">
      <li v-for="topic in topics" :key="topic.id">
        <button
          type="button"
          class="flex w-full items-center gap-3 py-4 text-left transition-colors hover:bg-neutral-50/80"
          :aria-expanded="isOpen(topic.id)"
          @click="toggle(topic.id)"
        >
          <span
            class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600"
            aria-hidden="true"
          >
            <component :is="iconFor(topic.icon)" class="h-4 w-4" />
          </span>
          <span class="flex-1 text-sm font-medium text-neutral-700">
            {{ topic.label }}
          </span>
          <svg
            class="h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform duration-200"
            :class="isOpen(topic.id) ? '-rotate-180' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <div
          v-if="isOpen(topic.id) && topic.links?.length"
          class="border-t border-neutral-100 bg-neutral-50/50 px-4 py-3 pl-14"
        >
          <ul class="space-y-2">
            <li v-for="link in topic.links" :key="link.label">
              <RouterLink
                :to="link.to"
                class="text-sm font-medium text-[#7c7cf8] hover:underline"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, h } from "vue";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();
const props = defineProps({
  topics: { type: Array, required: true },
});

const openIds = ref(
  new Set(props.topics.filter((t) => t.defaultOpen).map((t) => t.id)),
);

function isOpen(id) {
  return openIds.value.has(id);
}

function toggle(id) {
  const next = new Set(openIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  openIds.value = next;
}

function iconFor(name) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    class: "h-4 w-4",
  };
  const icons = {
    card: () =>
      h("svg", stroke, [
        h("rect", {
          x: "2",
          y: "5",
          width: "20",
          height: "14",
          rx: "2",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
        h("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M2 10h20",
        }),
      ]),
    user: () =>
      h("svg", stroke, [
        h("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        }),
      ]),
    code: () =>
      h("svg", stroke, [
        h("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
        }),
      ]),
    help: () =>
      h("svg", stroke, [
        h("circle", {
          cx: "12",
          cy: "12",
          r: "9",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
        h("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2",
          d: "M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01",
        }),
      ]),
  };
  return icons[name] || icons.help;
}
</script>
