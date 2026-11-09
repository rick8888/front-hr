<template>
  <!-- Admin Dashboard -->
  <div v-if="authStore.isAdmin" class="flex w-full min-w-0 flex-col xl:flex-row xl:items-start xl:gap-6">
    <!-- Main Content -->
    <div class="flex-1 min-w-0">
      <div class="px-4 py-4 sm:px-6 sm:py-6">
        <div
          v-if="error"
          class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ error }}
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            v-for="stat in stats"
            :key="stat.id"
            :title="stat.title"
            :value="stat.value"
            :change="stat.change"
            :update-date="stat.updateDate"
            :change-direction="stat.changeDirection"
            :loading="loading"
          />
        </div>

        <!-- Attendance Overview Chart -->
        <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-neutral-900">
              {{ t("admin.dashboard.attendanceOverview") }}
            </h2>
            <select
              v-model="chartFilter"
              :disabled="loading"
              class="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 bg-white cursor-pointer disabled:opacity-60"
            >
              <option value="today">{{ t("admin.dashboard.filter.today") }}</option>
              <option value="week">{{ t("admin.dashboard.filter.week") }}</option>
              <option value="month">{{ t("admin.dashboard.filter.month") }}</option>
            </select>
          </div>

          <div
            v-if="loading"
            class="flex h-64 items-center justify-center gap-2 text-sm text-neutral-500"
          >
            <span
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
              aria-hidden="true"
            />
            {{ t("common.loading") }}
          </div>
          
          <!-- Y-axis labels -->
          <div v-else class="relative">
            <div class="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-neutral-500 pr-2">
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
              <span>0%</span>
            </div>
            
            <!-- Chart Container -->
            <div class="ml-12 h-64 flex items-end justify-between gap-2 relative">
              <!-- Grid lines -->
              <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div
                  v-for="i in 6"
                  :key="i"
                  class="border-t border-neutral-100"
                  :style="{ height: '0px' }"
                ></div>
              </div>
              
              <!-- Stacked bars -->
              <div
                v-for="(day, index) in filteredChartData"
                :key="index"
                class="flex-1 flex flex-col items-center z-10 group cursor-pointer"
              >
                <div class="w-full h-64 relative flex flex-col-reverse justify-start">
                  <!-- Stacked bar segments - from bottom to top -->
                  <!-- Bottom segment - Purple (Present) -->
                  <div
                    class="w-full bg-secondary-500 transition-all duration-300 group-hover:brightness-110"
                    :style="{ 
                      height: `${day.present}%`,
                      minHeight: day.present > 0 ? '2px' : '0',
                      borderRadius: day.absent === 0 && day.late === 0 ? '4px' : day.late === 0 ? '0 0 4px 4px' : '0 0 0 0',
                    }"
                    :title="t('admin.dashboard.chartTooltip.present', { n: day.present })"
                  ></div>
                  <!-- Middle segment - Orange (Late) -->
                  <div
                    class="w-full bg-warning-500 transition-all duration-300 group-hover:brightness-110"
                    :style="{ 
                      height: `${day.late}%`,
                      minHeight: day.late > 0 ? '2px' : '0',
                    }"
                    :title="t('admin.dashboard.chartTooltip.late', { n: day.late })"
                  ></div>
                  <!-- Top segment - Red (Absent) -->
                  <div
                    class="w-full bg-error-500 transition-all duration-300 group-hover:brightness-110"
                    :style="{ 
                      height: `${day.absent}%`,
                      minHeight: day.absent > 0 ? '2px' : '0',
                      borderRadius: day.absent > 0 ? '4px 4px 0 0' : '0',
                    }"
                    :title="t('admin.dashboard.chartTooltip.absent', { n: day.absent })"
                  ></div>
                </div>
                <span class="text-xs text-neutral-600 mt-2 font-medium">{{ day.day }}</span>
              </div>
            </div>
          </div>
          
          <!-- Legend -->
          <div class="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-neutral-200">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-secondary-500 rounded"></div>
              <span class="text-xs text-neutral-600">{{ t("admin.dashboard.legend.present") }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-warning-500 rounded"></div>
              <span class="text-xs text-neutral-600">{{ t("admin.dashboard.legend.late") }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-error-500 rounded"></div>
              <span class="text-xs text-neutral-600">{{ t("admin.dashboard.legend.absent") }}</span>
            </div>
          </div>
        </div>

        <!-- Attendance Overview Table -->
        <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-neutral-900">
              {{ t("admin.dashboard.attendanceOverview") }}
            </h2>
            <RouterLink
              to="/attendance"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {{ t("admin.dashboard.viewAll") }}
            </RouterLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-neutral-200">
                  <th
                    class="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase"
                  >
                    {{ t("admin.dashboard.col.employeeName") }}
                  </th>
                  <th
                    class="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase"
                  >
                    {{ t("admin.dashboard.col.designation") }}
                  </th>
                  <th
                    class="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase"
                  >
                    {{ t("admin.dashboard.col.type") }}
                  </th>
                  <th
                    class="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase"
                  >
                    {{ t("admin.dashboard.col.checkInTime") }}
                  </th>
                  <th
                    class="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase"
                  >
                    {{ t("admin.dashboard.col.status") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="5" class="px-4 py-10 text-center text-sm text-neutral-500">
                    <span class="inline-flex items-center gap-2">
                      <span
                        class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
                        aria-hidden="true"
                      />
                      {{ t("common.loading") }}
                    </span>
                  </td>
                </tr>
                <tr v-else-if="attendanceList.length === 0">
                  <td colspan="5" class="px-4 py-10 text-center text-sm text-neutral-500">
                    {{ t("admin.dashboard.emptyAttendance") }}
                  </td>
                </tr>
                <template v-else>
                  <tr
                    v-for="employee in attendanceList"
                    :key="employee.id"
                    class="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td class="px-4 py-4">
                      <div class="flex items-center gap-3">
                        <EmployeeAvatar
                          :name="employee.name"
                          :avatar-url="employee.avatarUrl"
                          size-class="h-10 w-10 text-sm font-semibold"
                          :fallback-class="`${getAvatarColor(employee.name)} text-white`"
                        />
                        <span class="text-sm font-medium text-neutral-900">{{
                          employee.name
                        }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-4 text-sm text-neutral-600">
                      {{ employee.designation }}
                    </td>
                    <td class="px-4 py-4">
                      <span class="text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-700">
                        {{ employee.type }}
                      </span>
                    </td>
                    <td class="px-4 py-4 text-sm text-neutral-600">
                      {{ employee.checkIn }}
                    </td>
                    <td class="px-4 py-4">
                      <span
                        :class="[
                          'text-xs px-2 py-1 rounded font-medium',
                          employee.statusKey === 'on time'
                            ? 'bg-success-50 text-success-700'
                            : employee.statusKey === 'late'
                            ? 'bg-error-50 text-error-700'
                            : 'bg-neutral-100 text-neutral-700',
                        ]"
                      >
                        {{ employee.status }}
                      </span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar - My Schedule -->
    <div class="w-full min-w-0 border-t border-neutral-200 bg-white p-4 sm:p-6 xl:mb-6 xl:mr-6 xl:mt-6 xl:w-80 xl:overflow-y-auto xl:rounded-xl xl:border xl:border-neutral-200 xl:shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-bold text-neutral-900 flex items-center gap-2">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {{ t("admin.dashboard.mySchedule") }}
        </h2>
      </div>

      <!-- Calendar -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <button
            @click="previousMonth"
            class="p-1 hover:bg-neutral-100 rounded transition-colors"
          >
            <svg
              class="w-5 h-5 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h3 class="text-base font-semibold text-neutral-900">
            {{ currentMonth }}
          </h3>
          <button
            @click="nextMonth"
            class="p-1 hover:bg-neutral-100 rounded transition-colors"
          >
            <svg
              class="w-5 h-5 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1 mb-4">
          <div
            v-for="day in weekdayLabels"
            :key="day"
            class="text-center text-xs font-medium text-neutral-600 py-2"
          >
            {{ day }}
          </div>
          <div
            v-for="(date, index) in calendarDays"
            :key="index"
            :class="[
              'text-center text-sm py-2 rounded cursor-pointer transition-colors',
              date.isToday
                ? 'bg-primary-500 text-white font-semibold'
                : date.isSelected
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-neutral-600 hover:bg-neutral-100',
              !date.isCurrentMonth && 'text-neutral-300',
            ]"
            @click="selectDate(date)"
          >
            {{ date.day }}
          </div>
        </div>
      </div>

      <!-- Scheduled Events -->
      <div class="space-y-4">
        <div
          v-if="loading"
          class="flex min-h-[120px] items-center justify-center gap-2 text-sm text-neutral-500"
        >
          <span
            class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500"
            aria-hidden="true"
          />
          Chargement…
        </div>
        <p
          v-else-if="scheduledEvents.length === 0"
          class="text-center text-sm text-neutral-500 py-6"
        >
          {{ t("admin.dashboard.noEvents") }}
        </p>
        <template v-else>
          <div
            v-for="(day, index) in scheduledEvents"
            :key="index"
            class="border border-neutral-200 rounded-lg p-4"
          >
          <h4 class="text-sm font-semibold text-neutral-900 mb-3">
            {{ day.date }}
          </h4>
          <div class="space-y-3">
            <div
              v-for="(event, eventIndex) in day.events"
              :key="eventIndex"
              class="flex items-start justify-between gap-2"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-medium text-primary-600">{{
                    event.time
                  }}</span>
                </div>
                <p class="text-sm text-neutral-900 font-medium">
                  {{ event.title }}
                </p>
                <p class="text-xs text-neutral-500 mt-0.5">
                  {{ event.description }}
                </p>
              </div>
              <button class="p-1 hover:bg-neutral-100 rounded transition-colors">
          <svg
                  class="w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
          </svg>
        </button>
      </div>
    </div>
        </div>
        </template>
      </div>
    </div>
  </div>

  <!-- Employee Dashboard -->
  <div v-else class="px-6 py-6">
    <div class="max-w-7xl mx-auto">
      <!-- Welcome Section -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">
          Bonjour, {{ authStore.user?.name?.split(' ')[0] || 'Employé' }}! 👋
        </h1>
        <p class="text-neutral-600">Voici un aperçu de votre espace personnel</p>
      </div>

      <!-- Main Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Attendance Card -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-green-700">Présence ce mois</h3>
            <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
              <span class="text-2xl">📋</span>
            </div>
          </div>
          <p class="text-3xl font-bold text-green-700 mb-1">95%</p>
          <div class="flex items-center gap-2 mt-2">
            <div class="flex-1 bg-green-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" style="width: 95%"></div>
            </div>
            <span class="text-xs font-medium text-green-700">+2%</span>
          </div>
          <p class="text-xs text-green-600 mt-2">19 jours présents / 20</p>
        </div>

        <!-- Leave Balance Card -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-blue-700">Solde de congés</h3>
            <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
              <span class="text-2xl">🏖️</span>
            </div>
          </div>
          <p class="text-3xl font-bold text-blue-700 mb-1">12 jours</p>
          <p class="text-xs text-blue-600 mt-2">Restants sur 25 jours</p>
          <router-link
            to="/leave-requests"
            class="mt-3 inline-block text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Voir mes demandes →
          </router-link>
        </div>

        <!-- Overtime Card -->
        <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-orange-700">Heures supplémentaires</h3>
            <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <span class="text-2xl">⏰</span>
            </div>
          </div>
          <p class="text-3xl font-bold text-orange-700 mb-1">8h</p>
          <p class="text-xs text-orange-600 mt-2">Ce mois-ci</p>
          <router-link
            to="/attendance"
            class="mt-3 inline-block text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            Convertir ou payer →
          </router-link>
        </div>

        <!-- Salary Card -->
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-purple-700">Salaire net</h3>
            <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-sm">
              <span class="text-2xl">💰</span>
            </div>
          </div>
          <p class="text-3xl font-bold text-purple-700 mb-1">3 450 €</p>
          <p class="text-xs text-purple-600 mt-2">Dernière paie</p>
          <router-link
            to="/profile"
            class="mt-3 inline-block text-xs font-medium text-purple-600 hover:text-purple-700"
          >
            Voir détails →
          </router-link>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Attendance Chart -->
          <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-neutral-900">Présence du mois</h2>
              <router-link
                to="/attendance"
                class="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Voir tout →
              </router-link>
            </div>
            <div class="h-64 flex items-end justify-between gap-2">
              <div
                v-for="(day, index) in employeeAttendanceData"
                :key="index"
                class="flex-1 flex flex-col items-center group cursor-pointer"
              >
                <div class="w-full flex flex-col-reverse justify-end h-64 relative">
                  <div
                    class="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all duration-300 group-hover:brightness-110"
                    :style="{ height: day.present + '%', minHeight: day.present > 0 ? '4px' : '0' }"
                    :title="`${day.day}: ${day.present}% présent`"
                  ></div>
                </div>
                <span class="text-xs text-neutral-600 mt-2 font-medium">{{ day.day }}</span>
              </div>
            </div>
            <div class="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-neutral-200">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-green-500 rounded"></div>
                <span class="text-xs text-neutral-600">Présent</span>
              </div>
            </div>
          </div>

          <!-- Pending Requests & Notifications -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Pending Leave Requests -->
            <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-neutral-900">Demandes en attente</h2>
                <router-link
                  to="/leave-requests"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Voir tout →
                </router-link>
              </div>
              <div v-if="pendingRequests.length > 0" class="space-y-3">
                <div
                  v-for="request in pendingRequests"
                  :key="request.id"
                  class="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <span class="text-lg">⏳</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-neutral-900">{{ request.type }}</p>
                    <p class="text-xs text-neutral-600">{{ request.date }}</p>
                  </div>
                  <span class="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                    En attente
                  </span>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <span class="text-4xl mb-2 block">✅</span>
                <p class="text-sm text-neutral-600">Aucune demande en attente</p>
              </div>
            </div>

            <!-- Upcoming Events -->
            <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-neutral-900">Événements à venir</h2>
                <span class="text-sm text-neutral-600">Ce mois</span>
              </div>
              <div v-if="upcomingEvents.length > 0" class="space-y-3">
                <div
                  v-for="event in upcomingEvents"
                  :key="event.id"
                  class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span class="text-lg">{{ event.icon }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-neutral-900">{{ event.title }}</p>
                    <p class="text-xs text-neutral-600">{{ event.date }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <span class="text-4xl mb-2 block">📅</span>
                <p class="text-sm text-neutral-600">Aucun événement à venir</p>
              </div>
            </div>
          </div>

          <!-- Quick Actions Grid -->
          <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 class="text-lg font-bold text-neutral-900 mb-4">Actions rapides</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <router-link
                to="/attendance"
                class="flex flex-col items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-all group"
              >
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <span class="text-2xl group-hover:scale-110 transition-transform">📋</span>
                </div>
                <p class="text-sm font-medium text-neutral-900 text-center">Présence</p>
              </router-link>

              <router-link
                to="/leave-requests/new"
                class="flex flex-col items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-all group"
              >
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <span class="text-2xl group-hover:scale-110 transition-transform">🏖️</span>
                </div>
                <p class="text-sm font-medium text-neutral-900 text-center">Demander congé</p>
              </router-link>

              <router-link
                to="/training"
                class="flex flex-col items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-all group"
              >
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                  <span class="text-2xl group-hover:scale-110 transition-transform">🎓</span>
                </div>
                <p class="text-sm font-medium text-neutral-900 text-center">Formations</p>
              </router-link>

              <router-link
                to="/equipment"
                class="flex flex-col items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-all group"
              >
                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <span class="text-2xl group-hover:scale-110 transition-transform">💻</span>
                </div>
                <p class="text-sm font-medium text-neutral-900 text-center">Équipements</p>
              </router-link>

              <router-link
                to="/documents"
                class="flex flex-col items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-all group"
              >
                <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                  <span class="text-2xl group-hover:scale-110 transition-transform">📁</span>
                </div>
                <p class="text-sm font-medium text-neutral-900 text-center">Documents</p>
              </router-link>

              <router-link
                to="/profile"
                class="flex flex-col items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-all group"
              >
                <div class="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center group-hover:bg-pink-500 transition-colors">
                  <span class="text-2xl group-hover:scale-110 transition-transform">ℹ️</span>
                </div>
                <p class="text-sm font-medium text-neutral-900 text-center">Mon profil</p>
              </router-link>

              <router-link
                to="/attendance"
                class="flex flex-col items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-all group"
              >
                <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-500 transition-colors">
                  <span class="text-2xl group-hover:scale-110 transition-transform">⏰</span>
                </div>
                <p class="text-sm font-medium text-neutral-900 text-center">Heures sup</p>
              </router-link>

              <router-link
                to="/documents"
                class="flex flex-col items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-primary-300 transition-all group"
              >
                <div class="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                  <span class="text-2xl group-hover:scale-110 transition-transform">💼</span>
                </div>
                <p class="text-sm font-medium text-neutral-900 text-center">Bulletins</p>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="space-y-6">
          <!-- My Trainings Progress -->
          <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-neutral-900">Mes formations</h2>
              <router-link
                to="/training"
                class="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Voir tout →
              </router-link>
            </div>
            <div v-if="myTrainings.length > 0" class="space-y-4">
              <div
                v-for="training in myTrainings"
                :key="training.id"
                class="space-y-2"
              >
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-neutral-900">{{ training.name }}</p>
                  <span class="text-xs font-medium text-primary-600">{{ training.progress }}%</span>
                </div>
                <div class="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    class="bg-primary-500 h-2 rounded-full transition-all"
                    :style="{ width: training.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-6">
              <span class="text-3xl mb-2 block">🎓</span>
              <p class="text-sm text-neutral-600">Aucune formation en cours</p>
              <router-link
                to="/training"
                class="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Parcourir les formations →
              </router-link>
            </div>
          </div>

          <!-- Equipment Requests -->
          <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-neutral-900">Mes équipements</h2>
              <router-link
                to="/equipment"
                class="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Voir tout →
              </router-link>
            </div>
            <div v-if="myEquipment.length > 0" class="space-y-3">
              <div
                v-for="item in myEquipment"
                :key="item.id"
                class="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg"
              >
                <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span class="text-lg">💻</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-neutral-900">{{ item.name }}</p>
                  <p class="text-xs text-neutral-600">{{ item.status }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-6">
              <span class="text-3xl mb-2 block">💻</span>
              <p class="text-sm text-neutral-600">Aucun équipement</p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 class="text-lg font-bold text-neutral-900 mb-4">Activité récente</h2>
            <div class="space-y-4">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start gap-3"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    activity.bgColor,
                  ]"
                >
                  <span class="text-lg">{{ activity.icon }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-neutral-900">{{ activity.title }}</p>
                  <p class="text-xs text-neutral-500">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import StatCard from "../components/common/StatCard.vue";
import EmployeeAvatar from "../components/common/EmployeeAvatar.vue";
import { useAdminDashboard } from "./dashboard/composables/useAdminDashboard.js";
import { useI18n } from "../i18n/index.js";

const authStore = useAuthStore();
const { t } = useI18n();

const {
  loading,
  error,
  stats,
  chartFilter,
  filteredChartData,
  attendanceList,
  scheduledEvents,
  currentMonth,
  weekdayLabels,
  calendarDays,
  previousMonth,
  nextMonth,
  selectDate,
  getAvatarColor,
} = useAdminDashboard();

const employeeAttendanceData = ref([
  { day: "Lun", present: 100 },
  { day: "Mar", present: 100 },
  { day: "Mer", present: 95 },
  { day: "Jeu", present: 100 },
  { day: "Ven", present: 90 },
  { day: "Sam", present: 0 },
  { day: "Dim", present: 0 },
]);

const pendingRequests = ref([
  { id: 1, type: "Congé annuel", date: "15-20 Février 2026" },
  { id: 2, type: "Demande d'équipement", date: 'MacBook Pro 16"' },
]);

const upcomingEvents = ref([
  { id: 1, title: "Formation Excel Avancé", date: "15 Février 2026", icon: "🎓" },
  { id: 2, title: "Entretien annuel", date: "20 Février 2026", icon: "📅" },
]);

const myTrainings = ref([
  { id: 1, name: "Excel Avancé", progress: 45 },
  { id: 2, name: "Service Client", progress: 20 },
]);

const myEquipment = ref([
  { id: 1, name: 'MacBook Pro 16"', status: "Attribué" },
]);

const recentActivities = ref([
  {
    id: 1,
    title: "Pointage effectué",
    time: "Aujourd'hui à 9:00",
    icon: "✓",
    bgColor: "bg-green-100",
  },
  {
    id: 2,
    title: "Demande de congé approuvée",
    time: "Il y a 2 jours",
    icon: "📄",
    bgColor: "bg-blue-100",
  },
]);
</script>
<style scoped></style>
