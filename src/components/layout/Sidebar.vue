<template>
  <aside
    :class="[
      'mobile-full-height flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white',
      'fixed inset-y-0 left-0 z-[60] transform transition-transform duration-200 ease-out',
      'lg:static lg:top-auto lg:z-0 lg:translate-x-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Logo -->
    <div class="flex h-14 items-center justify-between gap-2.5 border-b border-neutral-100 px-5">
      <div class="flex items-center gap-2.5">
        <img
          src="/brand/bravorh-app-icon.png"
          alt=""
          class="h-8 w-8 shrink-0 rounded-lg"
        />
        <span class="truncate text-[15px] font-semibold tracking-tight text-white">{{ t("app.name") }}</span>
      </div>
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden"
        :aria-label="t('header.close')"
        @click="closeSidebar"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-4">
      <!-- Employé -->
      <ul v-if="authStore.isEmployee" class="space-y-0.5">
        <li>
          <RouterLink to="/dashboard-2" :class="linkClass(isActive('/dashboard-2'))">
            <NavIcon name="dashboard" />
            <span>{{ t('nav.dashboard') }}</span>
          </RouterLink>
        </li>
        <li>
          <SelfServiceNavSection
            :open="isSectionOpen('self-service')"
            @toggle="toggleSection('self-service')"
          />
        </li>
        <li v-for="item in employeeNavigationExtras" :key="item.id">
          <RouterLink :to="item.path" :class="linkClass(isActive(item.path))">
            <NavIcon :name="item.icon" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>

      <!-- Tenant -->
      <div v-else-if="authStore.isTenant">
        <TenantSidebarNav />
      </div>

      <!-- Admin -->
      <ul v-else class="space-y-0.5">
        <li>
          <RouterLink to="/chat" :class="linkClass(isActive('/chat'))">
            <NavIcon name="notes" />
            <span>{{ t('nav.chat') }}</span>
          </RouterLink>
        </li>
        <!-- Dashboard -->
        <li v-if="authStore.can('dashboard.view')">
          <RouterLink to="/dashboard" :class="linkClass(isActive('/dashboard'))">
            <NavIcon name="dashboard" />
            <span>{{ t('nav.dashboard') }}</span>
          </RouterLink>
        </li>

        <!-- Employés -->
        <li v-if="authStore.can('employees.view', 'employees.manage')">
          <button
            type="button"
            :class="parentClass(isSectionOpen('employees'))"
            :aria-expanded="isSectionOpen('employees')"
            @click="toggleSection('employees')"
          >
            <NavIcon name="users" />
            <span class="flex-1 text-left">{{ t('nav.employees') }}</span>
            <Chevron :open="isSectionOpen('employees')" />
          </button>
          <ul v-show="isSectionOpen('employees')" class="nav-sub">
            <template v-for="sub in employeeManagementSubItems" :key="sub.id || sub.label || sub.labelKey">
              <li v-if="sub.type === 'group'" class="nav-group">{{ sub.label }}</li>
              <li v-else>
                <RouterLink
                  :to="sub.path"
                  :class="subLinkClass(isEmployeeManagementSubActive(sub.path))"
                >
                  {{ sub.label }}
                </RouterLink>
              </li>
            </template>
          </ul>
        </li>

        <!-- Organisation -->
        <li v-if="authStore.can('organization.manage')">
          <button
            type="button"
            :class="parentClass(isSectionOpen('organization'))"
            :aria-expanded="isSectionOpen('organization')"
            @click="toggleSection('organization')"
          >
            <NavIcon name="building" />
            <span class="flex-1 text-left">{{ t('nav.organization') }}</span>
            <Chevron :open="isSectionOpen('organization')" />
          </button>
          <ul v-show="isSectionOpen('organization')" class="nav-sub">
            <li v-for="sub in organizationSubItems" :key="sub.path">
              <RouterLink
                :to="sub.path"
                :class="subLinkClass(isOrganizationSubActive(sub.path))"
              >
                {{ sub.label }}
              </RouterLink>
            </li>
          </ul>
        </li>

        <!-- Présence -->
        <li v-if="authStore.can('attendance.manage')">
          <button
            type="button"
            :class="parentClass(isSectionOpen('attendance'))"
            :aria-expanded="isSectionOpen('attendance')"
            @click="toggleSection('attendance')"
          >
            <NavIcon name="calendar" />
            <span class="flex-1 text-left">{{ t('nav.attendance') }}</span>
            <Chevron :open="isSectionOpen('attendance')" />
          </button>
          <ul v-show="isSectionOpen('attendance')" class="nav-sub">
            <template v-for="sub in attendanceSubItems" :key="sub.id || sub.label || sub.labelKey">
              <li v-if="sub.type === 'group'" class="nav-group">{{ sub.label }}</li>
              <li v-else>
                <RouterLink :to="sub.path" :class="subLinkClass(isAttendanceSubActive(sub.path))">
                  {{ sub.label }}
                </RouterLink>
              </li>
            </template>
          </ul>
        </li>

        <!-- Congés -->
        <li v-if="authStore.can('leave.manage')">
          <button
            type="button"
            :class="parentClass(isSectionOpen('leave'))"
            :aria-expanded="isSectionOpen('leave')"
            @click="toggleSection('leave')"
          >
            <NavIcon name="leave" />
            <span class="flex-1 text-left">{{ t('nav.leave') }}</span>
            <Chevron :open="isSectionOpen('leave')" />
          </button>
          <ul v-show="isSectionOpen('leave')" class="nav-sub">
            <template v-for="sub in leaveManagementSubItems" :key="sub.id || sub.label || sub.labelKey">
              <li v-if="sub.type === 'group'" class="nav-group">{{ sub.label }}</li>
              <li v-else>
                <RouterLink
                  :to="sub.path"
                  :class="subLinkClass(isLeaveManagementSubActive(sub.path))"
                >
                  {{ sub.label }}
                </RouterLink>
              </li>
            </template>
          </ul>
        </li>

        <!-- Paie -->
        <li v-if="authStore.can('payroll.view', 'payroll.manage')">
          <button
            type="button"
            :class="parentClass(isSectionOpen('payroll'))"
            :aria-expanded="isSectionOpen('payroll')"
            @click="toggleSection('payroll')"
          >
            <NavIcon name="payroll" />
            <span class="flex-1 text-left">{{ t('nav.payroll') }}</span>
            <Chevron :open="isSectionOpen('payroll')" />
          </button>
          <ul v-show="isSectionOpen('payroll')" class="nav-sub">
            <template v-for="sub in payrollSubItems" :key="sub.id || sub.label || sub.labelKey">
              <li v-if="sub.type === 'group'" class="nav-group">{{ sub.label }}</li>
              <li v-else>
                <RouterLink :to="sub.path" :class="subLinkClass(isPayrollSubActive(sub.path))">
                  {{ sub.label }}
                </RouterLink>
              </li>
            </template>
          </ul>
        </li>

        <!-- Self Service -->
        <li v-if="authStore.can('self_service.access')">
          <SelfServiceNavSection
            :open="isSectionOpen('self-service')"
            @toggle="toggleSection('self-service')"
          />
        </li>
        <!-- Liens plats -->
        <template v-if="adminNavSecondary.length">
          <li class="pt-2 mt-2 border-t border-neutral-100">
            <p class="nav-group px-3">{{ t('nav.other') }}</p>
          </li>
          <li v-for="item in adminNavSecondary" :key="item.id">
            <RouterLink :to="item.path" :class="linkClass(isActive(item.path))">
              <NavIcon :name="item.icon" />
              <span>{{ item.label }}</span>
            </RouterLink>
          </li>
        </template>
      </ul>
    </nav>

    <!-- Thème -->
    <div class="border-t border-neutral-100 px-3 py-3">
      <div class="flex rounded-md bg-white/10 p-0.5 text-xs font-medium">
        <button
          type="button"
          class="flex-1 rounded py-1.5 transition-colors"
          :class="theme === 'light' ? 'bg-white/15 text-white shadow-sm' : 'text-neutral-400 hover:text-white'"
          @click="theme = 'light'"
        >
          {{ t('theme.light') }}
        </button>
        <button
          type="button"
          class="flex-1 rounded py-1.5 transition-colors"
          :class="theme === 'dark' ? 'bg-white/15 text-white shadow-sm' : 'text-neutral-400 hover:text-white'"
          @click="theme = 'dark'"
        >
          {{ t('theme.dark') }}
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import { useI18n } from "../../i18n/index.js";
import { useAppShell } from "../../composables/useAppShell.js";
import SelfServiceNavSection from "./SelfServiceNavSection.vue";
import TenantSidebarNav from "./TenantSidebarNav.vue";
import { pathMatchesSelfServiceMenu } from "../../config/selfServiceNav.js";

