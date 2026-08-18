<template>
  <Modal
    :model-value="modelValue"
    :title="t('admin.employees.view.editWorkTitle')"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div
      v-if="catalogError"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ catalogError }}
    </div>
    <div
      v-if="saveError"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ saveError }}
    </div>

    <div
      v-if="catalogLoading"
      class="flex min-h-[160px] items-center justify-center gap-2 text-sm text-neutral-500"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-secondary-600"
        aria-hidden="true"
      />
      {{ t("common.loading") }}
    </div>

    <form v-else class="space-y-4" @submit.prevent="onSave">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field :label="t('admin.employees.create.designation')" required>
          <select
            v-model="form.designation"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.designation }"
            :disabled="saving"
          >
            <option value="">{{ t("admin.employees.create.selectDesignation") }}</option>
            <option
              v-for="d in designationOptions"
              :key="d.id || d.name"
              :value="d.name"
            >
              {{ d.name }}
            </option>
          </select>
          <ErrorLine :msg="errors.designation" />
        </Field>

        <Field :label="t('admin.employees.create.role')" required>
          <select
            v-model="form.role"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.role }"
            :disabled="saving"
          >
            <option value="">{{ t("admin.employees.create.selectRole") }}</option>
            <option
              v-for="r in roleOptions"
              :key="r.slug || r.id"
              :value="r.slug"
            >
              {{ r.name }}
            </option>
          </select>
          <ErrorLine :msg="errors.role" />
        </Field>

        <Field :label="t('admin.employees.create.department')" required>
          <select
            v-model="form.department"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.department }"
            :disabled="saving"
          >
            <option value="">{{ t("admin.employees.create.selectDepartment") }}</option>
            <option
              v-for="d in departmentOptions"
              :key="d.id || d.name"
              :value="d.name"
            >
              {{ d.name }}
            </option>
          </select>
          <ErrorLine :msg="errors.department" />
        </Field>

        <Field :label="t('admin.employees.create.team')" required>
          <select
            v-model="form.team"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.team }"
            :disabled="saving"
          >
            <option value="">{{ t("admin.employees.create.selectTeam") }}</option>
            <option
              v-for="team in teamOptions"
              :key="team.id || team.name"
              :value="team.name"
            >
              {{ team.name }}
            </option>
          </select>
          <ErrorLine :msg="errors.team" />
        </Field>

        <Field :label="t('admin.employees.create.shift')" required>
          <select
            v-model="form.shiftId"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.shiftId }"
            :disabled="saving"
          >
            <option value="">{{ t("admin.employees.create.selectShift") }}</option>
            <option
              v-for="s in shiftOptions"
              :key="s.id"
              :value="String(s.id)"
            >
              {{ s.label || s.name }}
            </option>
          </select>
          <ErrorLine :msg="errors.shiftId" />
        </Field>

        <Field :label="t('admin.employees.create.manager')" required>
          <select
            v-model="form.reportingManager"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.reportingManager }"
            :disabled="saving"
          >
            <option value="">{{ t("admin.employees.view.selectReportingTo") }}</option>
            <option
              v-for="m in managerOptions"
              :key="m.id || m.name"
              :value="m.name"
            >
              {{ m.name }}
            </option>
          </select>
          <ErrorLine :msg="errors.reportingManager" />
        </Field>

        <Field :label="t('admin.employees.create.joiningDate')" required>
          <input
            v-model="form.joinDate"
            type="date"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.joinDate }"
            :disabled="saving"
          />
          <ErrorLine :msg="errors.joinDate" />
        </Field>

        <Field :label="t('admin.employees.create.attendanceType')" required>
          <select
            v-model="form.attendanceType"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.attendanceType }"
            :disabled="saving"
          >
            <option value="">{{ t("admin.employees.create.selectAttendanceType") }}</option>
            <option
              v-for="a in attendanceTypeOptions"
              :key="a.id || a.code"
              :value="a.code"
            >
              {{ a.name }}
            </option>
          </select>
          <ErrorLine :msg="errors.attendanceType" />
        </Field>

        <Field :label="t('admin.employees.view.qrGroup')">
          <select
            v-model="form.qrGroup"
            class="input-base text-sm"
            :disabled="!isQrType || saving"
          >
            <option value="">
              {{ isQrType ? t("admin.employees.view.selectQrGroup") : t("admin.employees.view.qrNotApplicable") }}
            </option>
            <option v-for="g in qrGroups" :key="g" :value="g">{{ g }}</option>
          </select>
        </Field>
      </div>
    </form>

    <template #footer>
      <div class="flex gap-3 px-6 py-4 border-t border-neutral-200">
        <button
          type="button"
          class="inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm disabled:opacity-50"
          :disabled="saving || catalogLoading"
          @click="onSave"
        >
          {{ saving ? t("common.saving") : t("admin.employees.view.saveChanges") }}
        </button>
        <button
          type="button"
          class="inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg bg-error-50 text-error-600 hover:bg-error-100 disabled:opacity-50"
          :disabled="saving"
          @click="$emit('update:modelValue', false)"
        >
          {{ t("common.cancel") }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch, computed, h } from "vue";
