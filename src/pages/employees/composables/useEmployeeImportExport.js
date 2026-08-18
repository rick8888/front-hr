import { ref } from "vue";
import { employeesApiService } from "../services/employees.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { t } from "../../../i18n/index.js";

/**
 * Import / export CSV des employés (API).
 * @param {{ onImported?: () => void | Promise<void>, getSelectedIds?: () => number[] }} [options]
 */
export function useEmployeeImportExport(options = {}) {
  const exporting = ref(false);
  const importing = ref(false);
  const ioError = ref("");
  const ioSuccess = ref("");

  function clearIoMessages() {
    ioError.value = "";
    ioSuccess.value = "";
  }

  /**
   * @param {number[]} [ids]
   */
  async function exportEmployees(ids = []) {
    if (exporting.value) return;
    exporting.value = true;
    clearIoMessages();
    try {
      await employeesApiService.exportCsv(ids);
      ioSuccess.value = ids.length
        ? t("admin.employees.exportSuccessN", { n: ids.length })
        : t("admin.employees.exportSuccess");
    } catch (e) {
      ioError.value = parseApiError(e) || t("admin.employees.exportError");
    } finally {
      exporting.value = false;
    }
  }

  async function bulkExport() {
    const ids = options.getSelectedIds?.() ?? [];
    if (!ids.length) {
      ioError.value = t("admin.employees.exportSelect");
      return;
    }
    await exportEmployees(ids);
  }

  /**
   * Ouvre le sélecteur de fichier puis importe le CSV.
   */
  function importEmployees() {
    if (importing.value) return;
    clearIoMessages();

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,text/csv";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      await importFile(file);
    };
    input.click();
  }

  /**
   * @param {File} file
   */
  async function importFile(file) {
    if (importing.value) return;
    importing.value = true;
    clearIoMessages();
    try {
      const result = await employeesApiService.importCsv(file);
      const imported = result?.imported ?? 0;
      const failed = result?.failed ?? 0;
      const errors = Array.isArray(result?.errors) ? result.errors : [];

      if (imported > 0) {
        ioSuccess.value =
          failed > 0
            ? t("admin.employees.importPartial", { imported, failed })
            : t("admin.employees.importSuccess", { n: imported });
        await options.onImported?.();
      } else {
        const first = errors[0]?.message;
        ioError.value =
          first ||
          (failed > 0
            ? t("admin.employees.importNoneFailed", { n: failed })
            : t("admin.employees.importNone"));
      }
    } catch (e) {
      ioError.value = parseApiError(e) || t("admin.employees.importError");
    } finally {
      importing.value = false;
    }
  }

  return {
    exporting,
    importing,
    ioError,
    ioSuccess,
    clearIoMessages,
    exportEmployees,
    bulkExport,
    importEmployees,
    importFile,
  };
}