const route = useRoute();
const authStore = useAuthStore();
const { t, locale } = useI18n();
const { sidebarOpen, closeSidebar } = useAppShell();
const theme = ref("light");

/** Un seul sous-menu ouvert à la fois. */
const openSection = ref(null);

function isSectionOpen(id) {
  return openSection.value === id;
}

function toggleSection(id) {
  openSection.value = openSection.value === id ? null : id;
}

/* ——— Styles partagés ——— */
function linkClass(active) {
  return [
    "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
    active
      ? "bg-primary-50 text-primary-700"
      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
  ];
}

function parentClass(active) {
  return [
    "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors text-left",
    active
      ? "bg-primary-50 text-primary-700"
      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
  ];
}

function subLinkClass(active) {
  return [
    "block px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors",
    active
      ? "bg-primary-50 text-primary-700"
      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800",
  ];
}

/* ——— Icônes SVG unifiées ——— */
const ICONS = {
  dashboard:
    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
  users:
    "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 3a3 3 0 11-6 0 3 3 0 016 0z",
  building:
    "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  calendar:
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  leave:
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  payroll:
    "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  receipt:
    "M9 14h6m-6-4h6m2 10H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v9a2 2 0 01-2 2z M14 4v5h5",
  document:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  training:
    "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  laptop:
    "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  briefcase:
    "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  settings:
    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  notes:
    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
};

