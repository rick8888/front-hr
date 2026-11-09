<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Performance Reviews</h1>
        <p class="text-sm text-neutral-600">
          Track employee performance and ratings
        </p>
      </div>
      <button @click="isReviewModalOpen = true" class="btn-primary">
        + Create Review
      </button>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select class="input-base">
          <option>All Departments</option>
          <option>Sales</option>
          <option>Engineering</option>
        </select>
        <select class="input-base">
          <option>All Ratings</option>
          <option>Excellent</option>
          <option>Good</option>
          <option>Average</option>
        </select>
        <input type="text" placeholder="Search by name..." class="input-base" />
      </div>
    </div>

    <!-- Reviews Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="review in reviews" :key="review.id" class="card">
        <div class="flex items-center gap-3 mb-4">
          <EmployeeAvatar
            :name="review.employee"
            :avatar-url="review.avatar_url || review.avatarUrl"
            size-class="h-12 w-12 font-bold"
            fallback-class="bg-primary-200 text-primary-700"
          />
          <div>
            <p class="font-medium text-neutral-900">{{ review.employee }}</p>
            <p class="text-xs text-neutral-600">{{ review.role }}</p>
          </div>
        </div>

        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-neutral-700">Rating</span>
            <span :class="['badge', `badge-${getRatingClass(review.rating)}`]">
              {{ review.rating }}
            </span>
          </div>
          <div class="flex gap-1">
            <span
              v-for="i in 5"
              :key="i"
              :class="[
                'text-lg',
                i <= review.rating ? 'text-yellow-400' : 'text-neutral-300',
              ]"
            >
              ★
            </span>
          </div>
        </div>

        <div class="space-y-2 mb-4 text-sm">
          <div class="flex justify-between">
            <span class="text-neutral-600">Review Date:</span>
            <span class="font-medium text-neutral-900">{{
              review.reviewDate
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-neutral-600">Reviewed By:</span>
            <span class="font-medium text-neutral-900">{{
              review.reviewedBy
            }}</span>
          </div>
        </div>

        <button @click="editReview(review)" class="btn-outline w-full">
          Edit
        </button>
      </div>
    </div>

    <!-- Create/Edit Review Modal -->
    <Modal
      v-model="isReviewModalOpen"
      :title="
        editingReview ? 'Edit Performance Review' : 'Create Performance Review'
      "
      @confirm="saveReview"
    >
      <div class="space-y-4">
        <input
          v-model="reviewFormData.employee"
          type="text"
          placeholder="Employee Name"
          class="input-base"
        />
        <input
          v-model="reviewFormData.role"
          type="text"
          placeholder="Employee Role"
          class="input-base"
        />
        <select v-model.number="reviewFormData.rating" class="input-base">
          <option value="">Select Rating</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Below Average</option>
          <option value="3">3 - Average</option>
          <option value="4">4 - Good</option>
          <option value="5">5 - Excellent</option>
        </select>
        <input
          v-model="reviewFormData.reviewedBy"
          type="text"
          placeholder="Reviewed By"
          class="input-base"
        />
        <input
          v-model="reviewFormData.reviewDate"
          type="date"
          class="input-base"
        />
        <textarea
          v-model="reviewFormData.comments"
          placeholder="Comments (optional)"
          class="input-base"
          rows="3"
        />
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import EmployeeAvatar from "../components/common/EmployeeAvatar.vue";
import Modal from "../components/common/Modal.vue";

const isReviewModalOpen = ref(false);
const editingReview = ref(null);

const reviewFormData = ref({
  employee: "",
  role: "",
  rating: "",
  reviewedBy: "",
  reviewDate: "",
  comments: "",
});

const reviews = ref([
  {
    id: 1,
    employee: "John Doe",
    role: "Sales Manager",
    rating: 5,
    reviewDate: "2024-12-01",
    reviewedBy: "Sarah Admin",
  },
  {
    id: 2,
    employee: "Jane Smith",
    role: "Developer",
    rating: 4,
    reviewDate: "2024-11-15",
    reviewedBy: "Tom Lead",
  },
  {
    id: 3,
    employee: "Mike Johnson",
    role: "Executive",
    rating: 5,
    reviewDate: "2024-10-20",
    reviewedBy: "Sarah Admin",
  },
  {
    id: 4,
    employee: "Emma Davis",
    role: "Designer",
    rating: 3,
    reviewDate: "2024-09-10",
    reviewedBy: "Lisa Manager",
  },
  {
    id: 5,
    employee: "David Martinez",
    role: "Sales Rep",
    rating: 4,
    reviewDate: "2024-08-25",
    reviewedBy: "Tom Lead",
  },
  {
    id: 6,
    employee: "Lisa Anderson",
    role: "Tech Lead",
    rating: 5,
    reviewDate: "2024-07-30",
    reviewedBy: "Sarah Admin",
  },
]);

const editReview = (review) => {
  editingReview.value = review;
  reviewFormData.value = { ...review };
  isReviewModalOpen.value = true;
};

const saveReview = () => {
  if (editingReview.value) {
    const index = reviews.value.findIndex(
      (r) => r.id === editingReview.value.id
    );
    if (index !== -1) {
      reviews.value[index] = {
        ...editingReview.value,
        ...reviewFormData.value,
      };
    }
  } else {
    reviews.value.push({
      id: Math.max(...reviews.value.map((r) => r.id)) + 1,
      ...reviewFormData.value,
    });
  }
  isReviewModalOpen.value = false;
  editingReview.value = null;
  reviewFormData.value = {
    employee: "",
    role: "",
    rating: "",
    reviewedBy: "",
    reviewDate: "",
    comments: "",
  };
};

const getRatingClass = (rating) => {
  if (rating >= 4) return "success";
  if (rating === 3) return "warning";
  return "error";
};
</script>

<style scoped></style>
