function applyCellLabels(table) {
  const headers = Array.from(
    table.querySelectorAll("thead tr:last-child th"),
    (header) => header.textContent.trim().replace(/\s+/g, " "),
  );
  const wrapper = table.parentElement;

  if (!wrapper) return;

  if (!headers.length) {
    wrapper.classList.remove("mobile-table-cards");
    table.querySelectorAll("tbody td[data-mobile-label]").forEach((cell) => {
      delete cell.dataset.mobileLabel;
    });
    return;
  }

  wrapper.classList.add("mobile-table-cards");
  table.querySelectorAll("tbody tr").forEach((row) => {
    Array.from(row.cells).forEach((cell) => {
      const label = headers[cell.cellIndex];

      if (cell.colSpan > 1 || !label) {
        delete cell.dataset.mobileLabel;
      } else {
        cell.dataset.mobileLabel = label;
      }
    });
  });
}

export const responsiveTableCards = {
  mounted: applyCellLabels,
  updated: applyCellLabels,
  unmounted(table) {
    table.parentElement?.classList.remove("mobile-table-cards");
  },
};
