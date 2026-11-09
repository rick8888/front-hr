<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Company Info</h1>
        <p class="text-sm text-neutral-600">
          Organization details and structure
        </p>
      </div>
      <button @click="isEditModalOpen = true" class="btn-primary">
        Edit Info
      </button>
    </div>

    <!-- Company Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="card">
        <h3 class="text-lg font-bold text-neutral-900 mb-4">Company Details</h3>
        <div class="space-y-3 text-sm">
          <div>
            <span class="text-neutral-600">Company Name</span>
            <p class="font-medium text-neutral-900">Bravo HR Systems</p>
          </div>
          <div>
            <span class="text-neutral-600">Industry</span>
            <p class="font-medium text-neutral-900">Human Resources</p>
          </div>
          <div>
            <span class="text-neutral-600">Founded</span>
            <p class="font-medium text-neutral-900">2020</p>
          </div>
          <div>
            <span class="text-neutral-600">Headquarters</span>
            <p class="font-medium text-neutral-900">New York, USA</p>
          </div>
          <div>
            <span class="text-neutral-600">Employee Count</span>
            <p class="font-medium text-neutral-900">1,254</p>
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-bold text-neutral-900 mb-4">
          Contact Information
        </h3>
        <div class="space-y-3 text-sm">
          <div>
            <span class="text-neutral-600">Email</span>
            <p class="font-medium text-neutral-900">info@bravorh.com</p>
          </div>
          <div>
            <span class="text-neutral-600">Phone</span>
            <p class="font-medium text-neutral-900">+1 (555) 123-4567</p>
          </div>
          <div>
            <span class="text-neutral-600">Website</span>
            <p class="font-medium text-neutral-900">www.bravorh.com</p>
          </div>
          <div>
            <span class="text-neutral-600">Address</span>
            <p class="font-medium text-neutral-900">
              123 Main Street, New York, NY 10001
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Leadership -->
    <div class="card">
      <h3 class="text-lg font-bold text-neutral-900 mb-4">Leadership Team</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="leader in leaders"
          :key="leader.id"
          class="border border-neutral-200 rounded-lg p-4 text-center"
        >
          <EmployeeAvatar
            :name="leader.name"
            :avatar-url="leader.avatar_url || leader.avatarUrl"
            size-class="mx-auto mb-3 h-16 w-16 text-xl font-bold"
            fallback-class="bg-primary-200 text-primary-700"
          />
          <p class="font-medium text-neutral-900">{{ leader.name }}</p>
          <p class="text-sm text-neutral-600">{{ leader.position }}</p>
          <p class="text-xs text-neutral-500 mt-2">{{ leader.email }}</p>
          <div class="flex gap-2 mt-3 justify-center">
            <button
              @click="editLeader(leader)"
              class="text-primary-600 hover:text-primary-700 text-xs font-medium"
            >
              Edit
            </button>
            <button
              @click="
                selectedLeader = leader;
                isDeleteLeaderModalOpen = true;
              "
              class="text-error-600 hover:text-error-700 text-xs font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Company Info Modal -->
    <Modal
      v-model="isEditModalOpen"
      title="Edit Company Information"
      @confirm="saveCompanyInfo"
    >
      <div class="space-y-4">
        <input
          v-model="companyFormData.name"
          type="text"
          placeholder="Company Name"
          class="input-base"
        />
        <input
          v-model="companyFormData.industry"
          type="text"
          placeholder="Industry"
          class="input-base"
        />
        <input
          v-model="companyFormData.headquarters"
          type="text"
          placeholder="Headquarters"
          class="input-base"
        />
        <input
          v-model.number="companyFormData.employees"
          type="number"
          placeholder="Employee Count"
          class="input-base"
        />
        <input
          v-model="companyFormData.email"
          type="email"
          placeholder="Email"
          class="input-base"
        />
        <input
          v-model="companyFormData.phone"
          type="tel"
          placeholder="Phone"
          class="input-base"
        />
        <input
          v-model="companyFormData.website"
          type="url"
          placeholder="Website"
          class="input-base"
        />
        <input
          v-model="companyFormData.address"
          type="text"
          placeholder="Address"
          class="input-base"
        />
      </div>
    </Modal>

    <!-- Edit Leader Modal -->
    <Modal
      v-model="isLeaderModalOpen"
      :title="editingLeader ? 'Edit Leader' : 'Add Leader'"
      @confirm="saveLeader"
    >
      <div class="space-y-4">
        <input
          v-model="leaderFormData.name"
          type="text"
          placeholder="Name"
          class="input-base"
        />
        <input
          v-model="leaderFormData.position"
          type="text"
          placeholder="Position"
          class="input-base"
        />
        <input
          v-model="leaderFormData.email"
          type="email"
          placeholder="Email"
          class="input-base"
        />
      </div>
    </Modal>

    <!-- Delete Leader Modal -->
    <Modal
      v-model="isDeleteLeaderModalOpen"
      title="Delete Leader"
      @confirm="deleteLeader"
    >
      <p class="text-neutral-600">
        Are you sure you want to delete
        <strong>{{ selectedLeader?.name }}</strong> from the leadership team?
        This action cannot be undone.
      </p>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import EmployeeAvatar from "../components/common/EmployeeAvatar.vue";