import Modal from "../common/Modal.vue";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  employee: { type: Object, required: true },
  designations: { type: Array, default: () => [] },
  roles: { type: Array, default: () => [] },
  departments: { type: Array, default: () => [] },
  teams: { type: Array, default: () => [] },
  shifts: { type: Array, default: () => [] },
  managers: { type: Array, default: () => [] },
  attendanceTypes: { type: Array, default: () => [] },
  catalogLoading: { type: Boolean, default: false },
  catalogError: { type: String, default: "" },
  saving: { type: Boolean, default: false },
  saveError: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "save"]);

const qrGroups = ["HQ", "Branch A", "Branch B", "Remote"];

function withCurrentOption(list, current, key = "name") {
  if (!current) return list;
  const exists = list.some(
    (item) =>
      String(item[key]) === String(current) ||
      String(item.slug) === String(current) ||
      String(item.code) === String(current) ||
      String(item.id) === String(current)
  );
  if (exists) return list;
  return [{ id: `current-${current}`, name: current, label: current, slug: current, code: current }, ...list];
}

const designationOptions = computed(() =>
  withCurrentOption(props.designations, props.employee?.designation)
);
const roleOptions = computed(() =>
  withCurrentOption(props.roles, props.employee?.role, "slug")
);
const departmentOptions = computed(() =>
  withCurrentOption(props.departments, props.employee?.department)
);
const teamOptions = computed(() =>
  withCurrentOption(props.teams, props.employee?.team)
);
const shiftOptions = computed(() => {
  const list = props.shifts || [];
  const shiftId = props.employee?.shiftId;
  if (shiftId && !list.some((s) => String(s.id) === String(shiftId))) {
    return [
      {
        id: shiftId,
        name: props.employee?.shift || String(shiftId),
        label: props.employee?.shift || String(shiftId),
      },
      ...list,
    ];
  }
  return list;
});
const managerOptions = computed(() =>
  withCurrentOption(props.managers, props.employee?.reportingManager)
);
const attendanceTypeOptions = computed(() =>
  withCurrentOption(props.attendanceTypes, props.employee?.attendanceType, "code")
);

function resolveRoleValue(employee) {
  const current = employee?.role || "";
  if (!current) return "";
  const found = (props.roles || []).find(
    (r) => r.slug === current || r.name === current
  );
  return found?.slug || current;
}

function resolveAttendanceValue(employee) {
  const current = employee?.attendanceType || "";
  if (!current) return "";
  const found = (props.attendanceTypes || []).find(
    (a) => a.code === current || a.name === current
  );
  return found?.code || current;
}

function buildForm(e) {
  return {
    designation: e?.designation && e.designation !== "—" ? e.designation : "",
    role: resolveRoleValue(e),
    department: e?.department && e.department !== "—" ? e.department : "",
    team: e?.team && e.team !== "—" ? e.team : "",
    shiftId: e?.shiftId != null && e.shiftId !== "" ? String(e.shiftId) : "",
    reportingManager:
      e?.reportingManager && e.reportingManager !== "—" ? e.reportingManager : "",
    joinDate: e?.joinDate || "",
    attendanceType: resolveAttendanceValue(e),
    qrGroup: e?.qrGroup || "",
  };
}

const form = ref(buildForm(props.employee));
const errors = ref({});

const isQrType = computed(() => /qr/i.test(form.value.attendanceType || ""));

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.value = buildForm(props.employee);
      errors.value = {};
    }
  }
);

watch(
  () => [props.roles, props.attendanceTypes, props.employee],
  () => {
    if (props.modelValue) {
      form.value = buildForm(props.employee);
    }
  },
  { deep: true }
);

watch(
  () => form.value.attendanceType,
  () => {
    if (!isQrType.value) form.value.qrGroup = "";
  }
);

function validate() {
  const e = {};
  if (!form.value.designation) e.designation = t("admin.employees.create.error.designationRequired");
  if (!form.value.role) e.role = t("admin.employees.create.error.roleRequired");
  if (!form.value.department) e.department = t("admin.employees.create.error.departmentRequired");
  if (!form.value.team) e.team = t("admin.employees.create.error.teamRequired");
  if (!form.value.shiftId) e.shiftId = t("admin.employees.create.error.shiftRequired");
  if (!form.value.reportingManager) e.reportingManager = t("admin.employees.create.error.managerRequired");
  if (!form.value.joinDate) e.joinDate = t("admin.employees.create.error.joiningRequired");
  if (!form.value.attendanceType) e.attendanceType = t("admin.employees.create.error.attendanceTypeRequired");
  errors.value = e;
  return Object.keys(e).length === 0;
}

function onSave() {
  if (props.saving || props.catalogLoading) return;
  if (!validate()) return;
  emit("save", { ...form.value });
}

const Field = {
  props: { label: String, required: Boolean },
  setup(p, { slots }) {
    return () =>
      h("label", { class: "block" }, [
        h(
          "span",
          { class: "block text-sm font-medium text-neutral-700 mb-1.5" },
          [p.label, p.required ? h("span", { class: "text-error-600 ml-0.5" }, "*") : null]
        ),
        slots.default?.(),
      ]);
  },
};

const ErrorLine = {
  props: { msg: String },
  setup(p) {
    return () =>
      p.msg ? h("p", { class: "text-xs text-error-600 mt-1" }, p.msg) : null;
  },
};
</script>
