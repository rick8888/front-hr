/** Référence pour les libellés relatifs « Updated: … » */
export const MY_NOTES_REFERENCE_TODAY = "2026-05-10";

export const MY_NOTES_TAG_ALL = "all";

export const MY_NOTES_TAG_OPTIONS = [
  { value: MY_NOTES_TAG_ALL, labelKey: "ss.notes.tags.all" },
  { value: "work", labelKey: "ss.notes.tags.work" },
  { value: "personal", labelKey: "ss.notes.tags.personal" },
  { value: "ideas", labelKey: "ss.notes.tags.ideas" },
];

export const MY_NOTES_VIEW_OPTIONS = [
  { value: "active", labelKey: "ss.notes.view.active" },
  { value: "archived", labelKey: "ss.notes.view.archived" },
  { value: "all", labelKey: "ss.notes.view.all" },
];

export const myNotesSeed = [
  {
    id: 1,
    title: "asdsdsd",
    body: "sadssdson",
    checklist: [
      { id: "c1", label: "Follow up with HR", checked: false },
      { id: "c2", label: "Book meeting room", checked: false },
      { id: "c3", label: "Send weekly summary", checked: false },
    ],
    updatedAt: "2026-04-08",
    tags: ["work"],
    pinned: true,
    status: "active",
  },
];

function parseIso(iso) {
  const d = new Date(iso + "T12:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * @param {string} iso
 * @param {string} todayIso
 * @param {(key: string, params?: Record<string, string|number>) => string} t
 */
export function formatUpdatedRelative(iso, todayIso = MY_NOTES_REFERENCE_TODAY, t) {
  const end = parseIso(todayIso);
  const start = parseIso(iso);
  if (!end || !start) return "";
  const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000);
  if (!t) {
    if (diffDays <= 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 14) return `${diffDays} days ago`;
    if (diffDays < 45) return "1 month ago";
    const months = Math.round(diffDays / 30);
    if (months === 1) return "1 month ago";
    if (months < 12) return `${months} months ago`;
    const years = Math.round(months / 12);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  }
  if (diffDays <= 0) return t("ss.notes.relative.today");
  if (diffDays === 1) return t("ss.notes.relative.yesterday");
  if (diffDays < 14) return t("ss.notes.relative.daysAgo", { n: diffDays });
  if (diffDays < 45) return t("ss.notes.relative.oneMonthAgo");
  const months = Math.round(diffDays / 30);
  if (months === 1) return t("ss.notes.relative.oneMonthAgo");
  if (months < 12) return t("ss.notes.relative.monthsAgo", { n: months });
  const years = Math.round(months / 12);
  return years === 1
    ? t("ss.notes.relative.oneYearAgo")
    : t("ss.notes.relative.yearsAgo", { n: years });
}

/** @param {string} tagValue */
export function noteTagLabelKey(tagValue) {
  const found = MY_NOTES_TAG_OPTIONS.find((opt) => opt.value === tagValue);
  return found?.labelKey || tagValue;
}
