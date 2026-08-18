import { ref } from "vue";
import { employeesApiService } from "../services/employees.api.service.js";
import { normalizeEmployeeDetail } from "./useEmployees.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { t } from "../../../i18n/index.js";

/**
 * Sauvegarde pour la modal Edit Basic Information.
 */
export function useEditBasicInfo() {
  const saving = ref(false);
  const saveError = ref("");

  function buildUpdatePayload(form) {
    const emergency = form.emergency || {};

    return {
      first_name: form.firstName?.trim() || null,
      last_name: form.lastName?.trim() || null,
      email: form.email?.trim() || null,
      phone: form.phone?.trim() || null,
      date_of_birth: form.dateOfBirth || null,
      metadata: {
        gender: form.gender || null,
        blood_group: form.bloodGroup || null,
        alternative_phone: form.alternativePhone?.trim() || null,
        address: form.address?.trim() || null,
        emergency_contact_name: emergency.name?.trim() || null,
        emergency_relationship: emergency.relationship || null,
        emergency_contact_phone: emergency.phone?.trim() || null,
        emergency_contact_address: emergency.address?.trim() || null,
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
        parseApiError(e) || t("admin.employees.view.saveBasicError");
      throw e;
    } finally {
      saving.value = false;
    }
  }

  return {
    saving,
    saveError,
    save,
  };
}
