<template>
  <Modal
    :model-value="open"
    title="Ajouter un administrateur"
    size="md"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <p class="text-sm text-neutral-600">
        Créez un compte administrateur RH pour votre entreprise. Il pourra accéder à l'application de gestion des employés.
      </p>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Nom complet <span class="text-red-500">*</span>
        </label>
        <input v-model="form.name" type="text" class="input-base w-full" placeholder="ex: Marie Dupont" />
        <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Email <span class="text-red-500">*</span>
        </label>
        <input v-model="form.email" type="email" class="input-base w-full" placeholder="admin@entreprise.com" />
        <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Mot de passe <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.password"
          type="password"
          class="input-base w-full"
          autocomplete="new-password"
          placeholder="Minimum 8 caractères"
        />
        <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Confirmation <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.password_confirmation"
          type="password"
          class="input-base w-full"
          autocomplete="new-password"
          placeholder="Répétez le mot de passe"
        />
        <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-600">
          {{ errors.password_confirmation }}
        </p>
      </div>

      <div
        v-if="apiError"
        class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ apiError }}
      </div>

      <div class="flex justify-end gap-3 border-t border-neutral-100 pt-4">
        <button type="button" class="btn-outline" @click="close">Annuler</button>
        <button type="submit" class="btn-primary" :disabled="saving">
          {{ saving ? "Création…" : "Créer l'administrateur" }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import Modal from "../common/Modal.vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  serverErrors: { type: Object, default: () => ({}) },
  serverMessage: { type: String, default: "" },
});

const emit = defineEmits(["update:open", "submit"]);

const emptyForm = () => ({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const form = reactive(emptyForm());
const errors = reactive({});
const apiError = ref("");

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    Object.assign(form, emptyForm());
    Object.keys(errors).forEach((k) => delete errors[k]);
    apiError.value = "";
  }
);

watch(
  () => [props.serverErrors, props.serverMessage],
  () => {
    apiError.value = props.serverMessage || "";
    Object.keys(errors).forEach((k) => delete errors[k]);
    Object.assign(errors, props.serverErrors);
  },
  { deep: true }
);

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k]);
  apiError.value = "";
  let valid = true;

  if (!form.name.trim()) {
    errors.name = "Le nom est obligatoire.";
    valid = false;
  }
  if (!form.email.trim()) {
    errors.email = "L'email est obligatoire.";
    valid = false;
  }
  if (!form.password) {
    errors.password = "Le mot de passe est obligatoire.";
    valid = false;
  } else if (form.password.length < 8) {
    errors.password = "Minimum 8 caractères.";
    valid = false;
  }
  if (!form.password_confirmation) {
    errors.password_confirmation = "La confirmation est obligatoire.";
    valid = false;
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = "Les mots de passe ne correspondent pas.";
    valid = false;
  }

  return valid;
}

function close() {
  emit("update:open", false);
}

function submit() {
  if (!validate()) return;
  emit("submit", {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    password_confirmation: form.password_confirmation,
  });
}
</script>