import Modal from "../components/common/Modal.vue";

const isEditModalOpen = ref(false);
const isLeaderModalOpen = ref(false);
const isDeleteLeaderModalOpen = ref(false);
const editingLeader = ref(null);
const selectedLeader = ref(null);

const companyFormData = ref({
  name: "Bravo HR Systems",
  industry: "Human Resources",
  headquarters: "New York, USA",
  employees: 1254,
  email: "info@bravorh.com",
  phone: "+1 (555) 123-4567",
  website: "www.bravorh.com",
  address: "123 Main Street, New York, NY 10001",
});

const leaderFormData = ref({ name: "", position: "", email: "" });

const companyInfo = ref({
  name: "Bravo HR Systems",
  industry: "Human Resources",
  founded: "2020",
  headquarters: "New York, USA",
  employees: "1,254",
  email: "info@bravorh.com",
  phone: "+1 (555) 123-4567",
  website: "www.bravorh.com",
  address: "123 Main Street, New York, NY 10001",
});

const leaders = ref([
  { id: 1, name: "David Johnson", position: "CEO", email: "david@bravorh.com" },
  {
    id: 2,
    name: "Sarah Williams",
    position: "CFO",
    email: "sarah@bravorh.com",
  },
  {
    id: 3,
    name: "Michael Brown",
    position: "CTO",
    email: "michael@bravorh.com",
  },
  {
    id: 4,
    name: "Emma Davis",
    position: "Head of HR",
    email: "emma@bravorh.com",
  },
]);

const saveCompanyInfo = () => {
  companyInfo.value = { ...companyFormData.value };
  isEditModalOpen.value = false;
};

const editLeader = (leader) => {
  editingLeader.value = leader;
  leaderFormData.value = { ...leader };
  isLeaderModalOpen.value = true;
};

const saveLeader = () => {
  if (editingLeader.value) {
    const index = leaders.value.findIndex(
      (l) => l.id === editingLeader.value.id
    );
    if (index !== -1) {
      leaders.value[index] = {
        ...editingLeader.value,
        ...leaderFormData.value,
      };
    }
  } else {
    leaders.value.push({
      id: Math.max(...leaders.value.map((l) => l.id)) + 1,
      ...leaderFormData.value,
    });
  }
  isLeaderModalOpen.value = false;
  editingLeader.value = null;
  leaderFormData.value = { name: "", position: "", email: "" };
};

const deleteLeader = () => {
  leaders.value = leaders.value.filter((l) => l.id !== selectedLeader.value.id);
  isDeleteLeaderModalOpen.value = false;
  selectedLeader.value = null;
};

</script>

<style scoped></style>
