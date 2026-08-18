<template>
  <div ref="root" class="relative inline-block w-full">
    <!-- Input -->
    <button
      type="button"
      :class="[
        'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-neutral-300 bg-white px-3 text-sm transition-colors',
        'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
        displayValue ? 'text-neutral-700' : 'text-neutral-400',
      ]"
      @click="toggle"
    >
      <span class="truncate">{{ displayValue || placeholder }}</span>
      <svg class="h-4 w-4 flex-shrink-0 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </button>

    <!-- Popup -->
    <div
      v-if="open"
      class="absolute right-0 z-30 mt-2 w-[280px] rounded-xl border border-neutral-200 bg-white p-3 shadow-lg"
      role="dialog"
      aria-label="Select date range"
    >
      <!-- Header -->
      <div class="flex items-center justify-between gap-2 px-1 mb-2">
        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
          aria-label="Previous month"
          @click="shiftMonth(-1)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div class="flex flex-1 items-center justify-center gap-2 text-sm font-medium text-neutral-800">
          <div class="relative">
            <select
              v-model.number="viewMonth"
              class="appearance-none bg-transparent pr-5 text-sm font-medium text-neutral-800 focus:outline-none cursor-pointer"
              aria-label="Month"
            >
              <option v-for="(name, idx) in MONTH_NAMES" :key="name" :value="idx">
                {{ name }}
              </option>
            </select>
            <svg class="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <select
            v-model.number="viewYear"
            class="appearance-none bg-transparent text-sm font-medium text-neutral-800 focus:outline-none cursor-pointer"
            aria-label="Year"
          >
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <button
          type="button"
          class="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100"
          aria-label="Next month"
          @click="shiftMonth(1)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <!-- Weekdays -->
      <div class="grid grid-cols-7 px-1 text-center text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        <div v-for="d in WEEKDAYS" :key="d" class="py-1">{{ d }}</div>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7 gap-y-0.5 px-1">
        <button
          v-for="(cell, idx) in cells"
          :key="idx"
          type="button"
          :class="cellClass(cell)"
          :aria-pressed="isSelected(cell.date)"
          @click="onPick(cell)"
        >
          {{ cell.day }}
        </button>
      </div>

      <!-- Footer -->
      <div class="mt-2 flex items-center justify-between gap-2 border-t border-neutral-100 pt-2">
        <button
          type="button"
          class="text-xs font-medium text-neutral-500 hover:text-neutral-700"
          @click="clear"
        >
          Clear
        </button>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="rounded-md px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
            @click="open = false"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="!start"
            class="rounded-md bg-secondary-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-50"
            @click="apply"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { format } from "date-fns";

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "Select Date Range" },
});

const emit = defineEmits(["update:modelValue", "change"]);

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const today = new Date();
const open = ref(false);
const root = ref(null);
const viewMonth = ref(today.getMonth());
const viewYear = ref(today.getFullYear());
const start = ref(null);
const end = ref(null);

const yearOptions = computed(() => {
  const y = today.getFullYear();
  const out = [];
  for (let i = y - 10; i <= y + 10; i++) out.push(i);
  return out;
});

const displayValue = computed(() => {
  if (!start.value) return "";
  if (!end.value || isSameDay(start.value, end.value)) {
    return format(start.value, "MMM d, yyyy");
  }
  return `${format(start.value, "MMM d, yyyy")} → ${format(end.value, "MMM d, yyyy")}`;
});

/** 6 rows × 7 cols, with leading days from previous month and trailing days from next month. */
const cells = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1);
  const startOffset = first.getDay(); // 0 = Sun
  const gridStart = new Date(viewYear.value, viewMonth.value, 1 - startOffset);

  const result = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    result.push({
      date,
      day: date.getDate(),
      inMonth: date.getMonth() === viewMonth.value,
    });
  }
  return result;
});

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(d) {
  if (!start.value || !end.value) return false;
  return d >= startOfDay(start.value) && d <= endOfDay(end.value);
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function isSelected(d) {
  return (
    (start.value && isSameDay(d, start.value)) ||
    (end.value && isSameDay(d, end.value))
  );
}

function isToday(d) {
  return isSameDay(d, today);
}

function cellClass(cell) {
  const base =
    "flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors mx-auto";

  if (isSelected(cell.date)) {
    return `${base} bg-secondary-500 text-white font-semibold shadow-sm`;
  }
  if (isInRange(cell.date)) {
    return `${base} bg-secondary-50 text-secondary-700`;
  }
  if (!cell.inMonth) {
    return `${base} text-neutral-300 hover:bg-neutral-50`;
  }
  if (isToday(cell.date)) {
    return `${base} text-secondary-700 ring-1 ring-secondary-300`;
  }
  return `${base} text-neutral-700 hover:bg-neutral-100`;
}

function shiftMonth(delta) {
  let m = viewMonth.value + delta;
  let y = viewYear.value;
  if (m < 0) { m = 11; y -= 1; }
  if (m > 11) { m = 0; y += 1; }
  viewMonth.value = m;
  viewYear.value = y;
}

function onPick(cell) {
  const d = startOfDay(cell.date);
  if (!start.value || (start.value && end.value)) {
    start.value = d;
    end.value = null;
    return;
  }
  if (d < start.value) {
    end.value = start.value;
    start.value = d;
  } else {
    end.value = d;
  }
}

function clear() {
  start.value = null;
  end.value = null;
  emit("update:modelValue", "");
  emit("change", { start: null, end: null });
  open.value = false;
}

function apply() {
  if (!start.value) return;
  emit("update:modelValue", displayValue.value);
  emit("change", {
    start: start.value,
    end: end.value || start.value,
  });
  open.value = false;
}

function toggle() {
  open.value = !open.value;
}

function onDocClick(e) {
  if (!open.value) return;
  if (root.value && !root.value.contains(e.target)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("mousedown", onDocClick));
onBeforeUnmount(() => document.removeEventListener("mousedown", onDocClick));

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      start.value = null;
      end.value = null;
    }
  },
  { immediate: true },
);
</script>
