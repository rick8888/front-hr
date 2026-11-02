<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-6xl mx-auto space-y-4">
    <div
      v-if="pageError"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ pageError }}
    </div>
    <div
      v-else-if="extrasError"
      class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
    >
      {{ extrasError }}
    </div>

    <!-- Header (titre + breadcrumb) -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-xl font-semibold tracking-wide text-neutral-900">
        <Skeleton v-if="profileLoading" box-class="h-6 w-48" />
        <span v-else>{{ employee.name }}</span>
      </h1>
      <nav
        class="text-sm text-neutral-500 flex items-center gap-1.5"
        :aria-label="t('common.breadcrumb')"
      >
        <RouterLink to="/" class="hover:text-secondary-600 inline-flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10.5L12 4l9 6.5M5 10v9a1 1 0 001 1h3m10-10v9a1 1 0 01-1 1h-3m-6 0h6m-6 0v-5a1 1 0 011-1h4a1 1 0 011 1v5"
            />
          </svg>
          {{ t("common.home") }}
        </RouterLink>
        <span>/</span>
        <RouterLink to="/employees" class="hover:text-secondary-600">{{ t("admin.employees.title") }}</RouterLink>
        <span>/</span>
        <Skeleton v-if="profileLoading" box-class="h-4 w-32" />
        <span v-else class="text-neutral-800 font-medium">{{ employee.name }}</span>
      </nav>
    </div>

    <!-- Profile card -->
    <div
      class="relative rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5"
    >
      <!-- Avatar -->
      <div class="relative flex-shrink-0">
        <Skeleton
          v-if="profileLoading"
          rounded="rounded-full"
          box-class="h-24 w-24"
        />
        <div
          v-else
          class="w-24 h-24 rounded-full bg-secondary-100 text-secondary-600 font-semibold text-2xl flex items-center justify-center"
        >
          {{ initials }}
        </div>
        <span
          v-if="!profileLoading"
          class="absolute bottom-0 right-0 w-7 h-7 rounded-full border border-secondary-200 bg-white text-secondary-500 flex items-center justify-center"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 9a2 2 0 012-2h2l1.5-2h7L17 7h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </span>
      </div>

      <!-- Identité -->
      <div class="flex-1 min-w-0 w-full">
        <template v-if="profileLoading">
          <Skeleton box-class="h-6 w-52" />
          <div class="mt-2 flex items-center gap-2">
            <Skeleton box-class="h-5 w-20" />
            <Skeleton box-class="h-5 w-16" />
          </div>
          <div class="mt-3 flex flex-wrap gap-3">
            <Skeleton box-class="h-4 w-36" />
            <Skeleton box-class="h-4 w-28" />
            <Skeleton box-class="h-4 w-32" />
          </div>
          <div class="mt-2 flex flex-wrap gap-3">
            <Skeleton box-class="h-4 w-44" />
            <Skeleton box-class="h-4 w-32" />
          </div>
        </template>
        <template v-else>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="text-xl font-bold text-neutral-900">
            {{ employee.name }}
          </h2>
        </div>
        <div class="flex items-center gap-2 mt-1.5 flex-wrap">
          <span
            class="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 text-xs font-medium"
          >
            {{ employee.code }}
          </span>
          <span
            class="px-2 py-0.5 rounded text-xs font-medium"
            :class="statusBadgeClass"
          >
            {{ statusLabel }}
          </span>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-neutral-600">
          <span class="inline-flex items-center gap-1.5">
            <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            {{ employee.designation }}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4 0a4 4 0 100-8 4 4 0 000 8z"/></svg>
            {{ employee.team }}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            {{ tenureLabel }}
          </span>
        </div>
        <div class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-neutral-600">
          <span class="inline-flex items-center gap-1.5">
            <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l9 6 9-6m-18 0v8a2 2 0 002 2h14a2 2 0 002-2V8M3 8l2-2h14l2 2"/></svg>
            {{ employee.email || "—" }}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"/></svg>
            {{ employee.phone || "—" }}
          </span>
        </div>
        </template>
      </div>

      <!-- Actions -->
      <div
        v-if="canShowEmployeeActions"
        class="flex flex-col gap-2 w-full sm:w-48 flex-shrink-0"
      >
        <!-- Edit dropdown -->
        <div ref="editRoot" class="relative">
          <button
            type="button"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm disabled:opacity-50"
            :disabled="profileLoading"
            @click="editOpen = !editOpen"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            {{ t("admin.employees.view.edit") }}
            <svg
              class="w-3.5 h-3.5 transition-transform"
              :class="{ 'rotate-180': editOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="editOpen"
              class="absolute right-0 top-full mt-2 w-56 rounded-lg border border-neutral-200 bg-white shadow-lg overflow-hidden z-20"
              role="menu"
            >
              <button
                v-for="e in editActions"
                :key="e.id"
                type="button"
                class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left text-neutral-700 hover:bg-neutral-50 transition-colors"
                role="menuitem"
                @click="runEditAction(e)"
              >
                <span class="[&_svg]:w-4 [&_svg]:h-4 text-secondary-500" v-html="e.icon"></span>
                {{ e.label }}
              </button>
            </div>
          </transition>
        </div>

        <!-- Actions dropdown (RH admin uniquement) -->
        <div v-if="canManageEmployees" ref="actionsRoot" class="relative">
          <button
            type="button"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50"
            :disabled="profileLoading"
            :class="
              actionsOpen
                ? 'bg-neutral-700 border-neutral-700 text-white hover:bg-neutral-800'
                : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
            "
            @click="actionsOpen = !actionsOpen"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01A1.65 1.65 0 009 4.6V4a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.01a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            {{ t("admin.employees.view.actions") }}
            <svg
              class="w-3.5 h-3.5 transition-transform"
              :class="{ 'rotate-180': actionsOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="actionsOpen"
              class="absolute right-0 top-full mt-2 w-56 rounded-lg border border-neutral-200 bg-white shadow-lg overflow-hidden z-20"
              role="menu"
            >
              <button
                v-for="a in employeeActions"
                :key="a.id"
                type="button"
                class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors"
                :class="
                  a.variant === 'danger'
                    ? 'text-error-600 hover:bg-error-50'
                    : 'text-neutral-700 hover:bg-neutral-50'
                "
                role="menuitem"
                @click="runEmployeeAction(a)"
              >
                <span class="[&_svg]:w-4 [&_svg]:h-4" v-html="a.icon"></span>
                {{ a.label }}
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 pb-1">
      <button
        v-for="tabItem in tabs"
        :key="tabItem.id"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="
          tab === tabItem.id
            ? 'bg-secondary-500 text-white shadow-sm'
            : 'text-neutral-600 hover:bg-neutral-100'
        "
        @click="tab = tabItem.id"
      >
        <span class="[&_svg]:w-4 [&_svg]:h-4" v-html="tabItem.icon"></span>
        {{ tabItem.label }}
      </button>
    </div>

    <!-- ============== OVERVIEW ============== -->
    <div v-if="tab === 'overview'" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          :label="t('admin.employees.view.kpi.totalLeave')"
          :value="employee.kpis.totalLeave"
          :loading="extrasLoading"
          :sub="t('admin.employees.view.kpi.days')"
          icon-bg="bg-secondary-50"
          icon-color="text-secondary-500"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </KpiCard>
        <KpiCard
          :label="t('admin.employees.view.kpi.attendance')"
          :value="`${employee.kpis.attendanceRate}%`"
          :loading="extrasLoading"
          :sub="t('admin.employees.view.kpi.thisMonth')"
          icon-bg="bg-success-50"
          icon-color="text-success-600"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </KpiCard>
        <KpiCard
          :label="t('admin.employees.view.kpi.pendingApprovals')"
          :value="employee.kpis.pendingApprovals"
          :loading="extrasLoading"
          :sub="t('admin.employees.view.kpi.requests')"
          icon-bg="bg-warning-50"
          icon-color="text-warning-600"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </KpiCard>
        <KpiCard
          :label="t('admin.employees.view.kpi.activeWarnings')"
          :value="employee.kpis.activeWarnings"
          :loading="extrasLoading"
          :sub="t('admin.employees.view.kpi.disciplinary')"
          icon-bg="bg-error-50"
          icon-color="text-error-600"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86l-8.2 14.2A2 2 0 003.82 21h16.36a2 2 0 001.73-2.94l-8.2-14.2a2 2 0 00-3.42 0z"/></svg>
        </KpiCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card :title="t('admin.employees.view.employmentStatus')" class="lg:col-span-1 relative">
          <div
            v-if="profileLoading"
            class="space-y-4"
            aria-busy="true"
          >
            <div v-for="i in 6" :key="i" class="flex items-center justify-between gap-4">
              <Skeleton box-class="h-3.5 w-24" />
              <Skeleton box-class="h-3.5 w-32" />
            </div>
          </div>
          <div v-else class="space-y-3 text-sm">
            <InfoLine icon="status">
              <template #label>{{ t("admin.employees.view.status") }}</template>
              <template #value>
                <span
                  class="px-2 py-0.5 rounded text-xs font-medium"
                  :class="statusBadgeClass"
                  >{{ statusLabel }}</span
                >
              </template>
            </InfoLine>
            <InfoLine icon="briefcase">
              <template #label>{{ t("admin.employees.view.designation") }}</template>
              <template #value>{{ employee.designation }}</template>
            </InfoLine>
            <InfoLine icon="users">
              <template #label>{{ t("admin.employees.view.team") }}</template>
              <template #value>{{ employee.team }}</template>
            </InfoLine>
            <InfoLine icon="user">
              <template #label>{{ t("admin.employees.view.reportingTo") }}</template>
              <template #value>{{ employee.reportingManager }}</template>
            </InfoLine>
            <InfoLine icon="calendar">
              <template #label>{{ t("admin.employees.view.joiningDate") }}</template>
              <template #value>{{ formatDate(employee.joinDate) }}</template>
            </InfoLine>
            <InfoLine icon="clock">
              <template #label>{{ t("admin.employees.view.tenure") }}</template>
              <template #value>{{ tenureDetailedLabel }}</template>
            </InfoLine>
          </div>
        </Card>

        <Card :title="t('admin.employees.view.recentActivity')" class="lg:col-span-2">
          <div
            v-if="activitiesLoading"
            class="space-y-1"
            aria-busy="true"
          >
            <div
              v-for="i in 4"
              :key="i"
              class="flex items-start gap-3 py-3"
            >
              <Skeleton rounded="rounded-lg" box-class="h-9 w-9 shrink-0" />
              <div class="min-w-0 flex-1 space-y-2">
                <Skeleton box-class="h-3.5 w-3/5" />
                <Skeleton box-class="h-3 w-2/5" />
              </div>
            </div>
          </div>
          <EmptyState
            v-else-if="!recentActivityTotal"
            :message="t('admin.employees.view.emptyActivity')"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </EmptyState>
          <template v-else>
            <ul class="divide-y divide-neutral-100 -mx-2">
              <li
                v-for="(a, i) in paginatedRecentActivity"
                :key="a.id ?? i"
                class="flex items-start gap-3 py-3 px-2"
              >
                <span
                  class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 [&_svg]:w-4 [&_svg]:h-4"
                  :class="activityMeta(a.type).classes"
                  v-html="activityMeta(a.type).icon"
                ></span>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-3">
                    <p class="text-sm font-medium text-neutral-800 truncate">
                      {{ a.title }}
                    </p>
                    <span
                      v-if="a.status"
                      class="inline-flex flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
                      :class="statusBadge(a.status)"
                    >
                      {{ displayRecordStatus(a.status) }}
                    </span>
                  </div>
                  <p
                    v-if="a.description"
                    class="text-xs text-neutral-500 mt-0.5 truncate"
                  >
                    {{ a.description }}
                  </p>
                  <p class="text-xs text-neutral-400 mt-0.5">
                    {{ formatRelative(a.timestamp) }}
                  </p>
                </div>
              </li>
            </ul>

            <div
              v-if="activityPageCount > 1"
              class="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="text-xs text-neutral-500">
                {{ t("common.showingEntries", {
                  from: activityRange.from,
                  to: activityRange.to,
                  total: recentActivityTotal,
                }) }}
              </p>
              <nav class="flex flex-wrap items-center justify-end gap-2" :aria-label="t('admin.employees.view.activityPagination')">
                <button
                  type="button"
                  class="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-40"
                  :disabled="activityPage <= 1"
                  @click="activityPage = activityPage - 1"
                >
                  {{ t("common.previous") }}
                </button>
                <template v-for="(item, idx) in activityVisiblePages" :key="idx">
                  <span
                    v-if="item === 'ellipsis'"
                    class="px-1 text-xs text-neutral-400"
                  >...</span>
                  <button
                    v-else
                    type="button"
                    class="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md text-xs font-medium transition-colors"
                    :class="
                      item === activityPage
                        ? 'bg-secondary-500 text-white shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    "
                    @click="activityPage = item"
                  >
                    {{ item }}
                  </button>
                </template>
                <button
                  type="button"
                  class="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-40"
                  :disabled="activityPage >= activityPageCount"
                  @click="activityPage = activityPage + 1"
                >
                  {{ t("common.next") }}
                </button>
              </nav>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- ============== PERSONAL INFO ============== -->
    <div v-else-if="tab === 'personal'">
      <Card :title="t('admin.employees.show.personal')">
        <template #header-right>
          <EditPill
            :class="profileLoading ? 'pointer-events-none opacity-50' : ''"
            @click="!profileLoading && (basicInfoModalOpen = true)"
          />
        </template>

        <div
          v-if="profileLoading"
          class="space-y-6"
          aria-busy="true"
        >
          <div>
            <Skeleton box-class="h-4 w-36 mb-4" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div v-for="i in 4" :key="'p1-' + i" class="space-y-2">
                <Skeleton box-class="h-3 w-24" />
                <Skeleton box-class="h-4 w-40" />
              </div>
            </div>
          </div>
          <div>
            <Skeleton box-class="h-4 w-40 mb-4" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div v-for="i in 3" :key="'p2-' + i" class="space-y-2">
                <Skeleton box-class="h-3 w-24" />
                <Skeleton box-class="h-4 w-44" />
              </div>
            </div>
          </div>
          <div>
            <Skeleton box-class="h-4 w-48 mb-4" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div v-for="i in 4" :key="'p3-' + i" class="space-y-2">
                <Skeleton box-class="h-3 w-24" />
                <Skeleton box-class="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>
        <template v-else>
          <SubTitle>{{ t("admin.employees.view.basicInfo") }}</SubTitle>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-4">
            <Field :label="t('admin.employees.view.fullName')" :value="employee.name" />
            <Field :label="t('admin.employees.create.gender')" :value="genderLabel" />
            <Field :label="t('admin.employees.create.dob')" :value="dobWithAge" />
            <Field :label="t('admin.employees.create.bloodGroup')" :value="employee.bloodGroup" />
          </div>

          <Divider />

          <SubTitle>{{ t("admin.employees.view.contactInfo") }}</SubTitle>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-4">
            <Field :label="t('admin.employees.show.email')" icon="mail" :value="employee.email" is-link />
            <Field :label="t('admin.employees.create.phone')" icon="phone" :value="employee.phone" />
            <Field :label="t('admin.employees.create.address')" icon="pin" :value="employee.address" />
          </div>

          <Divider />

          <SubTitle>{{ t("admin.employees.view.emergencyContact") }}</SubTitle>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-4">
            <Field :label="t('admin.employees.create.contactName')" :value="employee.emergency.name" />
            <Field :label="t('admin.employees.create.relationship')" :value="employee.emergency.relationship" />
            <Field :label="t('admin.employees.create.phone')" icon="phone" :value="employee.emergency.phone" />
            <Field :label="t('admin.employees.create.address')" :value="employee.emergency.address" />
          </div>
        </template>
      </Card>
    </div>

    <!-- ============== EMPLOYMENT ============== -->
    <div v-else-if="tab === 'employment'">
      <Card :title="t('admin.employees.view.employmentInfo')">
        <template #header-right>
          <EditPill
            :class="profileLoading ? 'pointer-events-none opacity-50' : ''"
            @click="!profileLoading && (workInfoModalOpen = true)"
          />
        </template>

        <div
          v-if="profileLoading"
          class="space-y-6"
          aria-busy="true"
        >
          <div>
            <Skeleton box-class="h-4 w-32 mb-4" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div v-for="i in 7" :key="'w1-' + i" class="space-y-2">
                <Skeleton box-class="h-3 w-24" />
                <Skeleton box-class="h-4 w-40" />
              </div>
            </div>
          </div>
          <div>
            <Skeleton box-class="h-4 w-40 mb-4" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div v-for="i in 4" :key="'w2-' + i" class="space-y-2">
                <Skeleton box-class="h-3 w-28" />
                <Skeleton box-class="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>
        <template v-else>
          <SubTitle>{{ t("admin.employees.view.workInfo") }}</SubTitle>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-4">
            <Field :label="t('admin.employees.create.code')" :value="employee.code" />
            <Field :label="t('admin.employees.create.designation')" :value="employee.designation" />
            <Field :label="t('admin.employees.create.department')" :value="employee.department || '—'" />
            <Field :label="t('admin.employees.create.team')" :value="employee.team" />
            <Field :label="t('admin.employees.create.shift')" :value="employee.shift" />
            <Field :label="t('admin.employees.create.manager')" :value="employee.reportingManager" />
            <Field :label="t('admin.employees.create.role')">
              <template #value>
                <span
                  class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-secondary-50 text-secondary-600"
                >
                  {{ roleLabel }}
                </span>
              </template>
            </Field>
          </div>

          <Divider />

          <SubTitle>{{ t("admin.employees.view.joiningDetails") }}</SubTitle>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-4">
            <Field :label="t('admin.employees.create.joiningDate')" :value="formatDate(employee.joinDate)" />
            <Field :label="t('admin.employees.view.tenurePlain')" :value="tenureDetailedLabel" />
            <Field :label="t('admin.employees.edit.employmentType')" :value="employee.employmentType" />
            <Field :label="t('admin.employees.create.attendanceType')">
              <template #value>
                <span
                  class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-info-50 text-info-600"
                >
                  {{ attendanceTypeLabel }}
                </span>
              </template>
            </Field>
          </div>
        </template>
      </Card>
    </div>

    <!-- ============== ATTENDANCE ============== -->
    <div v-else-if="tab === 'attendance'" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          :label="t('admin.employees.view.attendanceRate')"
          :value="`${Number(employee.kpis.attendanceRate || 0).toFixed(1)}%`"
          :loading="extrasLoading"
          :sub="t('admin.employees.view.last30Days')"
          icon-bg="bg-success-50"
          icon-color="text-success-600"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </KpiCard>
        <KpiCard
          :label="t('admin.employees.view.presentDays')"
          :value="employee.kpis.presentDays"
          :loading="extrasLoading"
          :sub="t('admin.employees.view.outOf', { n: employee.kpis.plannedDays || 0 })"
          icon-bg="bg-secondary-50"
          icon-color="text-secondary-500"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </KpiCard>
        <KpiCard
          :label="t('admin.employees.view.lateArrivals')"
          :value="employee.kpis.lateArrivals"
          :loading="extrasLoading"
          :sub="t('admin.employees.view.last30Days')"
          icon-bg="bg-warning-50"
          icon-color="text-warning-600"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </KpiCard>
        <KpiCard
          :label="t('admin.employees.view.absentDays')"
          :value="employee.kpis.absentDays"
          :loading="extrasLoading"
          :sub="t('admin.employees.view.last30Days')"
          icon-bg="bg-error-50"
          icon-color="text-error-600"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </KpiCard>
      </div>

      <Card :title="t('admin.employees.view.attendanceLog')">
        <div
          v-if="extrasLoading"
          class="overflow-x-auto -mx-6 -mb-6"
          aria-busy="true"
        >
          <table class="min-w-full text-sm">
            <thead class="bg-neutral-50/70 text-xs uppercase text-neutral-500">
              <tr>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.date") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.day") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.shift") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.checkIn") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.checkOut") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.workHours") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("common.status") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.remarks") }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-for="i in 6" :key="'att-sk-' + i">
                <td v-for="c in 8" :key="c" class="px-6 py-3">
                  <Skeleton box-class="h-3.5 w-16" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="overflow-x-auto -mx-6 -mb-6">
          <table class="min-w-full text-sm">
            <thead class="bg-neutral-50/70 text-xs uppercase text-neutral-500">
              <tr>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.date") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.day") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.shift") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.checkIn") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.checkOut") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.workHours") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("common.status") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.remarks") }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-if="employee.attendanceLog.length === 0">
                <td colspan="8" class="px-6 py-10 text-center text-sm text-neutral-500">
                  {{ t("admin.employees.view.emptyAttendance") }}
                </td>
              </tr>
              <tr v-for="(row, i) in employee.attendanceLog" :key="i">
                <td class="px-6 py-3 text-neutral-700">{{ formatDate(row.date) }}</td>
                <td class="px-6 py-3 text-neutral-600">{{ row.day }}</td>
                <td class="px-6 py-3 text-neutral-600">{{ row.shift }}</td>
                <td class="px-6 py-3 text-neutral-700">{{ row.checkIn }}</td>
                <td class="px-6 py-3 text-neutral-700">{{ row.checkOut }}</td>
                <td class="px-6 py-3 text-neutral-700">{{ row.workHours }}</td>
                <td class="px-6 py-3">
                  <span
                    class="inline-flex px-2 py-0.5 rounded text-xs font-medium"
                    :class="statusBadge(row.status)"
                  >
                    {{ displayRecordStatus(row.status) }}
                  </span>
                </td>
                <td class="px-6 py-3 text-neutral-500">{{ row.remarks || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>

    <!-- ============== LEAVE ============== -->
    <div v-else-if="tab === 'leave'" class="space-y-4">
      <Card :title="t('admin.employees.view.leaveBalance')">
        <div
          v-if="extrasLoading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          aria-busy="true"
        >
          <div
            v-for="i in 4"
            :key="'lb-sk-' + i"
            class="rounded-xl border border-neutral-200 p-4"
          >
            <div class="flex items-start justify-between">
              <Skeleton rounded="rounded-lg" box-class="h-9 w-9" />
              <Skeleton box-class="h-5 w-10" />
            </div>
            <Skeleton box-class="h-4 w-28 mt-3" />
            <Skeleton box-class="h-3 w-36 mt-2" />
            <Skeleton box-class="h-1.5 w-full mt-2" rounded="rounded-full" />
          </div>
        </div>
        <EmptyState
          v-else-if="leaveBalances.length === 0"
          :message="t('admin.employees.view.emptyBalances')"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </EmptyState>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="lt in leaveBalances"
            :key="lt.name"
            class="rounded-xl border border-neutral-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div
                class="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-500 flex items-center justify-center"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <span
                class="px-2 py-0.5 rounded bg-error-50 text-error-600 text-xs font-semibold"
              >
                {{ lt.remaining.toFixed(1) }}
              </span>
            </div>
            <div class="mt-3 text-sm font-semibold text-neutral-800">
              {{ lt.name }}
            </div>
            <div class="text-xs text-neutral-500 mt-1">
              {{ t("admin.employees.view.usedOf", { used: lt.used.toFixed(1), total: lt.total.toFixed(1) }) }}
            </div>
            <div class="mt-2 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
              <div
                class="h-full rounded-full bg-secondary-500 transition-[width] duration-300"
                :style="{
                  width: (lt.total > 0 ? (Number(lt.used) / Number(lt.total)) * 100 : 0) + '%',
                }"
              ></div>
            </div>
          </div>
        </div>
      </Card>

      <Card :title="t('admin.employees.view.leaveHistory')">
        <div
          v-if="extrasLoading"
          class="overflow-x-auto -mx-6 -mb-6"
          aria-busy="true"
        >
          <table class="min-w-full text-sm">
            <thead class="bg-neutral-50/70 text-xs uppercase text-neutral-500">
              <tr>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.leaveType") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.fromDate") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.toDate") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.days") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("common.status") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.reason") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.appliedOn") }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-for="i in 5" :key="'lh-sk-' + i">
                <td v-for="c in 7" :key="c" class="px-6 py-3">
                  <Skeleton box-class="h-3.5 w-16" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="overflow-x-auto -mx-6 -mb-6">
          <table class="min-w-full text-sm">
            <thead class="bg-neutral-50/70 text-xs uppercase text-neutral-500">
              <tr>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.leaveType") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.fromDate") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.toDate") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.days") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("common.status") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.reason") }}</th>
                <th class="px-6 py-3 text-left font-medium">{{ t("admin.employees.view.col.appliedOn") }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-if="employee.leaveHistory.length === 0">
                <td colspan="7" class="px-6 py-10 text-center text-sm text-neutral-500">
                  {{ t("admin.employees.view.emptyLeave") }}
                </td>
              </tr>
              <tr v-for="(row, i) in employee.leaveHistory" :key="i">
                <td class="px-6 py-3 font-medium text-neutral-800">{{ row.type }}</td>
                <td class="px-6 py-3 text-neutral-600">{{ formatDate(row.from) }}</td>
                <td class="px-6 py-3 text-neutral-600">{{ formatDate(row.to) }}</td>
                <td class="px-6 py-3 text-neutral-700">{{ row.days }}</td>
                <td class="px-6 py-3">
                  <span
                    class="inline-flex px-2 py-0.5 rounded text-xs font-medium"
                    :class="statusBadge(row.status)"
                  >
                    {{ displayRecordStatus(row.status) }}
                  </span>
                </td>
                <td class="px-6 py-3 text-neutral-500">{{ row.reason }}</td>
                <td class="px-6 py-3 text-neutral-500">{{ formatDate(row.appliedOn) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>

    <!-- ============== DOCUMENTS ============== -->
    <div v-else-if="tab === 'documents'">
      <EmployeeProfileDocumentsPanel
        :employee-id="employee.id"
        :can-generate="canManageEmployees"
        :reload-key="documentsReloadKey"
        @generate="generateDocModalOpen = true"
      />
    </div>

    <!-- ============== TIMELINE ============== -->
    <div v-else-if="tab === 'timeline'">
      <Card :title="t('admin.employees.view.timelineTitle')">
        <template #header-right>
          <div class="inline-flex rounded-lg border border-neutral-200 overflow-hidden text-xs">
            <button
              v-for="f in timelineFilters"
              :key="f.id"
              type="button"
              class="px-3 py-1.5 font-medium transition-colors"
              :class="
                timelineFilter === f.id
                  ? 'bg-secondary-500 text-white'
                  : 'text-secondary-600 hover:bg-secondary-50'
              "
              @click="timelineFilter = f.id"
            >
              {{ f.label }}
            </button>
          </div>
        </template>

        <div
          v-if="extrasLoading"
          class="relative border-l border-neutral-200 ml-3 space-y-5"
          aria-busy="true"
        >
          <div v-for="i in 4" :key="'tl-sk-' + i" class="ml-6 space-y-2">
            <Skeleton box-class="h-4 w-48" />
            <Skeleton box-class="h-3 w-24" />
            <Skeleton box-class="h-3 w-64" />
          </div>
        </div>
        <EmptyState
          v-else-if="filteredTimelineTotal === 0"
          :message="t('admin.employees.view.emptyTimeline')"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </EmptyState>
        <template v-else>
          <ol class="relative border-l border-neutral-200 ml-3 space-y-5">
            <li
              v-for="(ev, i) in paginatedTimeline"
              :key="ev.id ?? i"
              class="ml-6"
            >
              <span
                class="absolute -left-1.5 w-3 h-3 rounded-full bg-secondary-500 border-2 border-white"
              ></span>
              <div class="text-sm font-medium text-neutral-800">{{ ev.title }}</div>
              <div class="text-xs text-neutral-500">{{ ev.date }}</div>
              <p v-if="ev.description" class="text-sm text-neutral-600 mt-1">
                {{ ev.description }}
              </p>
            </li>
          </ol>

          <div
            v-if="timelinePageCount > 1"
            class="mt-5 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p class="text-xs text-neutral-500">
              {{ t("common.showingEntries", {
                from: timelineRange.from,
                to: timelineRange.to,
                total: filteredTimelineTotal,
              }) }}
            </p>
            <nav
              class="flex flex-wrap items-center justify-end gap-2"
              :aria-label="t('admin.employees.view.timelinePagination')"
            >
              <button
                type="button"
                class="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-40"
                :disabled="timelinePage <= 1"
                @click="timelinePage = timelinePage - 1"
              >
                {{ t("common.previous") }}
              </button>
              <template v-for="(item, idx) in timelineVisiblePages" :key="idx">
                <span
                  v-if="item === 'ellipsis'"
                  class="px-1 text-xs text-neutral-400"
                >...</span>
                <button
                  v-else
                  type="button"
                  class="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md text-xs font-medium transition-colors"
                  :class="
                    item === timelinePage
                      ? 'bg-secondary-500 text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  "
                  @click="timelinePage = item"
                >
                  {{ item }}
                </button>
              </template>
              <button
                type="button"
                class="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 disabled:pointer-events-none disabled:opacity-40"
                :disabled="timelinePage >= timelinePageCount"
                @click="timelinePage = timelinePage + 1"
              >
                {{ t("common.next") }}
              </button>
            </nav>
          </div>
        </template>
      </Card>
    </div>

    <!-- Modal : Edit Basic Information -->
    <EditBasicInfoModal
      v-model="basicInfoModalOpen"
      :employee="employee"
      :saving="basicSaving"
      :save-error="basicSaveError"
      @save="onBasicInfoSaved"
    />

    <!-- Modal : Edit Work Information -->
    <EditWorkInfoModal
      v-model="workInfoModalOpen"
      :employee="employee"
      :designations="designations"
      :roles="roleOptions"
      :departments="departments"
      :teams="teams"
      :shifts="shifts"
      :managers="managers"
      :attendance-types="attendanceTypes"
      :catalog-loading="resourcesLoading"
      :catalog-error="resourcesError"
      :saving="workSaving"
      :save-error="workSaveError"
      @save="onWorkInfoSaved"
    />

    <!-- Modal : Suspend Employee -->
    <SuspendEmployeeModal
      v-model="suspendModalOpen"
      :employee="employee"
      :busy="suspendBusy"
      :save-error="suspendError"
      @confirm="onSuspendConfirm"
    />

    <!-- Modal : Initiate Termination -->
    <TerminateEmployeeModal
      v-model="terminateModalOpen"
      :employee="employee"
      :busy="terminateBusy"
      :save-error="terminateError"
      @confirm="onTerminateConfirm"
    />

    <GenerateEmployeeDocumentModal
      v-model="generateDocModalOpen"
      :employee="employee"
      @generated="onDocumentGenerated"
    />

    <!-- Confirm Dialog (SweetAlert-style) -->
    <ConfirmDialog
      :model-value="confirmState.open"
      :title="confirmState.title"
      :message="confirmState.message"
      :variant="confirmState.variant"
      :confirm-text="confirmState.confirmText"
      :loading-text="confirmState.loadingText"
      :cancel-text="t('common.cancel')"
      :busy="confirmBusy"
      @confirm="handleConfirmOk"
      @cancel="handleConfirmCancel"
      @update:model-value="(v) => !v && handleConfirmCancel()"
    />
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import EditBasicInfoModal from "../components/employee/EditBasicInfoModal.vue";
import EditWorkInfoModal from "../components/employee/EditWorkInfoModal.vue";
import SuspendEmployeeModal from "../components/employee/SuspendEmployeeModal.vue";
import TerminateEmployeeModal from "../components/employee/TerminateEmployeeModal.vue";
import GenerateEmployeeDocumentModal from "../components/employee/GenerateEmployeeDocumentModal.vue";
import EmployeeProfileDocumentsPanel from "../components/employee/EmployeeProfileDocumentsPanel.vue";
import ConfirmDialog from "../components/common/ConfirmDialog.vue";
import Skeleton from "../components/common/Skeleton.vue";
import { employeesApiService } from "./employees/services/employees.api.service.js";
import { normalizeEmployeeDetail } from "./employees/composables/useEmployees.js";
import { useEditWorkInfo } from "./employees/composables/useEditWorkInfo.js";
import { useEditBasicInfo } from "./employees/composables/useEditBasicInfo.js";
import { useEmployeeActivities } from "./employees/composables/useEmployeeActivities.js";
import {
  emptyExtras,
  loadEmployeeDetailExtras,
} from "./employees/composables/useEmployeeDetailExtras.js";
import { getVisiblePages } from "../composables/useLeaveRequestsTable.js";
import { parseApiError } from "../utils/apiErrors.js";
import { useI18n } from "../i18n/index.js";
import { useAuthStore } from "../stores/authStore.js";

const { t, locale, bcp47 } = useI18n();
const authStore = useAuthStore();
const canManageEmployees = computed(() => authStore.can("employees.manage"));
const canEditTeamWorkInfo = computed(
  () =>
    authStore.user?.role === "team_manager" &&
    authStore.can("attendance.manage"),
);
const canShowEmployeeActions = computed(
  () => canManageEmployees.value || canEditTeamWorkInfo.value,
);

const route = useRoute();
const router = useRouter();

const employee = ref(normalizeEmployeeDetail({}));
const profileLoading = ref(true);
const pageError = ref("");
const extrasLoading = ref(false);
const extrasError = ref("");

const {
  loading: resourcesLoading,
  error: resourcesError,
  teams,
  designations,
  departments,
  shifts,
  managers,
  attendanceTypes,
  roleOptions,
  ensureResources,
  save: saveWorkInfo,
  saving: workSaving,
  saveError: workSaveError,
} = useEditWorkInfo();

const {
  saving: basicSaving,
  saveError: basicSaveError,
  save: saveBasicInfo,
} = useEditBasicInfo();

const {
  paginatedActivities: paginatedRecentActivity,
  loading: activitiesLoading,
  load: loadActivities,
  page: activityPage,
  pageCount: activityPageCount,
  totalFiltered: recentActivityTotal,
  rangeLabel: activityRange,
  visiblePages: activityVisiblePages,
} = useEmployeeActivities({ pageSize: 5 });

async function applyExtras(detail) {
  extrasLoading.value = true;
  extrasError.value = "";
  try {
    const extras = await loadEmployeeDetailExtras(detail);
    employee.value = {
      ...employee.value,
      kpis: extras.kpis,
      attendanceLog: extras.attendanceLog,
      leaveBalances: extras.leaveBalances,
      leaveHistory: extras.leaveHistory,
      timeline: extras.timeline,
    };
    if (extras.error) extrasError.value = extras.error;
  } catch (e) {
    extrasError.value =
      parseApiError(e) || t("admin.employees.view.extrasError");
    const fallback = emptyExtras();
    employee.value = {
      ...employee.value,
      ...fallback,
    };
  } finally {
    extrasLoading.value = false;
  }
}

async function loadEmployee() {
  profileLoading.value = true;
  pageError.value = "";
  extrasError.value = "";
  timelinePage.value = 1;
  timelineFilter.value = "all";
  try {
    const raw = await employeesApiService.fetchById(route.params.id);
    const detail = normalizeEmployeeDetail(raw);
    employee.value = detail;
    profileLoading.value = false;
    // Extras + activités en parallèle, sans bloquer le profil
    loadActivities(detail.id);
    applyExtras(detail);
  } catch (e) {
    pageError.value = parseApiError(e) || t("admin.employees.view.loadError");
    profileLoading.value = false;
  }
}

onMounted(loadEmployee);

watch(
  () => route.params.id,
  () => {
    loadEmployee();
  }
);

const tab = ref("overview");
const timelineFilter = ref("all");

// === Menus (Edit + Actions) ===
const editOpen = ref(false);
const editRoot = ref(null);
const actionsOpen = ref(false);
const actionsRoot = ref(null);

const editActions = computed(() => {
  void locale.value;
  const items = [
    {
      id: "basic",
      label: t("admin.employees.view.basicInfo"),
      target: "personal",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
    },
    {
      id: "work",
      label: t("admin.employees.view.workInfo"),
      target: "employment",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
    },
  ];
  if (canEditTeamWorkInfo.value && !canManageEmployees.value) {
    return items.filter((item) => item.id === "work");
  }
  return items;
});

// État des modales Basic / Work Information
const basicInfoModalOpen = ref(false);
const workInfoModalOpen = ref(false);

watch(workInfoModalOpen, (open) => {
  if (open) ensureResources();
});

function runEditAction(action) {
  editOpen.value = false;
  if (action.id === "basic") {
    basicInfoModalOpen.value = true;
    return;
  }
  if (action.id === "work") {
    workInfoModalOpen.value = true;
    return;
  }
  router.push({
    path: `/employees/edit/${employee.value.id}`,
    query: { section: action.id },
  });
}

/** Conserve les blocs déjà chargés (KPI, congés, timeline) après une édition. */
function applyUpdatedEmployee(updated) {
  employee.value = {
    ...updated,
    kpis: employee.value.kpis,
    leaveBalances: employee.value.leaveBalances,
    leaveHistory: employee.value.leaveHistory,
    attendanceLog: employee.value.attendanceLog,
    timeline: employee.value.timeline,
  };
  loadActivities(employee.value.id);
}

async function onBasicInfoSaved(patch) {
  if (!employee.value?.id) return;
  try {
    applyUpdatedEmployee(await saveBasicInfo(employee.value.id, patch));
    basicInfoModalOpen.value = false;
  } catch {
    // Erreur exposée via basicSaveError dans la modal.
  }
}

async function onWorkInfoSaved(patch) {
  if (!employee.value?.id) return;
  try {
    applyUpdatedEmployee(await saveWorkInfo(employee.value.id, patch));
    workInfoModalOpen.value = false;
  } catch {
    // L'erreur est exposée via workSaveError dans la modal.
  }
}

const attendanceTypeLabel = computed(() => {
  const current = employee.value?.attendanceType;
  if (!current || current === "—") return "—";
  const found = attendanceTypes.value.find(
    (a) => a.code === current || a.name === current
  );
  return found?.name || current;
});

const roleLabel = computed(() => {
  const current = employee.value?.role;
  if (!current || current === "—") return "—";
  const found = roleOptions.value.find(
    (r) => r.slug === current || r.name === current
  );
  return found?.name || current;
});

const employeeActions = computed(() => {
  void locale.value;
  const status = String(employee.value?.status || "").toLowerCase();
  const blocked = new Set(["suspended", "terminated", "retired"]);
  return [
    {
      id: "generate-document",
      label: t("admin.employees.view.action.generateDocument"),
      variant: "default",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
    },
    {
      id: "inactive",
      label: t("admin.employees.view.action.inactive"),
      variant: "default",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 105.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"/></svg>`,
    },
    {
      id: "suspend",
      label: t("admin.employees.view.action.suspend"),
      variant: "default",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    },
    {
      id: "terminate",
      label: t("admin.employees.view.action.terminate"),
      variant: "danger",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.93 4.93l14.14 14.14M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    },
    {
      id: "retired",
      label: t("admin.employees.view.action.retired"),
      variant: "default",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10.5L12 4l9 6.5M5 10v9a1 1 0 001 1h3m10-10v9a1 1 0 01-1 1h-3m-6 0h6m-6 0v-5a1 1 0 011-1h4a1 1 0 011 1v5"/></svg>`,
    },
  ].filter((action) => {
    if (action.id === "generate-document") return canManageEmployees.value;
    if (action.id === "suspend") return !blocked.has(status);
    if (action.id === "terminate") return status !== "terminated";
    if (action.id === "inactive") return !["inactive", "terminated", "suspended"].includes(status);
    if (action.id === "retired") return !["retired", "terminated"].includes(status);
    return true;
  });
});

// === Dialogue de confirmation (SweetAlert-style) ============================
const confirmState = ref({
  open: false,
  title: "",
  message: "",
  variant: "warning",
  confirmText: t("admin.employees.view.confirm.defaultConfirm"),
  loadingText: t("common.updating"),
  onConfirm: null,
});
const confirmBusy = ref(false);

function askConfirm(opts) {
  confirmState.value = {
    open: true,
    title: opts.title || t("admin.employees.view.confirm.defaultTitle"),
    message: opts.message || "",
    variant: opts.variant || "warning",
    confirmText: opts.confirmText || t("admin.employees.view.confirm.defaultConfirm"),
    loadingText: opts.loadingText || t("common.updating"),
    onConfirm: opts.onConfirm || null,
  };
}

async function handleConfirmOk() {
  if (confirmBusy.value) return;
  confirmBusy.value = true;
  pageError.value = "";
  try {
    await confirmState.value.onConfirm?.();
    confirmState.value.open = false;
  } catch (e) {
    pageError.value = parseApiError(e) || t("common.error");
  } finally {
    confirmBusy.value = false;
  }
}

function handleConfirmCancel() {
  if (confirmBusy.value) return;
  confirmState.value.open = false;
}

// === Modale Suspend Employee (formulaire dédié) =============================
const suspendModalOpen = ref(false);
const suspendBusy = ref(false);
const suspendError = ref("");

watch(suspendModalOpen, (open) => {
  if (open) suspendError.value = "";
});

async function onSuspendConfirm(payload) {
  if (suspendBusy.value || !employee.value?.id) return;
  suspendBusy.value = true;
  suspendError.value = "";
  try {
    const updated = await employeesApiService.suspend(employee.value.id, payload);
    applyUpdatedEmployee(normalizeEmployeeDetail(updated));
    applyExtras(employee.value);
    suspendModalOpen.value = false;
  } catch (e) {
    suspendError.value =
      parseApiError(e) || t("admin.employees.view.suspend.error.submit");
  } finally {
    suspendBusy.value = false;
  }
}

// === Modale Initiate Termination (formulaire dédié) =========================
const terminateModalOpen = ref(false);
const terminateBusy = ref(false);
const terminateError = ref("");

const generateDocModalOpen = ref(false);
const documentsReloadKey = ref(0);

function onDocumentGenerated() {
  pageError.value = "";
  extrasError.value = t("admin.employees.view.generateDocument.success");
  documentsReloadKey.value += 1;
  tab.value = "documents";
  loadActivities(employee.value.id);
}

watch(terminateModalOpen, (open) => {
  if (open) terminateError.value = "";
});

async function onTerminateConfirm(payload) {
  if (terminateBusy.value || !employee.value?.id) return;
  terminateBusy.value = true;
  terminateError.value = "";
  try {
    const updated = await employeesApiService.terminate(employee.value.id, payload);
    applyUpdatedEmployee(normalizeEmployeeDetail(updated));
    applyExtras(employee.value);
    terminateModalOpen.value = false;
  } catch (e) {
    terminateError.value =
      parseApiError(e) || t("admin.employees.view.terminate.error.submit");
  } finally {
    terminateBusy.value = false;
  }
}

function runEmployeeAction(action) {
  actionsOpen.value = false;

  // Cas spécifiques : formulaires dédiés au lieu du confirm générique.
  if (action.id === "suspend") {
    suspendModalOpen.value = true;
    return;
  }
  if (action.id === "terminate") {
    terminateModalOpen.value = true;
    return;
  }
  if (action.id === "generate-document") {
    generateDocModalOpen.value = true;
    return;
  }

  const config = {
    inactive: {
      title: t("admin.employees.view.confirm.inactiveTitle"),
      message: t("admin.employees.view.confirm.inactiveMessage", {
        name: employee.value.name,
      }),
      variant: "warning",
      confirmText: t("admin.employees.view.confirm.inactiveConfirm"),
      loadingText: t("common.updating"),
      status: "inactive",
    },
    retired: {
      title: t("admin.employees.view.confirm.retiredTitle"),
      message: t("admin.employees.view.confirm.retiredMessage", {
        name: employee.value.name,
      }),
      variant: "info",
      confirmText: t("admin.employees.view.confirm.retiredConfirm"),
      loadingText: t("common.updating"),
      status: "retired",
    },
  }[action.id];

  if (!config) return;

  askConfirm({
    title: config.title,
    message: config.message,
    variant: config.variant,
    confirmText: config.confirmText,
    loadingText: config.loadingText,
    onConfirm: async () => {
      if (config.status === "inactive") {
        const updated = await employeesApiService.update(employee.value.id, {
          is_active: false,
        });
        applyUpdatedEmployee(normalizeEmployeeDetail(updated));
        return;
      }

      if (config.status === "retired") {
        const updated = await employeesApiService.retire(employee.value.id);
        applyUpdatedEmployee(normalizeEmployeeDetail(updated));
        applyExtras(employee.value);
      }
    },
  });
}

// Fermeture des menus au clic extérieur + Échap
function handleOutsideClick(e) {
  if (editRoot.value && !editRoot.value.contains(e.target)) {
    editOpen.value = false;
  }
  if (actionsRoot.value && !actionsRoot.value.contains(e.target)) {
    actionsOpen.value = false;
  }
}
function handleEscape(e) {
  if (e.key === "Escape") {
    editOpen.value = false;
    actionsOpen.value = false;
  }
}
onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleEscape);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
  document.removeEventListener("keydown", handleEscape);
});

