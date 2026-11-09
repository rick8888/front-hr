<template>
  <img
    v-if="avatarUrl && !failed"
    v-bind="$attrs"
    :src="avatarUrl"
    :alt="name"
    :class="['shrink-0 rounded-full object-cover', sizeClass]"
    @error="failed = true"
  />
  <div
    v-else
    v-bind="$attrs"
    :style="attrs.style"
    :class="[
      'shrink-0 rounded-full flex items-center justify-center',
      sizeClass,
      fallbackClass,
    ]"
    aria-hidden="true"
  >
    {{ initials }}
  </div>
</template>

<script setup>
import { computed, ref, useAttrs, watch } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  name: { type: String, default: "" },
  avatarUrl: { type: String, default: null },
  sizeClass: { type: String, default: "h-10 w-10" },
  fallbackClass: { type: String, default: "bg-neutral-200 text-neutral-700 text-xs font-semibold" },
});

const attrs = useAttrs();
const failed = ref(false);

watch(
  () => props.avatarUrl,
  () => {
    failed.value = false;
  }
);

const initials = computed(() => {
  const parts = String(props.name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "—";
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
});
</script>
