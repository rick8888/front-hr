<template>
  <div class="max-w-xl space-y-5">
    <div
      v-if="feedback"
      class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      {{ feedback }}
    </div>

    <section class="rounded-xl border border-neutral-200 p-5">
      <label class="mb-1.5 block text-sm font-medium text-neutral-800">
        {{ t("settings.preferences.language") }}
      </label>
      <select v-model="form.language" class="input-base w-full max-w-xs text-sm">
        <option value="fr">{{ t("settings.preferences.lang.fr") }}</option>
        <option value="en">{{ t("settings.preferences.lang.en") }}</option>
      </select>
    </section>

    <section class="rounded-xl border border-neutral-200 p-5">
      <label class="mb-1.5 block text-sm font-medium text-neutral-800">
        {{ t("settings.preferences.timezone") }}
      </label>
      <select v-model="form.timezone" class="input-base w-full max-w-xs text-sm">
        <option value="Europe/Paris">Europe/Paris</option>
        <option value="Europe/London">Europe/London</option>
        <option value="Africa/Casablanca">Africa/Casablanca</option>
        <option value="America/New_York">America/New_York</option>
        <option value="UTC">UTC</option>
      </select>
    </section>

    <section class="rounded-xl border border-neutral-200 p-5">
      <label class="mb-1.5 block text-sm font-medium text-neutral-800">
        {{ t("settings.preferences.dateFormat") }}
      </label>
      <select v-model="form.dateFormat" class="input-base w-full max-w-xs text-sm">
        <option value="DD/MM/YYYY">JJ/MM/AAAA</option>
        <option value="MM/DD/YYYY">MM/JJ/AAAA</option>
        <option value="YYYY-MM-DD">AAAA-MM-JJ</option>
      </select>
    </section>

    <div class="flex justify-end">
      <button type="button" class="btn-primary text-sm" @click="save">
        {{ t("settings.preferences.save") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n, setLocale } from "../../../i18n/index.js";
import {
  loadPreferences,
  savePreferences as persistPreferences,
} from "../../../i18n/preferences.js";

const { t } = useI18n();
const form = ref({ ...loadPreferences() });
const feedback = ref("");

function save() {
  const next = persistPreferences(form.value);
  form.value = { ...next };
  setLocale(next.language, { persist: false });
  feedback.value = t("settings.preferences.saved");
}
</script>