const tabs = computed(() => {
  void locale.value;
  return [
    {
      id: "overview",
      label: t("admin.employees.view.tab.overview"),
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10.5L12 4l9 6.5M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9"/></svg>`,
    },
    {
      id: "personal",
      label: t("admin.employees.view.tab.personal"),
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
    },
    {
      id: "employment",
      label: t("admin.employees.view.tab.employment"),
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
    },
    {
      id: "attendance",
      label: t("admin.employees.view.tab.attendance"),
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m-6 9A9 9 0 1121 12 9 9 0 013 12z"/></svg>`,
    },
    {
      id: "leave",
      label: t("admin.employees.view.tab.leave"),
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
    },
    {
      id: "documents",
      label: t("admin.employees.view.tab.documents"),
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
    },
    {
      id: "timeline",
      label: t("admin.employees.view.tab.timeline"),
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    },
  ];
});

const timelineFilters = computed(() => {
  void locale.value;
  return [
    { id: "all", label: t("admin.employees.view.filter.all") },
    { id: "status", label: t("admin.employees.view.filter.status") },
    { id: "probation", label: t("admin.employees.view.filter.probation") },
    { id: "changes", label: t("admin.employees.view.filter.changes") },
  ];
});

const timelinePage = ref(1);
const timelinePageSize = 5;

