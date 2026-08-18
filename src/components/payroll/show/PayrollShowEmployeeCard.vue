<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
    <div class="px-5 py-4 border-b border-neutral-200 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <svg class="w-5 h-5 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <h2 class="text-lg font-semibold text-neutral-900 truncate">Employee Information</h2>
      </div>
      <span
        v-if="approvalBadge"
        class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 shrink-0"
      >
        {{ approvalBadgeLabel }}
      </span>
    </div>

    <div class="p-5 grid gap-6 lg:grid-cols-2">
      <!-- Profil -->
      <div class="flex items-start gap-4 min-w-0">
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
          :style="{ backgroundColor: avatarColor }"
        >
          {{ initials }}
        </div>
        <div class="min-w-0 space-y-2">
          <div>
            <p class="text-xl font-bold text-neutral-900">{{ detail.employeeName }}</p>
            <p class="text-sm text-neutral-500 font-mono">{{ detail.empCode }}</p>
          </div>
          <ul class="space-y-1.5 text-sm text-neutral-600">
            <li class="flex items-center gap-2 min-w-0">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span class="truncate">{{ detail.email }}</span>
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {{ detail.phone }}
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8"
                />
              </svg>
              {{ detail.role }}
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {{ detail.department }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Infos paie -->
      <div class="min-w-0">
        <h3 class="text-sm font-semibold text-neutral-800 uppercase tracking-wide mb-3">
          Payroll Information
        </h3>
        <dl class="space-y-3 text-sm">
          <div class="flex items-center justify-between gap-3">
            <dt class="text-neutral-500">Payroll Number</dt>
            <dd>
              <span
                class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-100 text-secondary-800"
              >
                {{ detail.payrollNumber }}
              </span>
            </dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-neutral-500">Period</dt>
            <dd class="font-medium text-neutral-900">{{ detail.periodLabel }}</dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-neutral-500">Cycle</dt>
            <dd class="font-medium text-neutral-900">{{ detail.cycle }}</dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-neutral-500">Pay Date</dt>
            <dd class="font-medium text-neutral-900">{{ detail.payDate }}</dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-neutral-500">Status</dt>
            <dd>
              <span
                :class="['inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium', statusBadgeClass]"
              >
                {{ statusLabel }}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  detail: { type: Object, required: true },
  statusKey: { type: String, default: "pending" },
  statusLabel: { type: String, default: "Pending" },
  statusBadgeClass: { type: String, default: "bg-amber-100 text-amber-800" },
});

const approvalBadge = computed(() => props.detail.approvalBadge || props.detail.approval?.status);
const approvalBadgeLabel = computed(() => {
  const k = approvalBadge.value;
  if (!k) return "";
  return k === "approved" ? "Approved" : String(k).charAt(0).toUpperCase() + String(k).slice(1);
});

const initials = computed(() => {
  const name = props.detail.employeeName || "";
  const p = name.split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "??";
});

const avatarColor = computed(() => {
  const name = props.detail.employeeName || "";
  const colors = ["#6366f1", "#8b5cf6", "#0ea5e9", "#059669", "#d97706", "#7c3aed", "#ec4899"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return colors[h % colors.length];
});
</script>
