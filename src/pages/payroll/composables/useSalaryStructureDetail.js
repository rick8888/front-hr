import { ref, computed } from "vue";
import { avatarColor } from "../utils/payroll-http.js";

/**
 * Modale « Employee Compensation Details » (liste structures salariales).
 */
export function useSalaryStructureDetail(options = {}) {
  const open = ref(false);
  const employee = ref(null);

  const isOpen = computed(() => open.value && !!employee.value);

  const profile = computed(() => {
    const e = employee.value;
    if (!e) return null;
    return {
      id: e.id,
      name: e.name || "—",
      email: e.email || "—",
      empCode: e.empCode || `EMP-${e.id}`,
      initials: e.initials || "?",
      avatarUrl: e.avatarUrl || null,
      avatarBg: avatarColor(e.name),
      baseSalary: e.baseSalary,
      currency: e.currency || "EUR",
    };
  });

  const lines = computed(() => {
    const e = employee.value;
    if (!e) return [];
    const raw = Array.isArray(e.structureLines) ? e.structureLines : [];
    return [...raw].sort((a, b) => {
      if (a.base && !b.base) return -1;
      if (!a.base && b.base) return 1;
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });
  });

  const kpis = computed(() => {
    const list = lines.value;
    const total = list.length;
    const active = list.filter((l) => l.active !== false).length;
    const baseConfigured =
      employee.value?.baseSalary != null && Number(employee.value.baseSalary) > 0
        ? true
        : list.some((l) => l.base || l.componentCode === "BASE_SALARY");
    return {
      totalComponents: total,
      activeComponents: active,
      baseConfigured,
    };
  });

  function openDetail(row) {
    if (!row) return;
    employee.value = row;
    open.value = true;
  }

  function closeDetail() {
    open.value = false;
    employee.value = null;
  }

  function addComponent() {
    const id = employee.value?.id;
    closeDetail();
    options.onAddComponent?.(id);
  }

  function formatMoney(amount, currency = "EUR") {
    if (amount == null || Number.isNaN(Number(amount))) return "—";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "EUR",
        minimumFractionDigits: 2,
      }).format(Number(amount));
    } catch {
      return `${Number(amount).toFixed(2)}`;
    }
  }

  function formatLineValue(line, currency = "EUR") {
    if (!line) return "—";
    if (line.sourceType === "tax" && line.value == null) {
      return "Tax engine";
    }
    if (line.valueKind === "percent") {
      const n = Number(line.value);
      return Number.isFinite(n) ? `${n.toFixed(2)}%` : "—";
    }
    if (line.value != null) return formatMoney(line.value, currency);
    if (line.base && employee.value?.baseSalary != null) {
      return formatMoney(employee.value.baseSalary, currency);
    }
    return "—";
  }

  function formatEffectivePeriod(line) {
    const from = line?.effectiveFrom || employee.value?.structure?.effective_from;
    if (!from) return "—";
    const fromLabel = formatDateLabel(from);
    const to = line?.effectiveTo || employee.value?.structure?.effective_to;
    if (!to) return `${fromLabel} - Ongoing`;
    return `${fromLabel} - ${formatDateLabel(to)}`;
  }

  function formatDateLabel(iso) {
    if (!iso) return "—";
    const d = new Date(String(iso).length <= 10 ? `${iso}T00:00:00` : iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function typeLabel(line) {
    if (line?.base || line?.componentCode === "BASE_SALARY") return "EARNING";
    const t = String(line?.type || "").toLowerCase();
    if (t === "deduction" || t === "deduct") return "DEDUCTION";
    return "EARNING";
  }

  return {
    open,
    employee,
    isOpen,
    profile,
    lines,
    kpis,
    openDetail,
    closeDetail,
    addComponent,
    formatMoney,
    formatLineValue,
    formatEffectivePeriod,
    typeLabel,
  };
}
