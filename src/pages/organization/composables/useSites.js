import { ref, computed, watch } from "vue";
import { sitesApiService } from "../services/sites.api.service.js";
import { countriesApiService } from "../services/countries.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

function normalizeSite(raw) {
  return {
    id: raw.id,
    name: raw.name,
    code: raw.code,
    countryId: raw.country_id ?? raw.countryId ?? null,
    country: raw.country ?? "",
    city: raw.city ?? "",
    address: raw.address ?? "",
    description: raw.description ?? "",
    active: !!raw.active,
  };
}

function emptyForm() {
  return {
    name: "",
    code: "",
    city: "",
    countryId: null,
    address: "",
    description: "",
    active: true,
  };
}

export function useSites() {
  const { t } = useI18n();
  const sites = ref([]);
  const countries = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref("");

  const searchQuery = ref("");
  const pageSize = ref(25);
  const currentPage = ref(1);
  const openMenuId = ref(null);

  const modalOpen = ref(false);
  const editingId = ref(null);
  const form = ref(emptyForm());

  const deleteOpen = ref(false);
  const deleteTarget = ref(null);
  const deleteMessage = ref("");

  const filteredSites = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return sites.value;
    return sites.value.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.code || "").toLowerCase().includes(q) ||
        (s.city || "").toLowerCase().includes(q) ||
        (s.country || "").toLowerCase().includes(q) ||
        (s.address || "").toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q)
    );
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredSites.value.length / pageSize.value))
  );

  const startIndex = computed(() =>
    filteredSites.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value
  );

  const endIndex = computed(() =>
    Math.min(currentPage.value * pageSize.value, filteredSites.value.length)
  );

  const paginatedSites = computed(() =>
    filteredSites.value.slice(startIndex.value, endIndex.value)
  );

  watch([searchQuery, pageSize], () => {
    currentPage.value = 1;
  });

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) currentPage.value = pages;
  });

  function nextCode() {
    const nums = sites.value
      .map((s) => Number((s.code || "").replace(/\D/g, "")))
      .filter((n) => !Number.isNaN(n) && n < 10000);
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `SITE-${String(next).padStart(3, "0")}`;
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      const [siteList, countryList] = await Promise.all([
        sitesApiService.fetchAll(),
        countriesApiService.fetchAll(),
      ]);
      countries.value = countryList;
      sites.value = siteList.map(normalizeSite);
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.sites.loadError");
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

  function openAddSite() {
    editingId.value = null;
    form.value = { ...emptyForm(), code: nextCode() };
    modalOpen.value = true;
  }

  function editSite(site) {
    editingId.value = site.id;
    form.value = {
      name: site.name,
      code: site.code,
      city: site.city || "",
      countryId: site.countryId ?? null,
      address: site.address || "",
      description: site.description || "",
      active: !!site.active,
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
      country_id: form.value.countryId || null,
      city: form.value.city.trim() || null,
      address: form.value.address.trim() || null,
      description: form.value.description.trim() || null,
      active: !!form.value.active,
    };

    try {
      if (editingId.value) {
        const updated = normalizeSite(
          await sitesApiService.update(editingId.value, payload)
        );
        const idx = sites.value.findIndex((s) => s.id === editingId.value);
        if (idx !== -1) sites.value[idx] = updated;
      } else {
        const created = normalizeSite(await sitesApiService.create(payload));
        sites.value = [created, ...sites.value];
      }
      closeModal();
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.sites.saveError");
    } finally {
      saving.value = false;
    }
  }

  async function toggleActive(site) {
    openMenuId.value = null;
    error.value = "";
    try {
      const updated = normalizeSite(await sitesApiService.toggleStatus(site.id));
      const idx = sites.value.findIndex((s) => s.id === site.id);
      if (idx !== -1) sites.value[idx] = updated;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.statusError");
    }
  }

  function requestDelete(site) {
    openMenuId.value = null;
    deleteTarget.value = site;
    deleteMessage.value = t("admin.org.sites.deleteMessage", { name: site.name });
    deleteOpen.value = true;
  }

  async function confirmDelete() {
    if (!deleteTarget.value || deleting.value) return;

    deleting.value = true;
    error.value = "";
    const id = deleteTarget.value.id;

    try {
      await sitesApiService.remove(id);
      sites.value = sites.value.filter((s) => s.id !== id);
      deleteOpen.value = false;
      deleteTarget.value = null;
    } catch (e) {
      error.value = parseApiError(e) || t("admin.org.sites.deleteError");
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
    sites,
    countries,
    loading,
    saving,
    deleting,
    error,
    searchQuery,
    pageSize,
    currentPage,
    openMenuId,
    modalOpen,
    editingId,
    form,
    deleteOpen,
    deleteMessage,
    filteredSites,
    totalPages,
    startIndex,
    endIndex,
    paginatedSites,
    loadData,
    toggleMenu,
    closeMenus,
    openAddSite,
    editSite,
    closeModal,
    submitForm,
    toggleActive,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
