<template>
  <div class="px-8 py-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <!-- Search Bar -->
      <div class="relative w-full max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
        />
        <svg
          class="absolute left-3 top-3 w-4 h-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Add New Holiday Button -->
      <button
        @click="openAddHolidayModal"
        class="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add New Holiday
      </button>
    </div>

    <!-- Holidays Table -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <!-- Table Header -->
      <div class="grid grid-cols-4 gap-4 px-6 py-3 bg-neutral-50 border-b border-neutral-200">
        <div class="text-sm font-medium text-neutral-600">Date</div>
        <div class="text-sm font-medium text-neutral-600">Day</div>
        <div class="text-sm font-medium text-neutral-600">Holiday Name</div>
        <div class="text-sm font-medium text-neutral-600 text-right">Actions</div>
      </div>

      <!-- Table Body -->
      <div class="divide-y divide-neutral-100">
        <div
          v-for="holiday in filteredHolidays"
          :key="holiday.id"
          :class="[
            'grid grid-cols-4 gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors relative group',
            isUpcoming(holiday.date) ? 'border-l-4 border-l-primary-600' : '',
          ]"
        >
          <div class="text-sm text-neutral-900 font-medium">
            {{ formatDate(holiday.date) }}
          </div>
          <div class="text-sm text-neutral-600">
            {{ getDayName(holiday.date) }}
          </div>
          <div class="text-sm text-neutral-900">{{ holiday.name }}</div>
          <div class="flex items-center justify-end">
            <button
              @click.stop="confirmDelete(holiday)"
              class="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all duration-200"
              title="Delete holiday"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredHolidays.length === 0" class="px-6 py-12 text-center">
          <p class="text-neutral-500 text-sm">No holidays found</p>
        </div>
      </div>
    </div>

    <!-- Filter Tabs at Bottom -->
    <div class="flex items-center gap-4 mt-6">
      <button
        @click="activeFilter = 'upcoming'"
        class="flex items-center gap-2"
      >
        <div
          :class="[
            'w-4 h-4 rounded-full border-2 transition-colors',
            activeFilter === 'upcoming'
              ? 'bg-primary-600 border-primary-600'
              : 'bg-white border-neutral-300',
          ]"
        ></div>
        <span
          :class="[
            'text-sm font-medium transition-colors',
            activeFilter === 'upcoming'
              ? 'text-neutral-900'
              : 'text-neutral-500',
          ]"
        >
          Upcoming
        </span>
      </button>

      <button
        @click="activeFilter = 'past'"
        class="flex items-center gap-2"
      >
        <div
          :class="[
            'w-4 h-4 rounded-full border-2 transition-colors',
            activeFilter === 'past'
              ? 'bg-primary-600 border-primary-600'
              : 'bg-white border-neutral-300',
          ]"
        ></div>
        <span
          :class="[
            'text-sm font-medium transition-colors',
            activeFilter === 'past'
              ? 'text-neutral-900'
              : 'text-neutral-500',
          ]"
        >
          Past Holidays
        </span>
      </button>
    </div>

    <!-- Add Holiday Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Add New Holiday</h2>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Holiday Name
            </label>
            <input
              v-model="newHoliday.name"
              type="text"
              placeholder="Enter holiday name"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Date
            </label>
            <input
              v-model="newHoliday.date"
              type="date"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
        </div>

        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="addHoliday"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Holiday
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeDeleteModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Delete Holiday</h2>
        </div>

        <div class="px-6 py-4">
          <p class="text-sm text-neutral-600 mb-1">
            Are you sure you want to delete this holiday?
          </p>
          <p class="text-sm font-medium text-neutral-900">
            {{ holidayToDelete ? formatDate(holidayToDelete.date) : '' }} - {{ holidayToDelete?.name }}
          </p>
          <p class="text-xs text-error-600 mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="closeDeleteModal"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteHoliday"
            class="px-4 py-2 text-sm font-medium bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const activeFilter = ref("upcoming");
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const holidayToDelete = ref(null);

const newHoliday = ref({
  name: "",
  date: "",
});

// Mock holidays data matching the image
const holidays = ref([
  {
    id: 1,
    date: "2023-01-01",
    name: "New Year",
  },
  {
    id: 2,
    date: "2023-01-07",
    name: "International Programmers' Day",
  },
  {
    id: 3,
    date: "2023-02-04",
    name: "World Cancer Day",
  },
  {
    id: 4,
    date: "2023-04-01",
    name: "April Fool Day",
  },
  {
    id: 5,
    date: "2023-05-07",
    name: "International Programmers' Day",
  },
  {
    id: 6,
    date: "2023-05-22",
    name: "International Day for Biological Diversity",
  },
  {
    id: 7,
    date: "2023-06-05",
    name: "International Day for Biological Diversity",
  },
  {
    id: 8,
    date: "2023-08-07",
    name: "International Friendship Day",
  },
  {
    id: 9,
    date: "2023-09-15",
    name: "International Day of Democracy",
  },
  {
    id: 10,
    date: "2023-11-14",
    name: "World Diabetes Day",
  },
  {
    id: 11,
    date: "2023-12-25",
    name: "Merry Chrismas",
  },
]);

// Format date to "Month DD, YYYY" (always 2 digits for day)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  // Always format day with leading zero if needed
  const formattedDay = day.toString().padStart(2, '0');
  
  return `${month} ${formattedDay}, ${year}`;
};

// Get day name from date
const getDayName = (dateString) => {
  const date = new Date(dateString);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
};

// Check if holiday is upcoming
const isUpcoming = (dateString) => {
  const holidayDate = new Date(dateString);
  holidayDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return holidayDate >= today;
};

// Filter holidays based on search and active filter
const filteredHolidays = computed(() => {
  let result = holidays.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (holiday) =>
        holiday.name.toLowerCase().includes(query) ||
        formatDate(holiday.date).toLowerCase().includes(query) ||
        getDayName(holiday.date).toLowerCase().includes(query)
    );
  }

  // Apply date filter (upcoming or past)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (activeFilter.value === "upcoming") {
    result = result.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      holidayDate.setHours(0, 0, 0, 0);
      return holidayDate >= today;
    });
  } else if (activeFilter.value === "past") {
    result = result.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      holidayDate.setHours(0, 0, 0, 0);
      return holidayDate < today;
    });
  }

  // Sort by date
  return result.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
});

const openAddHolidayModal = () => {
  isModalOpen.value = true;
  newHoliday.value = {
    name: "",
    date: "",
  };
};

const closeModal = () => {
  isModalOpen.value = false;
  newHoliday.value = {
    name: "",
    date: "",
  };
};

const addHoliday = () => {
  if (!newHoliday.value.name || !newHoliday.value.date) {
    alert("Please fill in all fields");
    return;
  }

  const newId = holidays.value.length > 0 
    ? Math.max(...holidays.value.map((h) => h.id)) + 1 
    : 1;
  holidays.value.push({
    id: newId,
    date: newHoliday.value.date,
    name: newHoliday.value.name,
  });

  closeModal();
};

const confirmDelete = (holiday) => {
  holidayToDelete.value = holiday;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  holidayToDelete.value = null;
};

const deleteHoliday = () => {
  if (holidayToDelete.value) {
    const index = holidays.value.findIndex(
      (h) => h.id === holidayToDelete.value.id
    );
    if (index !== -1) {
      holidays.value.splice(index, 1);
    }
    closeDeleteModal();
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>

