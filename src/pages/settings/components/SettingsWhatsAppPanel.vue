<template>
  <div class="p-8 space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-neutral-900">{{ t('settings.whatsapp.title') }}</h2>
        <p class="text-sm text-neutral-600 mt-1">
          {{ t('settings.whatsapp.subtitle') }}
        </p>
      </div>
      <button
        type="button"
        class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold disabled:opacity-50 shrink-0"
        :disabled="loading || saving"
        @click="save"
      >
        {{ saving ? t('settings.whatsapp.saving') : t('settings.whatsapp.save') }}
      </button>
    </div>

    <div
      v-if="error"
      class="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
    >
      {{ error }}
    </div>
    <div
      v-if="success"
      class="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800"
    >
      {{ success }}
    </div>

    <div class="relative space-y-6">
      <div
        v-if="loading"
        class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 text-sm text-neutral-500"
      >
        {{ t('common.loading') }}
      </div>

      <!-- Activation -->
      <section class="rounded-xl border border-neutral-200 p-6 space-y-4">
        <h3 class="text-base font-semibold text-neutral-900">{{ t('settings.whatsapp.activation') }}</h3>
        <label class="flex items-start gap-3 text-sm text-neutral-700 cursor-pointer">
          <input
            v-model="form.enabled"
            type="checkbox"
            class="mt-0.5 w-4 h-4 rounded border-neutral-300 text-primary-600"
            :disabled="loading || saving"
          />
          <span>
            <span class="font-medium text-neutral-900">{{ t('settings.whatsapp.enable') }}</span>
            <span class="block text-xs text-neutral-500 mt-0.5">
              {{ t('settings.whatsapp.enableHint') }}
            </span>
          </span>
        </label>
        <label class="flex items-start gap-3 text-sm text-neutral-700 cursor-pointer">
          <input
            v-model="form.attendance_enabled"
            type="checkbox"
            class="mt-0.5 w-4 h-4 rounded border-neutral-300 text-primary-600"
            :disabled="loading || saving || !form.enabled"
          />
          <span>
            <span class="font-medium text-neutral-900">{{ t('settings.whatsapp.attendance') }}</span>
            <span class="block text-xs text-neutral-500 mt-0.5">
              {{ t('settings.whatsapp.attendanceHint') }}
            </span>
          </span>
        </label>
      </section>

      <!-- Meta Cloud credentials -->
      <section class="rounded-xl border border-neutral-200 p-6 space-y-4">
        <h3 class="text-base font-semibold text-neutral-900">{{ t('settings.whatsapp.credentials') }}</h3>
        <p class="text-xs text-neutral-500">
          {{ t('settings.whatsapp.credentialsHint') }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number ID</label>
            <input
              v-model="form.phone_number_id"
              type="text"
              class="input-base text-sm w-full font-mono"
              placeholder="Ex. 123456789012345"
              :disabled="loading || saving"
              autocomplete="off"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">
              WhatsApp Business Account ID
            </label>
            <input
              v-model="form.business_account_id"
              type="text"
              class="input-base text-sm w-full font-mono"
              placeholder="Optionnel"
              :disabled="loading || saving"
              autocomplete="off"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">
              N° affiché (indicatif international)
            </label>
            <input
              v-model="form.display_phone"
              type="text"
              class="input-base text-sm w-full"
              placeholder="+221 77 000 00 00"
              :disabled="loading || saving"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">Version API</label>
            <input
              v-model="form.api_version"
              type="text"
              class="input-base text-sm w-full font-mono"
              placeholder="v21.0"
              :disabled="loading || saving"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">
              Access Token (permanent)
              <span v-if="form.access_token_set" class="text-xs font-normal text-success-700 ml-2">
                · déjà enregistré
              </span>
            </label>
            <input
              v-model="form.access_token"
              type="password"
              class="input-base text-sm w-full font-mono"
              :placeholder="
                form.access_token_set
                  ? 'Laisser vide pour conserver le token actuel'
                  : 'Collez le token permanent Meta'
              "
              :disabled="loading || saving"
              autocomplete="new-password"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">
              App Secret
              <span v-if="form.app_secret_set" class="text-xs font-normal text-success-700 ml-2">
                · déjà enregistré
              </span>
            </label>
            <input
              v-model="form.app_secret"
              type="password"
              class="input-base text-sm w-full font-mono"
              :placeholder="
                form.app_secret_set
                  ? 'Laisser vide pour conserver le secret actuel'
                  : 'Pour valider la signature des webhooks (recommandé)'
              "
              :disabled="loading || saving"
              autocomplete="new-password"
            />
          </div>
        </div>
      </section>

      <!-- Webhook -->
      <section class="rounded-xl border border-neutral-200 p-6 space-y-4">
        <h3 class="text-base font-semibold text-neutral-900">Webhook Meta</h3>
        <p class="text-xs text-neutral-500">
          Dans Meta → WhatsApp → Configuration, créez un webhook avec l’URL et le jeton ci-dessous.
          Abonnez-vous au champ <code class="text-xs bg-neutral-100 px-1 rounded">messages</code>.
        </p>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1.5">URL de callback</label>
          <div class="flex gap-2">
            <input
              :value="meta.webhook_url || form.webhook_url"
              type="text"
              readonly
              class="input-base text-sm w-full font-mono bg-neutral-50"
            />
            <button
              type="button"
              class="px-3 py-2 text-sm font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50 shrink-0"
              @click="copyText(meta.webhook_url || form.webhook_url)"
            >
              Copier
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1.5">Verify Token</label>
          <div class="flex gap-2">
            <input
              v-model="form.verify_token"
              type="text"
              class="input-base text-sm w-full font-mono"
              :disabled="loading || saving"
            />
            <button
              type="button"
              class="px-3 py-2 text-sm font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50 shrink-0"
              :disabled="loading || saving"
              @click="regenerateVerifyToken"
            >
              Générer
            </button>
            <button
              type="button"
              class="px-3 py-2 text-sm font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50 shrink-0"
              @click="copyText(form.verify_token)"
            >
              Copier
            </button>
          </div>
        </div>
      </section>

      <!-- Message & commandes -->
      <section class="rounded-xl border border-neutral-200 p-6 space-y-4">
        <h3 class="text-base font-semibold text-neutral-900">Message d’accueil & commandes</h3>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1.5">
            Message (AIDE / premier contact)
          </label>
          <textarea
            v-model="form.welcome_message"
            rows="5"
            class="input-base text-sm w-full"
            :disabled="loading || saving"
            placeholder="Bonjour ! Envoyez ENTREE pour pointer…"
          />
        </div>
        <div class="rounded-lg bg-neutral-50 border border-neutral-100 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
            Commandes employé
          </p>
          <ul class="space-y-1.5 text-sm text-neutral-700">
            <li v-for="(desc, cmd) in (meta.commands || {})" :key="cmd" class="flex gap-2">
              <span class="font-mono text-xs bg-white border border-neutral-200 rounded px-1.5 py-0.5 shrink-0">
                {{ cmd }}
              </span>
              <span class="text-neutral-600">{{ desc }}</span>
            </li>
            <li v-if="!meta.commands || !Object.keys(meta.commands).length" class="text-neutral-500">
              ENTREE · SORTIE · STATUT · AIDE
            </li>
          </ul>
          <p class="text-xs text-neutral-500 mt-3">
            Le numéro WhatsApp de l’employé doit correspondre au champ
            <strong>téléphone</strong> de sa fiche employé.
          </p>
        </div>
      </section>

      <!-- Checklist -->
      <section class="rounded-xl border border-dashed border-neutral-300 p-6 bg-neutral-50/50">
        <h3 class="text-sm font-semibold text-neutral-900 mb-3">Mise en service (checklist)</h3>
        <ol class="list-decimal list-inside space-y-1.5 text-sm text-neutral-600">
          <li>Créer une app Meta + produit WhatsApp Business</li>
          <li>Renseigner Phone Number ID + Access Token ici</li>
          <li>Configurer le webhook (URL + Verify Token) dans Meta</li>
          <li>Activer WhatsApp + pointage, puis enregistrer</li>
          <li>
            S’assurer que chaque employé a un téléphone correct (indicatif international si
            possible)
          </li>
          <li>Tester : envoyer « AIDE » puis « ENTREE » depuis un n° connu</li>
        </ol>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "../../../i18n/index.js";
import { useWhatsAppSettings } from "../composables/useWhatsAppSettings.js";

const { t } = useI18n();

const {
  form,
  meta,
  loading,
  saving,
  error,
  success,
  save,
  regenerateVerifyToken,
  copyText,
} = useWhatsAppSettings();
</script>