const NavIcon = {
  name: "NavIcon",
  props: { name: { type: String, required: true } },
  setup(props) {
    return () =>
      h(
        "svg",
        {
          class: "w-[18px] h-[18px] shrink-0 opacity-80",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          "aria-hidden": "true",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "1.75",
            d: ICONS[props.name] || ICONS.dashboard,
          }),
        ]
      );
  },
};

const Chevron = {
  name: "Chevron",
  props: { open: Boolean },
  setup(props) {
    return () =>
      h(
        "svg",
        {
          class: [
            "w-3.5 h-3.5 shrink-0 text-neutral-400 transition-transform duration-200",
            props.open ? "rotate-180" : "",
          ],
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          "aria-hidden": "true",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M19 9l-7 7-7-7",
          }),
        ]
      );
  },
};

/* ——— Menus (labelKey + t(), réactifs à locale) ——— */
function withLabels(items) {
  return items.map((item) =>
    item.type === "group"
      ? { ...item, label: t(item.labelKey) }
      : { ...item, label: t(item.labelKey) }
  );
}

const organizationSubItems = computed(() => {
  void locale.value;
  return withLabels([
    { labelKey: "nav.org.teams", path: "/organization/team" },
    { labelKey: "nav.org.departments", path: "/organization/departments" },
    { labelKey: "nav.org.designations", path: "/organization/designation" },
    { labelKey: "nav.org.sites", path: "/organization/sites" },
  ]);
});

const employeeManagementSubItems = computed(() => {
  void locale.value;
  const canManage = authStore.can("employees.manage");
  const items = [
    { id: "e-all", labelKey: "nav.employees.all", path: "/employees" },
    canManage
      ? { id: "e-new", labelKey: "nav.employees.add", path: "/employees/new" }
      : null,
    { type: "group", labelKey: "nav.employees.categories", id: "e-cat" },
    { id: "e-onb", labelKey: "nav.employees.onboarding", path: "/employees/categories/onboarding" },
    canManage
      ? { id: "e-offboarding", labelKey: "nav.employees.offboarding", path: "/employees/offboarding" }
      : null,
    {
      id: "e-prob",
      labelKey: "nav.employees.probation",
      path: canManage ? "/employees/probation" : "/employees/categories/on-probation",
    },
    { id: "e-inact", labelKey: "nav.employees.inactive", path: "/employees/categories/inactive" },
    {
      id: "e-term",
      labelKey: "nav.employees.terminated",
      path: "/employees/categories/terminated",
    },
    { type: "group", labelKey: "nav.employees.development", id: "e-development" },
    {
      id: "e-performance",
      labelKey: "nav.employees.performance",
      path: "/performance-reviews",
    },
  ].filter(Boolean);

  return withLabels(items);
});

