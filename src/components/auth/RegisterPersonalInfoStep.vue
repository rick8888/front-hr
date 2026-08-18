<template>
  <form class="px-5 py-6 sm:px-6 sm:py-7" @submit.prevent="onNext">
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <h3 class="text-sm font-semibold text-neutral-900">
        Personal Information
      </h3>
    </header>

    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div>
        <label :for="ids.firstName" class="mb-1.5 block text-sm font-medium text-neutral-800">
          First Name<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input
          :id="ids.firstName"
          v-model="local.firstName"
          type="text"
          required
          placeholder="John"
          :class="inputClass"
        />
      </div>

      <div>
        <label :for="ids.lastName" class="mb-1.5 block text-sm font-medium text-neutral-800">
          Last Name<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input
          :id="ids.lastName"
          v-model="local.lastName"
          type="text"
          required
          placeholder="Doe"
          :class="inputClass"
        />
      </div>

      <div>
        <label :for="ids.gender" class="mb-1.5 block text-sm font-medium text-neutral-800">
          Gender<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <select
          :id="ids.gender"
          v-model="local.gender"
          required
          :class="inputClass"
        >
          <option value="" disabled>Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label :for="ids.phone" class="mb-1.5 block text-sm font-medium text-neutral-800">
          Phone Number<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input
          :id="ids.phone"
          v-model="local.phone"
          type="tel"
          required
          placeholder="+1234567890"
          :class="inputClass"
        />
      </div>

      <div class="sm:col-span-2">
        <label :for="ids.email" class="mb-1.5 block text-sm font-medium text-neutral-800">
          Email Address<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <input
          :id="ids.email"
          v-model="local.email"
          type="email"
          required
          placeholder="admin@acme.demo.com"
          :class="inputClass"
        />
      </div>

      <div>
        <label :for="ids.password" class="mb-1.5 block text-sm font-medium text-neutral-800">
          Password<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <div class="relative">
          <input
            :id="ids.password"
            v-model="local.password"
            :type="showPassword ? 'text' : 'password'"
            required
            minlength="8"
            placeholder="••••••••"
            :class="[inputClass, 'pr-10']"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-400 hover:text-neutral-600"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <svg
              v-if="showPassword"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 012.142-3.362M6.18 6.18A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-4.043 5.197M6.18 6.18L3 3m3.18 3.18L21 21"
              />
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
        <p class="mt-1.5 text-xs text-neutral-500">Enter a password</p>
      </div>

      <div>
        <label :for="ids.confirmPassword" class="mb-1.5 block text-sm font-medium text-neutral-800">
          Confirm Password<span class="text-red-500" aria-hidden="true"> *</span>
        </label>
        <div class="relative">
          <input
            :id="ids.confirmPassword"
            v-model="local.confirmPassword"
            :type="showConfirm ? 'text' : 'password'"
            required
            placeholder="Confirm your password"
            :class="[inputClass, 'pr-10']"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-400 hover:text-neutral-600"
            :aria-label="showConfirm ? 'Hide password' : 'Show password'"
            @click="showConfirm = !showConfirm"
          >
            <svg
              v-if="showConfirm"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 012.142-3.362M6.18 6.18A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-4.043 5.197M6.18 6.18L3 3m3.18 3.18L21 21"
              />
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
        <p v-if="passwordMismatch" class="mt-1.5 text-xs text-red-500">
          Passwords do not match
        </p>
      </div>
    </div>

    <p v-if="error" class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
      {{ error }}
    </p>

    <div class="mt-6 flex justify-end border-t border-neutral-100 pt-5">
      <button
        type="submit"
        class="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 disabled:pointer-events-none disabled:opacity-50"
        :disabled="!canGoNext"
      >
        Next
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Object, required: true },
});
const emit = defineEmits(["update:modelValue", "next"]);

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25";

const ids = {
  firstName: "reg-first-name",
  lastName: "reg-last-name",
  gender: "reg-gender",
  phone: "reg-phone",
  email: "reg-email",
  password: "reg-password",
  confirmPassword: "reg-confirm-password",
};

const local = reactive({
  firstName: "",
  lastName: "",
  gender: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  ...props.modelValue,
});

const showPassword = ref(false);
const showConfirm = ref(false);
const error = ref("");

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

const passwordMismatch = computed(
  () =>
    local.confirmPassword.length > 0 &&
    local.password !== local.confirmPassword,
);

const canGoNext = computed(
  () =>
    local.firstName.trim() &&
    local.lastName.trim() &&
    local.gender &&
    local.phone.trim() &&
    local.email.trim() &&
    local.password.length >= 8 &&
    local.password === local.confirmPassword,
);

function onNext() {
  error.value = "";
  if (local.password.length < 8) {
    error.value = "Password must be at least 8 characters.";
    return;
  }
  if (local.password !== local.confirmPassword) {
    error.value = "Passwords do not match.";
    return;
  }
  emit("next", { ...local });
}
</script>
