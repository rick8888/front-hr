<template>
  <Modal
    :model-value="open"
    :title="isEdit ? 'Modifier l\'administrateur' : 'Ajouter un administrateur'"
    size="md"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <p class="text-sm text-neutral-600">
        <template v-if="isEdit">
          Mettez à jour le compte administrateur RH. Laissez le mot de passe vide pour le conserver.
        </template>
        <template v-else>
          Créez un compte administrateur RH pour votre entreprise. Il pourra accéder à l'application de gestion des employés.
        </template>
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
          Mot de passe
          <span v-if="!isEdit" class="text-red-500">*</span>
          <span v-else class="font-normal text-neutral-500">(optionnel)</span>
        </label>
        <input
          v-model="form.password"
          type="password"
          class="input-base w-full"
          autocomplete="new-password"
          :placeholder="isEdit ? 'Laisser vide pour ne pas changer' : 'Minimum 8 caractères'"
        />
        <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-neutral-800">
          Confirmation
          <span v-if="!isEdit || form.password" class="text-red-500">*</span>
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
          <template v-if="isEdit">
            {{ saving ? "Enregistrement…" : "Enregistrer" }}
          </template>
          <template v-else>
            {{ saving ? "Création…" : "Créer l'administrateur" }}
          </template>
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import Modal from "../common/Modal.vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  user: { type: Object, default: null },
  serverErrors: { type: Object, default: () => ({}) },
  serverMessage: { type: String, default: "" },
});

const emit = defineEmits(["update:open", "submit"]);

const isEdit = computed(() => !!props.user?.id);

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
    Object.keys(errors).forEach((k) => delete errors[k]);
    apiError.value = "";

    if (props.user) {
      Object.assign(form, {
        name: props.user.name ?? "",
        email: props.user.email ?? "",
        password: "",
        password_confirmation: "",
      });
    } else {
      Object.assign(form, emptyForm());
    }
  }
);

watch(
  () => [props.serverErrors, props.serverMessage],
  () => {
    apiError.value = props.serverMessage || "";
    Object.keys(errors).forEach((k) => delete errors[k]);
    const mapped = {};
    for (const [key, value] of Object.entries(props.serverErrors || {})) {
      mapped[key] = Array.isArray(value) ? value[0] : value;
    }
    Object.assign(errors, mapped);
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

  if (!isEdit.value) {
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
  } else if (form.password || form.password_confirmation) {
    if (form.password.length < 8) {
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
  }

  return valid;
}

function close() {
  emit("update:open", false);
}

function submit() {
  if (!validate()) return;

  const payload = {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
  };

  if (form.password) {
    payload.password = form.password;
    payload.password_confirmation = form.password_confirmation;
  }

  emit("submit", payload);
}
</script>
