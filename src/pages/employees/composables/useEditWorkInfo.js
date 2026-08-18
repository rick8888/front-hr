import { ref } from "vue";
import { employeesApiService } from "../services/employees.api.service.js";
import { useNewEmployeeResources } from "./useNewEmployeeResources.js";
import { normalizeEmployeeDetail } from "./useEmployees.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { t } from "../../../i18n/index.js";

/**
 * Catalogue + sauvegarde pour la modal Edit Work Information.
 * Réutilise les mêmes ressources que New Employee.
 */
export function useEditWorkInfo() {
  const resources = useNewEmployeeResources();
  const saving = ref(false);
  const saveError = ref("");
  const loaded = ref(false);

  async function ensureResources() {
    if (loaded.value || resources.loading.value) return;
    await resources.loadResources();
    loaded.value = !resources.error.value;
  }

  function buildUpdatePayload(form) {
    const selectedShift = resources.shifts.value.find(
      (s) => String(s.id) === String(form.shiftId)
    );
    const selectedManager = resources.managers.value.find(
      (m) => m.name === form.reportingManager
    );
    const selectedRole = resources.roleOptions.value.find(
      (r) => r.slug === form.role || r.name === form.role
    );

    return {
      job_title: form.designation || null,
      department: form.department || null,
      hired_at: form.joinDate || null,
      metadata: {
        designation: form.designation || null,
        role: selectedRole?.slug || form.role || null,
        department: form.department || null,
        team: form.team || null,
        reporting_manager: form.reportingManager || null,
        reporting_manager_id: selectedManager?.id ?? null,
        shift: selectedShift?.name || selectedShift?.label || null,
        shift_id: selectedShift?.id ?? null,
        attendance_type: form.attendanceType || null,
        qr_group: form.qrGroup || null,
      },
    };
  }

  async function save(employeeId, form) {
    saving.value = true;
    saveError.value = "";
    try {
      const raw = await employeesApiService.update(
        employeeId,
        buildUpdatePayload(form)
      );
      return normalizeEmployeeDetail(raw);
    } catch (e) {
      saveError.value =
        parseApiError(e) || t("admin.employees.view.saveWorkError");
      throw e;
    } finally {
      saving.value = false;
    }
  }

  return {
    ...resources,
    saving,
    saveError,
    ensureResources,
    save,
  };
}
