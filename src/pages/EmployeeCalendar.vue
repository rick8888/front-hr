<template>
  <div class="calendar-page px-4 py-4 sm:px-8 sm:py-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900 tracking-tight mb-1">Presences & absences</h1>
        <p class="text-sm text-neutral-500">
          Visualisez vos absences et présences, déposez vos demandes d'absence
        </p>
      </div>
      <button
        type="button"
        @click="openRequestModalFromButton"
        class="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Déposer une demande
      </button>
    </div>

    <!-- Toolbar : navigation + légende -->
    <div class="calendar-toolbar flex flex-wrap items-center justify-between gap-6 mb-6">
      <div class="flex items-center gap-3 flex-wrap">
        <button
          @click="goToToday"
          type="button"
          class="calendar-nav-btn px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition-colors shrink-0"
        >
          Aujourd'hui
        </button>
        <div class="calendar-nav-group flex items-center rounded-lg border border-neutral-200 bg-white shrink-0 overflow-hidden">
          <button
            @click="prevMonth"
            type="button"
            class="calendar-nav-arrow p-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shrink-0"
            aria-label="Mois précédent"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="calendar-month-title min-w-[12rem] w-[12rem] text-center py-2.5 text-base font-semibold text-neutral-900 shrink-0">
            {{ monthTitle }}
          </span>
          <button
            @click="nextMonth"
            type="button"
            class="calendar-nav-arrow p-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shrink-0"
            aria-label="Mois suivant"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div class="calendar-nav-year-divider h-6 w-px bg-neutral-200 shrink-0" aria-hidden="true"></div>
          <select
            v-model.number="selectedYear"
            class="calendar-year-select h-[42px] min-h-[42px] w-[5.5rem] pl-3 pr-8 py-0 text-sm font-medium text-neutral-800 bg-transparent border-0 cursor-pointer appearance-none focus:outline-none focus:ring-0"
            aria-label="Filtrer par année"
          >
            <option v-for="yr in yearOptions" :key="yr" :value="yr">{{ yr }}</option>
          </select>
        </div>
      </div>
      <div class="calendar-legend flex flex-wrap items-center gap-3 text-xs">
        <button
          v-for="item in legendFilters"
          :key="item.key"
          type="button"
          :class="[
            'legend-item legend-filter-btn rounded-lg px-2.5 py-1.5 transition-colors',
            activeLegendFilters.has(item.key) && 'legend-filter-btn-active',
          ]"
          :title="activeLegendFilters.size ? 'Cliquer pour ' + (activeLegendFilters.has(item.key) ? 'désactiver le filtre' : 'activer le filtre') : 'Cliquer pour filtrer le calendrier'"
          @click="toggleLegendFilter(item.key)"
        >
          <span class="legend-dot" :class="item.dotClass"></span>
          {{ item.label }}
        </button>
      </div>
    </div>

    <!-- Calendrier -->
    <div class="calendar-wrapper bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <!-- En-tête des jours de la semaine -->
      <div class="calendar-weekdays grid grid-cols-7 border-b border-neutral-200">
        <div
          v-for="day in weekDays"
          :key="day"
          class="calendar-weekday py-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider"
        >
          {{ day }}
        </div>
      </div>
      <!-- Grille des jours -->
      <div class="calendar-grid grid grid-cols-7">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'calendar-day min-h-[120px] p-2 flex flex-col border-b border-neutral-100',
            index % 7 !== 6 && 'border-r',
            !isCurrentMonth(day) && 'calendar-day-other',
            isWeekend(day) && isCurrentMonth(day) && 'calendar-day-weekend',
            isToday(day) && 'calendar-day-today',
            isCurrentMonth(day) && !isPast(day) && 'calendar-day-clickable',
          ]"
          @click="onDayClick(day)"
        >
          <div
            :class="[
              'calendar-day-num w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium flex-shrink-0',
              isToday(day) ? 'calendar-day-num-today' : isCurrentMonth(day) ? 'text-neutral-700' : 'text-neutral-400',
            ]"
          >
            {{ format(day, 'd') }}
          </div>
          <div v-if="isCurrentMonth(day)" class="calendar-day-events flex flex-col gap-1 flex-1 min-h-0 mt-1 overflow-auto">
            <div
              v-for="ev in getEventsForDay(day)"
              :key="ev.id"
              :class="[
                'calendar-event flex items-center gap-1 text-xs px-2 py-1 rounded-md min-w-0',
                getEventClass(ev),
                ev.requestId && 'calendar-event-absence',
              ]"
              :title="getEventTooltip(ev)"
            >
              <div class="calendar-event-content flex-1 min-w-0 flex flex-col">
                <span class="calendar-event-label truncate">{{ ev.label }}</span>
                <span v-if="ev.dateDebut && ev.dateFin" class="calendar-event-dates text-[10px] opacity-90 mt-0.5">
                  Du {{ ev.dateDebut }} au {{ ev.dateFin }}
                </span>
                <span v-else-if="ev.delayLabel" class="calendar-event-dates text-[10px] opacity-90 mt-0.5">
                  Retard : {{ ev.delayLabel }}
                </span>
                <span v-else-if="ev.hoursLabel && ev.kind === 'overtime'" class="calendar-event-dates text-[10px] opacity-90 mt-0.5">
                  {{ ev.hoursLabel }}
                </span>
              </div>
              <template v-if="ev.requestId">
                <button
                  v-if="ev.status === 'Pending' || ev.status === 'Rejected'"
                  type="button"
                  class="calendar-event-btn flex-shrink-0 p-0.5 rounded hover:bg-black/10 transition-colors"
                  title="Modifier"
                  @click.stop="openEditModal(ev.requestId)"
                >
                  <svg class="w-3.5 h-3.5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  v-if="ev.status !== 'Approved'"
                  type="button"
                  class="calendar-event-btn calendar-event-btn-delete flex-shrink-0 p-0.5 rounded hover:bg-red-100 transition-colors"
                  title="Supprimer"
                  @click.stop="openDeleteModal(ev.requestId)"
                >
                  <svg class="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Déposer / Modifier une demande d'absence -->
    <Modal
      v-model="isRequestModalOpen"
      :title="editingRequestId ? 'Modifier la demande' : 'Déposer une demande d\'absence'"
      size="md"
      @confirm="submitAbsenceRequest"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1">Type d'absence *</label>
          <select v-model="requestForm.type" class="input-base w-full" required>
            <option value="">Choisir...</option>
            <option v-for="opt in leaveTypes" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Date de début *</label>
            <input v-model="requestForm.startDate" type="date" class="input-base w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">Date de fin *</label>
            <input v-model="requestForm.endDate" type="date" class="input-base w-full" required />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1">Motif (optionnel)</label>
          <textarea
            v-model="requestForm.reason"
            class="input-base w-full resize-none"
            rows="3"
            placeholder="Précisez si besoin..."
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1">Pièces jointes (optionnel)</label>
          <input
            ref="requestFileInputRef"
            type="file"
            multiple
            class="input-base w-full text-sm text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-100 file:text-neutral-700 file:font-medium file:cursor-pointer hover:file:bg-neutral-200"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            @change="onRequestFilesChange"
          />
          <p class="mt-1 text-xs text-neutral-500">Formats acceptés : PDF, Word, images (JPG, PNG). Taille max. recommandée : 5 Mo.</p>
          <ul v-if="requestAttachedFiles.length" class="mt-2 space-y-1.5">
            <li
              v-for="(file, index) in requestAttachedFiles"
              :key="index"
              class="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
            >
              <span class="truncate flex-1 min-w-0" :title="file.name">{{ file.name }}</span>
              <span class="text-xs text-neutral-500 shrink-0">{{ formatFileSize(file.size) }}</span>
              <button
                type="button"
                class="shrink-0 p-1 rounded text-neutral-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                title="Retirer"
                @click="removeAttachedFile(index)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
        <!-- Solde (info) quand un type d'absence est sélectionné -->
        <div
          v-if="requestForm.type && requestBalanceLabel"
          class="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800"
          role="alert"
        >
          {{ requestBalanceLabel }}
        </div>
        <!-- Jours qui seront déduits quand dates début/fin sont définies (pour types avec solde) -->
        <div
          v-if="requestForm.startDate && requestForm.endDate && deductedWorkingDays !== null && hasBalanceForSelectedType"
          class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="alert"
        >
          <strong>{{ deductedWorkingDays }}</strong> jour(s) ouvrable(s) seront déduits du solde.
        </div>
        <p v-if="requestError" class="text-sm text-red-600">{{ requestError }}</p>
      </div>
    </Modal>

    <!-- Modal : Confirmer la suppression -->
    <Modal
      v-model="isDeleteModalOpen"
      title="Supprimer la demande"
      @confirm="confirmDeleteRequest"
    >
      <p class="text-neutral-600 text-sm">
        Êtes-vous sûr de vouloir supprimer cette demande d'absence ?
        <span v-if="requestToDelete" class="block mt-2 font-medium text-neutral-900">
          {{ getRequestSummary(requestToDelete) }}
        </span>
      </p>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Modal from "../components/common/Modal.vue";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday as isTodayFns,
  parseISO,
  isWithinInterval,
  isBefore,
  startOfDay,
  eachDayOfInterval,
} from "date-fns";
import { fr } from "date-fns/locale";
import { LEAVE_TYPES } from "../config/constants.js";

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Heures sup : jour, nuit, week-end, jour férié
const OVERTIME_TYPES = [
  { value: "jour", label: "HS Jour" },
  { value: "nuit", label: "HS Nuit" },
  { value: "weekend", label: "HS Week-end" },
  { value: "jour_ferie", label: "HS Jour férié" },
];

