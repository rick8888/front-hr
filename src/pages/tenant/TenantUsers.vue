<template>
  <div class="px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto max-w-5xl space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-neutral-900 md:text-3xl">Utilisateurs</h1>
        <p class="mt-2 text-sm text-neutral-500">
          Liste des administrateurs RH de votre entreprise
        </p>
      </header>

      <div
        v-if="error"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <ListingTableShell
        search-id="tenant-users-search"
        search-placeholder="Rechercher un administrateur…"
        add-button-label="+ Ajouter un admin"
        :total="filteredUsers.length"
        :range-from="rangeLabel.from"
        :range-to="rangeLabel.to"
        :current-page="page"
        :page-count="pageCount"
        :page-size="pageSize"
        :search-query="searchQuery"
        @add="openModal = true"
        @update:current-page="page = $event"
        @update:page-size="pageSize = $event"
        @update:search-query="searchQuery = $event"
      >
        <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50/80">
            <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Nom</th>
            <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Email</th>
            <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Rôle</th>
            <th class="px-5 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Créé le</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr v-if="loading">
            <td colspan="4" class="px-6 py-16 text-center text-sm text-neutral-500">Chargement…</td>
          </tr>
          <tr v-else-if="paginatedUsers.length === 0">
            <td colspan="4" class="px-6 py-16 text-center text-sm text-neutral-500">
              Aucun administrateur trouvé.
            </td>
          </tr>
          <tr
            v-for="user in paginatedUsers"
            :key="user.id"
            class="transition-colors hover:bg-neutral-50/60"
          >
            <td class="px-5 py-4 text-sm font-medium text-neutral-900">{{ user.name }}</td>
            <td class="px-5 py-4 text-sm text-neutral-700">{{ user.email }}</td>
            <td class="px-5 py-4">
              <span :class="roleBadgeClass(user.role)">
                {{ roleLabel(user.role) }}
              </span>
            </td>
            <td class="px-5 py-4 text-sm text-neutral-600">{{ formatDate(user.created_at) }}</td>
          </tr>
        </tbody>
      </ListingTableShell>
    </div>

    <TenantAddAdminModal
      v-model:open="openModal"
      :saving="saving"
      :server-errors="serverErrors"
      :server-message="serverMessage"
      @submit="handleCreate"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import ListingTableShell from "../../components/leave-management/ListingTableShell.vue";
import TenantAddAdminModal from "../../components/tenant/TenantAddAdminModal.vue";
import { companyUsersApiService } from "./services/company-users.api.service.js";

const users = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const openModal = ref(false);
const serverErrors = ref({});
const serverMessage = ref("");

const searchQuery = ref("");
const page = ref(1);
const pageSize = ref(10);

const ROLE_LABELS = {
  tenant: "Tenant",
  admin: "Administrateur RH",
  employe: "Employé",
  team_manager: "Manager d'équipe",
  super_admin: "Super admin",
};

function roleLabel(role) {
  return ROLE_LABELS[role] ?? role;
}

function roleBadgeClass(role) {
  const base = "inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset";
  if (role === "admin") {
    return `${base} bg-indigo-50 text-indigo-800 ring-indigo-600/15`;
  }
  if (role === "tenant") {
    return `${base} bg-sky-50 text-sky-800 ring-sky-600/15`;
  }
  return `${base} bg-neutral-100 text-neutral-700 ring-neutral-500/15`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return users.value;
  return users.value.filter(
    (u) =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      roleLabel(u.role).toLowerCase().includes(q)
  );
});

const pageCount = computed(() =>
  Math.max(1, Math.ceil(filteredUsers.value.length / pageSize.value))
);

const paginatedUsers = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredUsers.value.slice(start, start + pageSize.value);
});

const rangeLabel = computed(() => {
  if (filteredUsers.value.length === 0) {
    return { from: 0, to: 0 };
  }
  const from = (page.value - 1) * pageSize.value + 1;
  const to = Math.min(page.value * pageSize.value, filteredUsers.value.length);
  return { from, to };
});

async function loadUsers() {
  loading.value = true;
  error.value = "";
  try {
    users.value = await companyUsersApiService.fetchUsers();
  } catch (e) {
    error.value =
      e.response?.data?.message ||
      "Impossible de charger les administrateurs.";
  } finally {
    loading.value = false;
  }
}

async function handleCreate(payload) {
  saving.value = true;
  serverErrors.value = {};
  serverMessage.value = "";
  try {
    const created = await companyUsersApiService.createAdmin(payload);
    users.value = [...users.value, created].sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    );
    openModal.value = false;
  } catch (e) {
    serverMessage.value = e.response?.data?.message || "";
    serverErrors.value = e.response?.data?.errors || {};
    if (!serverMessage.value && !Object.keys(serverErrors.value).length) {
      serverMessage.value = "Impossible de créer l'administrateur.";
    }
  } finally {
    saving.value = false;
  }
}

onMounted(loadUsers);
</script>