const filteredTimeline = computed(() => {
  const events = employee.value.timeline || [];
  if (timelineFilter.value === "all") return events;
  return events.filter((e) => e.category === timelineFilter.value);
});

const filteredTimelineTotal = computed(() => filteredTimeline.value.length);

const timelinePageCount = computed(() =>
  Math.max(1, Math.ceil(filteredTimelineTotal.value / timelinePageSize))
);

const paginatedTimeline = computed(() => {
  const current = Math.min(timelinePage.value, timelinePageCount.value);
  const start = (current - 1) * timelinePageSize;
  return filteredTimeline.value.slice(start, start + timelinePageSize);
});

const timelineRange = computed(() => {
  if (filteredTimelineTotal.value === 0) return { from: 0, to: 0 };
  const current = Math.min(timelinePage.value, timelinePageCount.value);
  return {
    from: (current - 1) * timelinePageSize + 1,
    to: Math.min(current * timelinePageSize, filteredTimelineTotal.value),
  };
});

const timelineVisiblePages = computed(() =>
  getVisiblePages(timelinePage.value, timelinePageCount.value)
);

watch(timelineFilter, () => {
  timelinePage.value = 1;
});

watch(filteredTimelineTotal, (total) => {
  const max = Math.max(1, Math.ceil(total / timelinePageSize));
  if (timelinePage.value > max) timelinePage.value = max;
});

