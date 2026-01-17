<template>
  <!-- Admin Dashboard -->
  <div v-if="authStore.isAdmin" class="flex gap-6 h-full">
    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <div class="px-6 py-6">
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
          />
        </div>

        <!-- Attendance Overview Chart -->
        <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-neutral-900">
              Attendance Overview
            </h2>
            <select
              v-model="chartFilter"
              @change="updateChartData"
              class="px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 bg-white cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <!-- Y-axis labels -->
          <div class="relative">
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
                    :title="`Present: ${day.present}%`"
                  ></div>
                  <!-- Middle segment - Orange (Late) -->
                  <div
                    class="w-full bg-warning-500 transition-all duration-300 group-hover:brightness-110"
                    :style="{ 
                      height: `${day.late}%`,
                      minHeight: day.late > 0 ? '2px' : '0',
                    }"
                    :title="`Late: ${day.late}%`"
                  ></div>
                  <!-- Top segment - Red (Absent) -->
                  <div
                    class="w-full bg-error-500 transition-all duration-300 group-hover:brightness-110"
                    :style="{ 
                      height: `${day.absent}%`,
                      minHeight: day.absent > 0 ? '2px' : '0',
                      borderRadius: day.absent > 0 ? '4px 4px 0 0' : '0',
                    }"
                    :title="`Absent: ${day.absent}%`"
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
              <span class="text-xs text-neutral-600">Present</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-warning-500 rounded"></div>
              <span class="text-xs text-neutral-600">Late</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-error-500 rounded"></div>
              <span class="text-xs text-neutral-600">Absent</span>
            </div>
          </div>
        </div>

        <!-- Attendance Overview Table -->
        <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-neutral-900">
              Attendance Overview
            </h2>
            <button
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-neutral-200">
                  <th
                    class="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase"
                  >
                    Employee Name
                  </th>
                  <th
                    class="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase"
                  >
                    Designation
                  </th>
                  <th
                    class="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase"
                  >
                    Type
                  </th>
                  <th
                    class="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase"
                  >
                    Check In Time
                  </th>
                  <th
                    class="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="employee in attendanceList"
                  :key="employee.id"
                  class="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                >
                  <td class="px-4 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        :class="[
                          'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm',
                          getAvatarColor(employee.name),
                        ]"
                      >
                        {{ employee.initials }}
                      </div>
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
                        employee.status === 'On Time'
                          ? 'bg-success-50 text-success-700'
                          : 'bg-error-50 text-error-700',
                      ]"
                    >
                      {{ employee.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar - My Schedule -->
    <div class="w-80 bg-white border-l border-neutral-200 p-6 overflow-y-auto">
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
          My Schedule
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
            v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
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
      </div>
    </div>
  </div>

  <!-- Employee Dashboard -->
  <div v-else class="px-6 py-6">
    <div class="max-w-7xl mx-auto">
      <!-- Welcome Section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">
          Welcome back, {{ authStore.user?.name?.split(' ')[0] || 'Employee' }}! 👋
        </h1>
        <p class="text-neutral-600">Here's your dashboard overview</p>
      </div>

      <!-- Employee Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-neutral-600">My Attendance</h3>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-xl">📋</span>
            </div>
          </div>
          <p class="text-2xl font-bold text-neutral-900 mb-1">95%</p>
          <p class="text-xs text-neutral-500">This month</p>
        </div>

        <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-neutral-600">Leave Balance</h3>
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-xl">🏖️</span>
            </div>
          </div>
          <p class="text-2xl font-bold text-neutral-900 mb-1">12 Days</p>
          <p class="text-xs text-neutral-500">Remaining</p>
    </div>

        <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-neutral-600">Upcoming Payslip</h3>
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-xl">💰</span>
            </div>
          </div>
          <p class="text-2xl font-bold text-neutral-900 mb-1">July</p>
          <p class="text-xs text-neutral-500">Available soon</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm mb-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link
            to="/attendance"
            class="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-xl">📋</span>
            </div>
            <div>
              <p class="font-medium text-neutral-900">View Attendance</p>
              <p class="text-xs text-neutral-500">Check your attendance records</p>
            </div>
          </router-link>

          <router-link
            to="/leave-requests/new"
            class="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-xl">🏖️</span>
            </div>
            <div>
              <p class="font-medium text-neutral-900">Request Leave</p>
              <p class="text-xs text-neutral-500">Submit a new leave request</p>
            </div>
          </router-link>

          <router-link
            to="/payslip"
            class="flex items-center gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="text-xl">💰</span>
            </div>
            <div>
              <p class="font-medium text-neutral-900">View Payslip</p>
              <p class="text-xs text-neutral-500">Access your salary details</p>
            </div>
          </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
      <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <h2 class="text-lg font-bold text-neutral-900 mb-4">Recent Activity</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4 pb-4 border-b border-neutral-100">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span class="text-lg">✓</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-neutral-900">Checked in today</p>
              <p class="text-xs text-neutral-500">9:00 AM</p>
            </div>
          </div>
          <div class="flex items-center gap-4 pb-4 border-b border-neutral-100">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-lg">📄</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-neutral-900">Leave request approved</p>
              <p class="text-xs text-neutral-500">2 days ago</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span class="text-lg">💰</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-neutral-900">June payslip available</p>
              <p class="text-xs text-neutral-500">5 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/authStore";
import StatCard from "../components/common/StatCard.vue";

const authStore = useAuthStore();

const stats = ref([
  {
    id: 1,
    title: "Total Employee",
    value: "560",
    change: "12%",
    updateDate: "July 16, 2023",
    changeDirection: "up",
  },
  {
    id: 2,
    title: "Total Applicant",
    value: "1050",
    change: "5%",
    updateDate: "July 14, 2023",
    changeDirection: "up",
  },
  {
    id: 3,
    title: "Today Attendance",
    value: "470",
    change: "8%",
    updateDate: "July 14, 2023",
    changeDirection: "down",
  },
  {
    id: 4,
    title: "Total Projects",
    value: "250",
    change: "12%",
    updateDate: "July 10, 2023",
    changeDirection: "up",
  },
]);

const chartFilter = ref("today");

// Data according to the image - values represent height percentages
const attendanceChartDataWeek = ref([
  { day: "Mon", present: 60, late: 28, absent: 12 }, // Purple 0-60%, Orange 60-88% (28%), Red 88-100% (12%)
  { day: "Tue", present: 60, late: 20, absent: 20 }, // Purple 0-60%, Orange 60-80% (20%), Red 80-100% (20%)
  { day: "Wed", present: 48, late: 27, absent: 25 }, // Purple 0-48%, Orange 48-75% (27%), Red 75-100% (25%)
  { day: "Thu", present: 60, late: 28, absent: 12 }, // Purple 0-60%, Orange 60-88% (28%), Red 88-100% (12%)
  { day: "Fri", present: 76, late: 14, absent: 10 }, // Purple 0-76%, Orange 76-90% (14%), Red 90-100% (10%)
  { day: "Sat", present: 46, late: 29, absent: 25 }, // Purple 0-46%, Orange 46-75% (29%), Red 75-100% (25%)
  { day: "Sun", present: 48, late: 37, absent: 15 }, // Purple 0-48%, Orange 48-85% (37%), Red 85-100% (15%)
]);

const attendanceChartDataToday = ref([
  { day: "Today", present: 60, late: 28, absent: 12 },
]);

const attendanceChartDataMonth = ref([
  { day: "Week 1", present: 58, late: 25, absent: 17 },
  { day: "Week 2", present: 62, late: 22, absent: 16 },
  { day: "Week 3", present: 55, late: 30, absent: 15 },
  { day: "Week 4", present: 65, late: 20, absent: 15 },
]);

const filteredChartData = computed(() => {
  switch (chartFilter.value) {
    case "today":
      return attendanceChartDataToday.value;
    case "week":
      return attendanceChartDataWeek.value;
    case "month":
      return attendanceChartDataMonth.value;
    default:
      return attendanceChartDataWeek.value;
  }
});

const updateChartData = () => {
  // Data is updated automatically via computed property
};

const attendanceList = ref([
  {
    id: 1,
    name: "Leasie Watson",
    designation: "Team Lead - Design",
    type: "Office",
    checkIn: "09:27 AM",
    status: "On Time",
    initials: "LW",
  },
  {
    id: 2,
    name: "Darlene Robertson",
    designation: "Web Designer",
    type: "Office",
    checkIn: "10:15 AM",
    status: "Late",
    initials: "DR",
  },
  {
    id: 3,
    name: "Jacob Jones",
    designation: "Medical Assistant",
    type: "Remote",
    checkIn: "10:24 AM",
    status: "Late",
    initials: "JJ",
  },
  {
    id: 4,
    name: "Kathryn Murphy",
    designation: "Marketing Coordinator",
    type: "Office",
    checkIn: "09:10 AM",
    status: "On Time",
    initials: "KM",
  },
  {
    id: 5,
    name: "Leslie Alexander",
    designation: "Data Analyst",
    type: "Office",
    checkIn: "09:15 AM",
    status: "On Time",
    initials: "LA",
  },
  {
    id: 6,
    name: "Ronald Richards",
    designation: "Python Developer",
    type: "Remote",
    checkIn: "09:29 AM",
    status: "On Time",
    initials: "RR",
  },
  {
    id: 7,
    name: "Jenny Wilson",
    designation: "React JS Developer",
    type: "Remote",
    checkIn: "11:30 AM",
    status: "Late",
    initials: "JW",
  },
]);

// Generate avatar color based on name
const getAvatarColor = (name) => {
  const colors = [
    "bg-primary-500",
    "bg-secondary-500",
    "bg-success-500",
    "bg-warning-500",
    "bg-error-500",
    "bg-info-500",
    "bg-secondary-600",
    "bg-primary-600",
    "bg-success-600",
    "bg-info-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const currentDate = ref(new Date(2023, 6, 1)); // July 2023

const currentMonth = computed(() => {
  return currentDate.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      date: new Date(year, month - 1, prevMonthLastDay - i),
    });
  }

  // Current month days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      isSelected: i === 6 || i === 7, // July 6 and 7 are selected
      date: date,
    });
  }

  // Next month days to fill the grid
  const remainingDays = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      date: new Date(year, month + 1, i),
    });
  }

  return days;
});

const scheduledEvents = ref([
  {
    date: "Wednesday, 06 July 2023",
    events: [
      {
        time: "09:30",
        title: "UI/UX Designer",
        description: "Practical Task Review",
      },
      {
        time: "12:00",
        title: "Magento Developer",
        description: "Resume Review",
      },
      {
        time: "01:30",
        title: "Sales Manager",
        description: "Final HR Round",
      },
    ],
  },
  {
    date: "Thursday, 07 July 2023",
    events: [
      {
        time: "09:30",
        title: "Front end Developer",
        description: "Practical Task Review",
      },
      {
        time: "11:00",
        title: "React JS",
        description: "TL Meeting",
      },
    ],
  },
]);

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const selectDate = (date) => {
  // Handle date selection
  console.log("Selected date:", date);
};
</script>

<style scoped></style>
