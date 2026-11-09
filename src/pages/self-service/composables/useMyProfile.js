import { computed, onMounted, ref } from "vue";
import {
  format,
  parseISO,
  isValid,
  differenceInYears,
  differenceInMonths,
  formatDistanceToNow,
} from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { myProfileApiService } from "../services/myProfile.api.service.js";
import { parseApiError } from "../../../utils/apiErrors.js";
import { useI18n } from "../../../i18n/index.js";

function dateFnsLocale(code) {
  return code === "en" ? enUS : fr;
}

function formatDisplayDate(iso, locale) {
  if (!iso) return "—";
  try {
    const d = parseISO(String(iso).slice(0, 10));
    return isValid(d) ? format(d, "MMM dd, yyyy", { locale }) : iso;
  } catch {
    return iso;
  }
}

function initialsFromName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function capitalize(value) {
  const s = String(value || "").trim();
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function statusLabel(status, t) {
  const key = String(status || "").toLowerCase();
  const translated = t(`ss.profile.status.${key}`);
  if (translated !== `ss.profile.status.${key}`) return translated;
  return capitalize(status) || "—";
}

function roleLabel(role, t) {
  const key = String(role || "").toLowerCase();
  const translated = t(`ss.profile.role.${key}`);
  if (translated !== `ss.profile.role.${key}`) return translated;
  return capitalize(role) || "—";
}

function durationLabel(years, months, t) {
  if (years >= 1) {
    return years === 1
      ? t("ss.profile.duration.year")
      : t("ss.profile.duration.years", { n: years });
  }
  const m = Math.max(years === 0 && months === 0 ? 1 : months, 0);
  return m === 1
    ? t("ss.profile.duration.month")
    : t("ss.profile.duration.months", { n: m });
}

function memberSinceLabel(iso, t, locale) {
  if (!iso) return "—";
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return "—";
    const years = differenceInYears(new Date(), d);
    const months = Math.max(1, differenceInMonths(new Date(), d));
    return durationLabel(years, months, t);
  } catch {
    return "—";
  }
}

function experienceLabel(hiredAt, t) {
  if (!hiredAt) return "—";
  try {
    const d = parseISO(String(hiredAt).slice(0, 10));
    if (!isValid(d)) return "—";
    const years = differenceInYears(new Date(), d);
    const months = Math.max(0, differenceInMonths(new Date(), d));
    return durationLabel(years, months, t);
  } catch {
    return "—";
  }
}

function relativeLabel(iso, locale) {
  if (!iso) return "—";
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return "—";
    return formatDistanceToNow(d, { addSuffix: true, locale });
  } catch {
    return "—";
  }
}

function mapActivities(raw, locale) {
  const list = Array.isArray(raw?.activities) ? raw.activities : [];
  return list.map((row, index) => ({
    id: row.id ?? `activity-${index + 1}`,
    type: row.type || "Updated",
    url: row.url || "—",
    ip: row.ip || "—",
    relative: relativeLabel(row.occurred_at, locale),
  }));
}

function mapProfile(raw, t, locale) {
  const name = raw?.name || "—";
  const email = raw?.email || "—";
  const language = (raw?.language || "FR").toUpperCase();
  const joined = raw?.hired_at || raw?.created_at;
  const status = statusLabel(raw?.status, t);
  const role = roleLabel(raw?.role, t);
  const activities = mapActivities(raw, locale);
  const activitiesTotal = Number(raw?.activities_total ?? activities.length) || 0;

  return {
    identity: {
      initials: initialsFromName(name),
      avatarUrl: raw?.avatar_url ?? raw?.employee?.avatar_url ?? null,
      name,
      email,
      joinedLabel: formatDisplayDate(joined, locale),
      statusLabel: status,
      connectionLabel: t("ss.profile.hero.connected"),
      avatarBg: "bg-secondary-200 text-secondary-700",
    },
    personal: {
      fullName: name,
      dateOfBirth: formatDisplayDate(raw?.date_of_birth, locale),
      gender: capitalize(raw?.gender),
      language,
    },
    contact: {
      email,
      phone: raw?.phone || "—",
    },
    system: {
      role,
      status,
      employeeCode: raw?.matricule || "—",
    },
    work: {
      joiningDate: formatDisplayDate(raw?.hired_at, locale),
      experience: experienceLabel(raw?.hired_at, t),
      jobTitle: raw?.job_title || "—",
      department: raw?.department || "—",
      companyName: raw?.company_name || "—",
    },
    account: {
      username: email,
      role,
      joiningDate: formatDisplayDate(raw?.hired_at || raw?.created_at, locale),
      languagePreference: language,
    },
    kpis: [
      {
        id: "member-since",
        icon: "clock",
        value: memberSinceLabel(raw?.created_at, t, locale),
        label: t("ss.profile.kpi.memberSince"),
        tone: "secondary",
      },
      {
        id: "email-status",
        icon: "verified",
        value: email && email !== "—" ? t("ss.profile.kpi.verified") : "—",
        label: t("ss.profile.kpi.emailStatus"),
        tone: "success",
      },
      {
        id: "joined-on",
        icon: "calendar",
        value: formatDisplayDate(joined, locale),
        label: t("ss.profile.kpi.joinedOn"),
        tone: "info",
      },
      {
        id: "activities",
        icon: "activity",
        value: String(activitiesTotal),
        label: t("ss.profile.kpi.activities"),
        tone: "warning",
      },
    ],
    activities: activities.map((row) => ({
      ...row,
      type:
        row.type === "Updated"
          ? t("ss.profile.activityType.updated")
          : row.type,
    })),
    activitiesTotal,
  };
}

export function useMyProfile() {
  const { t, locale } = useI18n();
  const rawProfile = ref(null);
  const loading = ref(true);
  const savingPassword = ref(false);
  const error = ref("");
  const passwordError = ref("");
  const passwordSuccess = ref("");

  const profile = computed(() => {
    void locale.value;
    const dfLocale = dateFnsLocale(locale.value);
    return mapProfile(rawProfile.value || {}, t, dfLocale);
  });

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      rawProfile.value = await myProfileApiService.fetch();
    } catch (e) {
      error.value = parseApiError(e) || t("ss.profile.loadError");
      rawProfile.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function updatePassword({ currentPassword, newPassword, confirmPassword }) {
    passwordError.value = "";
    passwordSuccess.value = "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      passwordError.value = t("ss.profile.security.fillAll");
      return false;
    }
    if (newPassword !== confirmPassword) {
      passwordError.value = t("ss.profile.security.mismatch");
      return false;
    }
    if (newPassword.length < 8) {
      passwordError.value = t("ss.profile.security.minLength");
      return false;
    }

    savingPassword.value = true;
    try {
      await myProfileApiService.updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      passwordSuccess.value = t("ss.profile.security.success");
      return true;
    } catch (e) {
      passwordError.value = parseApiError(e) || t("ss.profile.security.updateError");
      return false;
    } finally {
      savingPassword.value = false;
    }
  }

  onMounted(load);

  return {
    profile,
    loading,
    savingPassword,
    error,
    passwordError,
    passwordSuccess,
    load,
    updatePassword,
  };
}
