<template>
  <div class="px-8 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Bulletin de salaire</h1>
        <p class="text-sm text-neutral-600">
          Consultez, imprimez ou téléchargez votre fiche de paie
        </p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="selectedMonth" class="input-base">
          <option v-for="m in months" :key="m.value" :value="m.value">
            {{ m.label }}
          </option>
        </select>
        <button @click="printSlip" class="btn-outline">Imprimer</button>
        <button @click="downloadPdf" class="btn-primary">Télécharger</button>
      </div>
    </div>

    <div ref="slipRef" class="card bg-white max-w-5xl mx-auto p-6">
      <header class="flex items-start justify-between mb-6">
        <div class="flex items-start gap-4">
          <div
            class="w-16 h-16 bg-primary-50 rounded flex items-center justify-center text-primary-600 font-bold text-xl"
          >
            BR
          </div>
          <div>
            <h2 class="text-lg font-semibold text-neutral-900">
              {{ company.name }}
            </h2>
            <p class="text-sm text-neutral-600">{{ company.address }}</p>
            <p class="text-sm text-neutral-600">SIRET: {{ company.siret }}</p>
          </div>
        </div>

        <div class="text-right">
          <p class="text-xs text-neutral-500">Bulletin N°</p>
          <p class="font-semibold text-neutral-900">{{ payslip.number }}</p>
          <p class="text-xs text-neutral-500 mt-2">Période de paie</p>
          <p class="font-medium">{{ periodLabel }}</p>
        </div>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="col-span-2">
          <h3 class="text-sm font-semibold text-neutral-700 mb-3">
            Informations employé
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-neutral-500">Nom</p>
              <p class="font-medium text-neutral-900">{{ employee.name }}</p>
            </div>
            <div>
              <p class="text-xs text-neutral-500">Matricule</p>
              <p class="font-medium text-neutral-900">{{ employee.id }}</p>
            </div>
            <div>
              <p class="text-xs text-neutral-500">Poste</p>
              <p class="font-medium text-neutral-900">
                {{ employee.position }}
              </p>
            </div>
            <div>
              <p class="text-xs text-neutral-500">Département</p>
              <p class="font-medium text-neutral-900">
                {{ employee.department }}
              </p>
            </div>
            <div>
              <p class="text-xs text-neutral-500">Date d'embauche</p>
              <p class="font-medium text-neutral-900">
                {{ employee.hireDate }}
              </p>
            </div>
            <div>
              <p class="text-xs text-neutral-500">Banque (IBAN)</p>
              <p class="font-medium text-neutral-900">{{ employee.iban }}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-neutral-700 mb-3">Cumuls</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-neutral-600">Salaire brut YTD</span>
              <span class="font-medium">{{
                formatCurrency(totals.ytdGross)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-600">Net payé YTD</span>
              <span class="font-medium">{{
                formatCurrency(totals.ytdNet)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-600">Congés restants</span>
              <span class="font-medium">{{ totals.leaveBalance }} jours</span>
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 class="text-sm font-semibold text-neutral-700 mb-3">Gains</h3>
          <table class="w-full text-sm">
            <tbody>
              <tr
                v-for="(item, idx) in earnings"
                :key="idx"
                class="border-b border-neutral-100"
              >
                <td class="py-3">{{ item.label }}</td>
                <td class="py-3 text-right font-medium">
                  {{ formatCurrency(item.amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-neutral-700 mb-3">
            Retenues & cotisations
          </h3>
          <table class="w-full text-sm">
            <tbody>
              <tr
                v-for="(item, idx) in deductions"
                :key="idx"
                class="border-b border-neutral-100"
              >
                <td class="py-3">{{ item.label }}</td>
                <td class="py-3 text-right font-medium">
                  -{{ formatCurrency(item.amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section
        class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-neutral-200"
      >
        <div class="space-y-1">
          <p class="text-xs text-neutral-500">Mode de paiement</p>
          <p class="font-medium">Virement bancaire</p>
          <p class="text-xs text-neutral-500 mt-2">IBAN</p>
          <p class="font-medium">{{ employee.iban }}</p>
        </div>

        <div class="grid grid-cols-3 gap-4 text-center md:text-right">
          <div class="bg-neutral-50 p-4 rounded">
            <p class="text-xs text-neutral-600">Salaire brut</p>
            <p class="font-semibold text-neutral-900">
              {{ formatCurrency(grossPay) }}
            </p>
          </div>
          <div class="bg-neutral-50 p-4 rounded">
            <p class="text-xs text-neutral-600">Total retenues</p>
            <p class="font-semibold text-neutral-900">
              -{{ formatCurrency(totalDeductions) }}
            </p>
          </div>
          <div class="bg-primary-50 p-4 rounded">
            <p class="text-xs text-neutral-600">Net à payer</p>
            <p class="font-bold text-primary-600 text-lg">
              {{ formatCurrency(netPay) }}
            </p>
          </div>
        </div>
      </section>

      <footer class="mt-6 text-xs text-neutral-500 flex justify-between">
        <div>
          <p>Service Paie • {{ company.name }}</p>
        </div>
        <div>
          <p>Généré : {{ nowFormatted }}</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const slipRef = ref(null);

// Mock data - enrichie
const company = {
  name: "Bravo RH Ltd",
  address: "123 Rue de Exemple, 75000 Paris",
  siret: "123 456 789 00010",
};

const employee = {
  id: "EMP-00123",
  name: "Alice Dupont",
  position: "Software Engineer",
  department: "Engineering",
  hireDate: "2020-05-15",
  iban: "FR76 3000 6000 0112 3456 7890 189",
};

const payslip = {
  number: "2025-12-0001",
};

const months = [
  { value: "2025-12", label: "Décembre 2025" },
  { value: "2025-11", label: "Novembre 2025" },
  { value: "2025-10", label: "Octobre 2025" },
];
const selectedMonth = ref(months[0].value);

const earnings = ref([
  { label: "Salaire de base", amount: 4500.0 },
  { label: "Primes", amount: 350.0 },
  { label: "Heures supplémentaires", amount: 150.0 },
]);

const deductions = ref([
  { label: "Sécurité sociale", amount: 500.0 },
  { label: "Retraite", amount: 200.0 },
  { label: "Impôt sur le revenu", amount: 450.0 },
  { label: "Autres cotisations", amount: 50.0 },
]);

const grossPay = computed(() =>
  earnings.value.reduce((s, i) => s + i.amount, 0)
);
const totalDeductions = computed(() =>
  deductions.value.reduce((s, i) => s + i.amount, 0)
);
const netPay = computed(() => grossPay.value - totalDeductions.value);

const totals = {
  ytdGross: 54000.0,
  ytdNet: 38000.0,
  leaveBalance: 12,
};

const nowFormatted = new Date().toLocaleString();

const formatCurrency = (val) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(val);
};

const periodLabel = computed(() => {
  const found = months.find((m) => m.value === selectedMonth.value);
  return found ? found.label : selectedMonth.value;
});

function printSlip() {
  const printContents = slipRef.value.innerHTML;
  const newWin = window.open("", "", "width=900,height=900");
  newWin.document.write("<html><head><title>Bulletin de salaire</title>");
  newWin.document.write('<link rel="stylesheet" href="/assets/tailwind.css">');
  newWin.document.write("</head><body>");
  newWin.document.write(printContents);
  newWin.document.write("</body></html>");
  newWin.document.close();
  newWin.focus();
  newWin.print();
  newWin.close();
}

function downloadPdf() {
  // Placeholder: user can choose "Save as PDF" in print dialog.
  printSlip();
}

onMounted(() => {
  // In a real app, fetch payslip data from API using selectedMonth
});
</script>

<style scoped>
/* Minimal print styling */
@media print {
  body {
    -webkit-print-color-adjust: exact;
  }
}
</style>
