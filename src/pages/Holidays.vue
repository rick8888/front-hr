<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-7xl mx-auto">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-bold text-neutral-900">{{ t("admin.attendance.holidays.title") }}</h1>
      <nav
        class="text-sm text-neutral-500 flex items-center flex-wrap gap-1.5"
        aria-label="Breadcrumb"
      >
        <RouterLink
          to="/"
          class="hover:text-secondary-600 inline-flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10.5L12 4l9 6.5M5 10v9a1 1 0 001 1h3m10-10v9a1 1 0 01-1 1h-3m-6 0h6m-6 0v-5a1 1 0 011-1h4a1 1 0 011 1v5"
            />
          </svg>
          {{ t("common.home") }}
        </RouterLink>
        <span class="text-neutral-400">/</span>
        <span class="text-neutral-800 font-medium">{{ t("nav.attendance.holidays") }}</span>
      </nav>
    </div>

    <div
      v-if="error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5 border-b border-neutral-100"
      >
        <h2 class="text-base font-semibold text-neutral-900">{{ t("admin.attendance.holidays.listTitle") }}</h2>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
          :disabled="loading"
          @click="openAddHoliday"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ t("admin.attendance.holidays.add") }}
        </button>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4"
      >
        <label class="inline-flex items-center gap-2 text-sm text-neutral-600">
          <span>{{ t("common.show") }}</span>
          <select
            v-model.number="pageSize"
            class="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-800 focus:outline-none focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
          >
            <option v-for="n in [10, 25, 50, 100]" :key="n" :value="n">{{ n }}</option>
          </select>
          <span>{{ t("common.entries") }}</span>
        </label>
        <div class="relative w-full sm:w-72">
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="t('admin.attendance.holidays.searchPlaceholder')"
            class="w-full pl-10 pr-3 py-1.5 text-sm border border-neutral-300 rounded-md bg-white placeholder:text-neutral-400 focus:outline-none focus:border-secondary-500 focus:ring-1 focus:ring-secondary-500"
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="text-left text-xs font-semibold tracking-wider text-neutral-500 uppercase border-t border-b border-neutral-100"
            >
              <th class="px-6 py-3">{{ t("common.name") }}</th>
              <th class="px-6 py-3 min-w-[120px]">{{ t("common.date") }}</th>
              <th class="px-6 py-3">{{ t("common.type") }}</th>
              <th class="px-6 py-3">{{ t("admin.attendance.holidays.col.applicableTo") }}</th>
              <th class="px-6 py-3">{{ t("admin.attendance.holidays.col.properties") }}</th>
              <th class="px-6 py-3 w-24">{{ t("common.status") }}</th>
              <th class="px-6 py-3 w-20 text-right pr-8">{{ t("common.actions") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-10 text-center text-sm text-neutral-500">
                {{ t("common.loading") }}
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="row in paginatedHolidays"
                :key="row.id"
                class="hover:bg-neutral-50/60 transition-colors"
              >
                <td class="px-6 py-4">
                  <span class="font-semibold text-neutral-900">{{ row.name }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-semibold text-neutral-900 font-mono text-xs sm:text-sm">
                    {{ dateIso(row.date) }}
                  </div>
                  <div class="text-xs text-neutral-500 mt-0.5">
                    {{ dayName(row.date) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium',
                      typeClass(row.type),
                    ]"
                  >
                    {{ typeLabel(row.type) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    v-if="row.applicableTo === 'all'"
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-success-50 text-success-700 border border-success-200/50"
                  >
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ t("admin.attendance.holidays.applicableAll") }}
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-info-100 text-info-700 border border-info-200/50"
                  >
                    {{
                      row.applicableTo === "department"
                        ? t("admin.attendance.holidays.applicableDept")
                        : t("admin.attendance.holidays.applicableLocations")
                    }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <PropertyIcon
                      v-for="(p, i) in row.properties"
                      :key="i"
                      :kind="p"
                    />
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                    :class="
                      row.status === 'active'
                        ? 'bg-success-100 text-success-700'
                        : 'bg-neutral-100 text-neutral-600'
                    "
                  >
                    {{ row.status === "active" ? t("common.active") : t("common.inactive") }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right pr-6" @click.stop>
                  <div class="relative inline-block text-left">
                    <button
                      type="button"
                      class="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100"
                      @click="toggleMenu(row.id)"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                        />
                      </svg>
                    </button>
                    <div
                      v-if="openMenuId === row.id"
                      class="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
                    >
                      <button
                        type="button"
                        class="block w-full px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 text-left"
                        @click="editHoliday(row)"
                      >
                        {{ t("common.edit") }}
                      </button>
                      <button
                        type="button"
                        class="block w-full px-3 py-1.5 text-sm text-error-600 hover:bg-error-50 text-left"
                        @click="requestDelete(row)"
                      >
                        {{ t("common.delete") }}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="!paginatedHolidays.length">
                <td colspan="7" class="px-6 py-10 text-center text-sm text-neutral-500">
                  {{ t("admin.attendance.holidays.empty") }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-neutral-100"
      >
        <p class="text-sm text-neutral-500">
          {{
            t("common.showingEntries", {
              from: filteredHolidays.length === 0 ? 0 : startIndex + 1,
              to: endIndex,
              total: filteredHolidays.length,
            })
          }}
        </p>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="p-1.5 rounded-md text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
            :disabled="currentPage <= 1"
            @click="currentPage--"
            :aria-label="t('common.previousPage')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            class="min-w-[32px] h-8 px-2 text-sm font-medium rounded-md transition-colors"
            :class="
              p === currentPage
                ? 'bg-secondary-500 text-white shadow-sm'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            "
            @click="currentPage = p"
          >
            {{ p }}
          </button>
          <button
            type="button"
            class="p-1.5 rounded-md text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
            :aria-label="t('common.nextPage')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-5xl flex flex-col rounded-xl bg-white shadow-xl overflow-hidden"
        @click.stop
      >
        <div class="flex items-center justify-between px-5 py-2.5 border-b border-neutral-100 shrink-0">
          <h2 class="text-base font-bold text-neutral-900">
            {{
              editingId
                ? t("admin.attendance.holidays.modalEdit")
                : t("admin.attendance.holidays.modalAdd")
            }}
          </h2>
          <button
            type="button"
            class="text-neutral-400 hover:text-neutral-700 text-2xl leading-none"
            :aria-label="t('common.close')"
            :disabled="saving"
            @click="closeModal"
          >
            ×
          </button>
        </div>

        <div class="px-5 py-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 shrink-0 overflow-hidden">
          <section>
            <h3 class="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">
              {{ t("admin.attendance.holidays.basicInfo") }}
            </h3>
            <div class="space-y-2">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-0.5">
                    {{ t("admin.attendance.holidays.holidayName") }} <span class="text-error-600">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="input-base text-sm py-1.5"
                    :class="{ 'ring-1 ring-error-500': formErrors.name }"
                    :placeholder="t('admin.attendance.holidays.namePlaceholder')"
                  />
                  <p v-if="formErrors.name" class="text-xs text-error-600 mt-0.5">{{ formErrors.name }}</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-0.5">
                    {{ t("admin.attendance.holidays.holidayCode") }} <span class="text-error-600">*</span>
                  </label>
                  <input
                    v-model="form.code"
                    type="text"
                    class="input-base text-sm font-mono uppercase py-1.5"
                    :class="{ 'ring-1 ring-error-500': formErrors.code }"
                    :placeholder="t('admin.attendance.holidays.codePlaceholder')"
                  />
                  <p class="text-[11px] text-neutral-500 mt-0.5">{{ t("admin.attendance.holidays.codeHint") }}</p>
                  <p v-if="formErrors.code" class="text-xs text-error-600 mt-0.5">{{ formErrors.code }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-0.5">
                    {{ t("common.date") }} <span class="text-error-600">*</span>
                  </label>
                  <input
                    v-model="form.date"
                    type="date"
                    class="input-base text-sm py-1.5"
                    :class="{ 'ring-1 ring-error-500': formErrors.date }"
                  />
                  <p v-if="formErrors.date" class="text-xs text-error-600 mt-0.5">{{ formErrors.date }}</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-0.5">{{ t("admin.attendance.holidays.color") }}</label>
                  <div class="flex items-center gap-2 h-[34px]">
                    <input
                      v-model="form.color"
                      type="color"
                      class="h-8 w-14 cursor-pointer rounded border border-neutral-300 p-0.5 bg-white"
                      :title="t('admin.attendance.holidays.pickColor')"
                    />
                    <span
                      class="inline-block h-7 w-7 rounded border border-neutral-200 shadow-inner"
                      :style="{ backgroundColor: form.color }"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-0.5">
                    {{ t("common.type") }} <span class="text-error-600">*</span>
                  </label>
                  <select
                    v-model="form.type"
                    class="input-base text-sm py-1.5"
                    :class="{ 'ring-1 ring-error-500': formErrors.type }"
                  >
                    <option value="">{{ t("admin.attendance.holidays.selectType") }}</option>
                    <option value="public">{{ t("admin.attendance.holidays.type.public") }}</option>
                    <option value="religious">{{ t("admin.attendance.holidays.type.religious") }}</option>
                    <option value="company">{{ t("admin.attendance.holidays.type.company") }}</option>
                    <option value="regional">{{ t("admin.attendance.holidays.type.regional") }}</option>
                  </select>
                  <p v-if="formErrors.type" class="text-xs text-error-600 mt-0.5">{{ formErrors.type }}</p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-neutral-700 mb-0.5">{{ t("common.category") }}</label>
                  <select v-model="form.category" class="input-base text-sm py-1.5">
                    <option value="">{{ t("admin.attendance.holidays.selectCategory") }}</option>
                    <option value="national">{{ t("admin.attendance.holidays.cat.national") }}</option>
                    <option value="regional">{{ t("admin.attendance.holidays.cat.regional") }}</option>
                    <option value="religious">{{ t("admin.attendance.holidays.cat.religious") }}</option>
                    <option value="corporate">{{ t("admin.attendance.holidays.cat.corporate") }}</option>
                    <option value="other">{{ t("admin.attendance.holidays.cat.other") }}</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-0.5">{{ t("common.description") }}</label>
                <textarea
                  v-model="form.description"
                  rows="2"
                  class="input-base text-sm resize-none py-1.5"
                  :placeholder="t('admin.attendance.holidays.descriptionPlaceholder')"
                />
              </div>
            </div>
          </section>

          <div class="flex flex-col gap-3 md:border-l md:border-neutral-100 md:pl-6">
            <section>
              <h3 class="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">{{ t("admin.attendance.holidays.applicability") }}</h3>
              <div>
                <label class="block text-xs font-medium text-neutral-700 mb-0.5">
                  {{ t("admin.attendance.holidays.appliesTo") }} <span class="text-error-600">*</span>
                </label>
                <select
                  v-model="form.applicableTo"
                  class="input-base text-sm py-1.5 w-full"
                  :class="{ 'ring-1 ring-error-500': formErrors.applicableTo }"
                >
                  <option value="all">{{ t("admin.attendance.holidays.applicableAll") }}</option>
                  <option value="locations">{{ t("admin.attendance.holidays.applicableLocations") }}</option>
                  <option value="department">{{ t("admin.attendance.holidays.byDepartment") }}</option>
                </select>
                <p v-if="formErrors.applicableTo" class="text-xs text-error-600 mt-0.5">
                  {{ formErrors.applicableTo }}
                </p>
              </div>
            </section>

            <section>
              <h3 class="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">{{ t("admin.attendance.holidays.options") }}</h3>
              <div
                class="rounded-lg border border-neutral-100 bg-neutral-50/80 p-2 space-y-1.5"
              >
                <div
                  class="flex items-center justify-between gap-2 min-h-[32px] border-b border-neutral-100/80 pb-1.5"
                >
                  <div class="min-w-0 pr-1">
                    <p class="text-xs font-medium text-neutral-800">{{ t("admin.attendance.holidays.recurring") }}</p>
                    <p class="text-[11px] text-neutral-500 leading-tight">{{ t("admin.attendance.holidays.recurringHint") }}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="form.recurring"
                    class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
                    :class="form.recurring ? 'bg-info-500' : 'bg-neutral-300'"
                    @click="form.recurring = !form.recurring"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-4 w-4 mt-0.5 ml-0.5 transform rounded-full bg-white shadow transition',
                        form.recurring ? 'translate-x-4' : 'translate-x-0',
                      ]"
                    />
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                  <div
                    v-for="opt in optionToggles"
                    :key="opt.key"
                    class="flex items-center justify-between gap-1.5"
                  >
                    <span class="text-xs font-medium text-neutral-800 truncate" :title="opt.label">{{
                      opt.label
                    }}</span>
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="form[opt.key]"
                      class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
                      :class="form[opt.key] ? 'bg-info-500' : 'bg-neutral-300'"
                      @click="form[opt.key] = !form[opt.key]"
                    >
                      <span
                        :class="[
                          'pointer-events-none inline-block h-4 w-4 mt-0.5 ml-0.5 transform rounded-full bg-white shadow transition',
                          form[opt.key] ? 'translate-x-4' : 'translate-x-0',
                        ]"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div
          class="flex items-center justify-between gap-3 px-5 py-2.5 border-t border-neutral-100 bg-neutral-50/80 shrink-0"
        >
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-info-600 hover:bg-info-700 shadow-sm transition-colors disabled:opacity-50"
            :disabled="saving"
            @click="submitForm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 3H5a2 2 0 00-2 2v12a2 2 0 002 2h2m10-2h2a2 2 0 002-2V8l-4-4H8V3zM8 3v4h5V3M8 7v1h.01M12 7v1h.01M16 7v1h.01M8 11h8M8 15h5"
              />
            </svg>
            {{ saving ? t("common.saving") : t("admin.attendance.holidays.save") }}
          </button>
          <button
            type="button"
            class="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
            :disabled="saving"
            @click="closeModal"
          >
            {{ t("common.cancel") }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-model="deleteOpen"
      :title="t('admin.attendance.holidays.deleteTitle')"
      :message="deleteMessage"
      :confirm-text="t('common.delete')"
      :cancel-text="t('common.cancel')"
      :loading-text="t('common.deleting')"
      variant="danger"
      :busy="deleting"
      :close-on-backdrop="!deleting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { computed, h, onMounted, onUnmounted } from "vue";
import ConfirmDialog from "../components/common/ConfirmDialog.vue";
import { useHolidays } from "./holidays/composables/useHolidays.js";
import { useI18n } from "../i18n/index.js";

const { t, bcp47 } = useI18n();

const PropertyIcon = {
  props: { kind: { type: String, default: "info" } },
  setup(props) {
    return () => {
      const base =
        "inline-flex items-center justify-center w-7 h-7 rounded-md border text-neutral-500";
      if (props.kind === "share") {
        return h(
          "span",
          {
            class: `${base} bg-success-50 border-success-200/60 text-success-600`,
            title: t("admin.attendance.holidays.prop.share"),
          },
          [
            h(
              "svg",
              { class: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
              [
                h("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
                }),
              ]
            ),
          ]
        );
      }
      if (props.kind === "info") {
        return h(
          "span",
          {
            class: `${base} bg-neutral-100 border-neutral-200 text-neutral-500`,
            title: t("admin.attendance.holidays.prop.info"),
          },
          [
            h(
              "svg",
              { class: "w-3.5 h-3.5", fill: "currentColor", viewBox: "0 0 20 20" },
              [
                h("path", {
                  "fill-rule": "evenodd",
                  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
                  "clip-rule": "evenodd",
                }),
              ]
            ),
          ]
        );
      }
      if (props.kind === "clock") {
        return h(
          "span",
          {
            class: `${base} bg-info-50 border-info-200/60 text-info-600`,
            title: t("admin.attendance.holidays.prop.clock"),
          },
          [
            h(
              "svg",
              { class: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
              [
                h("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                }),
              ]
            ),
          ]
        );
      }
      if (props.kind === "lock") {
        return h(
          "span",
          {
            class: `${base} bg-warning-50 border-warning-200/60 text-warning-700`,
            title: t("admin.attendance.holidays.prop.lock"),
          },
          [
            h(
              "svg",
              { class: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
              [
                h("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                }),
              ]
            ),
          ]
        );
      }
      return h("span");
    };
  },
};

const optionToggles = computed(() => [
  { key: "optionalHoliday", label: t("admin.attendance.holidays.opt.optional") },
  { key: "restrictedHoliday", label: t("admin.attendance.holidays.opt.restricted") },
  { key: "halfDay", label: t("admin.attendance.holidays.opt.halfDay") },
  { key: "visibleToEmployees", label: t("admin.attendance.holidays.opt.visible") },
  { key: "sendNotification", label: t("admin.attendance.holidays.opt.notify") },
]);

const {
  loading,
  saving,
  deleting,
  error,
  searchQuery,
  pageSize,
  currentPage,
  openMenuId,
  modalOpen,
  editingId,
  form,
  formErrors,
  deleteOpen,
  deleteMessage,
  filteredHolidays,
  totalPages,
  startIndex,
  endIndex,
  paginatedHolidays,
  loadData,
  toggleMenu,
  closeMenus,
  openAddHoliday,
  editHoliday,
  closeModal,
  submitForm,
  requestDelete,
  confirmDelete,
  cancelDelete,
} = useHolidays();

function dateIso(dateString) {
  if (!dateString) return "—";
  return dateString;
}

function dayName(dateString) {
  const d = new Date(dateString + "T12:00:00");
  return d.toLocaleDateString(bcp47.value, { weekday: "long" });
}

function typeLabel(type) {
  return t(`admin.attendance.holidays.type.${type}`);
}

function typeClass(type) {
  const map = {
    public: "bg-secondary-100 text-secondary-700 border border-secondary-200/60",
    religious: "bg-sky-100 text-sky-800 border border-sky-200/60",
    company: "bg-success-100 text-success-800 border border-success-200/50",
    regional: "bg-amber-100 text-amber-800 border border-amber-200/60",
  };
  return map[type] || "bg-neutral-100 text-neutral-700";
}

onMounted(() => {
  loadData();
  document.addEventListener("click", closeMenus);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenus);
});
</script>
