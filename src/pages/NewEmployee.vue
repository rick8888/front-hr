<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-2xl font-semibold text-neutral-900">{{ t("admin.employees.create.title") }}</h1>
      <nav
        class="text-sm text-neutral-500 flex items-center gap-1.5"
        :aria-label="t('common.breadcrumb')"
      >
        <RouterLink to="/" class="hover:text-secondary-600 inline-flex items-center gap-1">
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
        <span>/</span>
        <RouterLink to="/employees" class="hover:text-secondary-600">{{ t("admin.employees.title") }}</RouterLink>
        <span>/</span>
        <span class="text-neutral-800 font-medium">{{ t("admin.employees.create.breadcrumb") }}</span>
      </nav>
    </div>

    <!-- Carte unique : stepper + steps + navigation -->
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm flex flex-col">
      <!-- Stepper -->
      <div
        class="flex flex-col sm:flex-row gap-3 sm:gap-6 p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50/40"
      >
        <button
          v-for="s in steps"
          :key="s.id"
          type="button"
          class="flex items-center gap-3 flex-1 min-w-0 text-left rounded-lg px-3 py-2 transition-colors"
          :class="
            step === s.id
              ? 'bg-white ring-1 ring-secondary-200 shadow-sm'
              : step > s.id
                ? 'hover:bg-neutral-100'
                : ''
          "
          @click="goToStep(s.id)"
        >
          <span
            class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 [&_svg]:w-5 [&_svg]:h-5"
            :class="
              step === s.id
                ? 'bg-secondary-500 text-white'
                : step > s.id
                  ? 'bg-secondary-100 text-secondary-600'
                  : 'bg-neutral-100 text-neutral-400'
            "
            v-html="s.icon"
          ></span>
          <span class="min-w-0">
            <span
              class="block font-semibold text-sm"
              :class="step === s.id ? 'text-secondary-600' : 'text-neutral-700'"
            >
              {{ s.title }}
            </span>
            <span class="block text-xs text-neutral-500 truncate">{{ s.sub }}</span>
          </span>
        </button>
      </div>

      <!-- Corps -->
      <div class="p-5 sm:p-8 flex-1 min-h-0">
        <!-- ============== STEP 1 : Personal Information ============== -->
        <div v-show="step === 1" class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold text-neutral-900">{{ t("admin.employees.create.step1.title") }}</h2>
            <p class="text-sm text-neutral-500 mt-1">
              {{ t("admin.employees.create.step1.intro") }}
            </p>
          </div>

          <!-- Profile Picture dropzone -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1.5">
              {{ t("admin.employees.create.photo") }}
            </label>
            <label
              class="block cursor-pointer rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/60 hover:bg-neutral-50 transition-colors px-6 py-10 text-center"
            >
              <input
                ref="photoInput"
                type="file"
                class="hidden"
                accept="image/png,image/jpeg,image/jpg"
                @change="handlePhotoUpload"
              />
              <div v-if="!profilePhotoPreview">
                <svg
                  class="w-10 h-10 mx-auto text-neutral-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                    d="M3 15a4 4 0 004 4h10a4 4 0 003.8-5.4A4 4 0 0016 10a5 5 0 00-9.9 1A4 4 0 003 15z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                    d="M12 12v6m0-6l-2 2m2-2l2 2"
                  />
                </svg>
                <p class="text-sm font-medium text-neutral-600">
                  {{ t("admin.employees.create.photoHint") }}
                </p>
                <p class="text-xs text-neutral-400 mt-1">
                  {{ t("admin.employees.create.photoTypes") }}
                </p>
              </div>
              <div v-else class="flex items-center justify-center gap-4">
                <img
                  :src="profilePhotoPreview"
                  :alt="t('admin.employees.create.photoAlt')"
                  class="w-24 h-24 rounded-lg object-cover border border-neutral-200"
                />
                <button
                  type="button"
                  class="text-sm text-error-600 hover:underline"
                  @click.prevent="clearPhoto"
                >
                  {{ t("admin.employees.create.removePhoto") }}
                </button>
              </div>
            </label>
          </div>

          <!-- Ligne 1 : Code / Email / Phone -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FieldLabel required>{{ t("admin.employees.create.code") }}</FieldLabel>
              <input
                v-model="form.employeeCode"
                type="text"
                class="input-base text-sm"
                :class="{ 'border-error-500 ring-1 ring-error-500': errors.employeeCode }"
                :placeholder="t('admin.employees.create.codePlaceholder')"
              />
              <p v-if="errors.employeeCode" class="text-xs text-error-600 mt-1">
                {{ errors.employeeCode }}
              </p>
              <p v-else class="text-xs text-neutral-400 mt-1">
                {{ t("admin.employees.create.codeHint") }}
              </p>
            </div>
            <div>
              <FieldLabel required>{{ t("admin.employees.create.email") }}</FieldLabel>
              <input
                v-model="form.email"
                type="email"
                class="input-base text-sm"
                :class="{ 'border-error-500 ring-1 ring-error-500': errors.email }"
                :placeholder="t('admin.employees.create.emailPlaceholder')"
              />
              <p v-if="errors.email" class="text-xs text-error-600 mt-1">
                {{ errors.email }}
              </p>
              <p v-else class="text-xs text-neutral-400 mt-1">
                {{ t("admin.employees.create.emailHint") }}
              </p>
            </div>
            <div>
              <FieldLabel required>{{ t("admin.employees.create.phone") }}</FieldLabel>
              <input
                v-model="form.phone"
                type="tel"
                class="input-base text-sm"
                :class="{ 'border-error-500 ring-1 ring-error-500': errors.phone }"
                :placeholder="t('admin.employees.create.phonePlaceholder')"
              />
              <p v-if="errors.phone" class="text-xs text-error-600 mt-1">
                {{ errors.phone }}
              </p>
              <p v-else class="text-xs text-neutral-400 mt-1">
                {{ t("admin.employees.create.phoneHint") }}
              </p>
            </div>
          </div>

          <!-- Ligne 2 : First / Last Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>{{ t("admin.employees.create.firstName") }}</FieldLabel>
              <input
                v-model="form.firstName"
                type="text"
                class="input-base text-sm"
                :class="{ 'border-error-500 ring-1 ring-error-500': errors.firstName }"
                :placeholder="t('admin.employees.create.firstNamePlaceholder')"
              />
              <p v-if="errors.firstName" class="text-xs text-error-600 mt-1">
                {{ errors.firstName }}
              </p>
            </div>
            <div>
              <FieldLabel required>{{ t("admin.employees.create.lastName") }}</FieldLabel>
              <input
                v-model="form.lastName"
                type="text"
                class="input-base text-sm"
                :class="{ 'border-error-500 ring-1 ring-error-500': errors.lastName }"
                :placeholder="t('admin.employees.create.lastNamePlaceholder')"
              />
              <p v-if="errors.lastName" class="text-xs text-error-600 mt-1">
                {{ errors.lastName }}
              </p>
            </div>
          </div>

          <!-- Ligne 3 : Gender / DOB -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>{{ t("admin.employees.create.gender") }}</FieldLabel>
              <select
                v-model="form.gender"
                class="input-base text-sm"
                :class="{ 'border-error-500 ring-1 ring-error-500': errors.gender }"
              >
                <option value="">{{ t("admin.employees.create.selectGender") }}</option>
                <option value="male">{{ t("admin.employees.create.gender.male") }}</option>
                <option value="female">{{ t("admin.employees.create.gender.female") }}</option>
                <option value="other">{{ t("admin.employees.create.gender.other") }}</option>
              </select>
              <p v-if="errors.gender" class="text-xs text-error-600 mt-1">
                {{ errors.gender }}
              </p>
            </div>
            <div>
              <FieldLabel required>{{ t("admin.employees.create.dob") }}</FieldLabel>
              <input
                v-model="form.dateOfBirth"
                type="date"
                class="input-base text-sm"
                :class="{ 'border-error-500 ring-1 ring-error-500': errors.dateOfBirth }"
                :placeholder="t('admin.employees.create.dobPlaceholder')"
              />
              <p v-if="errors.dateOfBirth" class="text-xs text-error-600 mt-1">
                {{ errors.dateOfBirth }}
              </p>
            </div>
          </div>

          <!-- Ligne 4 : Blood / Alt Phone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>{{ t("admin.employees.create.bloodGroup") }}</FieldLabel>
              <select v-model="form.bloodGroup" class="input-base text-sm">
                <option value="">{{ t("admin.employees.create.selectBloodGroup") }}</option>
                <option v-for="bg in bloodGroups" :key="bg" :value="bg">{{ bg }}</option>
              </select>
            </div>
            <div>
              <FieldLabel>{{ t("admin.employees.create.altPhone") }}</FieldLabel>
              <input
                v-model="form.alternativePhone"
                type="tel"
                class="input-base text-sm"
                :placeholder="t('admin.employees.create.altPhonePlaceholder')"
              />
            </div>
          </div>

          <!-- Address -->
          <div>
            <FieldLabel>{{ t("admin.employees.create.address") }}</FieldLabel>
            <textarea
              v-model="form.address"
              rows="2"
              class="input-base text-sm"
              :placeholder="t('admin.employees.create.addressPlaceholder')"
            ></textarea>
          </div>

          <!-- Emergency Contact Information -->
          <div class="pt-6 border-t border-neutral-100">
            <div class="flex items-center gap-2 mb-4 text-sm font-semibold text-neutral-700">
              <svg class="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
                />
              </svg>
              {{ t("admin.employees.create.emergency") }}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel>{{ t("admin.employees.create.contactName") }}</FieldLabel>
                <input
                  v-model="form.emergencyContactName"
                  type="text"
                  class="input-base text-sm"
                  :placeholder="t('admin.employees.create.contactNamePlaceholder')"
                />
              </div>
              <div>
                <FieldLabel>{{ t("admin.employees.create.relationship") }}</FieldLabel>
                <select v-model="form.emergencyRelationship" class="input-base text-sm">
                  <option value="">{{ t("admin.employees.create.selectRelationship") }}</option>
                  <option v-for="r in relationships" :key="r.value" :value="r.value">{{ r.label }}</option>
                </select>
              </div>
              <div>
                <FieldLabel>{{ t("admin.employees.create.contactPhone") }}</FieldLabel>
                <input
                  v-model="form.emergencyContactPhone"
                  type="tel"
                  class="input-base text-sm"
                  :placeholder="t('admin.employees.create.contactPhonePlaceholder')"
                />
              </div>
              <div>
                <FieldLabel>{{ t("admin.employees.create.contactAddress") }}</FieldLabel>
                <textarea
                  v-model="form.emergencyContactAddress"
                  rows="1"
                  class="input-base text-sm"
                  :placeholder="t('admin.employees.create.contactAddressPlaceholder')"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- ============== STEP 2 : Employment & Account ============== -->
        <div v-show="step === 2" class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold text-neutral-900">
              {{ t("admin.employees.create.step2.title") }}
            </h2>
            <p class="text-sm text-neutral-500 mt-1">
              {{ t("admin.employees.create.step2.intro") }}
            </p>
          </div>

          <div
            v-if="resourcesLoading"
            class="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600"
          >
            {{ t("admin.employees.create.loadingResources") }}
          </div>
          <div
            v-else-if="resourcesError"
            class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            {{ resourcesError }}
            <button
              type="button"
              class="ml-2 underline font-medium"
              @click="loadResources"
            >
              {{ t("admin.employees.create.retry") }}
            </button>
          </div>

          <!-- Employment Details -->
          <div>
            <div class="flex items-center gap-2 mb-4 text-sm font-semibold text-secondary-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {{ t("admin.employees.create.employment") }}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FieldLabel required>{{ t("admin.employees.create.joiningDate") }}</FieldLabel>
                <input
                  v-model="form.dateOfJoining"
                  type="date"
                  class="input-base text-sm"
                  :class="{ 'border-error-500': errors.dateOfJoining }"
                />
                <p v-if="errors.dateOfJoining" class="text-xs text-error-600 mt-1">
                  {{ errors.dateOfJoining }}
                </p>
              </div>
              <div>
                <FieldLabel required>{{ t("admin.employees.create.designation") }}</FieldLabel>
                <select
                  v-model="form.designation"
                  class="input-base text-sm"
                  :class="{ 'border-error-500': errors.designation }"
                  :disabled="resourcesLoading"
                >
                  <option value="">{{ t("admin.employees.create.selectDesignation") }}</option>
                  <option v-for="d in designations" :key="d.id" :value="d.name">
                    {{ d.label }}
                  </option>
                </select>
                <p v-if="errors.designation" class="text-xs text-error-600 mt-1">
                  {{ errors.designation }}
                </p>
              </div>
              <div>
                <FieldLabel required>{{ t("admin.employees.create.team") }}</FieldLabel>
                <select
                  v-model="form.team"
                  class="input-base text-sm"
                  :class="{ 'border-error-500': errors.team }"
                  :disabled="resourcesLoading"
                >
                  <option value="">{{ t("admin.employees.create.selectTeam") }}</option>
                  <option v-for="team in teams" :key="team.id" :value="team.name">
                    {{ team.label }}
                  </option>
                </select>
                <p v-if="errors.team" class="text-xs text-error-600 mt-1">
                  {{ errors.team }}
                </p>
              </div>
              <div>
                <FieldLabel>{{ t("admin.employees.create.manager") }}</FieldLabel>
                <select
                  v-model="form.reportingManager"
                  class="input-base text-sm"
                  :class="{ 'border-error-500': errors.reportingManager }"
                  :disabled="resourcesLoading"
                >
                  <option value="">{{ t("admin.employees.create.selectManager") }}</option>
                  <option v-for="m in managers" :key="m.id" :value="m.name">
                    {{ m.label }}
                  </option>
                </select>
                <p v-if="errors.reportingManager" class="text-xs text-error-600 mt-1">
                  {{ errors.reportingManager }}
                </p>
              </div>
              <div>
                <FieldLabel required>{{ t("admin.employees.create.shift") }}</FieldLabel>
                <select
                  v-model="form.shiftId"
                  class="input-base text-sm"
                  :class="{ 'border-error-500': errors.shiftId }"
                  :disabled="resourcesLoading"
                >
                  <option value="">{{ t("admin.employees.create.selectShift") }}</option>
                  <option v-for="s in shifts" :key="s.id" :value="String(s.id)">
                    {{ s.label }}
                  </option>
                </select>
                <p v-if="errors.shiftId" class="text-xs text-error-600 mt-1">
                  {{ errors.shiftId }}
                </p>
              </div>
              <div>
                <FieldLabel required>{{ t("admin.employees.create.department") }}</FieldLabel>
                <select
                  v-model="form.department"
                  class="input-base text-sm"
                  :class="{ 'border-error-500': errors.department }"
                  :disabled="resourcesLoading"
                >
                  <option value="">{{ t("admin.employees.create.selectDepartment") }}</option>
                  <option v-for="d in departments" :key="d.id" :value="d.name">
                    {{ d.label }}
                  </option>
                </select>
                <p v-if="!resourcesLoading && !departments.length" class="text-xs text-neutral-500 mt-1">
                  {{ t("admin.employees.create.noDepartments") }}
                </p>
                <p v-if="errors.department" class="text-xs text-error-600 mt-1">
                  {{ errors.department }}
                </p>
              </div>
            </div>
          </div>

          <!-- Account Settings -->
          <div class="pt-6 border-t border-neutral-100">
            <div class="flex items-center gap-2 mb-4 text-sm font-semibold text-secondary-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3zm-7 8a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7a2 2 0 00-2 2v5z"
                />
              </svg>
              {{ t("admin.employees.create.account") }}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <FieldLabel required>{{ t("admin.employees.create.role") }}</FieldLabel>
                <select
                  v-model="form.role"
                  class="input-base text-sm"
                  :class="{ 'border-error-500': errors.role }"
                  :disabled="resourcesLoading"
                >
                  <option value="">{{ t("admin.employees.create.selectRole") }}</option>
                  <option v-for="r in roleOptions" :key="r.slug" :value="r.slug">
                    {{ r.name }}
                  </option>
                </select>
                <p v-if="!resourcesLoading && !roleOptions.length" class="text-xs text-neutral-500 mt-1">
                  {{ t("admin.employees.create.noRoles") }}
                </p>
                <p v-if="errors.role" class="text-xs text-error-600 mt-1">
                  {{ errors.role }}
                </p>
                <p v-else class="text-xs text-neutral-400 mt-1">
                  {{ t("admin.employees.create.roleHint") }}
                </p>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                      :class="form.useDefaultPassword ? 'bg-secondary-500' : 'bg-neutral-300'"
                      @click="form.useDefaultPassword = !form.useDefaultPassword"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        :class="form.useDefaultPassword ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                    <span class="text-sm font-medium text-neutral-700">
                      {{ t("admin.employees.create.useDefaultPassword") }}
                    </span>
                  </div>
                </div>
                <p v-if="form.useDefaultPassword" class="text-xs text-neutral-500">
                  {{ t("admin.employees.create.defaultPassword") }} <span class="font-mono text-neutral-700">12345678</span>
                </p>
                <div v-else class="mt-2">
                  <input
                    v-model="form.password"
                    type="password"
                    class="input-base text-sm"
                    :class="{ 'border-error-500': errors.password }"
                    :placeholder="t('admin.employees.create.passwordPlaceholder')"
                  />
                  <p v-if="errors.password" class="text-xs text-error-600 mt-1">
                    {{ errors.password }}
                  </p>
                </div>
                <label class="mt-4 flex items-center gap-2 cursor-pointer select-none">
                  <input
                    v-model="form.sendWelcomeEmail"
                    type="checkbox"
                    class="w-4 h-4 rounded border-neutral-300 text-secondary-500 focus:ring-secondary-500"
                  />
                  <span class="text-sm text-neutral-800">{{
                    t("admin.employees.create.sendWelcomeEmail")
                  }}</span>
                </label>
                <p class="text-xs text-neutral-500 mt-1">
                  {{ t("admin.employees.view.lifecycleEmailTemplateHint") }}
                </p>
              </div>
            </div>
          </div>

          <!-- Attendance Configuration -->
          <div class="pt-6 border-t border-neutral-100">
            <div class="flex items-center gap-2 mb-4 text-sm font-semibold text-secondary-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ t("admin.employees.create.attendance") }}
            </div>
            <div>
              <FieldLabel required>{{ t("admin.employees.create.attendanceType") }}</FieldLabel>
              <select
                v-model="form.attendanceType"
                class="input-base text-sm"
                :disabled="resourcesLoading"
              >
                <option value="">{{ t("admin.employees.create.selectAttendanceType") }}</option>
                <option v-for="attType in attendanceTypes" :key="attType.id" :value="attType.code">
                  {{ attType.name }}
                </option>
              </select>
              <p class="text-xs text-neutral-400 mt-1">
                {{ t("admin.employees.create.attendanceHint") }}
              </p>
            </div>
          </div>

          <!-- Probation Period -->
          <div class="pt-6 border-t border-neutral-100">
            <div class="flex items-center gap-2 mb-4 text-sm font-semibold text-secondary-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ t("admin.employees.create.probation") }}
              <span class="ml-1 text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 font-normal">
                {{ t("common.optional") }}
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel>{{ t("admin.employees.create.probationDuration") }}</FieldLabel>
                <select v-model.number="form.probationMonths" class="input-base text-sm">
                  <option :value="0">{{ t("admin.employees.create.noProbation") }}</option>
                  <option :value="1">{{ t("admin.employees.create.months", { n: 1 }) }}</option>
                  <option :value="3">{{ t("admin.employees.create.months", { n: 3 }) }}</option>
                  <option :value="6">{{ t("admin.employees.create.months", { n: 6 }) }}</option>
                  <option :value="12">{{ t("admin.employees.create.months", { n: 12 }) }}</option>
                </select>
              </div>
              <div>
                <FieldLabel>{{ t("admin.employees.create.probationEnd") }}</FieldLabel>
                <input
                  :value="probationEndDate"
                  type="text"
                  class="input-base text-sm bg-neutral-50 text-neutral-500 cursor-not-allowed"
                  :placeholder="t('admin.employees.create.autoCalculated')"
                  readonly
                />
                <p class="text-xs text-neutral-400 mt-1">
                  {{ t("admin.employees.create.probationEndHint") }}
                </p>
              </div>
            </div>
            <div class="mt-4">
              <FieldLabel>{{ t("admin.employees.create.probationNotes") }}</FieldLabel>
              <textarea
                v-model="form.probationNotes"
                rows="2"
                class="input-base text-sm"
                :placeholder="t('admin.employees.create.probationNotesPlaceholder')"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- ============== STEP 3 : Review & Create ============== -->
        <div v-show="step === 3" class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold text-neutral-900">{{ t("admin.employees.create.reviewTitle") }}</h2>
            <p class="text-sm text-neutral-500 mt-1">
              {{ t("admin.employees.create.step3.intro") }}
            </p>
          </div>

          <div
            v-if="submitError"
            class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ submitError }}
          </div>

          <ReviewSection :title="t('admin.employees.create.step1.title')" icon="user">
            <ReviewRow :label="t('admin.employees.create.firstName')" :value="form.firstName" />
            <ReviewRow :label="t('admin.employees.create.lastName')" :value="form.lastName" />
            <ReviewRow :label="t('admin.employees.create.code')" :value="form.employeeCode" />
            <ReviewRow :label="t('admin.employees.create.email')" :value="form.email" />
            <ReviewRow :label="t('admin.employees.create.review.phone')" :value="form.phone" />
            <ReviewRow :label="t('admin.employees.create.altPhone')" :value="form.alternativePhone" />
            <ReviewRow :label="t('admin.employees.create.gender')" :value="genderLabel" />
            <ReviewRow :label="t('admin.employees.create.dob')" :value="form.dateOfBirth" />
            <ReviewRow :label="t('admin.employees.create.address')" :value="form.address" />
          </ReviewSection>

          <ReviewSection :title="t('admin.employees.create.employment')" icon="briefcase">
            <ReviewRow :label="t('admin.employees.create.joiningDate')" :value="form.dateOfJoining" />
            <ReviewRow :label="t('admin.employees.create.designation')" :value="form.designation" />
            <ReviewRow :label="t('admin.employees.create.team')" :value="form.team" />
            <ReviewRow :label="t('admin.employees.create.manager')" :value="form.reportingManager" />
            <ReviewRow :label="t('admin.employees.create.shift')" :value="shiftLabel" />
            <ReviewRow :label="t('admin.employees.create.department')" :value="form.department" />
          </ReviewSection>

          <ReviewSection :title="t('admin.employees.create.account')" icon="lock">
            <ReviewRow :label="t('admin.employees.create.role')" :value="roleLabel" />
            <ReviewRow
              :label="t('admin.employees.create.review.password')"
              :value="form.useDefaultPassword ? t('admin.employees.create.review.defaultPassword') : form.password ? '••••••••' : ''"
            />
          </ReviewSection>

          <ReviewSection :title="t('admin.employees.create.attendance')" icon="calendar">
            <ReviewRow :label="t('admin.employees.create.attendanceType')" :value="attendanceTypeLabel" />
            <ReviewRow :label="t('admin.employees.create.review.configuration')" :value="attendanceConfigLabel" />
          </ReviewSection>

          <ReviewSection :title="t('admin.employees.create.probation')" icon="clock">
            <ReviewRow :label="t('admin.employees.create.review.duration')" :value="probationDurationLabel" />
            <ReviewRow :label="t('admin.employees.create.review.endDate')" :value="probationEndDate" />
          </ReviewSection>
        </div>
      </div>

      <!-- Navigation -->
      <div
        class="flex flex-row justify-between items-center gap-4 px-5 sm:px-8 py-4 border-t border-neutral-200 bg-white"
      >
        <button
          v-if="step === 1"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          @click="backToList"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{ t("admin.employees.create.backToList") }}
        </button>
        <button
          v-else
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          @click="prevStep"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{ t("common.previous") }}
        </button>

        <button
          v-if="step < 3"
          type="button"
          class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm"
          @click="nextStep"
        >
          {{ step === 1 ? t("common.next") : t("admin.employees.create.review") }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <button
          v-else
          type="button"
          class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-sm disabled:opacity-50"
          :disabled="saving"
          @click="createEmployee"
        >
          <span
            v-if="saving"
            class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          />
          <svg
            v-else
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {{ saving ? t("admin.employees.create.creating") : t("admin.employees.create.submit") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "../i18n/index.js";
import { useNewEmployeeResources } from "./employees/composables/useNewEmployeeResources.js";
import { employeesApiService } from "./employees/services/employees.api.service.js";
import { parseApiError } from "../utils/apiErrors.js";

const { t } = useI18n();
const router = useRouter();

const {
  loading: resourcesLoading,
  error: resourcesError,
  teams,
  designations,
  shifts,
  managers,
  departments,
  attendanceTypes,
  roleOptions,
  existingEmails,
  existingCodes,
  loadResources,
} = useNewEmployeeResources();

onMounted(async () => {
  await loadResources();
  const employeeRole = roleOptions.value.find((role) =>
    ["employee", "employe"].includes(role.slug.toLowerCase())
  );
  if (employeeRole && !form.value.role) {
    form.value.role = employeeRole.slug;
  }
});

const step = ref(1);
const saving = ref(false);
const submitError = ref("");

const steps = computed(() => [
  {
    id: 1,
    title: t("admin.employees.create.step1.title"),
    sub: t("admin.employees.create.step1.sub"),
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`,
  },
  {
    id: 2,
    title: t("admin.employees.create.step2.title"),
    sub: t("admin.employees.create.step2.sub"),
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`,
  },
  {
    id: 3,
    title: t("admin.employees.create.step3.title"),
    sub: t("admin.employees.create.step3.sub"),
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  },
]);

function emptyForm() {
  return {
    // Personal
    employeeCode: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    alternativePhone: "",
    address: "",
    emergencyContactName: "",
    emergencyRelationship: "",
    emergencyContactPhone: "",
    emergencyContactAddress: "",
    // Employment
    dateOfJoining: "",
    designation: "",
    team: "",
    reportingManager: "",
    shiftId: "",
    department: "",
    // Account
    role: "",
    useDefaultPassword: true,
    password: "",
    sendWelcomeEmail: true,
    // Attendance
    attendanceType: "open",
    // Probation
    probationMonths: 0,
    probationNotes: "",
  };
}

const form = ref(emptyForm());
const errors = ref({});
const profilePhoto = ref(null);
const profilePhotoPreview = ref("");
const photoInput = ref(null);

// Listes statiques (hors API)
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const relationships = computed(() => [
  { value: "Father", label: t("admin.employees.create.rel.father") },
  { value: "Mother", label: t("admin.employees.create.rel.mother") },
  { value: "Spouse", label: t("admin.employees.create.rel.spouse") },
  { value: "Sibling", label: t("admin.employees.create.rel.sibling") },
  { value: "Friend", label: t("admin.employees.create.rel.friend") },
  { value: "Other", label: t("admin.employees.create.rel.other") },
]);

// === Computeds ===

const genderLabel = computed(() => {
  const map = {
    male: t("admin.employees.create.gender.male"),
    female: t("admin.employees.create.gender.female"),
    other: t("admin.employees.create.gender.other"),
  };
  return map[form.value.gender] || "";
});

const attendanceTypeLabel = computed(() => {
  const found = attendanceTypes.value.find((t) => t.code === form.value.attendanceType);
  return found?.name || form.value.attendanceType || "";
});

const roleLabel = computed(() => {
  const found = roleOptions.value.find((r) => r.slug === form.value.role);
  return found?.name || form.value.role || "";
});

const shiftLabel = computed(() => {
  const found = shifts.value.find((s) => String(s.id) === String(form.value.shiftId));
  return found?.label || "";
});

const attendanceConfigLabel = computed(() =>
  form.value.attendanceType === "open"
    ? t("admin.employees.create.attendanceOpen")
    : t("admin.employees.create.attendanceRestricted")
);

const probationDurationLabel = computed(() => {
  const m = form.value.probationMonths;
  if (!m) return t("admin.employees.create.noProbation");
  return t("admin.employees.create.months", { n: m });
});

const probationEndDate = computed(() => {
  if (!form.value.probationMonths || !form.value.dateOfJoining) return "";
  const raw = String(form.value.dateOfJoining).slice(0, 10);
  const [year, month, day] = raw.split("-").map(Number);
  if (!year || !month || !day) return "";
  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) return "";
  d.setMonth(d.getMonth() + Number(form.value.probationMonths));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
});

// === Validation ===

function validateStep1() {
  const e = {};
  if (!form.value.employeeCode.trim()) e.employeeCode = t("admin.employees.create.error.codeRequired");
  else if (existingCodes.value.includes(form.value.employeeCode.trim().toUpperCase()))
    e.employeeCode = t("admin.employees.create.error.codeExists");

  if (!form.value.email.trim()) e.email = t("admin.employees.create.error.emailRequired");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
    e.email = t("admin.employees.create.error.emailInvalid");
  else if (existingEmails.value.includes(form.value.email.trim().toLowerCase()))
    e.email = t("admin.employees.create.error.emailExists");

  if (!form.value.phone.trim()) e.phone = t("admin.employees.create.error.phoneRequired");

  if (!form.value.firstName.trim()) e.firstName = t("admin.employees.create.error.firstNameRequired");
  if (!form.value.lastName.trim()) e.lastName = t("admin.employees.create.error.lastNameRequired");
  if (!form.value.gender) e.gender = t("admin.employees.create.error.genderRequired");
  if (!form.value.dateOfBirth) e.dateOfBirth = t("admin.employees.create.error.dobRequired");

  errors.value = e;
  return Object.keys(e).length === 0;
}

function validateStep2() {
  const e = {};
  if (!form.value.dateOfJoining) e.dateOfJoining = t("admin.employees.create.error.joiningRequired");
  if (!form.value.designation) e.designation = t("admin.employees.create.error.designationRequired");
  if (!form.value.team) e.team = t("admin.employees.create.error.teamRequired");
  if (!form.value.shiftId) e.shiftId = t("admin.employees.create.error.shiftRequired");
  if (!form.value.department) e.department = t("admin.employees.create.error.departmentRequired");
  if (!form.value.role) e.role = t("admin.employees.create.error.roleRequired");
  if (!form.value.useDefaultPassword) {
    if (!form.value.password || form.value.password.length < 8)
      e.password = t("admin.employees.create.error.passwordMin");
  }
  errors.value = e;
  return Object.keys(e).length === 0;
}

// === Navigation ===

function nextStep() {
  if (step.value === 1 && !validateStep1()) return;
  if (step.value === 2 && !validateStep2()) return;
  if (step.value < 3) step.value += 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function prevStep() {
  if (step.value > 1) step.value -= 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToStep(target) {
  if (target === step.value) return;
  if (target < step.value) {
    step.value = target;
    return;
  }
  if (target === 2 && validateStep1()) step.value = 2;
  else if (target === 3 && validateStep1() && validateStep2()) step.value = 3;
}

function backToList() {
  router.push("/employees");
}

async function createEmployee() {
  if (!validateStep1() || !validateStep2()) {
    step.value = !validateStep1() ? 1 : 2;
    return;
  }
  if (saving.value) return;

  saving.value = true;
  submitError.value = "";

  const selectedShift = shifts.value.find(
    (s) => String(s.id) === String(form.value.shiftId),
  );
  const selectedManager = managers.value.find(
    (m) => m.name === form.value.reportingManager,
  );

  const payload = {
    matricule: form.value.employeeCode.trim(),
    first_name: form.value.firstName.trim(),
    last_name: form.value.lastName.trim(),
    email: form.value.email.trim(),
    phone: form.value.phone.trim() || null,
    date_of_birth: form.value.dateOfBirth || null,
    hired_at: form.value.dateOfJoining || null,
    job_title: form.value.designation || null,
    department: form.value.department || null,
    role: form.value.role,
    create_user: true,
    use_default_password: !!form.value.useDefaultPassword,
    password: form.value.useDefaultPassword ? null : form.value.password,
    notify_by_email: !!form.value.sendWelcomeEmail,
    metadata: {
      gender: form.value.gender || null,
      blood_group: form.value.bloodGroup || null,
      alternative_phone: form.value.alternativePhone || null,
      address: form.value.address || null,
      emergency_contact_name: form.value.emergencyContactName || null,
      emergency_relationship: form.value.emergencyRelationship || null,
      emergency_contact_phone: form.value.emergencyContactPhone || null,
      emergency_contact_address: form.value.emergencyContactAddress || null,
      designation: form.value.designation || null,
      team: form.value.team || null,
      reporting_manager: form.value.reportingManager || null,
      reporting_manager_id: selectedManager?.id ?? null,
      shift: selectedShift?.name || selectedShift?.label || null,
      shift_id: selectedShift?.id ?? null,
      attendance_type: form.value.attendanceType || null,
      probation_months: Number(form.value.probationMonths) || 0,
      probation_notes: form.value.probationNotes || null,
      probation_end_date: probationEndDate.value || null,
    },
  };

  try {
    const created = await employeesApiService.create(payload);

    if (profilePhoto.value && created?.id) {
      await employeesApiService.updateAvatar(created.id, profilePhoto.value);
    }

    router.push("/employees");
  } catch (e) {
    submitError.value = parseApiError(e) || t("admin.employees.create.error.submit");
  } finally {
    saving.value = false;
  }
}

// === Photo ===

function handlePhotoUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert(t("admin.employees.create.error.fileSize"));
    return;
  }
  profilePhoto.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => (profilePhotoPreview.value = ev.target.result);
  reader.readAsDataURL(file);
}

function clearPhoto() {
  profilePhoto.value = null;
  profilePhotoPreview.value = "";
  if (photoInput.value) photoInput.value.value = "";
}

// === Sub-components légers ===

const FieldLabel = {
  props: { required: { type: Boolean, default: false } },
  setup(props, { slots }) {
    return () =>
      h(
        "label",
        { class: "block text-sm font-medium text-neutral-700 mb-1.5" },
        [
          slots.default?.(),
          props.required
            ? h("span", { class: "text-error-600 ml-0.5" }, "*")
            : null,
        ]
      );
  },
};

const ReviewSection = {
  props: {
    title: String,
    icon: { type: String, default: "user" },
  },
  setup(props, { slots }) {
    const iconPaths = {
      user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      briefcase:
        "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      lock: "M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3zm-7 8a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7a2 2 0 00-2 2v5z",
      calendar:
        "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    };
    return () =>
      h(
        "section",
        {
          class:
            "rounded-xl border border-neutral-200 bg-white overflow-hidden",
        },
        [
          h(
            "header",
            {
              class:
                "flex items-center gap-2 px-5 py-3 border-b border-neutral-100 text-sm font-semibold text-neutral-700",
            },
            [
              h(
                "svg",
                {
                  class: "w-5 h-5 text-neutral-500",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                },
                [
                  h("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: iconPaths[props.icon] || iconPaths.user,
                  }),
                ]
              ),
              props.title,
            ]
          ),
          h(
            "div",
            { class: "divide-y divide-neutral-100" },
            slots.default?.()
          ),
        ]
      );
  },
};

const ReviewRow = {
  props: { label: String, value: [String, Number] },
  setup(props) {
    return () =>
      h(
        "div",
        { class: "flex items-center justify-between px-5 py-2.5 text-sm" },
        [
          h("span", { class: "text-neutral-600" }, props.label),
          h(
            "span",
            { class: "text-neutral-900 text-right" },
            props.value !== "" && props.value != null ? String(props.value) : "-"
          ),
        ]
      );
  },
};
</script>
