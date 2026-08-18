<template>
  <div
    class="flex items-center justify-between rounded-t-xl border-b border-neutral-200 bg-neutral-50 px-5 py-4 sm:px-6"
  >
    <template v-for="(step, idx) in steps" :key="step.id">
      <div class="flex items-center gap-3">
        <span
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
          :class="stepBadgeClass(step.id)"
        >
          {{ step.id }}
        </span>
        <div class="leading-tight">
          <p
            class="text-sm font-semibold"
            :class="
              isActive(step.id) ? 'text-primary-600' : 'text-neutral-500'
            "
          >
            {{ step.title }}
          </p>
          <p class="text-xs text-neutral-500">{{ step.subtitle }}</p>
        </div>
      </div>

      <div
        v-if="idx < steps.length - 1"
        class="mx-3 h-px flex-1 sm:mx-6"
        :class="
          currentStep > step.id ? 'bg-emerald-400' : 'bg-neutral-300'
        "
        aria-hidden="true"
      />
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  currentStep: { type: Number, required: true },
  /** Array of { id: Number, title: String, subtitle: String } */
  steps: { type: Array, required: true },
});

function isActive(id) {
  return id === props.currentStep;
}

function stepBadgeClass(id) {
  if (isActive(id)) return "bg-primary-500 text-white";
  if (id < props.currentStep)
    return "bg-emerald-100 text-emerald-600";
  return "bg-neutral-200 text-neutral-500";
}
</script>
