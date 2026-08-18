<template>
  <section class="rounded-xl border border-neutral-200 bg-white shadow-xs">
    <header class="border-b border-neutral-100 px-5 py-4 flex justify-between items-center">
      <div>
        <h2 class="text-base font-semibold text-neutral-800">Catégories</h2>
        <p class="text-xs text-neutral-500">Classification des règles</p>
      </div>
      <button type="button" class="btn-outline text-sm px-3 py-2" :disabled="disabled" @click="showAdd = !showAdd">+ Ajouter</button>
    </header>
    <div v-if="showAdd" class="border-b border-neutral-100 bg-blue-50/30 px-5 py-4 flex gap-3">
      <input v-model="newLabel" class="input-base flex-1 text-sm" placeholder="Nom de la catégorie" @keydown.enter="submitAdd" />
      <button type="button" class="btn-primary text-sm px-3 py-2" @click="submitAdd">OK</button>
    </div>
    <ul class="divide-y divide-neutral-100">
      <li v-for="cat in categories" :key="cat.id" class="flex items-center justify-between px-5 py-3">
        <div>
          <p class="text-sm font-medium">{{ editingId === cat.id ? '' : cat.label }}</p>
          <input v-if="editingId === cat.id" v-model="editLabel" class="input-base text-sm mt-1" @keydown.enter="submitRename(cat)" />
          <p v-else class="text-xs text-neutral-400">{{ cat.id }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs px-2 py-0.5 rounded-md" :class="cat.is_active ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'">
            {{ cat.is_active ? "Actif" : "Désactivé" }}
          </span>
          <button v-if="editingId === cat.id" type="button" class="text-xs text-primary-600" @click="submitRename(cat)">OK</button>
          <button v-else-if="cat.is_active" type="button" class="text-xs text-neutral-600" :disabled="disabled" @click="startRename(cat)">Renommer</button>
          <button v-if="cat.is_active && editingId !== cat.id" type="button" class="text-xs text-orange-600" :disabled="disabled" @click="emit('disable', cat.id)">Désactiver</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from "vue";

defineProps({ categories: { type: Array, default: () => [] }, disabled: { type: Boolean, default: false } });
const emit = defineEmits(["add", "rename", "disable"]);

const showAdd = ref(false);
const newLabel = ref("");
const editingId = ref(null);
const editLabel = ref("");

function slugify(label) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
function submitAdd() {
  if (!newLabel.value.trim()) return;
  emit("add", { label: newLabel.value.trim(), id: slugify(newLabel.value) });
  newLabel.value = "";
  showAdd.value = false;
}
function startRename(cat) {
  editingId.value = cat.id;
  editLabel.value = cat.label;
}
function submitRename(cat) {
  if (!editLabel.value.trim()) return;
  emit("rename", cat.id, { label: editLabel.value.trim() });
  editingId.value = null;
}
</script>
