<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6"
  >
    <h2 class="text-base font-bold text-neutral-900">{{ t("tenant.subscription.currentSubscription") }}</h2>

    <div
      v-if="loading"
      class="mt-4 flex min-h-[10rem] items-center justify-center"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
        aria-hidden="true"
      />
      <span class="ml-2 text-sm text-neutral-500">{{ t("tenant.subscription.loading") }}</span>
    </div>

    <template v-else-if="subscription">
      <div class="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        <div class="space-y-2 text-sm">
          <p class="font-semibold text-neutral-900">{{ subscription.planName }}</p>
          <p class="flex items-center gap-2 text-neutral-700">
            <span class="font-semibold text-neutral-900">{{ t("tenant.subscription.statusLabel") }}:</span>
            <span
              :class="[
                'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold',
                statusClass,
              ]"
            >
              {{ subscription.statusLabel || subscription.status }}
            </span>
          </p>
          <p class="text-neutral-700">
            <span class="font-semibold text-neutral-900">{{ t("tenant.subscription.price") }}:</span>
            {{ subscription.price }}
          </p>
          <p class="text-neutral-700">
            <span class="font-semibold text-neutral-900">{{ t("tenant.subscription.started") }}:</span>
            {{ subscription.startedDate }}
          </p>
          <p class="flex flex-wrap items-center gap-2 text-neutral-700">
            <span class="font-semibold text-neutral-900">{{ t("tenant.subscription.applicationUrl") }}:</span>
            <a
              :href="subscription.applicationUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-[#7c7cf8] hover:underline"
            >
              <svg
                class="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              {{ applicationUrlLabel }}
            </a>
          </p>
          <p class="text-neutral-700">
            <span class="font-semibold text-neutral-900">{{ t("tenant.subscription.nextBilling") }}:</span>
            {{ subscription.nextBillingDate }}
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold text-neutral-900">{{ t("tenant.subscription.planFeatures") }}</p>
          <ul class="mt-2 space-y-1.5">
            <li
              v-for="(feature, idx) in subscription.features"
              :key="idx"
              class="flex items-start gap-2 text-sm text-neutral-700"
            >
              <svg
                class="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-3">
        <button
          v-if="subscription.planCode"
          type="button"
          :class="[
            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
            subscription.hasActiveSubscription
              ? 'bg-neutral-100 text-neutral-400'
              : 'bg-[#7c7cf8] text-white hover:bg-[#6b6be8]',
          ]"
          :disabled="cancelling || subscription.hasActiveSubscription"
          :title="subscription.hasActiveSubscription ? t('tenant.subscription.renewalAvailableAtEnd') : undefined"
          @click="$emit('renew')"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7v5h-5M4 17v-5h5m-4.1-3a7 7 0 0 1 11.6-2.6L20 12M4 12l3.5 3.6A7 7 0 0 0 19.1 15"
            />
          </svg>
          {{ subscription.hasActiveSubscription
            ? t("tenant.subscription.renewalAvailableAtEnd")
            : t("tenant.subscription.renewSubscription") }}
        </button>
        <button
          v-if="subscription.canCancel"
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="cancelling"
          @click="$emit('cancel')"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 9l6 6m0-6l-6 6"
            />
          </svg>
          {{ cancelling ? t("tenant.subscription.cancelling") : t("tenant.subscription.cancelSubscription") }}
        </button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  subscription: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  cancelling: { type: Boolean, default: false },
});

defineEmits(["cancel", "renew"]);

const applicationUrlLabel = computed(() =>
  String(props.subscription?.applicationUrl || "").replace(/^https?:\/\//, ""),
);

const statusClass = computed(() => {
  const status = String(props.subscription?.status || "").toLowerCase();

  if (status === "active") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "cancelled") {
    return "bg-rose-50 text-rose-700";
  }

  return "bg-neutral-100 text-neutral-600";
});
</script>
