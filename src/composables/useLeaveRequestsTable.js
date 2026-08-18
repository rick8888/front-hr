import { computed, ref, watch } from "vue";

function normalize(s) {
  return (s || "").toString().toLowerCase().trim();
}

function dateInRange(isoDay, from, to) {
  if (!isoDay) return true;
  return isoDay >= from && isoDay <= to;
}

/**
 * Client-side filters + search + pagination for leave request rows.
 * Row shape: { id, employee, employeeCode, leaveType, from, to, status, document, ... }
 */
export function useLeaveRequestsTable(requestsRef) {
  const filters = ref({
    employeeCode: "",
    date: "",
    leaveType: "",
    status: "",
  });

  const searchQuery = ref("");
  const page = ref(1);
  const pageSize = ref(10);

  const filtered = computed(() => {
    let list = requestsRef.value;
    const f = filters.value;
    const q = normalize(searchQuery.value);

    if (f.employeeCode) {
      list = list.filter((r) => r.employeeCode === f.employeeCode);
    }
    if (f.leaveType) {
      list = list.filter((r) => r.leaveType === f.leaveType);
    }
    if (f.status) {
      list = list.filter((r) => r.status === f.status);
    }
    if (f.date) {
      list = list.filter((r) => dateInRange(f.date, r.from, r.to));
    }
    if (q) {
      list = list.filter(
        (r) =>
          normalize(r.employee).includes(q) ||
          normalize(r.employeeCode).includes(q) ||
          normalize(r.leaveType).includes(q) ||
          normalize(r.status).includes(q),
      );
    }
    return list;
  });

  const totalFiltered = computed(() => filtered.value.length);

  const pageCount = computed(() =>
    Math.max(1, Math.ceil(totalFiltered.value / pageSize.value)),
  );

  const paginatedRows = computed(() => {
    const p = Math.min(page.value, pageCount.value);
    const start = (p - 1) * pageSize.value;
    return filtered.value.slice(start, start + pageSize.value);
  });

  const rangeLabel = computed(() => {
    if (totalFiltered.value === 0) return { from: 0, to: 0 };
    const from = (page.value - 1) * pageSize.value + 1;
    const to = Math.min(page.value * pageSize.value, totalFiltered.value);
    return { from, to };
  });

  watch(
    () => ({ ...filters.value, q: searchQuery.value, ps: pageSize.value }),
    () => {
      page.value = 1;
    },
    { deep: true },
  );

  watch(totalFiltered, (n) => {
    const maxPage = Math.max(1, Math.ceil(n / pageSize.value));
    if (page.value > maxPage) page.value = maxPage;
  });

  return {
    filters,
    searchQuery,
    page,
    pageSize,
    filtered,
    totalFiltered,
    pageCount,
    paginatedRows,
    rangeLabel,
  };
}

/** e.g. [1, 2, 3, 4, 5, 'ellipsis', 10] when current is near start */
export function getVisiblePages(current, total) {
  if (total <= 0) return [];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const c = Math.min(Math.max(1, current), total);
  const set = new Set([1, total, c, c - 1, c + 1].filter((p) => p >= 1 && p <= total));
  for (let p = 2; p <= Math.min(5, total); p++) set.add(p);

  const sorted = [...set].sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("ellipsis");
    out.push(p);
    prev = p;
  }
  return out;
}