const currentMonth = ref(new Date());

// Filtre par année : liste d'années proposées (année courante ± 5)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

const selectedYear = computed({
  get: () => currentMonth.value.getFullYear(),
  set: (year) => {
    const d = currentMonth.value;
    currentMonth.value = new Date(year, d.getMonth(), 1);
  },
});

const monthTitle = computed(() => {
  return format(currentMonth.value, "MMMM yyyy", { locale: fr });
});

const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentMonth.value), { weekStartsOn: 1 });
  const days = [];
  let d = start;
  while (d <= end) {
    days.push(d);
    d = addDays(d, 1);
  }
  return days;
});

function prevMonth() {
  currentMonth.value = subMonths(currentMonth.value, 1);
}
function nextMonth() {
  currentMonth.value = addMonths(currentMonth.value, 1);
}

function isCurrentMonth(day) {
  return isSameMonth(day, currentMonth.value);
}
function isToday(day) {
  return isTodayFns(day);
}
function isPast(day) {
  return isBefore(startOfDay(day), startOfDay(new Date()));
}
function isWeekend(day) {
  const d = day.getDay();
  return d === 0 || d === 6;
}
function goToToday() {
  currentMonth.value = new Date();
}

// Événements : absences (avec status) + présences
const leaveTypes = computed(() =>
  LEAVE_TYPES.map((t) => ({ value: t.value, label: t.label }))
);

