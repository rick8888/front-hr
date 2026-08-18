<template>
  <form class="px-5 py-6 sm:px-6 sm:py-7" @submit.prevent="onSubmit">
    <header class="mb-5 flex items-center gap-2 border-b border-neutral-100 pb-3">
      <svg
        class="h-5 w-5 text-primary-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
      <h3 class="text-sm font-semibold text-neutral-900">
        Company Information
      </h3>
    </header>

    <div class="space-y-5">
      <div>
        <label :for="ids.companyName" class="mb-1.5 block text-sm font-medium text-neutral-800">
          Company Name<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input
          :id="ids.companyName"
          v-model="local.companyName"
          type="text"
          required
          placeholder="Acme Inc."
          :class="inputClass"
        />
      </div>

      <div>
        <label :for="ids.subdomain" class="mb-1.5 block text-sm font-medium text-neutral-800">
          Choose Your Subdomain<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <div
          class="flex items-stretch overflow-hidden rounded-lg border border-neutral-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/25"
        >
          <input
            :id="ids.subdomain"
            v-model="local.subdomain"
            type="text"
            required
            pattern="[a-z0-9\-]+"
            placeholder="yourcompany"
            class="w-full px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
            @input="onSubdomainInput"
          />
          <span
            class="flex items-center bg-neutral-50 px-3 text-sm font-medium text-neutral-500 border-l border-neutral-300"
          >
            {{ domainSuffix }}
          </span>
        </div>
        <p class="mt-1.5 text-xs text-neutral-500">
          Letters, numbers and hyphens only. This cannot be changed later.
        </p>
      </div>

      <label class="flex items-start gap-2 text-sm text-neutral-700">
        <input
          v-model="local.agreeToTerms"
          type="checkbox"
          required
          class="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
        />
        <span>
          I agree to the
          <a href="#" class="font-medium text-primary-600 hover:underline">
            terms and conditions
          </a>
        </span>
      </label>
    </div>

    <p v-if="error" class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
      {{ error }}
    </p>

    <div class="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50"
        @click="emit('previous')"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <button
        type="submit"
        class="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 disabled:pointer-events-none disabled:opacity-50"
        :disabled="!canSubmit || submitting"
      >
        <svg
          v-if="submitting"
          class="h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Create Account
        <svg
          v-if="!submitting"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  modelValue: { type: Object, required: true },
  domainSuffix: { type: String, default: ".opencorebs.com" },
  submitting: { type: Boolean, default: false },
  error: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "previous", "submit"]);

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25";

const ids = {
  companyName: "reg-company-name",
  subdomain: "reg-subdomain",
};

const local = reactive({
  companyName: "",
  subdomain: "",
  agreeToTerms: false,
  ...props.modelValue,
});

watch(
  () => props.modelValue,
  (next) => {
    if (!next) return;
    Object.assign(local, next);
  },
  { deep: true },
);

watch(
  local,
  (value) => emit("update:modelValue", { ...value }),
  { deep: true },
);

const canSubmit = computed(
  () =>
    local.companyName.trim() &&
    /^[a-z0-9-]+$/.test(local.subdomain) &&
    local.agreeToTerms,
);

function onSubdomainInput() {
  local.subdomain = local.subdomain
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function onSubmit() {
  if (!canSubmit.value || props.submitting) return;
  emit("submit", { ...local });
}
</script>