// === Initiales ===
const initials = computed(() => {
  const e = employee.value;
  const src = `${e.firstName || ""} ${e.lastName || ""}`.trim() || e.name || "?";
  return src
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
});

// === Labels ===
const statusLabel = computed(() => {
  void locale.value;
  const map = {
    active: t("admin.employees.status.active"),
    inactive: t("admin.employees.status.inactive"),
    "on-leave": t("admin.employees.status.onLeave"),
    suspended: t("admin.employees.view.status.suspended"),
    terminated: t("admin.employees.status.terminated"),
    retired: t("admin.employees.status.retired"),
  };
  return map[employee.value.status] || t("admin.employees.view.status.unknown");
});

const statusBadgeClass = computed(() => {
  const map = {
    active: "bg-success-50 text-success-700",
    inactive: "bg-neutral-100 text-neutral-600",
    "on-leave": "bg-warning-50 text-warning-700",
    suspended: "bg-warning-50 text-warning-700",
    terminated: "bg-error-50 text-error-600",
    retired: "bg-info-50 text-info-600",
  };
  return map[employee.value.status] || "bg-neutral-100 text-neutral-600";
});

const genderLabel = computed(() => {
  void locale.value;
  const g = employee.value.gender;
  const map = {
    male: t("admin.employees.create.gender.male"),
    female: t("admin.employees.create.gender.female"),
    other: t("admin.employees.create.gender.other"),
  };
  return map[g] || null;
});