const attendanceSubItems = computed(() => {
  void locale.value;
  const canOrg = authStore.can("organization.manage");
  const canSettings = authStore.can("settings.manage");
  const canConfigureShifts = canOrg || canSettings;
  const items = [
    { id: "a-all", labelKey: "nav.attendance.records", path: "/attendance" },
    canConfigureShifts
      ? { id: "a-shift", labelKey: "nav.attendance.shifts", path: "/attendance/shifts" }
      : null,
    canSettings
      ? { id: "a-type", labelKey: "nav.attendance.types", path: "/attendance/types" }
      : null,
    canOrg
      ? { id: "a-hol", labelKey: "nav.attendance.holidays", path: "/holidays" }
      : null,
    {
      id: "a-reg",
      labelKey: "nav.attendance.regularizations",
      path: "/attendance/regularizations",
    },
    { type: "group", labelKey: "nav.attendance.reports", id: "a-rep" },
    { id: "a-daily", labelKey: "nav.attendance.daily", path: "/attendance/reports/daily" },
    {
      id: "a-month",
      labelKey: "nav.attendance.monthly",
      path: "/attendance/reports/monthly-summary",
    },
    {
      id: "a-late",
      labelKey: "nav.attendance.late",
      path: "/attendance/reports/late-arrivals",
    },
    {
      id: "a-ot",
      labelKey: "nav.attendance.overtime",
      path: "/attendance/reports/overtime",
    },
    {
      id: "a-dept",
      labelKey: "nav.attendance.byDept",
      path: "/attendance/reports/department-comparison",
    },
  ].filter(Boolean);

  return withLabels(items);
});

const leaveManagementSubItems = computed(() => {
  void locale.value;
  const canReports = authStore.can("reports.view", "leave.manage");
  const items = [
    { id: "l-req", labelKey: "nav.leave.requests", path: "/leave-requests" },
    {
      id: "l-comp",
      labelKey: "nav.leave.compOff",
      path: "/leave-management/compensatory-offs",
    },
    {
      id: "l-cal",
      labelKey: "nav.leave.teamCalendar",
      path: "/leave-management/team-calendar",
    },
    { id: "l-types", labelKey: "nav.leave.types", path: "/leave-management/types" },
    { id: "l-bal", labelKey: "nav.leave.balances", path: "/leave-management/balance" },
    canReports
      ? { type: "group", labelKey: "nav.leave.reports", id: "l-rep" }
      : null,
    canReports
      ? {
          id: "l-dash",
          labelKey: "nav.leave.overview",
          path: "/leave-management/reports/dashboard",
        }
      : null,
    canReports
      ? {
          id: "l-lbal",
          labelKey: "nav.leave.balanceReport",
          path: "/leave-management/reports/leave-balance",
        }
      : null,
    canReports
      ? {
          id: "l-hist",
          labelKey: "nav.leave.history",
          path: "/leave-management/reports/leave-history",
        }
      : null,
    canReports
      ? {
          id: "l-stat",
          labelKey: "nav.leave.byDept",
          path: "/leave-management/reports/department-statistics",
        }
      : null,
    canReports
      ? {
          id: "l-comp2",
          labelKey: "nav.leave.compliance",
          path: "/leave-management/reports/compliance",
        }
      : null,
  ].filter(Boolean);

  return withLabels(items);
});

const payrollSubItems = computed(() => {
  void locale.value;
  return withLabels([
    { id: "pd", labelKey: "nav.payroll.dashboard", path: "/payroll/dashboard" },
    { id: "pr", labelKey: "nav.payroll.records", path: "/payroll/records" },
    { type: "group", labelKey: "nav.payroll.setup", id: "pg-setup" },
    { id: "pc", labelKey: "nav.payroll.components", path: "/payroll/components" },
    { id: "pm", labelKey: "nav.payroll.modifiers", path: "/payroll/modifiers" },
    { id: "ps", labelKey: "nav.payroll.structures", path: "/payroll/salary-structures" },
    { type: "group", labelKey: "nav.payroll.reports", id: "pg-reports" },
    {
      id: "preg",
      labelKey: "nav.payroll.register",
      path: "/payroll/reports/payroll-register",
    },
    {
      id: "pdep",
      labelKey: "nav.payroll.byDept",
      path: "/payroll/reports/department-summary",
    },
    {
      id: "ptax",
      labelKey: "nav.payroll.tax",
      path: "/payroll/reports/tax-summary",
    },
    {
      id: "phist",
      labelKey: "nav.payroll.history",
      path: "/payroll/reports/employee-history",
    },
    { type: "group", labelKey: "nav.payroll.system", id: "pg-sys" },
    { id: "pset", labelKey: "nav.payroll.settings", path: "/payroll/settings" },
  ]);
});

