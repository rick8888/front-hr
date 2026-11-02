import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { leaveRequestsApiService } from "../../leave/services/leaveRequests.api.service.js";
import { leaveTypesApiService } from "../../leave/services/leaveTypes.api.service.js";
import { myLeaveBalanceApiService } from "../services/myLeaveBalance.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";

import { getPolicyAvailable } from "../../../data/leavePoliciesDemo.js";

export { getPolicyAvailable };

function mapPolicies(leaveTypes, balancesByCode = {}) {
  return (leaveTypes || [])
    .filter((t) => t.active !== false && t.is_active !== false)
    .map((t) => {
      const code = String(t.code || "").toUpperCase();
      const bal = balancesByCode[code] || balancesByCode[t.code] || {};
      return {
        id: String(t.id),
        code,
        name: t.name || code,
        description: t.description || "",
        annualEntitlement: Number(bal.entitled ?? bal.entitlement ?? 0),
        additional:
          Number(bal.additional ?? 0) + Number(bal.carried_forward ?? 0),
        used: Number(bal.used ?? 0),
        available: Number(
          bal.available ??
            Number(bal.entitled ?? bal.entitlement ?? 0) +
              Number(bal.carried_forward ?? 0) +
              Number(bal.additional ?? 0) -
              Number(bal.used ?? 0) -
              Number(bal.pending ?? 0)
        ),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function buildBalancesMap(payload) {
  const map = {};
  // Self-service /leave-balance
  if (Array.isArray(payload?.by_type)) {
    for (const row of payload.by_type) {
      const code = String(row.code || "").toUpperCase();
      if (!code) continue;
      map[code] = {
        entitled: row.entitlement,
        entitlement: row.entitlement,
        used: row.used,
        pending: row.pending,
        available: row.available,
      };
    }
    return map;
  }
  const employee = Array.isArray(payload?.employees) ? payload.employees[0] : null;
  const balances = employee?.balances || {};
  for (const [code, bal] of Object.entries(balances)) {
    map[String(code).toUpperCase()] = bal;
  }
  if (Array.isArray(payload?.balances)) {
    for (const row of payload.balances) {
      const code = String(row.code || "").toUpperCase();
      if (!code) continue;
      map[code] = row;
    }
  }
  return map;
}

function buildReason(payload) {
  let reason = (payload.reason || "").trim();
  const contactBits = [payload.contactName, payload.contactPhone]
    .map((s) => (s || "").trim())
    .filter(Boolean);
  if (contactBits.length) {
    reason = `${reason}\n\nEmergency contact: ${contactBits.join(" — ")}`;
  }
  return reason;
}

function toCreatePayload(formPayload, selectedPolicy) {
  const halfDay = Boolean(formPayload.halfDay);
  const from = formPayload.fromDate;
  const to = halfDay ? formPayload.fromDate : formPayload.toDate;
  const days = halfDay ? 0.5 : Number(formPayload.totalDays);

  return {
    leave_type: String(selectedPolicy?.code || "").toUpperCase(),
    duration_kind: halfDay ? "half" : "full",
    start_date: from,
    end_date: to,
    total_days: days,
    reason: buildReason(formPayload),
    emergency_contact: Boolean(
      (formPayload.contactName || "").trim() || (formPayload.contactPhone || "").trim()
    ),
    traveling_abroad: Boolean(formPayload.travelingAbroad),
    document: formPayload.fileName || null,
  };
}

export function useApplyForLeave() {
  const route = useRoute();
  const router = useRouter();

  const policies = ref([]);
  const loading = ref(true);
  const saving = ref(false);
  const error = ref("");
  const editingId = ref(null);
  const mode = computed(() => {
    const m = String(route.query.mode || "create").toLowerCase();
    if (m === "view" || m === "edit") return m;
    return editingId.value ? "edit" : "create";
  });
  const readOnly = computed(() => mode.value === "view");

  const initialForm = ref(null);

  const listPath = "/self-service/leave-requests";

  async function loadPolicies() {
    const year = new Date().getFullYear();
    let types = [];
    let balancesByCode = {};

    try {
      types = await leaveTypesApiService.fetchAll();
    } catch (e) {
      throw e;
    }

    try {
      const balancePayload = await myLeaveBalanceApiService.fetchMine(year);
      balancesByCode = buildBalancesMap(balancePayload);
    } catch {
      balancesByCode = {};
    }

    policies.value = mapPolicies(types, balancesByCode);
  }

  async function loadExistingIfNeeded() {
    const id = route.query.id ? Number(route.query.id) : null;
    if (!id) {
      editingId.value = null;
      initialForm.value = null;
      return;
    }

    const raw = await leaveRequestsApiService.fetchOne(id);
    editingId.value = raw.id;

    const typeCode = String(raw.leave_type || "").toUpperCase();
    const policy =
      policies.value.find((p) => p.code === typeCode) ||
      policies.value.find((p) => String(p.id) === String(raw.leave_type_id));

    initialForm.value = {
      leaveTypeId: policy?.id || "",
      fromDate: raw.start_date || "",
      toDate: raw.end_date || "",
      halfDay: (raw.duration_kind || "") === "half",
      reason: raw.reason || "",
      contactName: "",
      contactPhone: "",
      travelingAbroad: Boolean(raw.traveling_abroad),
      fileName: raw.document || "",
    };
  }

  async function loadData() {
    loading.value = true;
    error.value = "";
    try {
      await loadPolicies();
      await loadExistingIfNeeded();
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible de charger le formulaire de congé.";
      policies.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function submit(formPayload) {
    if (saving.value || readOnly.value) return false;
    saving.value = true;
    error.value = "";

    const selectedPolicy = policies.value.find(
      (p) => p.id === formPayload.leaveTypeId
    );
    if (!selectedPolicy) {
      error.value = "Veuillez sélectionner un type de congé valide.";
      saving.value = false;
      return false;
    }

    try {
      const payload = toCreatePayload(formPayload, selectedPolicy);
      if (editingId.value && mode.value === "edit") {
        await leaveRequestsApiService.update(editingId.value, payload);
      } else {
        await leaveRequestsApiService.create(payload);
      }
      await router.push(listPath);
      return true;
    } catch (e) {
      error.value =
        parseApiError(e) || "Impossible d'enregistrer la demande de congé.";
      return false;
    } finally {
      saving.value = false;
    }
  }

  function cancel() {
    router.push(listPath);
  }

  watch(
    () => [route.query.id, route.query.mode],
    () => {
      loadData();
    }
  );

  onMounted(loadData);

  return {
    policies,
    loading,
    saving,
    error,
    mode,
    readOnly,
    initialForm,
    submit,
    cancel,
    getPolicyAvailable,
  };
}