// === Dates ===
function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(bcp47.value, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const dobWithAge = computed(() => {
  const dob = employee.value.dateOfBirth;
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return dob;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (
    now.getMonth() < d.getMonth() ||
    (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())
  ) {
    age -= 1;
  }
  return `${formatDate(dob)} ${t("admin.employees.view.ageYears", { n: age })}`;
});

// === Tenure ===
function computeTenure(joinDate) {
  if (!joinDate) return { years: 0, months: 0, days: 0 };
  const start = new Date(joinDate);
  if (Number.isNaN(start.getTime())) return { years: 0, months: 0, days: 0 };
  const end = new Date();
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    const prev = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) years = 0;
  const totalDays = Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
  return { years, months, days, totalDays };
}

const tenureLabel = computed(() => {
  void locale.value;
  const { years, months } = computeTenure(employee.value.joinDate);
  return t("admin.employees.view.tenureShort", { years, months });
});

const tenureDetailedLabel = computed(() => {
  void locale.value;
  const { years, months, totalDays } = computeTenure(employee.value.joinDate);
  if (years === 0 && months === 0) {
    return t("admin.employees.view.tenureDays", { n: totalDays });
  }
  return t("admin.employees.view.tenureYearsMonths", { years, months });
});

// === Leave balances ===
const leaveBalances = computed(() => {
  if (Array.isArray(employee.value.leaveBalances) && employee.value.leaveBalances.length) {
    return employee.value.leaveBalances;
  }
  return [];
});

