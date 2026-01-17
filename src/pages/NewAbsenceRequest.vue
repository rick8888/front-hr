<template>
  <div class="px-8 py-6">
    <!-- Header Navigation -->
    <div class="mb-8">
      <router-link
        to="/leave-requests"
        class="text-primary-600 hover:text-primary-700 font-medium text-sm mb-4 flex items-center gap-2 w-fit"
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
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        Leave Requests
      </router-link>
    </div>

    <!-- Page Title -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-neutral-900">Request Time Off</h1>
      <p class="text-neutral-600 text-sm mt-1">
        Submit a new leave or absence request
      </p>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex gap-0 mb-6 border-b border-neutral-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-6 py-3 font-medium text-sm border-b-2 transition-colors -mb-[2px]',
          activeTab === tab.id
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-neutral-600 hover:text-neutral-900',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="card">
      <form @submit.prevent="handleSubmit" class="space-y-8 p-6">
        <!-- Absence Type Tab -->
        <div v-if="activeTab === 'type'" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-neutral-900 mb-4"
              >Type of Absence</label
            >
            <div class="space-y-3">
              <div
                v-for="category in categories"
                :key="category.id"
                class="flex items-start gap-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                @click="formData.categoryId = category.id"
              >
                <input
                  type="radio"
                  :value="category.id"
                  v-model="formData.categoryId"
                  :id="`category-${category.id}`"
                  class="w-5 h-5 mt-0.5"
                />
                <label
                  :for="`category-${category.id}`"
                  class="flex-1 cursor-pointer"
                >
                  <p class="font-medium text-neutral-900">
                    {{ category.name }}
                  </p>
                  <p class="text-xs text-neutral-500 mt-1">
                    Available:
                    <span class="font-semibold text-neutral-700"
                      >{{ category.balance }} days</span
                    >
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Duration Tab -->
        <div v-if="activeTab === 'duration'" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-neutral-900 mb-4"
              >Period</label
            >
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-2"
                  >Start Date *</label
                >
                <input
                  v-model="formData.startDate"
                  type="date"
                  class="input-base"
                  required
                  @change="calculateDuration"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-2"
                  >End Date *</label
                >
                <input
                  v-model="formData.endDate"
                  type="date"
                  class="input-base"
                  required
                  @change="calculateDuration"
                />
              </div>
            </div>

            <!-- Duration Summary -->
            <div
              v-if="durationDays > 0"
              class="mt-6 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-4"
            >
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-neutral-600 mb-1">Start Date</p>
                  <p class="font-semibold text-neutral-900">
                    {{ formatDate(formData.startDate) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-neutral-600 mb-1">Total Duration</p>
                  <p class="font-semibold text-primary-600">
                    {{ durationDays }} day{{ durationDays > 1 ? "s" : "" }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-neutral-600 mb-1">End Date</p>
                  <p class="font-semibold text-neutral-900">
                    {{ formatDate(formData.endDate) }}
                  </p>
                </div>
              </div>

              <!-- Warning if exceeds balance -->
              <div
                v-if="
                  selectedCategory && durationDays > selectedCategory.balance
                "
                class="mt-3 flex gap-2 text-sm text-warning-700 bg-warning-50 border border-warning-200 rounded p-3"
              >
                <svg
                  class="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <p>
                  You will exceed your available balance by
                  {{ durationDays - selectedCategory.balance }} day{{
                    durationDays - selectedCategory.balance > 1 ? "s" : ""
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Tab -->
        <div v-if="activeTab === 'details'" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-neutral-900 mb-2"
              >Reason for Absence</label
            >
            <textarea
              v-model="formData.reason"
              placeholder="Please provide details about your absence request..."
              class="input-base resize-none"
              rows="5"
            ></textarea>
            <p class="text-xs text-neutral-500 mt-2">
              {{ formData.reason.length }}/500 characters
            </p>
          </div>

          <!-- Attachments -->
          <div>
            <label class="block text-sm font-semibold text-neutral-900 mb-3"
              >Supporting Documents</label
            >
            <div
              class="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors"
            >
              <input
                type="file"
                multiple
                @change="handleFileSelect"
                class="hidden"
                ref="fileInput"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <svg
                class="w-10 h-10 text-neutral-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p class="text-sm text-neutral-600 font-medium">
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Click to upload
                </button>
                <span class="text-neutral-600"> or drag and drop</span>
              </p>
              <p class="text-xs text-neutral-500 mt-2">
                PDF, DOC, DOCX, JPG, PNG (max 5MB)
              </p>
            </div>

            <!-- Uploaded Files -->
            <div v-if="attachments.length > 0" class="mt-4 space-y-2">
              <p class="text-sm font-medium text-neutral-700">
                Uploaded Files:
              </p>
              <div
                v-for="(file, index) in attachments"
                :key="index"
                class="flex items-center justify-between bg-neutral-50 p-3 rounded-lg border border-neutral-200"
              >
                <div class="flex items-center gap-2">
                  <svg
                    class="w-5 h-5 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 16.5a1 1 0 11-2 0 1 1 0 012 0z"
                    ></path>
                    <path
                      d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1H3zm11 5H7v2h7V9z"
                    ></path>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-neutral-900">
                      {{ file.name }}
                    </p>
                    <p class="text-xs text-neutral-500">
                      {{ (file.size / 1024).toFixed(2) }} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="removeFile(index)"
                  class="text-error-600 hover:text-error-700 p-1"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div class="space-y-3">
          <div
            v-if="errorMessage"
            class="bg-error-50 border border-error-200 rounded-lg p-4 flex gap-3"
          >
            <svg
              class="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <p class="text-sm text-error-700">{{ errorMessage }}</p>
          </div>

          <div
            v-if="successMessage"
            class="bg-success-50 border border-success-200 rounded-lg p-4 flex gap-3"
          >
            <svg
              class="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <p class="text-sm text-success-700">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-6 border-t border-neutral-200">
          <button type="submit" :disabled="isLoading" class="btn-primary px-8">
            {{ isLoading ? "Submitting..." : "Submit Request" }}
          </button>
          <router-link to="/leave-requests" class="btn-outline px-8">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Tabs
const tabs = [
  { id: "type", label: "Absence Type" },
  { id: "duration", label: "Duration" },
  { id: "details", label: "Details" },
];
const activeTab = ref("type");

// Form data
const formData = ref({
  categoryId: "",
  startDate: "",
  endDate: "",
  reason: "",
});

// UI States
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const attachments = ref([]);
const fileInput = ref(null);

// Mock categories with balances
const categories = ref([
  { id: 1, name: "Annual Leave", balance: 20 },
  { id: 2, name: "Sick Leave", balance: 10 },
  { id: 3, name: "Personal Leave", balance: 5 },
  { id: 4, name: "Unpaid Leave", balance: "Unlimited" },
]);

const selectedCategory = computed(() => {
  return categories.value.find((cat) => cat.id == formData.value.categoryId);
});

const durationDays = computed(() => {
  if (!formData.value.startDate || !formData.value.endDate) return 0;
  const start = new Date(formData.value.startDate);
  const end = new Date(formData.value.endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
});

// Methods
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-US", options);
};

const calculateDuration = () => {
  if (new Date(formData.value.startDate) > new Date(formData.value.endDate)) {
    errorMessage.value = "End date must be after start date";
    formData.value.endDate = "";
  } else {
    errorMessage.value = "";
  }
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  for (let file of files) {
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = `File ${file.name} is too large (max 5MB)`;
      continue;
    }
    attachments.value.push(file);
  }
  fileInput.value.value = "";
};

const removeFile = (index) => {
  attachments.value.splice(index, 1);
};

const validateForm = () => {
  errorMessage.value = "";

  if (!formData.value.categoryId) {
    errorMessage.value = "Please select an absence type";
    activeTab.value = "type";
    return false;
  }

  if (!formData.value.startDate) {
    errorMessage.value = "Please select a start date";
    activeTab.value = "duration";
    return false;
  }

  if (!formData.value.endDate) {
    errorMessage.value = "Please select an end date";
    activeTab.value = "duration";
    return false;
  }

  if (new Date(formData.value.startDate) > new Date(formData.value.endDate)) {
    errorMessage.value = "End date must be after start date";
    activeTab.value = "duration";
    return false;
  }

  if (formData.value.reason.length > 500) {
    errorMessage.value = "Reason must be 500 characters or less";
    activeTab.value = "details";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock API response
    const response = {
      success: true,
      message: "Leave request submitted successfully",
    };

    if (response.success) {
      successMessage.value =
        "Your leave request has been submitted successfully!";

      // Reset form
      formData.value = {
        categoryId: "",
        startDate: "",
        endDate: "",
        reason: "",
      };
      attachments.value = [];
      activeTab.value = "type";

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/leave-requests");
      }, 2000);
    } else {
      errorMessage.value = response.message || "Failed to submit request";
    }
  } catch (error) {
    errorMessage.value = "An error occurred. Please try again.";
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

// Initialize
onMounted(() => {
  // Load user's absence balance from API
  // In real app: fetch from /api/my-absences/categories
});
</script>

<style scoped></style>
