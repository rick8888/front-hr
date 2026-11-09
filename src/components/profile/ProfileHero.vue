<template>
  <section
    class="rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden"
  >
    <!-- Banner abstrait -->
    <div class="relative h-44 sm:h-48 bg-gradient-to-r from-teal-200 via-stone-200 to-rose-200">
      <span class="absolute inset-y-0 left-0 w-1/2 bg-teal-300/70"
        style="clip-path: polygon(0 0, 60% 0, 90% 100%, 0% 100%);"
      />
      <span class="absolute inset-y-0 left-1/3 w-1/3 bg-stone-200/80"
        style="clip-path: polygon(15% 0, 85% 0, 100% 100%, 0 100%);"
      />
      <span class="absolute inset-y-0 right-0 w-2/5 bg-rose-200/80"
        style="clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);"
      />
      <span class="absolute inset-y-0 right-0 w-1/4 bg-rose-300/60"
        style="clip-path: polygon(40% 0, 100% 0, 100% 100%, 70% 100%);"
      />
    </div>

    <!-- Identité -->
    <div class="relative px-6 sm:px-8 pb-6">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div class="flex items-end gap-4 sm:gap-6">
          <!-- Avatar overlap -->
          <div class="-mt-12 sm:-mt-14 flex flex-col items-center gap-2">
            <div
              v-if="loading"
              :class="[
                'w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-white flex items-center justify-center font-semibold text-2xl sm:text-3xl',
                identity.avatarBg,
              ]"
            >
              <span
                class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white/70 border-t-secondary-600"
                aria-hidden="true"
              />
            </div>
            <EmployeeAvatar
              v-else
              :name="identity.name"
              :avatar-url="identity.avatarUrl"
              size-class="h-24 w-24 sm:h-28 sm:w-28 text-2xl sm:text-3xl"
              :fallback-class="identity.avatarBg"
              class="ring-4 ring-white"
            />
            <button
              v-if="!loading"
              type="button"
              class="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium hover:bg-neutral-200 transition-colors"
              @click="$emit('change-avatar')"
            >
              {{ t("ss.profile.hero.changeAvatar") }}
            </button>
          </div>

          <div class="pt-2 sm:pt-4">
            <h1
              v-if="loading"
              class="h-7 w-48 animate-pulse rounded bg-neutral-100"
              aria-hidden="true"
            />
            <h1 v-else class="text-xl sm:text-2xl font-semibold text-neutral-900">
              {{ identity.name }}
            </h1>
            <div
              v-if="loading"
              class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2"
              aria-busy="true"
            >
              <span class="h-4 w-40 animate-pulse rounded bg-neutral-100" />
              <span class="h-4 w-32 animate-pulse rounded bg-neutral-100" />
              <span class="h-4 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
            <div v-else class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-600">
              <span class="inline-flex items-center gap-1.5">
                <ProfileIcon name="mail" size="sm" />
                {{ identity.email }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <ProfileIcon name="calendar" size="sm" />
                {{ t("ss.profile.hero.joined", { date: identity.joinedLabel }) }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <ProfileIcon name="flag" size="sm" />
                {{ t("ss.profile.hero.status", { status: identity.statusLabel }) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Pill connection -->
        <div class="pt-2 sm:pt-4">
          <span
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-500 text-white text-sm font-medium shadow-sm"
          >
            <ProfileIcon name="bolt" size="sm" />
            {{ identity.connectionLabel }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ProfileIcon from "./ProfileIcon.vue";
import EmployeeAvatar from "../common/EmployeeAvatar.vue";
import { useI18n } from "../../i18n/index.js";

defineProps({
  identity: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["change-avatar"]);

const { t } = useI18n();
</script>