// === Badges réutilisables ===
function displayRecordStatus(status) {
  const key = String(status || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  const map = {
    present: t("admin.employees.view.att.present"),
    late: t("admin.employees.view.att.late"),
    halfday: t("admin.employees.view.att.halfDay"),
    leave: t("admin.employees.view.att.leave"),
    absent: t("admin.employees.view.att.absent"),
    weekend: t("admin.employees.view.att.weekend"),
    pending: t("admin.leave.status.pending"),
    approved: t("admin.leave.status.approved"),
    rejected: t("admin.employees.view.leaveStatus.rejected"),
    cancelled: t("admin.leave.status.cancelled"),
    warning: t("admin.employees.view.leaveStatus.warning"),
    active: t("admin.employees.status.active"),
    inactive: t("admin.employees.status.inactive"),
    onleave: t("admin.employees.status.onLeave"),
    suspended: t("admin.employees.view.status.suspended"),
    terminated: t("admin.employees.status.terminated"),
    retired: t("admin.employees.status.retired"),
  };
  return map[key] || status;
}

function statusBadge(kind, label) {
  const map = {
    Present: "bg-success-50 text-success-700",
    Late: "bg-warning-50 text-warning-700",
    "Half Day": "bg-info-50 text-info-700",
    Leave: "bg-secondary-50 text-secondary-700",
    Absent: "bg-error-50 text-error-600",
    Weekend: "bg-neutral-100 text-neutral-500",
    Approved: "bg-success-50 text-success-700",
    Pending: "bg-warning-50 text-warning-700",
    Rejected: "bg-error-50 text-error-600",
    Cancelled: "bg-neutral-100 text-neutral-600",
    Warning: "bg-error-50 text-error-600",
  };
  return map[kind] || map[label] || "bg-neutral-100 text-neutral-600";
}

const ACTIVITY_META = {
  leave: {
    classes: "bg-secondary-50 text-secondary-600",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  },
  attendance: {
    classes: "bg-success-50 text-success-600",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  },
  document: {
    classes: "bg-info-50 text-info-600",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z"/></svg>`,
  },
  profile: {
    classes: "bg-neutral-100 text-neutral-600",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
  },
  training: {
    classes: "bg-warning-50 text-warning-600",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.02 12.02 0 0118 14.27m-6-.27v6m-6-6l6 3 6-3"/></svg>`,
  },
  review: {
    classes: "bg-secondary-50 text-secondary-600",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.977-2.888a1 1 0 00-1.176 0l-3.977 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.069 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"/></svg>`,
  },
  warning: {
    classes: "bg-error-50 text-error-600",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86l-8.2 14.2A2 2 0 003.82 21h16.36a2 2 0 001.73-2.94l-8.2-14.2a2 2 0 00-3.42 0z"/></svg>`,
  },
  status: {
    classes: "bg-neutral-100 text-neutral-600",
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  },
};

function activityMeta(type) {
  return ACTIVITY_META[type] || ACTIVITY_META.status;
}

/**
 * Date relative façon "2h ago" / "3 days ago" / "12 Apr 2026".
 */
function formatRelative(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return t("admin.employees.view.justNow");
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return t("admin.employees.view.minutesAgo", { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("admin.employees.view.hoursAgo", { n: hours });
  const days = Math.floor(hours / 24);
  if (days < 7) return t("admin.employees.view.daysAgo", { n: days });
  return d.toLocaleDateString(bcp47.value, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


// ============== Sous-composants internes =================================

const Card = {
  props: { title: String },
  setup(props, { slots }) {
    return () =>
      h(
        "section",
        { class: "rounded-xl border border-neutral-200 bg-white p-6" },
        [
          h(
            "header",
            { class: "flex items-center justify-between mb-4" },
            [
              h(
                "h3",
                { class: "text-base font-semibold text-neutral-900" },
                props.title
              ),
              slots["header-right"]?.(),
            ]
          ),
          h("div", slots.default?.()),
        ]
      );
  },
};

const KpiCard = {
  props: {
    label: String,
    value: [String, Number],
    sub: String,
    loading: { type: Boolean, default: false },
    iconBg: { type: String, default: "bg-secondary-50" },
    iconColor: { type: String, default: "text-secondary-500" },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "div",
        { class: "rounded-xl border border-neutral-200 bg-white p-5" },
        [
          h("div", { class: "flex items-start justify-between" }, [
            h("div", { class: "min-w-0" }, [
              h(
                "div",
                { class: "text-sm font-medium text-neutral-600" },
                props.label
              ),
              props.loading
                ? h("div", {
                    class: "mt-2 h-8 w-20 animate-pulse rounded-md bg-neutral-200",
                    "aria-busy": "true",
                    "aria-label": t("common.loading"),
                  })
                : h(
                    "div",
                    { class: "text-3xl font-bold text-neutral-900 mt-1" },
                    props.value
                  ),
              h(
                "div",
                {
                  class: `text-xs text-neutral-500 mt-1 ${
                    props.loading ? "opacity-40" : ""
                  }`,
                },
                props.sub
              ),
            ]),
            h(
              "div",
              {
                class: `w-10 h-10 rounded-lg flex items-center justify-center ${props.iconBg} ${props.iconColor} [&_svg]:w-5 [&_svg]:h-5 ${
                  props.loading ? "opacity-50" : ""
                }`,
              },
              slots.default?.()
            ),
          ]),
        ]
      );
  },
};

const SubTitle = {
  setup(_, { slots }) {
    return () =>
      h(
        "h4",
        { class: "text-sm font-medium text-neutral-500" },
        slots.default?.()
      );
  },
};

const Divider = {
  setup() {
    return () =>
      h("hr", { class: "my-6 border-neutral-100" });
  },
};

const Field = {
  props: {
    label: String,
    value: [String, Number, null],
    icon: String,
    isLink: Boolean,
  },
  setup(props, { slots }) {
    const icons = {
      mail: "M3 8l9 6 9-6m-18 0v8a2 2 0 002 2h14a2 2 0 002-2V8M3 8l2-2h14l2 2",
      phone:
        "M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z",
      pin: "M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    };
    return () => {
      const displayValue =
        props.value !== "" && props.value != null ? String(props.value) : t("common.notApplicable");
      const valueNode = slots.value
        ? slots.value()
        : props.isLink && props.value
          ? h(
              "a",
              {
                href: `mailto:${props.value}`,
                class: "text-secondary-600 hover:underline",
              },
              displayValue
            )
          : h(
              "span",
              { class: props.value ? "text-neutral-900" : "text-neutral-400" },
              displayValue
            );

      const labelChildren = [
        h("div", { class: "text-xs text-neutral-500 mb-1" }, props.label),
        h(
          "div",
          { class: "text-sm font-medium inline-flex items-center gap-1.5" },
          [
            props.icon
              ? h(
                  "svg",
                  {
                    class: "w-4 h-4 text-neutral-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                  },
                  [
                    h("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: icons[props.icon],
                    }),
                  ]
                )
              : null,
            valueNode,
          ]
        ),
      ];
      return h("div", {}, labelChildren);
    };
  },
};

const InfoLine = {
  props: { icon: String },
  setup(props, { slots }) {
    const icons = {
      status: "M9 12l2 2 4-4m-6 9A9 9 0 1121 12 9 9 0 013 12z",
      briefcase:
        "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      users:
        "M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4 0a4 4 0 100-8 4 4 0 000 8z",
      user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      calendar:
        "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    };
    return () =>
      h("div", { class: "flex items-start gap-2" }, [
        h(
          "svg",
          {
            class: "w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
          },
          [
            h("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "stroke-width": "2",
              d: icons[props.icon],
            }),
          ]
        ),
        h("span", { class: "text-neutral-500" }, slots.label?.()),
        h("span", { class: "ml-1" }, slots.value?.()),
      ]);
  },
};

const EmptyState = {
  props: { message: String },
  setup(props, { slots }) {
    return () =>
      h(
        "div",
        {
          class:
            "py-10 flex flex-col items-center justify-center text-neutral-400 gap-2",
        },
        [
          h(
            "div",
            {
              class:
                "w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5",
            },
            slots.default?.()
          ),
          h("p", { class: "text-sm" }, props.message),
        ]
      );
  },
};

const EditPill = {
  setup() {
    return () =>
      h(
        "button",
        {
          type: "button",
          class:
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-secondary-500 text-white hover:bg-secondary-600",
        },
        [
          h(
            "svg",
            {
              class: "w-3.5 h-3.5",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
            },
            [
              h("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
              }),
            ]
          ),
          t("admin.employees.view.edit"),
        ]
      );
  },
};
</script>
