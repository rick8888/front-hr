<template>
  <div class="relative" ref="rootRef">
    <label :for="inputId" class="mb-1.5 block text-sm font-medium text-neutral-800">Pays</label>
    <button
      :id="inputId"
      type="button"
      class="input-base w-full flex items-center justify-between gap-2 text-left"
      :disabled="disabled"
      :aria-expanded="open"
      @click="toggle"
    >
      <span v-if="selectedLabel" class="truncate">{{ selectedLabel }}</span>
      <span v-else class="text-neutral-400">Sélectionner un pays…</span>
      <svg class="h-4 w-4 shrink-0 text-neutral-400" :class="open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div v-if="open" class="absolute z-20 mt-1 w-full rounded-xl border border-neutral-200 bg-white shadow-lg">
      <div class="border-b border-neutral-100 p-2">
        <input ref="searchRef" v-model="search" type="search" placeholder="Rechercher…" class="input-base w-full text-sm" />
      </div>
      <div class="max-h-64 overflow-y-auto py-1">
        <div v-for="group in groupedCountries" :key="group.region">
          <p class="px-3 py-1.5 text-xs font-semibold uppercase text-neutral-400">{{ group.region }}</p>
          <button
            v-for="country in group.items"
            :key="country.country_code"
            type="button"
            class="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral-50"
            :class="country.country_code === modelValue ? 'bg-primary-50 text-primary-700' : 'text-neutral-700'"
            @click="select(country.country_code)"
          >
            <span>{{ country.country_name }}</span>
            <span class="text-xs text-neutral-400">{{ country.country_code }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  countries: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "select"]);

const open = ref(false);
const search = ref("");
const rootRef = ref(null);
const searchRef = ref(null);
const inputId = `country-selector-${Math.random().toString(36).slice(2, 8)}`;

const selectedLabel = computed(() => {
  const found = props.countries.find((c) => c.country_code === props.modelValue);
  return found ? `${found.country_name} (${found.country_code})` : "";
});

const groupedCountries = computed(() => {
  const q = search.value.trim().toLowerCase();
  const filtered = q
    ? props.countries.filter((c) =>
        [c.country_name, c.country_code, c.region].some((v) => v.toLowerCase().includes(q))
      )
    : props.countries;
  const map = new Map();
  filtered.forEach((c) => {
    if (!map.has(c.region)) map.set(c.region, []);
    map.get(c.region).push(c);
  });
  return [...map.entries()].map(([region, items]) => ({ region, items }));
});

function toggle() {
  if (!props.disabled) open.value = !open.value;
}
function select(code) {
  emit("update:modelValue", code);
  emit("select", code);
  open.value = false;
  search.value = "";
}
function onClickOutside(e) {
  if (rootRef.value && !rootRef.value.contains(e.target)) {
    open.value = false;
    search.value = "";
  }
}
watch(open, async (v) => {
  if (v) {
    await nextTick();
    searchRef.value?.focus();
  }
});
onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));
</script>