const adminNavSecondary = computed(() => {
  void locale.value;
  const items = [
    authStore.can("leave.manage", "payroll.view")
      ? {
          id: 14,
          labelKey: "nav.leave.expenses",
          path: "/expenses",
          icon: "receipt",
        }
      : null,
    authStore.can("leave.manage", "employees.manage")
      ? {
          id: 15,
          labelKey: "nav.leave.documents",
          path: "/employee-documents",
          icon: "document",
        }
      : null,
    authStore.can("organization.manage", "employees.manage")
      ? {
          id: 6,
          labelKey: "nav.secondary.training",
          path: "/admin-trainings",
          icon: "training",
        }
      : null,
    authStore.can("organization.manage", "employees.manage")
      ? {
          id: 13,
          labelKey: "nav.secondary.equipment",
          path: "/admin-equipments",
          icon: "laptop",
        }
      : null,
    authStore.can("organization.manage", "employees.manage")
      ? {
          id: 7,
          labelKey: "nav.secondary.recruitment",
          path: "/recruitment",
          icon: "briefcase",
        }
      : null,
    authStore.can("organization.manage", "employees.manage")
      ? {
          id: 8,
          labelKey: "nav.secondary.candidates",
          path: "/candidates",
          icon: "user",
        }
      : null,
    authStore.can("settings.manage")
      ? {
          id: 12,
          labelKey: "nav.secondary.settings",
          path: "/settings",
          icon: "settings",
        }
      : null,
  ].filter(Boolean);

  return withLabels(items);
});

const employeeNavigationExtras = computed(() => {
  void locale.value;
  return withLabels([
    { id: 9, labelKey: "nav.notes", path: "/notes", icon: "notes" },
    { id: 10, labelKey: "nav.chat", path: "/chat", icon: "notes" },
  ]);
});

/* ——— Active states ——— */
function isOrganizationSubActive(path) {
  return route.path === path || route.path.startsWith(path + "/");
}

function isEmployeeManagementSubActive(path) {
  if (path === "/employees") {
    return (
      route.path === "/employees" ||
      (route.path.startsWith("/employees/") &&
        route.path !== "/employees/new" &&
        !route.path.startsWith("/employees/categories"))
    );
  }
  return route.path === path || route.path.startsWith(path + "/");
}

function isAttendanceSubActive(path) {
  if (path === "/attendance") return route.path === "/attendance";
  if (path === "/holidays") return route.path.startsWith("/holidays");
  return route.path === path || route.path.startsWith(path + "/");
}

function isLeaveManagementSubActive(path) {
  return route.path === path || route.path.startsWith(path + "/");
}

function isPayrollSubActive(path) {
  if (!path) return false;
  if (path === "/expenses") {
    return route.path === "/expenses" || route.path.startsWith("/expenses/");
  }
  if (path === "/payroll/records") {
    return (
      route.path === "/payroll/records" ||
      route.path.startsWith("/payroll/show/") ||
      route.path.startsWith("/payroll/generate")
    );
  }
  if (path === "/payroll/salary-structures") {
    return route.path.startsWith("/payroll/salary-structures");
  }
  return route.path === path || route.path.startsWith(path + "/");
}

const isActive = (path) => route.path === path;

function sectionFromPath(path) {
  if (path.startsWith("/employees") || path.startsWith("/performance-reviews")) return "employees";
  if (path.startsWith("/organization")) return "organization";
  if (
    path === "/attendance" ||
    path.startsWith("/attendance/") ||
    path.startsWith("/holidays")
  ) {
    return "attendance";
  }
  if (path.startsWith("/payroll")) return "payroll";
  if (
    path.startsWith("/leave-management") ||
    path === "/leave-requests" ||
    path.startsWith("/leave-requests/")
  ) {
    return "leave";
  }
  if (
    path === "/expenses" ||
    path.startsWith("/expenses/") ||
    path === "/employee-documents" ||
    path.startsWith("/employee-documents/")
  ) return null;
  if (pathMatchesSelfServiceMenu(path)) return "self-service";
  return null;
}

watch(
  () => route.path,
  (path) => {
    const next = sectionFromPath(path);
    openSection.value = next;
  },
  { immediate: true }
);
</script>

<style scoped>
.nav-sub {
  margin-top: 0.15rem;
  margin-left: 0.85rem;
  padding-left: 0.65rem;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.nav-group {
  margin-top: 0.45rem;
  margin-bottom: 0.1rem;
  padding-left: 0.65rem;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9ca3af;
}

.nav-group:first-child {
  margin-top: 0.15rem;
}
</style>
