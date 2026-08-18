<template>
  <Modal
    :model-value="open"
    :title="modalTitle"
    size="lg"
    hide-footer
    @update:model-value="$emit('update:open', $event)"
  >
    <form v-if="open" class="space-y-5" @submit.prevent="submit">
      <div v-if="isCreate" class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">
            Nom du plan <span class="text-red-500">*</span>
          </label>
          <input v-model="form.name" type="text" class="input-base w-full text-sm" placeholder="Ex. Business" />
          <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Code technique</label>
          <input v-model="form.code" type="text" class="input-base w-full font-mono text-sm" placeholder="business" />
          <p class="mt-1 text-xs text-neutral-500">Généré automatiquement si vide</p>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-neutral-800">Accroche</label>
          <input v-model="form.tagline" type="text" class="input-base w-full text-sm" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Prix mensuel ({{ currency }})</label>
          <input v-model.number="form.price_monthly" type="number" min="0" step="1" class="input-base w-full text-sm" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Stockage (Go)</label>
          <input
            v-model="storageInput"
            type="number"
            min="0"
            class="input-base w-full text-sm"
            placeholder="Illimité"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Utilisateurs max</label>
          <input
            v-model="usersInput"
            type="number"
            min="1"
            class="input-base w-full text-sm"
            placeholder="Illimité"
          />
          <p class="mt-1 text-xs text-neutral-500">Comptes admin / managers connectés</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-neutral-800">Employés max</label>
          <input
            v-model="employeesInput"
            type="number"
            min="1"
            class="input-base w-full text-sm"
            placeholder="Illimité"
          />
          <p class="mt-1 text-xs text-neutral-500">Fiches salariés dans le tenant</p>
        </div>
      </div>

      <div class="space-y-3 rounded-lg border border-neutral-100 bg-neutral-50/50 px-4 py-3">
        <SwitchField v-model="form.is_active" label="Plan actif" hint="Proposé aux nouvelles souscriptions" />
        <SwitchField v-model="form.is_highlighted" label="Mettre en avant" hint="Badge « Le plus populaire » sur la grille" />
      </div>

      <div>
        <h3 class="mb-3 text-sm font-semibold text-neutral-800">Services inclus</h3>
        <div class="space-y-4">
          <div v-for="(services, category) in groupedServices" :key="category">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {{ categoryLabel(category) }}
            </p>
            <div class="grid gap-2 sm:grid-cols-2">
              <label
                v-for="service in services"
                :key="service.id"
                class="flex cursor-pointer items-start gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 hover:border-primary-200"
              >
                <input
                  type="checkbox"
                  class="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600"
                  :checked="selectedServices.includes(service.id)"
                  @change="toggleService(service.id, $event.target.checked)"
                />
                <span class="min-w-0">
                  <span class="block text-sm font-medium text-neutral-800">{{ service.label }}</span>
                  <span class="block text-xs text-neutral-500">{{ service.description }}</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex gap-3 border-t border-neutral-200 px-6 py-4 justify-end">
        <button type="button" class="btn-outline" :disabled="disabled" @click="$emit('update:open', false)">
          Annuler
        </button>
        <button type="button" class="btn-primary" :disabled="disabled" @click="submit">
          {{ isCreate ? "Créer le plan" : "Enregistrer" }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import Modal from "../../../../components/common/Modal.vue";
import SwitchField from "../../../../components/common/SwitchField.vue";
import {
  SUBSCRIPTION_SERVICES,
  SERVICE_CATEGORY_LABELS,
  groupServicesByCategory,
} from "../../../../data/subscription/index.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  plan: { type: Object, default: null },
  services: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "save"]);

const isCreate = computed(() => !props.plan?.id);
const currency = computed(() => props.plan?.currency ?? "EUR");
const modalTitle = computed(() =>
  isCreate.value ? "Nouveau plan d'abonnement" : `Configurer — ${props.plan.name}`
);

const serviceList = computed(() =>
  props.services.length ? props.services : SUBSCRIPTION_SERVICES
);

const groupedServices = computed(() => groupServicesByCategory(serviceList.value));
const selectedServices = ref([]);
const errors = ref({});

const form = reactive({
  name: "",
  code: "",
  tagline: "",
  price_monthly: 0,
  is_active: true,
  is_highlighted: false,
});

const usersInput = ref("5");
const employeesInput = ref("25");
const storageInput = ref("5");

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    errors.value = {};
    if (props.plan) {
      form.name = props.plan.name ?? "";
      form.code = props.plan.code ?? "";
      form.tagline = props.plan.tagline ?? "";
      form.price_monthly = props.plan.price_monthly ?? 0;
      form.is_active = props.plan.is_active ?? true;
      form.is_highlighted = props.plan.is_highlighted ?? false;
      selectedServices.value = [...(props.plan.included_services ?? [])];
      usersInput.value = props.plan.max_users != null ? String(props.plan.max_users) : "";
      employeesInput.value = props.plan.max_employees != null ? String(props.plan.max_employees) : "";
      storageInput.value = props.plan.storage_gb != null ? String(props.plan.storage_gb) : "";
    } else {
      form.name = "";
      form.code = "";
      form.tagline = "";
      form.price_monthly = 0;
      form.is_active = true;
      form.is_highlighted = false;
      selectedServices.value = ["employees", "attendance", "self_service"];
      usersInput.value = "5";
      employeesInput.value = "25";
      storageInput.value = "5";
    }
  }
);

function categoryLabel(cat) {
  return SERVICE_CATEGORY_LABELS[cat] ?? cat;
}

function parseLimit(input) {
  const trimmed = String(input).trim();
  return trimmed === "" ? null : Number(trimmed);
}

function toggleService(id, checked) {
  if (checked) {
    if (!selectedServices.value.includes(id)) {
      selectedServices.value = [...selectedServices.value, id];
    }
  } else {
    selectedServices.value = selectedServices.value.filter((s) => s !== id);
  }
}

function validate() {
  const e = {};
  if (isCreate.value && !form.name?.trim()) e.name = "Le nom du plan est requis.";
  errors.value = e;
  return Object.keys(e).length === 0;
}

function submit() {
  if (!validate()) return;
  const payload = {
    tagline: form.tagline.trim(),
    price_monthly: form.price_monthly,
    max_users: parseLimit(usersInput.value),
    max_employees: parseLimit(employeesInput.value),
    storage_gb: parseLimit(storageInput.value),
    is_active: form.is_active,
    is_highlighted: form.is_highlighted,
    included_services: [...selectedServices.value],
  };
  if (isCreate.value) {
    payload.name = form.name.trim();
    payload.code = form.code.trim();
    payload.currency = "EUR";
  }
  emit("save", payload);
  emit("update:open", false);
}
</script>
