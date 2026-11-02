<template>
  <div class="px-4 sm:px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <h1 class="text-2xl font-bold text-neutral-800">{{ t("admin.attendance.title") }}</h1>
      <nav class="text-sm text-neutral-500 flex items-center gap-1.5" aria-label="Breadcrumb">
        <RouterLink to="/" class="hover:text-secondary-600">{{ t("common.home") }}</RouterLink>
        <span>/</span><span class="text-neutral-800 font-medium">{{ t("admin.attendance.breadcrumb") }}</span>
      </nav>
    </div>

    <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </div>

    <div class="flex flex-wrap gap-4 mb-5">
      <label class="text-sm font-medium text-neutral-700">
        <span class="block mb-1.5">{{ t("admin.attendance.selectDate") }}</span>
        <input v-model="dateFilter" type="date" class="input-base min-w-[200px] bg-white" @change="loadData()" />
      </label>
      <label class="text-sm font-medium text-neutral-700">
        <span class="block mb-1.5">{{ t("admin.attendance.selectUser") }}</span>
        <select v-model="employeeFilter" class="input-base min-w-[240px] bg-white" @change="loadData()">
          <option value="">{{ t("admin.attendance.allUsers") }}</option>
          <option v-for="employee in employees" :key="employee.id" :value="employee.id">
            {{ employee.name || employee.full_name }}
          </option>
        </select>
      </label>
      <label class="text-sm font-medium text-neutral-700">
        <span class="block mb-1.5">{{ t("admin.attendance.selectStatus") }}</span>
        <select v-model="statusFilter" class="input-base min-w-[200px] bg-white" @change="loadData()">
          <option value="">{{ t("admin.attendance.allStatuses") }}</option>
          <option value="on_time">{{ t("admin.attendance.status.onTime") }}</option>
          <option value="late">{{ t("admin.attendance.status.late") }}</option>
          <option value="half_day">{{ t("admin.attendance.status.halfDay") }}</option>
          <option value="leave">{{ t("admin.attendance.status.leave") }}</option>
          <option value="absent">{{ t("admin.attendance.status.absent") }}</option>
        </select>
      </label>
    </div>

    <div class="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 flex items-center justify-between border-b border-neutral-100">
        <h2 class="font-bold text-neutral-900">{{ t("admin.attendance.recordsTitle") }}</h2>
        <button class="btn-secondary" type="button" :disabled="loading" @click="openCreate">+ {{ t("admin.attendance.addRecord") }}</button>
      </div>
      <div class="px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          {{ t("admin.attendance.showEntries") }}
          <select v-model.number="pageSize" class="rounded-md border border-neutral-300 px-2 py-1.5">
            <option v-for="size in [10, 25, 50, 100]" :key="size" :value="size">{{ size }}</option>
          </select>
          {{ t("admin.attendance.entries") }}
        </label>
        <input v-model="search" type="search" :placeholder="t('common.search')" class="w-full sm:w-56 rounded-md border border-neutral-300 px-3 py-1.5 text-sm" />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[1000px]">
          <thead>
            <tr class="text-left text-xs font-semibold uppercase text-neutral-500 border-y border-neutral-100">
              <th class="px-4 py-3">{{ t("admin.attendance.col.id") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.employee") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.status") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.shift") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.checkIn") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.checkOut") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.late") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.earlyOut") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.overtime") }}</th>
              <th class="px-4 py-3">{{ t("admin.attendance.col.break") }}</th>
              <th class="px-4 py-3 text-right">{{ t("common.actions") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="loading"><td colspan="11" class="px-4 py-12 text-center text-neutral-500">{{ t("common.loading") }}</td></tr>
            <tr v-else-if="!paginated.length"><td colspan="11" class="px-4 py-12 text-center text-neutral-500">{{ t("admin.attendance.empty") }}</td></tr>
            <template v-else>
              <tr v-for="record in paginated" :key="record.id" class="hover:bg-neutral-50">
                <td class="px-4 py-3 font-mono text-xs">{{ record.id }}</td>
                <td class="px-4 py-3">
                  <p class="font-semibold text-neutral-900">{{ record.employee }}</p>
                  <p class="text-xs text-neutral-500">{{ record.employeeCode }}</p>
                </td>
                <td class="px-4 py-3">{{ statusLabel(record.status) }}</td>
                <td class="px-4 py-3">{{ record.shift }}</td>
                <td class="px-4 py-3">{{ formatTime(record.checkIn) }}</td>
                <td class="px-4 py-3">{{ formatTime(record.checkOut) }}</td>
                <td class="px-4 py-3">{{ formatMinutes(record.lateMinutes) }}</td>
                <td class="px-4 py-3">{{ formatMinutes(record.earlyOutMinutes) }}</td>
                <td class="px-4 py-3">{{ formatMinutes(record.overtimeMinutes) }}</td>
                <td class="px-4 py-3">{{ formatMinutes(record.breakMinutes) }}</td>
                <td class="px-4 py-3 text-right">
                  <button class="text-secondary-600 hover:underline mr-3" @click="openEdit(record)">{{ t("admin.attendance.edit") }}</button>
                  <button class="text-error-600 hover:underline" @click="requestDelete(record)">{{ t("admin.attendance.delete") }}</button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-3 border-t border-neutral-100 flex items-center justify-between text-sm">
        <span class="text-neutral-500">{{ t("common.showingEntries", { from: filtered.length ? start + 1 : 0, to: end, total: filtered.length }) }}</span>
        <div class="flex gap-2">
          <button class="btn-outline" :disabled="page <= 1" @click="page--">{{ t("common.previous") }}</button>
          <button class="btn-outline" :disabled="page >= totalPages" @click="page++">{{ t("common.next") }}</button>
        </div>
      </div>
    </div>

    <Modal v-model="modalOpen" :title="editingId ? t('admin.attendance.modal.edit') : t('admin.attendance.modal.add')" @confirm="submit">
      <div class="space-y-4">
        <label class="block text-sm font-medium">{{ t("admin.attendance.modal.date") }}<input v-model="form.date" type="date" class="input-base w-full mt-1" /></label>
        <label class="block text-sm font-medium">{{ t("admin.attendance.modal.employee") }}
          <select v-model="form.employeeId" class="input-base w-full mt-1">
            <option value="">{{ t("admin.attendance.modal.selectEmployee") }}</option>
            <option v-for="employee in employees" :key="employee.id" :value="employee.id">{{ employee.name || employee.full_name }}</option>
          </select>
        </label>
        <label class="block text-sm font-medium">{{ t("admin.attendance.col.shift") }}
          <select v-model="form.shiftId" class="input-base w-full mt-1">
            <option value="">{{ t("admin.attendance.modal.none") }}</option>
            <option v-for="shift in shifts" :key="shift.id" :value="shift.id">{{ shift.name }}</option>
          </select>
        </label>
        <label class="block text-sm font-medium">{{ t("admin.attendance.modal.location") }}
          <select v-model="form.siteId" class="input-base w-full mt-1">
            <option value="">{{ t("admin.attendance.modal.noLocation") }}</option>
            <option v-for="site in sites" :key="site.id" :value="site.id">{{ site.name }}</option>
          </select>
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="text-sm font-medium">{{ t("admin.attendance.modal.checkIn") }}<input v-model="form.checkIn" type="time" class="input-base w-full mt-1" /></label>
          <label class="text-sm font-medium">{{ t("admin.attendance.modal.checkOut") }}<input v-model="form.checkOut" type="time" class="input-base w-full mt-1" /></label>
        </div>
        <label class="block text-sm font-medium">{{ t("admin.attendance.modal.status") }}
          <select v-model="form.status" class="input-base w-full mt-1">
            <option value="on_time">{{ t("admin.attendance.status.onTime") }}</option>
            <option value="late">{{ t("admin.attendance.status.late") }}</option>
            <option value="half_day">{{ t("admin.attendance.status.halfDay") }}</option>
            <option value="leave">{{ t("admin.attendance.status.leave") }}</option>
            <option value="absent">{{ t("admin.attendance.status.absent") }}</option>
          </select>
        </label>
      </div>
    </Modal>

    <ConfirmDialog
      v-model="deleteOpen"
      :title="t('admin.attendance.deleteTitle')"
      :message="t('admin.attendance.deleteMessage', { name: deleteTarget?.employee || '' })"
      variant="danger"
      :busy="deleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Modal from "../components/common/Modal.vue";
import ConfirmDialog from "../components/common/ConfirmDialog.vue";
import { formatMinutes, useAttendanceRecords } from "./attendance/composables/useAttendanceRecords.js";
import { useI18n } from "../i18n/index.js";

const { t, bcp47 } = useI18n();

const {
  employees, shifts, sites, loading, deleting, error, dateFilter, employeeFilter,
  statusFilter, search, page, pageSize, modalOpen, editingId, form, deleteOpen, deleteTarget,
  filtered, totalPages, start, end, paginated, loadData, loadReferenceData,
  openCreate, openEdit, submit, requestDelete, confirmDelete,
} = useAttendanceRecords();

function formatTime(value) {
  if (!value) return "—";
  const [hours, minutes] = value.split(":");
  const date = new Date(2000, 0, 1, Number(hours), Number(minutes));
  return date.toLocaleTimeString(bcp47.value, { hour: "numeric", minute: "2-digit" });
}

function statusLabel(status) {
  const key = {
    on_time: "onTime",
    late: "late",
    half_day: "halfDay",
    leave: "leave",
    absent: "absent",
  }[status];
  return key ? t(`admin.attendance.status.${key}`) : status || "—";
}

onMounted(() => {
  loadData();
  loadReferenceData();
});
</script>
