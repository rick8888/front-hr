import { ref, computed, watch } from "vue";
import { teamsApiService } from "../services/teams.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

export function useTeams() {
  const { t } = useI18n();
  const teams = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const pageSize = ref(25);
  const currentPage = ref(1);
  const openMenuId = ref(null);

  const modalOpen = ref(false);
  const editingId = ref(null);
  const form = ref({ name: "", code: "", description: "", active: true });

  const filteredTeams = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return teams.value;
    return teams.value.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredTeams.value.length / pageSize.value))
  );

  const startIndex = computed(() =>
    filteredTeams.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value
  );

  const endIndex = computed(() =>
    Math.min(currentPage.value * pageSize.value, filteredTeams.value.length)
  );

  const paginatedTeams = computed(() =>
    filteredTeams.value.slice(startIndex.value, endIndex.value)
  );

  watch([searchQuery, pageSize], () => {
    currentPage.value = 1;
  });

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) currentPage.value = pages;
  });

  function nextCode() {
    const nums = teams.value
      .map((t) => Number((t.code || "").replace(/\D/g, "")))
      .filter((n) => !Number.isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `TM-${String(next).padStart(3, "0")}`;
  }

  async function loadTeams() {
    loading.value = true;
    error.value = "";
    try {
      teams.value = await teamsApiService.fetchAll();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.teams.loadError");
    } finally {
      loading.value = false;
    }
  }

  function toggleMenu(id) {
    openMenuId.value = openMenuId.value === id ? null : id;
  }

  function closeMenus() {
    openMenuId.value = null;
  }

  function openAddTeam() {
    editingId.value = null;
    form.value = { name: "", code: nextCode(), description: "", active: true };
    modalOpen.value = true;
  }

  function editTeam(team) {
    editingId.value = team.id;
    form.value = {
      name: team.name,
      code: team.code,
      description: team.description || "",
      active: !!team.active,
    };
    openMenuId.value = null;
    modalOpen.value = true;
  }

  function closeModal() {
    modalOpen.value = false;
    editingId.value = null;
  }

  async function submitForm() {
    if (!form.value.name.trim() || saving.value) return;

    saving.value = true;
    error.value = "";
    const payload = {
      name: form.value.name.trim(),
      code: form.value.code.trim() || undefined,
      description: form.value.description.trim() || null,
      active: !!form.value.active,
    };

    try {
      if (editingId.value) {
        const updated = await teamsApiService.update(editingId.value, payload);
        const idx = teams.value.findIndex((t) => t.id === editingId.value);
        if (idx !== -1) teams.value[idx] = updated;
      } else {
        const created = await teamsApiService.create(payload);
        teams.value = [created, ...teams.value];
      }
      closeModal();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.teams.saveError");
    } finally {
      saving.value = false;
    }
  }

  async function toggleActive(team) {
    openMenuId.value = null;
    error.value = "";
    try {
      const updated = await teamsApiService.toggleStatus(team.id);
      const idx = teams.value.findIndex((t) => t.id === team.id);
      if (idx !== -1) teams.value[idx] = updated;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.statusError");
    }
  }

  async function removeTeam(id) {
    openMenuId.value = null;
    error.value = "";
    try {
      await teamsApiService.remove(id);
      teams.value = teams.value.filter((t) => t.id !== id);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.teams.deleteError");
    }
  }

  return {
    teams,
    loading,
    saving,
    error,
    searchQuery,
    pageSize,
    currentPage,
    openMenuId,
    modalOpen,
    editingId,
    form,
    filteredTeams,
    totalPages,
    startIndex,
    endIndex,
    paginatedTeams,
    loadTeams,
    toggleMenu,
    closeMenus,
    openAddTeam,
    editTeam,
    closeModal,
    submitForm,
    toggleActive,
    removeTeam,
  };
}
