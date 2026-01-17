<template>
  <div class="px-8 py-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-neutral-900 mb-2">My Profile</h1>
      <p class="text-sm text-neutral-600">
        Manage your personal information and account settings
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Profile Card -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <!-- Avatar -->
          <div class="flex flex-col items-center mb-6">
            <div
              class="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4"
              style="background-color: #6699FF;"
            >
              {{ getInitials(user.name) }}
            </div>
            <h2 class="text-xl font-bold text-neutral-900 mb-1">
              {{ user.name }}
            </h2>
            <p class="text-sm text-neutral-600 mb-4">{{ user.role }}</p>
            <button
              @click="editProfile"
              class="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
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
              Edit Profile
            </button>
          </div>

          <!-- Quick Info -->
          <div class="space-y-4 border-t border-neutral-200 pt-6">
            <div class="flex items-center gap-3">
              <svg
                class="w-5 h-5 text-neutral-400"
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
              <div>
                <p class="text-xs text-neutral-500">Email</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ user.email }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <svg
                class="w-5 h-5 text-neutral-400"
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
              <div>
                <p class="text-xs text-neutral-500">Department</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ user.department }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <svg
                class="w-5 h-5 text-neutral-400"
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
              <div>
                <p class="text-xs text-neutral-500">Join Date</p>
                <p class="text-sm font-medium text-neutral-900">
                  {{ user.joinDate }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Content Tabs -->
      <div class="lg:col-span-2">
        <!-- Tabs Navigation -->
        <div class="bg-white rounded-xl border border-neutral-200 shadow-sm mb-6">
          <div class="border-b border-neutral-200">
            <div class="flex items-center gap-1 px-6">
              <button
                :class="[
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'personal'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900',
                ]"
                @click="activeTab = 'personal'"
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
                Personal Information
              </button>
              <button
                :class="[
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'security'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900',
                ]"
                @click="activeTab = 'security'"
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
                Security
              </button>
              <button
                :class="[
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'preferences'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900',
                ]"
                @click="activeTab = 'preferences'"
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Preferences
              </button>
            </div>
          </div>
        </div>

        <!-- Personal Information Tab -->
        <div
          v-if="activeTab === 'personal'"
          class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
        >
          <h2 class="text-lg font-bold text-neutral-900 mb-6">
            Personal Information
          </h2>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                First Name
              </label>
              <input
                v-model="user.firstName"
                type="text"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                placeholder="First Name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Last Name
              </label>
              <input
                v-model="user.lastName"
                type="text"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                placeholder="Last Name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                v-model="user.email"
                type="email"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                placeholder="Email Address"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number
              </label>
              <input
                v-model="user.phone"
                type="tel"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                placeholder="Phone Number"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Date of Birth
              </label>
              <input
                v-model="user.dateOfBirth"
                type="date"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Gender
              </label>
              <select
                v-model="user.gender"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Address
              </label>
              <textarea
                v-model="user.address"
                rows="3"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                placeholder="Address"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                City
              </label>
              <input
                v-model="user.city"
                type="text"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                placeholder="City"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Country
              </label>
              <input
                v-model="user.country"
                type="text"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                placeholder="Country"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="cancelEdit"
              class="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="savePersonalInfo"
              class="btn-primary px-4 py-2 text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>

        <!-- Security Tab -->
        <div
          v-if="activeTab === 'security'"
          class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
        >
          <h2 class="text-lg font-bold text-neutral-900 mb-6">Security</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Current Password
              </label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                New Password
              </label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Confirm New Password
              </label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="resetPasswordForm"
              class="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="updatePassword"
              class="btn-primary px-4 py-2 text-sm font-medium"
            >
              Update Password
            </button>
          </div>
        </div>

        <!-- Preferences Tab -->
        <div
          v-if="activeTab === 'preferences'"
          class="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm"
        >
          <h2 class="text-lg font-bold text-neutral-900 mb-6">Preferences</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Language
              </label>
              <select
                v-model="preferences.language"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Time Zone
              </label>
              <select
                v-model="preferences.timezone"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Standard Time</option>
                <option value="PST">Pacific Standard Time</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-neutral-700">
                  Email Notifications
                </p>
                <p class="text-xs text-neutral-500">
                  Receive email notifications for important updates
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="preferences.emailNotifications"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"
                ></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-neutral-700">
                  SMS Notifications
                </p>
                <p class="text-xs text-neutral-500">
                  Receive SMS notifications for urgent matters
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="preferences.smsNotifications"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"
                ></div>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="resetPreferences"
              class="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="savePreferences"
              class="btn-primary px-4 py-2 text-sm font-medium"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();
const activeTab = ref("personal");

const user = ref({
  name: "Robert Allen",
  firstName: "Robert",
  lastName: "Allen",
  email: "robert.allen@bravorh.com",
  phone: "+1 (555) 123-4567",
  role: "HR Manager",
  department: "Human Resources",
  joinDate: "January 15, 2020",
  dateOfBirth: "1985-05-20",
  gender: "male",
  address: "123 Main Street",
  city: "New York",
  country: "United States",
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const preferences = ref({
  language: "en",
  timezone: "EST",
  emailNotifications: true,
  smsNotifications: false,
});

const getInitials = (name) => {
  if (!name) return "RA";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const editProfile = () => {
  // Navigate to edit mode or open edit modal
  activeTab.value = "personal";
};

const savePersonalInfo = () => {
  // Save personal information
  console.log("Saving personal info:", user.value);
  // In a real app, make an API call here
  alert("Personal information saved successfully!");
};

const cancelEdit = () => {
  // Reset form or close edit mode
  // In a real app, reload user data
};

const updatePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert("New passwords do not match!");
    return;
  }
  // Update password
  console.log("Updating password");
  // In a real app, make an API call here
  alert("Password updated successfully!");
  resetPasswordForm();
};

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
};

const savePreferences = () => {
  // Save preferences
  console.log("Saving preferences:", preferences.value);
  // In a real app, make an API call here
  alert("Preferences saved successfully!");
};

const resetPreferences = () => {
  // Reset preferences to default
  preferences.value = {
    language: "en",
    timezone: "EST",
    emailNotifications: true,
    smsNotifications: false,
  };
};

onMounted(() => {
  // Load user data from store or API
  // In a real app, fetch user data here
});
</script>

<style scoped></style>



