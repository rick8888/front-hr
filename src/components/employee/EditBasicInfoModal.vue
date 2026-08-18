<template>
  <Modal
    :model-value="modelValue"
    :title="t('admin.employees.view.editBasicTitle')"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div
      v-if="saveError"
      class="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ saveError }}
    </div>

    <form class="space-y-3" @submit.prevent="onSave">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field :label="t('admin.employees.create.firstName')" required>
          <input
            v-model="form.firstName"
            type="text"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.firstName }"
            :placeholder="t('admin.employees.create.firstNamePlaceholder')"
            :disabled="saving"
          />
          <ErrorLine :msg="errors.firstName" />
        </Field>

        <Field :label="t('admin.employees.create.lastName')" required>
          <input
            v-model="form.lastName"
            type="text"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.lastName }"
            :placeholder="t('admin.employees.create.lastNamePlaceholder')"
            :disabled="saving"
          />
          <ErrorLine :msg="errors.lastName" />
        </Field>

        <Field :label="t('admin.employees.create.dob')" required>
          <input
            v-model="form.dateOfBirth"
            type="date"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.dateOfBirth }"
            :disabled="saving"
          />
          <ErrorLine :msg="errors.dateOfBirth" />
        </Field>

        <Field :label="t('admin.employees.create.gender')" required>
          <select
            v-model="form.gender"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.gender }"
            :disabled="saving"
          >
            <option value="">{{ t("admin.employees.create.selectGender") }}</option>
            <option value="male">{{ t("admin.employees.create.gender.male") }}</option>
            <option value="female">{{ t("admin.employees.create.gender.female") }}</option>
            <option value="other">{{ t("admin.employees.create.gender.other") }}</option>
          </select>
          <ErrorLine :msg="errors.gender" />
        </Field>

        <Field :label="t('admin.employees.create.bloodGroup')">
          <select v-model="form.bloodGroup" class="input-base text-sm" :disabled="saving">
            <option value="">{{ t("admin.employees.create.selectBloodGroup") }}</option>
            <option v-for="bg in bloodGroups" :key="bg" :value="bg">{{ bg }}</option>
          </select>
        </Field>

        <Field :label="t('admin.employees.create.email')" required>
          <input
            v-model="form.email"
            type="email"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.email }"
            :placeholder="t('admin.employees.create.emailPlaceholder')"
            :disabled="saving"
          />
          <ErrorLine :msg="errors.email" />
        </Field>

        <Field :label="t('admin.employees.create.phone')" required>
          <input
            v-model="form.phone"
            type="tel"
            class="input-base text-sm"
            :class="{ 'border-error-500 ring-1 ring-error-500': errors.phone }"
            :placeholder="t('admin.employees.create.phonePlaceholder')"
            :disabled="saving"
          />
          <ErrorLine :msg="errors.phone" />
        </Field>

        <Field :label="t('admin.employees.create.altPhone')">
          <input
            v-model="form.alternativePhone"
            type="tel"
            class="input-base text-sm"
            :placeholder="t('admin.employees.create.altPhonePlaceholder')"
            :disabled="saving"
          />
        </Field>

        <div class="md:col-span-2">
          <Field :label="t('admin.employees.create.address')">
            <textarea
              v-model="form.address"
              rows="1"
              class="input-base text-sm"
              :placeholder="t('admin.employees.create.addressPlaceholder')"
              :disabled="saving"
            ></textarea>
          </Field>
        </div>
      </div>

      <div class="pt-3 border-t border-neutral-100">
        <div class="flex items-center gap-2 mb-2 text-sm font-medium text-neutral-500">
          <svg class="w-4 h-4 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
            />
          </svg>
          {{ t("admin.employees.create.emergency") }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field :label="t('admin.employees.create.contactName')">
            <input
              v-model="form.emergency.name"
              type="text"
              class="input-base text-sm"
              :placeholder="t('admin.employees.create.contactNamePlaceholder')"
              :disabled="saving"
            />
          </Field>

          <Field :label="t('admin.employees.create.relationship')">
            <select
              v-model="form.emergency.relationship"
              class="input-base text-sm"
              :disabled="saving"
            >
              <option value="">{{ t("admin.employees.create.selectRelationship") }}</option>
              <option v-for="r in relationships" :key="r.value" :value="r.value">{{ r.label }}</option>
            </select>
          </Field>

          <Field :label="t('admin.employees.create.contactPhone')">
            <input
              v-model="form.emergency.phone"
              type="tel"
              class="input-base text-sm"
              :placeholder="t('admin.employees.create.contactPhonePlaceholder')"
              :disabled="saving"
            />
          </Field>

          <div class="md:col-span-2">
            <Field :label="t('admin.employees.create.contactAddress')">
              <textarea
                v-model="form.emergency.address"
                rows="1"
                class="input-base text-sm"
                :placeholder="t('admin.employees.create.contactAddressPlaceholder')"
                :disabled="saving"
              ></textarea>
            </Field>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex gap-3 px-6 py-4 border-t border-neutral-200">
        <button
          type="button"
          class="inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm disabled:opacity-50"
          :disabled="saving"
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
import { ref, watch, h, computed } from "vue";
import Modal from "../common/Modal.vue";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  employee: { type: Object, required: true },
  saving: { type: Boolean, default: false },
  saveError: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue", "save"]);

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const relationships = computed(() => [
  { value: "Father", label: t("admin.employees.create.rel.father") },
  { value: "Mother", label: t("admin.employees.create.rel.mother") },
  { value: "Spouse", label: t("admin.employees.create.rel.spouse") },
  { value: "Sibling", label: t("admin.employees.create.rel.sibling") },
  { value: "Friend", label: t("admin.employees.create.rel.friend") },
  { value: "Other", label: t("admin.employees.create.rel.other") },
]);

function buildForm(e) {
  return {
    firstName: e?.firstName || "",
    lastName: e?.lastName || "",
    dateOfBirth: e?.dateOfBirth || "",
    gender: e?.gender || "",
    bloodGroup: e?.bloodGroup || "",
    email: e?.email || "",
    phone: e?.phone || "",
    alternativePhone: e?.alternativePhone || "",
    address: e?.address || "",
    emergency: {
      name: e?.emergency?.name || "",
      relationship: e?.emergency?.relationship || "",
      phone: e?.emergency?.phone || "",
      address: e?.emergency?.address || "",
    },
  };
}

const form = ref(buildForm(props.employee));
const errors = ref({});

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.value = buildForm(props.employee);
      errors.value = {};
    }
  }
);

function validate() {
  const e = {};
  if (!form.value.firstName.trim()) e.firstName = t("admin.employees.create.error.firstNameRequired");
  if (!form.value.lastName.trim()) e.lastName = t("admin.employees.create.error.lastNameRequired");
  if (!form.value.dateOfBirth) e.dateOfBirth = t("admin.employees.create.error.dobRequired");
  if (!form.value.gender) e.gender = t("admin.employees.create.error.genderRequired");
  if (!form.value.email.trim()) e.email = t("admin.employees.create.error.emailRequired");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
    e.email = t("admin.employees.create.error.emailInvalid");
  if (!form.value.phone.trim()) e.phone = t("admin.employees.create.error.phoneRequired");
  errors.value = e;
  return Object.keys(e).length === 0;
}

function onSave() {
  if (props.saving) return;
  if (!validate()) return;
  const firstName = form.value.firstName.trim();
  const lastName = form.value.lastName.trim();
  emit("save", {
    ...form.value,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    emergency: { ...form.value.emergency },
  });
}

const Field = {
  props: { label: String, required: Boolean },
  setup(p, { slots }) {
    return () =>
      h("label", { class: "block" }, [
        h(
          "span",
          { class: "block text-sm font-medium text-neutral-700 mb-1" },
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
