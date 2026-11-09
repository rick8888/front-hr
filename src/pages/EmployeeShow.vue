<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <!-- Employee Header Section -->
    <div
      class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm mb-6"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <!-- Avatar -->
          <EmployeeAvatar
            :name="employee.name"
            :avatar-url="employee.avatar_url || employee.avatarUrl"
            size-class="h-24 w-24 text-2xl font-bold"
            fallback-class="text-white"
            :style="{ backgroundColor: getAvatarColor(employee.name) }"
          />

          <!-- Employee Info -->
          <div>
            <h1 class="text-2xl font-bold text-neutral-900 mb-2">
              {{ employee.name }}
            </h1>
      <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-neutral-600">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4"
                  />
                </svg>
                <span class="text-sm">{{ employee.designation }}</span>
              </div>
              <div class="flex items-center gap-2 text-neutral-600">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span class="text-sm">{{ employee.email }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Profile Button -->
        <button
          @click="editEmployee"
          class="btn-primary flex items-center gap-2 px-4 py-2"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          {{ t("admin.employees.show.editProfile") }}
        </button>
        </div>
      </div>

    <!-- Tabs Navigation -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm mb-6">
      <div class="border-b border-neutral-200">
        <div class="flex items-center gap-1 px-6">
          <button
            :class="[
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeMainTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900',
            ]"
            @click="handleMainTabChange('profile')"
          >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
          </svg>
            {{ t("admin.employees.show.personal") }}
        </button>
        <button
            :class="[
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeMainTab === 'professional'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900',
            ]"
            @click="handleMainTabChange('professional')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4"
              />
          </svg>
            {{ t("admin.employees.show.professional") }}
        </button>
        <button
            :class="[
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeMainTab === 'documents'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900',
            ]"
            @click="handleMainTabChange('documents')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
          </svg>
            {{ t("admin.employees.show.documents") }}
          </button>
          <button
            :class="[
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeMainTab === 'account'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900',
            ]"
            @click="handleMainTabChange('account')"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            {{ t("admin.employees.show.accountAccess") }}
          </button>
          <button
            :class="[
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeMainTab === 'remuneration'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900',
            ]"
            @click="handleMainTabChange('remuneration')"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ t("admin.employees.show.remuneration") }}
        </button>
      </div>
    </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex flex-col gap-6 lg:flex-row">
      <!-- Left Sidebar Navigation (only visible when Profile tab is active) -->
      <div v-if="activeMainTab === 'profile'" class="w-full min-w-0 shrink-0 lg:w-64">
        <div
          class="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
        >
          <!-- Header with Profile -->
          <div class="bg-primary-500 px-4 py-3 flex items-center gap-3">
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
              </svg>
            <span class="text-white font-medium text-sm">{{ t("admin.employees.show.profile") }}</span>
            </div>

          <!-- Separator -->
          <div class="border-t border-neutral-200"></div>

          <!-- Body with menu items -->
          <nav class="p-4 space-y-1">
            <button
              :class="[
                'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                activeSideNav === 'attendance'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-900 hover:bg-neutral-50',
              ]"
              @click="activeSideNav = 'attendance'"
            >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
                </svg>
              {{ t("admin.employees.show.attendance") }}
            </button>
            <button
              :class="[
                'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                activeSideNav === 'projects'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-900 hover:bg-neutral-50',
              ]"
              @click="activeSideNav = 'projects'"
            >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
                </svg>
              {{ t("admin.employees.show.projects") }}
            </button>
            <button
              :class="[
                'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                activeSideNav === 'leave'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-900 hover:bg-neutral-50',
              ]"
              @click="activeSideNav = 'leave'"
            >
              <svg
                class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
              {{ t("admin.employees.show.leave") }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1">
        <!-- Personal Information Content (Profile tab - main content) -->
        <div
          v-if="activeMainTab === 'profile' && !activeSideNav"
          class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
        >
          <h2 class="text-lg font-bold text-neutral-900 mb-6">
              {{ t("admin.employees.show.personal") }}
          </h2>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.create.firstName") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.firstName || "Brooklyn" }}
              </p>
          </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.create.lastName") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.lastName || "Simmons" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.show.mobile") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.mobile || "(702) 555-0122" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.show.email") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.email || "brooklyn.s@example.com" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.create.dob") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.dateOfBirth || "July 14, 1995" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.edit.maritalStatus") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.maritalStatus || "Married" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.create.gender") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.gender || "Female" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.edit.nationality") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.nationality || "America" }}
              </p>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.create.address") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.address || "2464 Royal Ln. Mesa, New Jersey" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("common.city") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.city || "California" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.show.state") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.state || "United State" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.show.zipCode") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.zipCode || "35624" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Side Navigation Content (Profile tab) -->
        <div
          v-if="activeMainTab === 'profile' && activeSideNav"
          class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
        >
          <!-- Attendance Content -->
          <div v-if="activeSideNav === 'attendance'">
            <h2 class="text-lg font-bold text-neutral-900 mb-6">{{ t("admin.employees.show.attendance") }}</h2>
            <div class="overflow-x-auto">
              <div class="overflow-y-auto max-h-[600px]">
                <table class="w-full border-collapse">
                  <thead class="sticky top-0 bg-white z-10">
                    <tr class="border-b border-neutral-200">
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.view.col.date") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.view.col.checkIn") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.view.col.checkOut") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.show.col.break") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.show.col.workingHours") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("common.status") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="record in attendanceRecords"
                      :key="record.id"
                      class="border-b border-neutral-100 hover:bg-neutral-50"
                    >
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ record.date }}
                      </td>
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ record.checkIn }}
                      </td>
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ record.checkOut }}
                      </td>
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ record.break }}
                      </td>
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ record.workingHours }}
                      </td>
                      <td class="py-3 px-4">
                        <span
                          :class="[
                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                            record.status === 'On Time'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700',
                          ]"
                        >
                          {{ record.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
          </div>
        </div>

          <!-- Projects Content -->
          <div v-else-if="activeSideNav === 'projects'">
            <h2 class="text-lg font-bold text-neutral-900 mb-6">{{ t("admin.employees.show.projects") }}</h2>
            <div class="overflow-x-auto">
              <div class="overflow-y-auto max-h-[600px]">
                <table class="w-full border-collapse">
                  <thead class="sticky top-0 bg-white z-10">
                    <tr class="border-b border-neutral-200">
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.show.col.srNo") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.show.col.projectName") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.edit.startDate") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.show.col.finishDate") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("common.status") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="project in projects"
                      :key="project.id"
                      class="border-b border-neutral-100 hover:bg-neutral-50"
                    >
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ project.srNo }}
                      </td>
                      <td class="py-3 px-4 text-sm">
                        <a
                          :href="project.link || '#'"
                          class="text-primary-600 hover:text-primary-700"
                        >
                          {{ project.name }}
                        </a>
                      </td>
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ project.startDate }}
                      </td>
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ project.finishDate }}
                      </td>
                      <td class="py-3 px-4">
                        <span
                          :class="[
                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                            project.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700',
                          ]"
                        >
                          {{ project.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
          </div>
            </div>
          </div>

          <!-- Leave Content -->
          <div v-else-if="activeSideNav === 'leave'">
            <h2 class="text-lg font-bold text-neutral-900 mb-6">{{ t("admin.employees.show.leave") }}</h2>
            <div class="overflow-x-auto">
              <div class="overflow-y-auto max-h-[600px]">
                <table class="w-full border-collapse">
                  <thead class="sticky top-0 bg-white z-10">
                    <tr class="border-b border-neutral-200">
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.show.col.srNo") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.view.col.leaveType") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.show.col.from") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.show.col.to") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("admin.employees.view.col.days") }}
                      </th>
                      <th
                        class="text-left py-3 px-4 text-sm font-semibold text-neutral-700"
                      >
                        {{ t("common.status") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="leave in leaveRecords"
                      :key="leave.id"
                      class="border-b border-neutral-100 hover:bg-neutral-50"
                    >
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ leave.srNo }}
                      </td>
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ leave.leaveType }}
                      </td>
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ leave.from }}
                      </td>
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ leave.to }}
                      </td>
                      <td class="py-3 px-4 text-sm text-neutral-900">
                        {{ leave.days }}
                      </td>
                      <td class="py-3 px-4">
                        <span
                          :class="[
                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                            leave.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : leave.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700',
                          ]"
                        >
                          {{ leave.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Information Content (from main tab only) -->
        <div
          v-if="activeMainTab === 'professional'"
          class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
        >
          <h2 class="text-lg font-bold text-neutral-900 mb-6">
            {{ t("admin.employees.show.professional") }}
          </h2>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.edit.jobTitle") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.designation || "Project Manager" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.create.department") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.department || "Engineering" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.edit.employmentType") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.employmentType || "Full-time" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.edit.startDate") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.startDate || "January 15, 2020" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.edit.manager") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.manager || "Robert Allen" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.show.employeeId") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                #{{ employee.employeeId || "EMP-001" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Documents Content (from main tab only) -->
        <div
          v-if="activeMainTab === 'documents'"
          class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
        >
          <h2 class="text-lg font-bold text-neutral-900 mb-6">{{ t("admin.employees.show.documents") }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="doc in documents"
              :key="doc.id"
              class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <p class="text-sm font-medium text-neutral-900">
                    {{ doc.name }}
                  </p>
                  <p class="text-xs text-neutral-500">{{ doc.size }}</p>
                </div>
              </div>
                <button class="text-neutral-400 hover:text-neutral-600">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                  </svg>
                </button>
            </div>
              </div>
            </div>

        <!-- Account Access Content (from main tab only) -->
        <div
          v-if="activeMainTab === 'account'"
          class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
        >
          <h2 class="text-lg font-bold text-neutral-900 mb-6">
            {{ t("admin.employees.show.accountAccess") }}
          </h2>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.edit.username") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.username || "brooklyn.simmons" }}
              </p>
            </div>
                <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.create.email") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.email || "brooklyn.s@example.com" }}
              </p>
                </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.create.role") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.userRole || "Employee" }}
              </p>
              </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                {{ t("admin.employees.show.lastLogin") }}
              </label>
              <p
                class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
              >
                {{ employee.lastLogin || "Today at 09:00 AM" }}
              </p>
            </div>
          </div>
        </div>

        <!-- Remuneration Content -->
        <div
          v-if="activeMainTab === 'remuneration'"
          class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
        >
          <h2 class="text-lg font-bold text-neutral-900 mb-6">{{ t("admin.employees.show.remuneration") }}</h2>

          <!-- Salary Overview -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div
              class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200"
            >
              <p class="text-sm text-neutral-600 mb-1">{{ t("admin.employees.edit.monthlySalary") }}</p>
              <p class="text-2xl font-bold text-primary-700">
                ${{ remuneration.monthlySalary?.toLocaleString() || "6,500" }}
              </p>
            </div>
            <div
              class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200"
            >
              <p class="text-sm text-neutral-600 mb-1">{{ t("admin.employees.edit.annualSalary") }}</p>
              <p class="text-2xl font-bold text-green-700">
                ${{ remuneration.annualSalary?.toLocaleString() || "78,000" }}
              </p>
            </div>
            <div
              class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200"
            >
              <p class="text-sm text-neutral-600 mb-1">{{ t("admin.employees.show.totalBenefits") }}</p>
              <p class="text-2xl font-bold text-amber-700">
                ${{ remuneration.totalBenefits?.toLocaleString() || "12,500" }}
              </p>
              </div>
            </div>

          <!-- Salary Breakdown -->
          <div class="mb-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t("admin.employees.show.salaryBreakdown") }}
            </h3>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t("admin.employees.edit.baseSalary") }}
                </label>
                <p
                  class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
                >
                  ${{ remuneration.baseSalary?.toLocaleString() || "5,500" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t("admin.employees.show.allowances") }}
                </label>
                <p
                  class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
                >
                  ${{ remuneration.allowances?.toLocaleString() || "1,000" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t("admin.employees.show.overtimePay") }}
                </label>
                <p
                  class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
                >
                  ${{ remuneration.overtimePay?.toLocaleString() || "0" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t("admin.employees.edit.bonus") }}
                </label>
                <p
                  class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
                >
                  ${{
                    remuneration.performanceBonus?.toLocaleString() || "500"
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Benefits -->
          <div class="mb-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t("admin.employees.show.benefitsAllowances") }}
            </h3>
            <div class="space-y-3">
              <div
                class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <div class="flex items-center gap-3">
                <svg
                    class="w-5 h-5 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <div>
                  <p class="text-sm font-medium text-neutral-900">
                      {{ t("admin.employees.edit.healthInsurance") }}
                  </p>
                    <p class="text-xs text-neutral-500">
                      {{ t("admin.employees.show.healthInsuranceHint") }}
                    </p>
                </div>
              </div>
                <p class="text-sm font-semibold text-neutral-900">
                  ${{ remuneration.healthInsurance?.toLocaleString() || "350" }}{{ t("admin.employees.show.perMonth") }}
                </p>
              </div>
              <div
                class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-neutral-900">
                      {{ t("admin.employees.edit.retirementPlan") }}
                    </p>
                    <p class="text-xs text-neutral-500">{{ t("admin.employees.show.retirementHint") }}</p>
              </div>
            </div>
                <p class="text-sm font-semibold text-neutral-900">
                  ${{ remuneration.retirementPlan?.toLocaleString() || "325" }}{{ t("admin.employees.show.perMonth") }}
                </p>
              </div>
              <div
                class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <div class="flex items-center gap-3">
                <svg
                    class="w-5 h-5 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <div>
                    <p class="text-sm font-medium text-neutral-900">
                      {{ t("admin.employees.edit.transportation") }}
                    </p>
                    <p class="text-xs text-neutral-500">
                      {{ t("admin.employees.show.travelHint") }}
                    </p>
                </div>
              </div>
                <p class="text-sm font-semibold text-neutral-900">
                  ${{ remuneration.transportation?.toLocaleString() || "200" }}{{ t("admin.employees.show.perMonth") }}
                </p>
              </div>
              <div
                class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div class="flex items-center gap-3">
                  <svg
                    class="w-5 h-5 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-neutral-900">
                      {{ t("admin.employees.edit.meal") }}
                    </p>
                    <p class="text-xs text-neutral-500">{{ t("admin.employees.show.mealHint") }}</p>
              </div>
                </div>
                <p class="text-sm font-semibold text-neutral-900">
                  ${{ remuneration.mealAllowance?.toLocaleString() || "150" }}{{ t("admin.employees.show.perMonth") }}
                </p>
            </div>
          </div>
        </div>

          <!-- Tax Information -->
          <div>
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t("admin.employees.show.taxDeductions") }}
            </h3>
            <div class="grid grid-cols-2 gap-6">
            <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t("admin.employees.show.taxId") }}
                </label>
                <p
                  class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
                >
                  {{ remuneration.taxId || "123-45-6789" }}
              </p>
            </div>
            <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t("admin.employees.edit.taxFiling") }}
                </label>
                <p
                  class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
                >
                  {{ remuneration.taxStatus || "Married Filing Jointly" }}
              </p>
            </div>
            <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t("admin.employees.show.federalTax") }}
                </label>
                <p
                  class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
                >
                  ${{
                    remuneration.federalTax?.toLocaleString() || "1,200"
                  }}{{ t("admin.employees.show.perMonth") }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t("admin.employees.show.stateTax") }}
                </label>
                <p
                  class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
                >
                  ${{ remuneration.stateTax?.toLocaleString() || "325" }}{{ t("admin.employees.show.perMonth") }}
              </p>
            </div>
            <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t("admin.employees.show.socialSecurity") }}
                </label>
                <p
                  class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
                >
                  ${{
                    remuneration.socialSecurity?.toLocaleString() || "403"
                  }}{{ t("admin.employees.show.perMonth") }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t("admin.employees.show.medicare") }}
                </label>
                <p
                  class="text-sm text-neutral-900 bg-neutral-50 px-4 py-2.5 rounded-lg"
                >
                  ${{ remuneration.medicare?.toLocaleString() || "94" }}{{ t("admin.employees.show.perMonth") }}
                </p>
        </div>
      </div>
    </div>

          <!-- Net Pay -->
          <div class="mt-6 pt-6 border-t border-neutral-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-neutral-600 mb-1">{{ t("admin.employees.show.netMonthly") }}</p>
                <p class="text-2xl font-bold text-neutral-900">
                  ${{ remuneration.netPay?.toLocaleString() || "4,478" }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-neutral-600 mb-1">{{ t("admin.employees.edit.paymentMethod") }}</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ remuneration.paymentMethod || "Direct Deposit" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "../i18n/index.js";
import EmployeeAvatar from "../components/common/EmployeeAvatar.vue";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const employee = ref({});
const activeMainTab = ref("profile");
const activeSideNav = ref(null);

const documents = ref([
  { id: 1, name: "Appointment Letter", size: "PDF • 2.3 MB" },
  { id: 2, name: "Salary Slips", size: "PDF • 5.1 MB" },
  { id: 3, name: "Identity Card", size: "PDF • 1.2 MB" },
  { id: 4, name: "Experience Letter", size: "PDF • 2.7 MB" },
]);

const attendanceRecords = ref([
  {
    id: 1,
    date: "July 01, 2023",
    checkIn: "09:28 AM",
    checkOut: "07:00 PM",
    break: "00:30 Min",
    workingHours: "09:02 Hrs",
    status: "On Time",
  },
  {
    id: 2,
    date: "July 02, 2023",
    checkIn: "09:00 AM",
    checkOut: "07:00 PM",
    break: "00:30 Min",
    workingHours: "09:30 Hrs",
    status: "On Time",
  },
  {
    id: 3,
    date: "July 03, 2023",
    checkIn: "09:00 AM",
    checkOut: "07:00 PM",
    break: "00:30 Min",
    workingHours: "09:30 Hrs",
    status: "On Time",
  },
  {
    id: 4,
    date: "July 04, 2023",
    checkIn: "10:00 AM",
    checkOut: "07:00 PM",
    break: "00:30 Min",
    workingHours: "08:30 Hrs",
    status: "Late",
  },
  {
    id: 5,
    date: "July 05, 2023",
    checkIn: "10:00 AM",
    checkOut: "07:00 PM",
    break: "00:30 Min",
    workingHours: "08:30 Hrs",
    status: "Late",
  },
  {
    id: 6,
    date: "July 06, 2023",
    checkIn: "09:00 AM",
    checkOut: "07:00 PM",
    break: "00:45 Min",
    workingHours: "09:15 Hrs",
    status: "On Time",
  },
  {
    id: 7,
    date: "July 07, 2023",
    checkIn: "09:00 AM",
    checkOut: "07:00 PM",
    break: "00:30 Min",
    workingHours: "09:30 Hrs",
    status: "On Time",
  },
  {
    id: 8,
    date: "July 08, 2023",
    checkIn: "10:00 AM",
    checkOut: "07:00 PM",
    break: "00:30 Min",
    workingHours: "08:30 Hrs",
    status: "Late",
  },
  {
    id: 9,
    date: "July 09, 2023",
    checkIn: "09:00 AM",
    checkOut: "07:00 PM",
    break: "00:30 Min",
    workingHours: "09:30 Hrs",
    status: "On Time",
  },
  {
    id: 10,
    date: "July 10, 2023",
    checkIn: "10:00 AM",
    checkOut: "07:00 PM",
    break: "00:30 Min",
    workingHours: "08:30 Hrs",
    status: "Late",
  },
]);

const projects = ref([
  {
    id: 1,
    srNo: "1",
    name: "Amongus - Discovery Phase",
    startDate: "Feb 01, 2023",
    finishDate: "Mar 05, 2023",
    status: "Completed",
    link: "#",
  },
  {
    id: 2,
    srNo: "2",
    name: "Wildcare - Development Project",
    startDate: "Feb 12, 2023",
    finishDate: "April 20, 2023",
    status: "Completed",
    link: "#",
  },
  {
    id: 3,
    srNo: "3",
    name: "Hingutsan Web Development",
    startDate: "April 05, 2023",
    finishDate: "October 05, 2023",
    status: "In Process",
    link: "#",
  },
  {
    id: 4,
    srNo: "4",
    name: "Montilisy Ecommerce Platform",
    startDate: "May 12, 2023",
    finishDate: "August 12, 2023",
    status: "In Process",
    link: "#",
  },
]);

const leaveRecords = ref([
  {
    id: 1,
    srNo: "1",
    leaveType: "Annual Leave",
    from: "Dec 15, 2023",
    to: "Dec 20, 2023",
    days: "5",
    status: "Approved",
  },
  {
    id: 2,
    srNo: "2",
    leaveType: "Sick Leave",
    from: "Nov 10, 2023",
    to: "Nov 12, 2023",
    days: "3",
    status: "Approved",
  },
  {
    id: 3,
    srNo: "3",
    leaveType: "Annual Leave",
    from: "Oct 05, 2023",
    to: "Oct 10, 2023",
    days: "5",
    status: "Approved",
  },
  {
    id: 4,
    srNo: "4",
    leaveType: "Personal Leave",
    from: "Sep 18, 2023",
    to: "Sep 18, 2023",
    days: "1",
    status: "Pending",
  },
  {
    id: 5,
    srNo: "5",
    leaveType: "Annual Leave",
    from: "Aug 25, 2023",
    to: "Aug 30, 2023",
    days: "5",
    status: "Approved",
  },
  {
    id: 6,
    srNo: "6",
    leaveType: "Sick Leave",
    from: "July 28, 2023",
    to: "July 29, 2023",
    days: "2",
    status: "Approved",
  },
  {
    id: 7,
    srNo: "7",
    leaveType: "Emergency Leave",
    from: "June 15, 2023",
    to: "June 15, 2023",
    days: "1",
    status: "Approved",
  },
  {
    id: 8,
    srNo: "8",
    leaveType: "Annual Leave",
    from: "May 20, 2023",
    to: "May 25, 2023",
    days: "5",
    status: "Rejected",
  },
]);

const remuneration = ref({
  monthlySalary: 6500,
  annualSalary: 78000,
  totalBenefits: 12500,
  baseSalary: 5500,
  allowances: 1000,
  overtimePay: 0,
  performanceBonus: 500,
  healthInsurance: 350,
  retirementPlan: 325,
  transportation: 200,
  mealAllowance: 150,
  taxId: "123-45-6789",
  taxStatus: "Married Filing Jointly",
  federalTax: 1200,
  stateTax: 325,
  socialSecurity: 403,
  medicare: 94,
  netPay: 4478,
  paymentMethod: "Direct Deposit",
});

const getAvatarColor = (name) => {
  // Use the blue color from the image for the employee profile
  return "#6699FF";
};

const editEmployee = () => {
  router.push(`/employees/edit/${employee.value.id}`);
};

const handleMainTabChange = (tab) => {
  activeMainTab.value = tab;
  // Reset side nav when switching to profile tab to show Personal Information
  if (tab === "profile") {
    activeSideNav.value = null;
  }
};

// Load employee data
onMounted(() => {
  const employeeId = route.params.id;
  loadEmployeeData(employeeId);
});

const loadEmployeeData = (employeeId) => {
  // Mock data matching the image
  const mockEmployee = {
    id: parseInt(employeeId) || 1,
    name: "Brooklyn Simmons",
    firstName: "Brooklyn",
    lastName: "Simmons",
    designation: "Project Manager",
    email: "brooklyn.s@example.com",
    mobile: "(702) 555-0122",
    dateOfBirth: "July 14, 1995",
    maritalStatus: "Married",
    gender: "Female",
    nationality: "America",
    address: "2464 Royal Ln. Mesa, New Jersey",
    city: "California",
    state: "United State",
    zipCode: "35624",
    department: "Engineering",
    employmentType: "Full-time",
    startDate: "January 15, 2020",
    manager: "Robert Allen",
    employeeId: "EMP-001",
    username: "brooklyn.simmons",
    userRole: "Employee",
    lastLogin: "Today at 09:00 AM",
  };

  employee.value = mockEmployee;
};
</script>

<style scoped></style>
