<template>
  <div class="space-y-6">
    <p class="text-sm text-neutral-500">
      Configuration du serveur SMTP pour les e-mails transactionnels (invitations, notifications, etc.).
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
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Serveur SMTP</label>
            <input
              v-model="smtpForm.host"
              type="text"
              class="input-base w-full text-sm"
              placeholder="smtp.example.com"
              :disabled="loading || saving"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Port</label>
            <input
              v-model.number="smtpForm.port"
              type="number"
              class="input-base w-full text-sm"
              :disabled="loading || saving"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Chiffrement</label>
            <select
              v-model="smtpForm.encryption"
              class="input-base w-full text-sm"
              :disabled="loading || saving"
            >
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
              <option value="none">Aucun</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Utilisateur</label>
            <input
              v-model="smtpForm.username"
              type="text"
              class="input-base w-full text-sm"
              :disabled="loading || saving"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Mot de passe</label>
            <input
              v-model="smtpForm.password"
              type="password"
              class="input-base w-full text-sm"
              :disabled="loading || saving"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-800">Adresse expéditeur</label>
            <input
              v-model="smtpForm.from_address"
              type="email"
              class="input-base w-full text-sm"
              :disabled="loading || saving"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1 block text-sm font-medium text-neutral-800">Nom expéditeur</label>
            <input
              v-model="smtpForm.from_name"
              type="text"
              class="input-base w-full text-sm"
              :disabled="loading || saving"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
          <button type="submit" class="btn-primary text-sm" :disabled="loading || saving">
            {{ saving ? "Enregistrement…" : "Enregistrer SMTP" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { usePlatformSettings } from "../composables/usePlatformSettings.js";

const { smtpForm, loading, saving, error, success, load, save } = usePlatformSettings("smtp");

onMounted(load);
</script>
