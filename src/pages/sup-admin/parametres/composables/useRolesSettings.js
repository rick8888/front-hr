import { ref, computed } from "vue";
import { rolesApiService } from "../services/roles.api.service.js";
import { parseApiError } from "../../../../utils/apiErrors.js";

function normalizeRole(raw) {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? "",
    permissions: raw.permissions ?? [],
    isSystem: !!raw.is_system,
    isActive: raw.is_active !== false,
    usersCount: raw.users_count ?? 0,
  };
}

function emptyForm() {
  return {
    name: "",
    slug: "",
    description: "",
    permissions: [],
    isActive: true,
  };
}

export function useRolesSettings() {
  const roles = ref([]);
  const permissions = ref([]);
  const loading = ref(true);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const pageSize = ref(10);
  const currentPage = ref(1);

  const modalOpen = ref(false);
  const editingRole = ref(null);
  const form = ref(emptyForm());

  const deleteOpen = ref(false);
  const deleteTarget = ref(null);

  const permissionGroups = computed(() => {
    const groups = new Map();
    for (const perm of permissions.value) {
      const group = perm.group ?? "Autre";
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(perm);
    }
    return [...groups.entries()].map(([group, items]) => ({ group, items }));
  });

  const filteredRoles = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return roles.value;
    return roles.value.filter(
      (role) =>
        role.name.toLowerCase().includes(q) ||
        role.slug.toLowerCase().includes(q) ||
        role.description.toLowerCase().includes(q)
    );
  });

  const pageCount = computed(() =>
    Math.max(1, Math.ceil(filteredRoles.value.length / pageSize.value))
  );

  const paginatedRoles = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredRoles.value.slice(start, start + pageSize.value);
  });

  const rangeLabel = computed(() => {
    const total = filteredRoles.value.length;
    if (!total) return { from: 0, to: 0 };
    const from = (currentPage.value - 1) * pageSize.value + 1;
    const to = Math.min(currentPage.value * pageSize.value, total);
    return { from, to };
  });

  const stats = computed(() => ({
    total: roles.value.length,
    active: roles.value.filter((r) => r.isActive).length,
    system: roles.value.filter((r) => r.isSystem).length,
    users: roles.value.reduce((sum, r) => sum + r.usersCount, 0),
  }));

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      const [roleList, permissionList] = await Promise.all([
        rolesApiService.fetchAll(),
        rolesApiService.fetchPermissions(),
      ]);
      roles.value = roleList.map(normalizeRole);
      permissions.value = permissionList;
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de charger les rôles.";
    } finally {
      loading.value = false;
    }
  }

  function openCreate() {
    editingRole.value = null;
    form.value = emptyForm();
    modalOpen.value = true;
  }

  function openEdit(role) {
    editingRole.value = role;
    form.value = {
      name: role.name,
      slug: role.slug,
      description: role.description,
      permissions: [...role.permissions],
      isActive: role.isActive,
    };
    modalOpen.value = true;
  }

  function slugify(value) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function syncSlugFromName() {
    if (!editingRole.value) {
      form.value.slug = slugify(form.value.name);
    }
  }

  function togglePermission(key) {
    const list = form.value.permissions;
    const index = list.indexOf(key);
    if (index === -1) {
      form.value.permissions = [...list, key];
    } else {
      form.value.permissions = list.filter((p) => p !== key);
    }
  }

  async function save() {
    saving.value = true;
    error.value = "";
    const payload = {
      name: form.value.name.trim(),
      slug: form.value.slug.trim(),
      description: form.value.description.trim() || null,
      permissions: form.value.permissions,
      is_active: form.value.isActive,
    };

    try {
      if (editingRole.value?.id) {
        const updated = await rolesApiService.update(editingRole.value.id, payload);
        const normalized = normalizeRole(updated);
        const idx = roles.value.findIndex((r) => r.id === normalized.id);
        if (idx !== -1) roles.value[idx] = normalized;
      } else {
        const created = await rolesApiService.create(payload);
        roles.value = [normalizeRole(created), ...roles.value];
      }
      modalOpen.value = false;
    } catch (e) {
      error.value = parseApiError(e) || "Impossible d'enregistrer le rôle.";
      throw e;
    } finally {
      saving.value = false;
    }
  }

  async function toggleActive(role) {
    saving.value = true;
    error.value = "";
    try {
      const updated = await rolesApiService.toggleStatus(role.id, !role.isActive);
      const normalized = normalizeRole(updated);
      const idx = roles.value.findIndex((r) => r.id === role.id);
      if (idx !== -1) roles.value[idx] = normalized;
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de modifier le statut.";
    } finally {
      saving.value = false;
    }
  }

  function requestDelete(role) {
    deleteTarget.value = role;
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value || deleting.value) return;
    deleting.value = true;
    error.value = "";
    try {
      await rolesApiService.remove(deleteTarget.value.id);
      roles.value = roles.value.filter((r) => r.id !== deleteTarget.value.id);
      deleteOpen.value = false;
      deleteTarget.value = null;
    } catch (e) {
      error.value = parseApiError(e) || "Impossible de supprimer le rôle.";
    } finally {
      deleting.value = false;
    }
  }

  function cancelDelete() {
    if (deleting.value) return;
    deleteOpen.value = false;
    deleteTarget.value = null;
  }

  return {
    roles,
    permissions,
    permissionGroups,
    loading,
    saving,
    deleting,
    error,
    searchQuery,
    pageSize,
    currentPage,
    filteredRoles,
    paginatedRoles,
    pageCount,
    rangeLabel,
    stats,
    modalOpen,
    editingRole,
    form,
    deleteOpen,
    deleteTarget,
    load,
    openCreate,
    openEdit,
    syncSlugFromName,
    togglePermission,
    save,
    toggleActive,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
