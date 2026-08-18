<template>
  <div ref="rootEl" class="relative w-full max-w-md">
    <label v-if="label" class="block text-sm font-medium text-neutral-700 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-error-600">*</span>
    </label>

    <div class="relative">
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        ref="inputEl"
        type="search"
        class="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border bg-white transition-colors focus:outline-none focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20"
        :class="
          open
            ? 'border-secondary-500 ring-2 ring-secondary-500/20'
            : 'border-neutral-300 hover:border-neutral-400'
        "
        :value="displayValue"
        :placeholder="placeholder"
        :aria-expanded="open"
        role="combobox"
        aria-autocomplete="list"
        autocomplete="off"
        @focus="onFocus"
        @input="onInput"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape.prevent="close"
      />
      <button
        v-if="modelValue || (typing && query)"
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-neutral-400 hover:text-neutral-600"
        aria-label="Clear"
        @click.stop="clear"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <p v-if="hint" class="mt-1.5 text-xs text-neutral-500">{{ hint }}</p>

    <Teleport to="body">
      <div
        v-if="open"
        ref="menuEl"
        class="fixed z-[300] rounded-lg border border-neutral-200 bg-white shadow-lg overflow-hidden"
        :style="menuStyle"
        role="listbox"
        @click.stop
      >
        <div class="max-h-60 overflow-y-auto py-1">
          <p v-if="!filteredOptions.length" class="px-3 py-2.5 text-sm text-neutral-500">
            No employees found
          </p>
          <button
            v-for="(opt, idx) in filteredOptions"
            :key="opt.id"
            type="button"
            class="w-full px-3 py-2 text-left text-sm transition-colors"
            :class="optionClass(opt, idx)"
            role="option"
            :aria-selected="String(modelValue) === String(opt.id)"
            @mousedown.prevent="select(opt)"
          >
            {{ formatOption(opt) }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number, null], default: null },
  options: { type: Array, default: () => [] },
  label: { type: String, default: "" },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: "Search employee…" },
  /** Conservé pour compat ; non utilisé (un seul champ). */
  searchPlaceholder: { type: String, default: "" },
  hint: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "change"]);

const open = ref(false);
const query = ref("");
const typing = ref(false);
const highlighted = ref(0);
const inputEl = ref(null);
const rootEl = ref(null);
const menuEl = ref(null);
const menuStyle = ref({});

const selected = computed(
  () => props.options.find((o) => String(o.id) === String(props.modelValue)) || null
);

const selectedLabel = computed(() => (selected.value ? formatOption(selected.value) : ""));

const displayValue = computed(() => (typing.value ? query.value : selectedLabel.value));

const filteredOptions = computed(() => {
  const q = typing.value ? query.value.trim().toLowerCase() : "";
  if (!q) return props.options;
  return props.options.filter((o) => {
    const hay = `${o.name || ""} ${o.empCode || ""}`.toLowerCase();
    return hay.includes(q);
  });
});

function formatOption(opt) {
  return `${opt.name} (${opt.empCode})`;
}

function optionClass(opt, idx) {
  if (idx === highlighted.value) {
    return "bg-secondary-50 text-secondary-800 font-medium";
  }
  if (String(props.modelValue) === String(opt.id)) {
    return "bg-secondary-50/60 text-secondary-800 font-medium";
  }
  return "text-neutral-800 hover:bg-secondary-50";
}

function updateMenuPosition() {
  const el = inputEl.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const maxMenuHeight = 280;
  const gap = 4;
  const spaceBelow = window.innerHeight - rect.bottom - gap;
  const spaceAbove = rect.top - gap;
  const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;

  if (openUp) {
    menuStyle.value = {
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      bottom: `${window.innerHeight - rect.top + gap}px`,
      top: "auto",
      maxHeight: `${Math.min(maxMenuHeight, spaceAbove)}px`,
    };
  } else {
    menuStyle.value = {
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      top: `${rect.bottom + gap}px`,
      bottom: "auto",
      maxHeight: `${Math.min(maxMenuHeight, Math.max(spaceBelow, 120))}px`,
    };
  }
}

async function openMenu() {
  open.value = true;
  highlighted.value = 0;
  await nextTick();
  updateMenuPosition();
}

function close() {
  open.value = false;
  typing.value = false;
  query.value = "";
  highlighted.value = 0;
}

async function onFocus() {
  typing.value = false;
  query.value = "";
  await openMenu();
}

function onInput(e) {
  typing.value = true;
  query.value = e.target.value;
  open.value = true;
  highlighted.value = 0;
  nextTick(updateMenuPosition);
}

function select(opt) {
  emit("update:modelValue", opt.id);
  emit("change", opt);
  typing.value = false;
  query.value = "";
  open.value = false;
  highlighted.value = 0;
}

function clear() {
  emit("update:modelValue", null);
  emit("change", null);
  typing.value = false;
  query.value = "";
  open.value = false;
  nextTick(() => inputEl.value?.focus());
}

function highlightNext() {
  if (!open.value) openMenu();
  const max = filteredOptions.value.length - 1;
  if (max < 0) return;
  highlighted.value = Math.min(highlighted.value + 1, max);
}

function highlightPrev() {
  if (!open.value) return;
  highlighted.value = Math.max(highlighted.value - 1, 0);
}

function selectHighlighted() {
  const opt = filteredOptions.value[highlighted.value];
  if (opt) select(opt);
}

function onDocClick(e) {
  if (!open.value) return;
  const t = e.target;
  if (rootEl.value?.contains(t) || menuEl.value?.contains(t)) return;
  close();
}

function onScrollOrResize() {
  if (open.value) updateMenuPosition();
}

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      query.value = "";
      typing.value = false;
    }
  }
);

watch(filteredOptions, (list) => {
  if (highlighted.value >= list.length) {
    highlighted.value = Math.max(0, list.length - 1);
  }
});

onMounted(() => {
  document.addEventListener("click", onDocClick);
  window.addEventListener("resize", onScrollOrResize);
  window.addEventListener("scroll", onScrollOrResize, true);
});

onUnmounted(() => {
  document.removeEventListener("click", onDocClick);
  window.removeEventListener("resize", onScrollOrResize);
  window.removeEventListener("scroll", onScrollOrResize, true);
});
</script>