// Année courante pour la démo (données toujours visibles)
const demoYear = new Date().getFullYear();
const y = String(demoYear);

// Données mock : absences pour la démo (année courante)
const absenceRequests = ref([
  { id: "ar1", type: "annual", startDate: `${y}-01-02`, endDate: `${y}-01-03`, status: "Approved", statusLabel: "Approuvée", reason: "Récup" },
  { id: "ar2", type: "annual", startDate: `${y}-02-10`, endDate: `${y}-02-14`, status: "Approved", statusLabel: "Approuvée", reason: "Congés" },
  { id: "ar3", type: "sick", startDate: `${y}-02-20`, endDate: `${y}-02-21`, status: "Pending", statusLabel: "En attente", reason: "" },
  { id: "ar4", type: "annual", startDate: `${y}-01-27`, endDate: `${y}-01-28`, status: "Rejected", statusLabel: "Refusée", reason: "", rejectionReason: "Période de congés déjà saturée pour cette date." },
  { id: "ar5", type: "unpaid", startDate: `${y}-02-03`, endDate: `${y}-02-03`, status: "Pending", statusLabel: "En attente", reason: "Démarches" },
  { id: "ar6", type: "annual", startDate: `${y}-03-17`, endDate: `${y}-03-21`, status: "Approved", statusLabel: "Approuvée", reason: "" },
  { id: "ar7", type: "study", startDate: `${y}-03-10`, endDate: `${y}-03-10`, status: "Pending", statusLabel: "En attente", reason: "Examen" },
  { id: "ar8", type: "annual", startDate: `${y}-04-07`, endDate: `${y}-04-11`, status: "Approved", statusLabel: "Approuvée", reason: "" },
  { id: "ar9", type: "sick", startDate: `${y}-01-15`, endDate: `${y}-01-16`, status: "Approved", statusLabel: "Approuvée", reason: "" },
  { id: "ar10", type: "annual", startDate: `${y}-02-24`, endDate: `${y}-02-25`, status: "Approved", statusLabel: "Approuvée", reason: "Pont" },
  { id: "ar11", type: "unpaid", startDate: `${y}-03-03`, endDate: `${y}-03-03`, status: "Rejected", statusLabel: "Refusée", reason: "", rejectionReason: "Absence non justifiée." },
  { id: "ar12", type: "paternity", startDate: `${y}-04-21`, endDate: `${y}-04-25`, status: "Pending", statusLabel: "En attente", reason: "" },
  { id: "ar13", type: "sick", startDate: `${y}-04-14`, endDate: `${y}-04-14`, status: "Approved", statusLabel: "Approuvée", reason: "" },
  { id: "ar14", type: "annual", startDate: `${y}-05-12`, endDate: `${y}-05-16`, status: "Pending", statusLabel: "En attente", reason: "Vacances" },
  { id: "ar15", type: "study", startDate: `${y}-05-26`, endDate: `${y}-05-27`, status: "Approved", statusLabel: "Approuvée", reason: "Formation" },
]);

