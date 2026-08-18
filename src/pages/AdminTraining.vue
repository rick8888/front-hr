
<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-neutral-900 mb-2">Gestion des Formations</h1>
      <p class="text-sm text-neutral-600">
        Gérez les formations proposées, ajoutez/modifiez/supprimez des sessions, inscrivez des employés.
      </p>
    </div>
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <!-- Liste des formations -->
      <div class="mb-4">
        <button class="bg-primary-500 text-white px-4 py-2 rounded" @click="showAddModal = true">Ajouter une formation</button>
      </div>
      <table class="min-w-full text-sm">
        <thead>
          <tr>
            <th class="text-left py-2">Nom</th>
            <th class="text-left py-2">Date</th>
            <th class="text-left py-2">Participants</th>
            <th class="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="formation in formations" :key="formation.id">
            <td>{{ formation.nom }}</td>
            <td>{{ formation.date }}</td>
            <td>{{ formation.participants.length }}</td>
            <td>
              <button class="text-blue-600 mr-2" @click="editFormation(formation)">Modifier</button>
              <button class="text-red-600" @click="deleteFormation(formation.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Modal ajout/modification -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded shadow-xl w-96">
          <h2 class="text-lg font-bold mb-4">Ajouter une formation</h2>
          <input v-model="newFormation.nom" placeholder="Nom" class="border p-2 w-full mb-2" />
          <input v-model="newFormation.date" type="date" class="border p-2 w-full mb-2" />
          <button class="bg-primary-500 text-white px-4 py-2 rounded mr-2" @click="addFormation">Ajouter</button>
          <button class="bg-neutral-300 px-4 py-2 rounded" @click="showAddModal = false">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminTraining",
  data() {
    return {
      formations: [
        { id: 1, nom: "Excel avancé", date: "2026-03-10", participants: ["Alice", "Bob"] },
        { id: 2, nom: "Gestion du temps", date: "2026-04-05", participants: ["Charlie"] },
      ],
      showAddModal: false,
      newFormation: { nom: "", date: "", participants: [] },
    };
  },
  methods: {
    addFormation() {
      if (!this.newFormation.nom || !this.newFormation.date) return;
      this.formations.push({
        id: Date.now(),
        nom: this.newFormation.nom,
        date: this.newFormation.date,
        participants: [],
      });
      this.newFormation = { nom: "", date: "", participants: [] };
      this.showAddModal = false;
    },
    editFormation(formation) {
      // Logique de modification à ajouter
      alert("Modification non implémentée");
    },
    deleteFormation(id) {
      this.formations = this.formations.filter(f => f.id !== id);
    },
  },
};
</script>

<style scoped>
/* Ajoutez vos styles spécifiques ici */
</style>
