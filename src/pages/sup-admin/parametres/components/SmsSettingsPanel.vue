<template>
  <div class="space-y-6">
    <p class="text-sm text-neutral-500">
      Configuration du fournisseur SMS pour les notifications et alertes (OTP, rappels, etc.).
    </p>

    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>
    <div
      v-if="success"
      class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
    >
      {{ success }}
    </div>

    <div class="relative rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div
        v-if="loading"
        class="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-xl bg-white/80 text-sm text-neutral-500"
      >
        <span
          class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
          aria-hidden="true"
        />
        Chargement…
      </div>

      <form @submit.prevent="save">
        <div class="mb-4">
          <label class="flex items-center gap-2 text-sm font-medium text-neutral-800">
            <input
              v-model="smsForm.enabled"
              type="checkbox"
              class="rounded border-neutral-300"
              :disabled="loading || saving"
            />
            Activer l'envoi SMS
          </label>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Fournisseur</label>
            <select
              v-model="smsForm.provider"
              class="input-base w-full text-sm"
              :disabled="loading || saving"
            >
              <option value="">Sélectionner</option>
              <option value="twilio">Twilio</option>
              <option value="nexmo">Vonage (Nexmo)</option>
              <option value="orange">Orange SMS API</option>
              <option value="custom">Autre</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Sender ID</label>
            <input
              v-model="smsForm.sender_id"
              type="text"
              class="input-base w-full text-sm"
              :disabled="loading || saving"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1 block text-sm font-medium text-neutral-800">Clé API</label>
            <input
              v-model="smsForm.api_key"
              type="password"
              class="input-base w-full text-sm"
              :disabled="loading || saving"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
          <button type="submit" class="btn-primary text-sm" :disabled="loading || saving">
            {{ saving ? "Enregistrement…" : "Enregistrer SMS" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { usePlatformSettings } from "../composables/usePlatformSettings.js";

const { smsForm, loading, saving, error, success, load, save } = usePlatformSettings("sms");

onMounted(load);
</script>
