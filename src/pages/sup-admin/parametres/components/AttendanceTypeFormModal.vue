<template>
  <Modal
    :model-value="open"
    :title="isEdit ? t('admin.attendance.types.modalEdit', { name: type?.name || '' }) : t('admin.attendance.types.modalAdd')"
    size="lg"
    backdrop-class="bg-neutral-950/60 backdrop-blur-sm"
    panel-class="overflow-hidden rounded-2xl border border-white/60 shadow-2xl"
    header-class="border-neutral-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/60 px-7 py-5"
    title-class="text-xl tracking-tight"
    close-button-class="rounded-lg p-2 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
    :close-label="t('common.close')"
    body-class="px-7 py-6"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form v-if="open" class="space-y-6" @submit.prevent="$emit('save')">
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">
            {{ t("admin.attendance.types.col.label") }} <span class="text-rose-500">*</span>
          </label>
          <input
            :value="form.name"
            type="text"
            class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 text-sm shadow-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            :placeholder="t('admin.attendance.types.namePlaceholder')"
            @input="onNameInput"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">
            {{ t("common.code") }} <span class="text-rose-500">*</span>
          </label>
          <input
            :value="form.code"
            type="text"
            class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 font-mono text-sm shadow-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
            :disabled="isEdit && type?.isSystem"
            :placeholder="t('admin.attendance.types.codePlaceholder')"
            @input="$emit('update:form', { ...form, code: $event.target.value })"
          />
        </div>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-semibold text-slate-700">{{ t("common.description") }}</label>
        <textarea
          :value="form.description"
          rows="3"
          class="input-base w-full resize-y rounded-lg border-slate-200 bg-white py-2.5 text-sm shadow-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          @input="$emit('update:form', { ...form, description: $event.target.value })"
        />
      </div>

      <div class="grid gap-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-4 sm:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">{{ t("admin.attendance.types.col.order") }}</label>
          <input
            :value="form.sortOrder"
            type="number"
            min="0"
            class="input-base w-full rounded-lg border-slate-200 bg-white py-2.5 text-sm shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            @input="$emit('update:form', { ...form, sortOrder: Number($event.target.value) })"
          />
        </div>
        <label class="flex min-h-[72px] cursor-pointer items-center gap-3 rounded-lg border border-white/80 bg-white/80 px-3 shadow-sm transition hover:border-indigo-200">
          <input
            :checked="form.isActive"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            @change="$emit('update:form', { ...form, isActive: $event.target.checked })"
          />
          <span class="text-sm font-semibold text-slate-700">{{ t("admin.attendance.types.active") }}</span>
        </label>
      </div>

      <div class="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end sm:gap-3">
        <button type="button" class="btn-outline text-sm disabled:opacity-50" :disabled="busy" @click="$emit('update:open', false)">
          {{ t("common.cancel") }}
        </button>
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="busy"
        >
          {{ busy ? t("common.saving") : isEdit ? t("common.update") : t("common.create") }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import { useI18n } from "../../../../i18n/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  type: { type: Object, default: null },
  form: { type: Object, required: true },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "update:form", "save"]);

const { t } = useI18n();

const isEdit = computed(() => !!props.type?.id);

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function onNameInput(event) {
  const name = event.target.value;
  const next = { ...props.form, name };
  if (!props.type) {
    next.code = slugify(name);
  }
  emit("update:form", next);
}
</script>