// Présences : jours de travail (hors week-ends, hors absences approuvées)
function buildPresenceDays() {
  const days = [];
  const start = new Date(demoYear, 0, 1);
  const end = new Date(demoYear, 4, 31); // jusqu'à fin mai
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    const dayStr = format(d, "yyyy-MM-dd");
    const isOnLeave = absenceRequests.value.some((req) => {
      if (req.status !== "Approved") return false;
      const s = parseISO(req.startDate);
      const e = parseISO(req.endDate);
      return isWithinInterval(startOfDay(d), { start: s, end: e });
    });
    if (!isOnLeave) days.push(dayStr);
  }
  return days;
}
const presenceByDay = ref(buildPresenceDays());

// Jours avec retard + durée en minutes (mock) – année courante
const lateByDay = ref({
  [`${y}-01-08`]: 15,
  [`${y}-01-22`]: 45,
  [`${y}-02-05`]: 30,
  [`${y}-02-12`]: 90,
  [`${y}-02-26`]: 20,
  [`${y}-03-04`]: 60,
  [`${y}-03-18`]: 25,
  [`${y}-04-02`]: 45,
  [`${y}-04-15`]: 15,
});

function formatDelay(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m} min` : `${h}h`;
}

// Heures sup par jour (mock) – année courante
const overtimeByDay = ref([
  { date: `${y}-01-09`, type: "jour", hours: 2 },
  { date: `${y}-01-16`, type: "nuit", hours: 3 },
  { date: `${y}-01-18`, type: "weekend", hours: 4 },
  { date: `${y}-01-25`, type: "weekend", hours: 2 },
  { date: `${y}-02-06`, type: "jour", hours: 1.5 },
  { date: `${y}-02-14`, type: "nuit", hours: 2 },
  { date: `${y}-04-21`, type: "jour_ferie", hours: 5 },
  { date: `${y}-05-01`, type: "jour_ferie", hours: 4 },
]);

function formatOvertimeHours(hours) {
  return Number(hours) === Math.floor(hours) ? `${hours}h` : `${hours}h`;
}

// Filtres de la légende (badges cliquables)
const LEGEND_FILTERS = [
  { key: "present", label: "Présent", dotClass: "legend-present" },
  { key: "absence:Approved", label: "Congé approuvé", dotClass: "legend-approved" },
  { key: "absence:Pending", label: "En attente", dotClass: "legend-pending" },
  { key: "absence:Rejected", label: "Refusé", dotClass: "legend-rejected" },
  { key: "late", label: "Retard", dotClass: "legend-late" },
  { key: "overtime:jour", label: "HS Jour", dotClass: "legend-overtime-jour" },
  { key: "overtime:nuit", label: "HS Nuit", dotClass: "legend-overtime-nuit" },
  { key: "overtime:weekend", label: "HS Week-end", dotClass: "legend-overtime-weekend" },
  { key: "overtime:jour_ferie", label: "HS Jour férié", dotClass: "legend-overtime-ferie" },
];
const legendFilters = LEGEND_FILTERS;
const activeLegendFilters = ref(new Set());

function getEventFilterKey(ev) {
  if (ev.kind === "present") return "present";
  if (ev.kind === "late") return "late";
  if (ev.kind === "absence") return "absence:" + ev.status;
  if (ev.kind === "overtime") return "overtime:" + ev.overtimeType;
  return null;
}

function toggleLegendFilter(key) {
  const next = new Set(activeLegendFilters.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  activeLegendFilters.value = next;
}

function getEventsForDay(day) {
  const dayStr = format(day, "yyyy-MM-dd");
  const events = [];

  absenceRequests.value.forEach((req) => {
    const start = parseISO(req.startDate);
    const end = parseISO(req.endDate);
    const dayDate = startOfDay(day);
    if (isWithinInterval(dayDate, { start, end })) {
      const typeLabel = LEAVE_TYPES.find((t) => t.value === req.type)?.label || req.type;
      events.push({
        id: req.id + dayStr,
        label: typeLabel,
        status: req.status,
        statusLabel: req.statusLabel,
        kind: "absence",
        requestId: req.id,
        dateDebut: format(parseISO(req.startDate), "d MMM", { locale: fr }),
        dateFin: format(parseISO(req.endDate), "d MMM yyyy", { locale: fr }),
        ...(req.status === "Rejected" && req.rejectionReason && { rejectionReason: req.rejectionReason }),
      });
    }
  });

  if (presenceByDay.value.includes(dayStr)) {
    const delayMinutes = lateByDay.value[dayStr];
    const isLate = delayMinutes != null;
    events.push({
      id: "presence-" + dayStr,
      label: isLate ? "Présent (retard)" : "Présent",
      kind: isLate ? "late" : "present",
      ...(isLate && { delayMinutes, delayLabel: formatDelay(delayMinutes) }),
    });
  }

  overtimeByDay.value.forEach((ot) => {
    if (ot.date !== dayStr) return;
    const typeLabel = OVERTIME_TYPES.find((t) => t.value === ot.type)?.label || ot.type;
    events.push({
      id: "overtime-" + dayStr + "-" + ot.type,
      label: typeLabel,
      kind: "overtime",
      overtimeType: ot.type,
      hours: ot.hours,
      hoursLabel: formatOvertimeHours(ot.hours),
    });
  });

  if (activeLegendFilters.value.size > 0) {
    return events.filter((ev) => {
      const key = getEventFilterKey(ev);
      return key && activeLegendFilters.value.has(key);
    });
  }
  return events;
}

function getEventClass(ev) {
  if (ev.kind === "present") return "calendar-event-present";
  if (ev.kind === "late") return "calendar-event-late";
  if (ev.kind === "overtime") {
    if (ev.overtimeType === "jour") return "calendar-event-overtime-jour";
    if (ev.overtimeType === "nuit") return "calendar-event-overtime-nuit";
    if (ev.overtimeType === "weekend") return "calendar-event-overtime-weekend";
    if (ev.overtimeType === "jour_ferie") return "calendar-event-overtime-ferie";
  }
  if (ev.kind === "absence") {
    if (ev.status === "Approved") return "calendar-event-approved";
    if (ev.status === "Pending") return "calendar-event-pending";
    if (ev.status === "Rejected") return "calendar-event-rejected";
  }
  return "calendar-event-default";
}

function getEventTooltip(ev) {
  let t = ev.label;
  if (ev.status) t += " – " + ev.statusLabel;
  if (ev.dateDebut && ev.dateFin) t += " – Du " + ev.dateDebut + " au " + ev.dateFin;
  if (ev.delayLabel) t += " – Retard : " + ev.delayLabel;
  if (ev.hoursLabel && ev.kind === "overtime") t += " – " + ev.hoursLabel;
  if (ev.status === "Rejected" && ev.rejectionReason) t += " – Motif du refus : " + ev.rejectionReason;
  return t;
}

const selectedDate = ref(null);
const isRequestModalOpen = ref(false);
const editingRequestId = ref(null);
const requestError = ref("");
const requestForm = ref({
  type: "",
  startDate: "",
  endDate: "",
  reason: "",
});

const requestAttachedFiles = ref([]);
const requestFileInputRef = ref(null);

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
}

function onRequestFilesChange(event) {
  const input = event.target;
  if (!input.files?.length) return;
  const newFiles = Array.from(input.files);
  requestAttachedFiles.value = [...requestAttachedFiles.value, ...newFiles];
  input.value = "";
}

function removeAttachedFile(index) {
  requestAttachedFiles.value = requestAttachedFiles.value.filter((_, i) => i !== index);
}

// Solde (en jours) par type d'absence – mock. null = pas de solde déductible
const leaveBalanceByType = {
  annual: 18,
  study: 5,
  recovery: 3,
  sick: null,
  unpaid: null,
  maternity: null,
  paternity: null,
};

const requestBalanceLabel = computed(() => {
  const type = requestForm.value.type;
  if (!type) return "";
  const typeLabel = LEAVE_TYPES.find((t) => t.value === type)?.label || type;
  const balance = leaveBalanceByType[type];
  if (balance != null) {
    return `Solde ${typeLabel} : ${balance} jour(s) restant(s).`;
  }
  return `Type « ${typeLabel} » : ce type ne déduit pas de solde.`;
});

function countWorkingDays(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (end < start) return null;
  const days = eachDayOfInterval({ start, end });
  return days.filter((d) => {
    const dayOfWeek = d.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }).length;
}

const deductedWorkingDays = computed(() => {
  const { startDate, endDate } = requestForm.value;
  return countWorkingDays(startDate, endDate);
});

const hasBalanceForSelectedType = computed(() => {
  const type = requestForm.value.type;
  return type && leaveBalanceByType[type] != null;
});

function openRequestModal(day) {
  if (day && isPast(day)) return;
  editingRequestId.value = null;
  selectedDate.value = day;
  const d = day ? format(day, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
  requestForm.value = {
    type: "",
    startDate: d,
    endDate: d,
    reason: "",
  };
  requestAttachedFiles.value = [];
  if (requestFileInputRef.value) requestFileInputRef.value.value = "";
  requestError.value = "";
  isRequestModalOpen.value = true;
}

function openEditModal(requestId) {
  const req = absenceRequests.value.find((r) => r.id === requestId);
  if (!req) return;
  editingRequestId.value = requestId;
  requestForm.value = {
    type: req.type,
    startDate: req.startDate,
    endDate: req.endDate,
    reason: req.reason || "",
  };
  requestAttachedFiles.value = [];
  if (requestFileInputRef.value) requestFileInputRef.value.value = "";
  requestError.value = "";
  isRequestModalOpen.value = true;
}

function openRequestModalFromButton() {
  openRequestModal(new Date());
}

function onDayClick(day) {
  if (!isCurrentMonth(day) || isPast(day)) return;
  openRequestModal(day);
}

function submitAbsenceRequest() {
  requestError.value = "";
  const { type, startDate, endDate } = requestForm.value;
  if (!type || !startDate || !endDate) {
    requestError.value = "Veuillez remplir le type et les dates.";
    isRequestModalOpen.value = true;
    return;
  }
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (end < start) {
    requestError.value = "La date de fin doit être après la date de début.";
    isRequestModalOpen.value = true;
    return;
  }
  if (editingRequestId.value) {
    const index = absenceRequests.value.findIndex((r) => r.id === editingRequestId.value);
    if (index !== -1) {
      const existing = absenceRequests.value[index];
      absenceRequests.value[index] = {
        ...existing,
        type,
        startDate,
        endDate,
        reason: requestForm.value.reason || "",
        attachedFileNames: requestAttachedFiles.value.map((f) => f.name),
      };
    }
    editingRequestId.value = null;
  } else {
    absenceRequests.value.push({
      id: "ar-" + Date.now(),
      type,
      startDate,
      endDate,
      status: "Pending",
      statusLabel: "En attente",
      reason: requestForm.value.reason || "",
      attachedFileNames: requestAttachedFiles.value.map((f) => f.name),
    });
  }
  requestAttachedFiles.value = [];
  if (requestFileInputRef.value) requestFileInputRef.value.value = "";
  isRequestModalOpen.value = false;
  selectedDate.value = null;
}

watch(isRequestModalOpen, (open) => {
  if (!open) requestError.value = "";
});

// Suppression d'une demande
const isDeleteModalOpen = ref(false);
const requestToDelete = ref(null);

function openDeleteModal(requestId) {
  requestToDelete.value = absenceRequests.value.find((r) => r.id === requestId) || null;
  isDeleteModalOpen.value = true;
}

function confirmDeleteRequest() {
  if (!requestToDelete.value) return;
  absenceRequests.value = absenceRequests.value.filter((r) => r.id !== requestToDelete.value.id);
  requestToDelete.value = null;
  isDeleteModalOpen.value = false;
}

function getRequestSummary(req) {
  if (!req) return "";
  const typeLabel = LEAVE_TYPES.find((t) => t.value === req.type)?.label || req.type;
  return `${typeLabel} – du ${format(parseISO(req.startDate), "d MMM yyyy", { locale: fr })} au ${format(parseISO(req.endDate), "d MMM yyyy", { locale: fr })} (${req.statusLabel})`;
}
</script>

<style scoped>
.calendar-page {
  max-width: 1200px;
}

.calendar-toolbar {
  padding: 0.75rem 0;
}

.calendar-nav-group {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.calendar-month-title {
  text-transform: capitalize;
  white-space: nowrap;
}

.calendar-year-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23737373'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25rem;
}

.calendar-year-select:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.calendar-nav-year-divider {
  margin: 0 0.125rem 0 0;
}

.calendar-legend {
  padding: 0.5rem 0.75rem;
  background: #fafafa;
  border-radius: 0.5rem;
  border: 1px solid #e5e5e5;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: #525252;
  font-weight: 500;
}

.legend-filter-btn {
  border: 1px solid transparent;
  cursor: pointer;
  background: transparent;
}

.legend-filter-btn:hover {
  background: rgba(0, 0, 0, 0.04);
}

.legend-filter-btn-active {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.4);
  color: #1d4ed8;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-present { background: #22c55e; }
.legend-approved { background: #16a34a; }
.legend-pending { background: #eab308; }
.legend-rejected { background: #dc2626; }
.legend-late { background: #ea580c; }
.legend-overtime-jour { background: #3b82f6; }
.legend-overtime-nuit { background: #1e3a5f; }
.legend-overtime-weekend { background: #8b5cf6; }
.legend-overtime-ferie { background: #c026d3; }

.calendar-wrapper {
  border-radius: 12px;
  overflow: hidden;
}

.calendar-weekdays {
  background: #fafafa;
  border-bottom: 1px solid #e5e5e5;
}

.calendar-weekday {
  color: #737373;
  font-weight: 600;
}

.calendar-grid {
  min-height: 520px;
}

.calendar-day {
  background: #fff;
  transition: background 0.15s ease;
}

.calendar-day-other {
  background: #fafafa;
}

.calendar-day-weekend {
  background: #f5f5f5;
}

.calendar-day-today {
  background: #eff6ff;
}

.calendar-day-clickable:hover {
  background: #f8fafc;
  cursor: pointer;
}

.calendar-day-num {
  color: #404040;
}

.calendar-day-num-today {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}

.calendar-day-events {
  font-size: 0.6875rem;
}

.calendar-event {
  font-weight: 500;
  line-height: 1.25;
}

.calendar-event-present {
  background: #dcfce7;
  color: #166534;
}

.calendar-event-approved {
  background: #bbf7d0;
  color: #14532d;
}

.calendar-event-pending {
  background: #fef9c3;
  color: #854d0e;
}

.calendar-event-rejected {
  background: #fecaca;
  color: #991b1b;
}

.calendar-event-late {
  background: #ffedd5;
  color: #c2410c;
}

.calendar-event-overtime-jour {
  background: #dbeafe;
  color: #1d4ed8;
}

.calendar-event-overtime-nuit {
  background: #e0e7ff;
  color: #312e81;
}

.calendar-event-overtime-weekend {
  background: #ede9fe;
  color: #5b21b6;
}

.calendar-event-overtime-ferie {
  background: #fae8ff;
  color: #86198f;
}

.calendar-event-default {
  background: #f5f5f5;
  color: #525252;
}

.calendar-event-absence {
  padding-right: 4px;
}

.calendar-event-label {
  line-height: 1.25;
}

.calendar-event-btn {
  opacity: 0.85;
}

.calendar-event-btn:hover {
  opacity: 1;
}

.calendar-event-btn-delete:hover {
  color: #dc2626;
}

.input-base {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d4d4d4;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.input-base:focus {
  outline: none;
  border-color: #5b99f5;
  box-shadow: 0 0 0 2px rgba(91, 153, 245, 0.25);
}
</style>
