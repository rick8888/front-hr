<template>
  <div class="px-4 py-4 sm:px-8 sm:py-6">
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <button
          @click="$router.go(-1)"
          class="text-neutral-600 hover:text-neutral-900"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 mb-2">
            {{ t("admin.employees.edit.title") }}
          </h1>
          <p class="text-neutral-600">
            {{ t("admin.employees.edit.subtitle") }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 text-sm text-neutral-600">
        <span>{{ t("admin.employees.edit.allEmployees") }}</span>
        <span>›</span>
        <span>{{ t("admin.employees.edit.title") }}</span>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-2 mb-6 border-b border-neutral-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-3 font-medium transition-colors',
          activeTab === tab.id
            ? 'border-b-2 border-primary-500 text-primary-600'
            : 'text-neutral-600 hover:text-neutral-900',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="card bg-white rounded-lg shadow">
      <form @submit.prevent="handleSubmit" class="p-6">
        <!-- Personal Information Tab -->
        <div v-if="activeTab === 'personal'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            {{ t("admin.employees.show.personal") }}
          </h2>

          <!-- Profile Photo Section -->
          <div class="flex items-start gap-6">
            <div class="flex-shrink-0">
              <div
                class="w-24 h-24 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="profilePhotoPreview"
                  :src="profilePhotoPreview"
                  :alt="t('admin.employees.create.photoAlt')"
                  class="w-full h-full object-cover"
                />
                <svg
                  v-else
                  class="w-12 h-12 text-neutral-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.profilePhoto") }}</label
              >
              <input
                type="file"
                @change="handlePhotoUpload"
                class="hidden"
                ref="photoInput"
                accept="image/*"
              />
              <button
                type="button"
                @click="$refs.photoInput.click()"
                class="btn-outline text-sm"
              >
                {{ t("admin.employees.edit.changePhoto") }}
              </button>
              <p class="text-xs text-neutral-500 mt-1">
                {{ t("admin.employees.edit.photoTypes") }}
              </p>
            </div>
          </div>

          <!-- Personal Info Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.create.firstName") }} *</label
              >
              <input
                v-model="formData.firstName"
                type="text"
                class="input-base"
                :placeholder="t('admin.employees.create.firstNamePlaceholder')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.create.lastName") }} *</label
              >
              <input
                v-model="formData.lastName"
                type="text"
                class="input-base"
                :placeholder="t('admin.employees.create.lastNamePlaceholder')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.show.email") }} *</label
              >
              <input
                v-model="formData.email"
                type="email"
                class="input-base"
                :placeholder="t('admin.employees.create.emailPlaceholder')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.create.phone") }}</label
              >
              <input
                v-model="formData.phone"
                type="tel"
                class="input-base"
                :placeholder="t('admin.employees.create.phonePlaceholder')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.create.dob") }}</label
              >
              <input
                v-model="formData.dateOfBirth"
                type="date"
                class="input-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.create.gender") }}</label
              >
              <select v-model="formData.gender" class="input-base">
                <option value="">{{ t("admin.employees.create.selectGender") }}</option>
                <option value="male">{{ t("admin.employees.create.gender.male") }}</option>
                <option value="female">{{ t("admin.employees.create.gender.female") }}</option>
                <option value="other">{{ t("admin.employees.create.gender.other") }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.nationality") }}</label
              >
              <input
                v-model="formData.nationality"
                type="text"
                class="input-base"
                placeholder="American"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.maritalStatus") }}</label
              >
              <select v-model="formData.maritalStatus" class="input-base">
                <option value="">{{ t("admin.employees.edit.selectStatus") }}</option>
                <option value="single">{{ t("admin.employees.edit.marital.single") }}</option>
                <option value="married">{{ t("admin.employees.edit.marital.married") }}</option>
                <option value="divorced">{{ t("admin.employees.edit.marital.divorced") }}</option>
                <option value="widowed">{{ t("admin.employees.edit.marital.widowed") }}</option>
              </select>
            </div>
          </div>

          <!-- Address Section -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2"
              >{{ t("admin.employees.create.address") }}</label
            >
            <textarea
              v-model="formData.address"
              rows="3"
              class="input-base"
              :placeholder="t('admin.employees.create.addressPlaceholder')"
            ></textarea>
          </div>
        </div>

        <!-- Professional Information Tab -->
        <div v-if="activeTab === 'professional'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            {{ t("admin.employees.show.professional") }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.create.department") }} *</label
              >
              <select v-model="formData.department" class="input-base">
                <option value="">{{ t("admin.employees.edit.selectDepartment") }}</option>
                <option value="Sales">Sales</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.jobTitle") }} *</label
              >
              <input
                v-model="formData.jobTitle"
                type="text"
                class="input-base"
                placeholder="Senior Developer"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.employmentType") }}</label
              >
              <select v-model="formData.employmentType" class="input-base">
                <option value="Full-time">{{ t("admin.employees.edit.type.fullTime") }}</option>
                <option value="Part-time">{{ t("admin.employees.edit.type.partTime") }}</option>
                <option value="Contract">{{ t("admin.employees.edit.type.contract") }}</option>
                <option value="Intern">{{ t("admin.employees.edit.type.intern") }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.startDate") }}</label
              >
              <input
                v-model="formData.startDate"
                type="date"
                class="input-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.manager") }}</label
              >
              <select v-model="formData.manager" class="input-base">
                <option value="">{{ t("admin.employees.edit.selectManager") }}</option>
                <option value="Sarah Admin">Sarah Admin</option>
                <option value="John Director">John Director</option>
                <option value="Emma Lead">Emma Lead</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.salary") }}</label
              >
              <input
                v-model="formData.salary"
                type="text"
                class="input-base"
                placeholder="$50,000"
              />
            </div>
          </div>

          <!-- Employee Status -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-3"
              >{{ t("admin.employees.edit.employeeStatus") }}</label
            >
            <div class="flex gap-4">
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="active"
                  class="text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-neutral-700">{{ t("admin.employees.status.active") }}</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="inactive"
                  class="text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-neutral-700">{{ t("admin.employees.status.inactive") }}</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="on-leave"
                  class="text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-neutral-700">{{ t("admin.employees.status.onLeave") }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Remuneration Tab -->
        <div v-if="activeTab === 'remuneration'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            {{ t("admin.employees.show.remuneration") }}
          </h2>

          <!-- Salary Information -->
          <div>
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t("admin.employees.edit.salaryInfo") }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.baseSalary") }} *</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    >$</span
                  >
                  <input
                    v-model="formData.baseSalary"
                    type="number"
                    class="input-base pl-8"
                    placeholder="5500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.monthlySalary") }}</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    >$</span
                  >
                  <input
                    v-model="formData.monthlySalary"
                    type="number"
                    class="input-base pl-8"
                    placeholder="6500"
                    readonly
                  />
                </div>
                <p class="text-xs text-neutral-500 mt-1">
                  {{ t("admin.employees.create.autoCalculated") }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.annualSalary") }}</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    >$</span
                  >
                  <input
                    v-model="formData.annualSalary"
                    type="number"
                    class="input-base pl-8"
                    placeholder="78000"
                    readonly
                  />
                </div>
                <p class="text-xs text-neutral-500 mt-1">
                  {{ t("admin.employees.create.autoCalculated") }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.currency") }}</label
                >
                <select v-model="formData.currency" class="input-base">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Allowances & Bonuses -->
          <div>
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t("admin.employees.edit.allowancesBonuses") }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.transportation") }}</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    >$</span
                  >
                  <input
                    v-model="formData.transportationAllowance"
                    type="number"
                    class="input-base pl-8"
                    placeholder="200"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.meal") }}</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    >$</span
                  >
                  <input
                    v-model="formData.mealAllowance"
                    type="number"
                    class="input-base pl-8"
                    placeholder="150"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.bonus") }}</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    >$</span
                  >
                  <input
                    v-model="formData.performanceBonus"
                    type="number"
                    class="input-base pl-8"
                    placeholder="500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.overtimeRate") }}</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    >$</span
                  >
                  <input
                    v-model="formData.overtimeRate"
                    type="number"
                    class="input-base pl-8"
                    placeholder="25"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Benefits -->
          <div>
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t("admin.employees.edit.benefits") }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div class="flex items-center gap-3">
                  <input
                    v-model="formData.healthInsurance"
                    type="checkbox"
                    class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <p class="text-sm font-medium text-neutral-900">
                      {{ t("admin.employees.edit.healthInsurance") }}
                    </p>
                    <p class="text-xs text-neutral-500">
                      {{ t("admin.employees.edit.healthInsuranceHint") }}
                    </p>
                  </div>
                </div>
                <div class="w-32">
                  <div class="relative">
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm"
                      >$</span
                    >
                    <input
                      v-model="formData.healthInsuranceAmount"
                      type="number"
                      class="input-base pl-8 text-sm"
                      placeholder="350"
                      :disabled="!formData.healthInsurance"
                    />
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div class="flex items-center gap-3">
                  <input
                    v-model="formData.retirementPlan"
                    type="checkbox"
                    class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <p class="text-sm font-medium text-neutral-900">
                      {{ t("admin.employees.edit.retirementPlan") }}
                    </p>
                    <p class="text-xs text-neutral-500">
                      {{ t("admin.employees.edit.retirementHint") }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-24 relative">
                    <input
                      v-model="formData.retirementMatch"
                      type="number"
                      class="input-base text-sm pr-8"
                      placeholder="5"
                      :disabled="!formData.retirementPlan"
                    />
                    <span
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm"
                      >%</span
                    >
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div class="flex items-center gap-3">
                  <input
                    v-model="formData.lifeInsurance"
                    type="checkbox"
                    class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <p class="text-sm font-medium text-neutral-900">
                      {{ t("admin.employees.edit.lifeInsurance") }}
                    </p>
                    <p class="text-xs text-neutral-500">
                      {{ t("admin.employees.edit.lifeInsuranceHint") }}
                    </p>
                  </div>
                </div>
                <div class="w-32">
                  <div class="relative">
                    <span
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm"
                      >$</span
                    >
                    <input
                      v-model="formData.lifeInsuranceAmount"
                      type="number"
                      class="input-base pl-8 text-sm"
                      placeholder="50000"
                      :disabled="!formData.lifeInsurance"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tax Information -->
          <div>
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t("admin.employees.edit.taxInfo") }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.taxId") }}</label
                >
                <input
                  v-model="formData.taxId"
                  type="text"
                  class="input-base"
                  placeholder="123-45-6789"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.taxFiling") }}</label
                >
                <select v-model="formData.taxStatus" class="input-base">
                  <option value="">{{ t("admin.employees.edit.selectStatus") }}</option>
                  <option value="single">{{ t("admin.employees.edit.marital.single") }}</option>
                  <option value="married-jointly">{{ t("admin.employees.edit.tax.jointly") }}</option>
                  <option value="married-separately"
                    >{{ t("admin.employees.edit.tax.separately") }}</option
                  >
                  <option value="head-of-household"
                    >{{ t("admin.employees.edit.tax.head") }}</option
                  >
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.federalTax") }}</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    >$</span
                  >
                  <input
                    v-model="formData.federalTax"
                    type="number"
                    class="input-base pl-8"
                    placeholder="1200"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.stateTax") }}</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    >$</span
                  >
                  <input
                    v-model="formData.stateTax"
                    type="number"
                    class="input-base pl-8"
                    placeholder="325"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div>
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t("admin.employees.edit.paymentInfo") }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.paymentMethod") }}</label
                >
                <select v-model="formData.paymentMethod" class="input-base">
                  <option value="direct-deposit">{{ t("admin.employees.edit.payment.direct") }}</option>
                  <option value="check">{{ t("admin.employees.edit.payment.check") }}</option>
                  <option value="wire-transfer">{{ t("admin.employees.edit.payment.wire") }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.bankName") }}</label
                >
                <input
                  v-model="formData.bankName"
                  type="text"
                  class="input-base"
                  placeholder="Bank of America"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.accountNumber") }}</label
                >
                <input
                  v-model="formData.accountNumber"
                  type="text"
                  class="input-base"
                  placeholder="****1234"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >{{ t("admin.employees.edit.routingNumber") }}</label
                >
                <input
                  v-model="formData.routingNumber"
                  type="text"
                  class="input-base"
                  placeholder="123456789"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Tab -->
        <div v-if="activeTab === 'documents'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            {{ t("admin.employees.show.documents") }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Appointment Letter -->
            <div class="group">
              <div
                class="bg-secondary-100 rounded-lg p-6 border-2 border-dashed border-secondary-300 hover:border-secondary-400 transition-colors"
              >
                <div class="text-center">
                  <div
                    class="w-12 h-12 bg-secondary-200 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary-300 transition-colors"
                  >
                    <svg
                      class="w-6 h-6 text-secondary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-sm font-medium text-neutral-900 mb-1">
                    {{ t("admin.employees.edit.uploadAppointment") }}
                  </h3>
                  <p class="text-xs text-neutral-500 mb-3">
                    {{ t("admin.employees.edit.supportedFormats") }}
                  </p>
                  <input
                    type="file"
                    @change="handleFileSelect($event, 'appointmentLetter')"
                    class="hidden"
                    ref="appointmentLetterInput"
                    accept=".jpeg,.jpg,.pdf"
                  />
                  <button
                    type="button"
                    @click="$refs.appointmentLetterInput.click()"
                    class="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                  >
                    {{ t("common.chooseFile") }}
                  </button>
                  <div
                    v-if="documents.appointmentLetter"
                    class="mt-2 flex items-center justify-center gap-2"
                  >
                    <svg
                      class="w-4 h-4 text-success-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-xs text-success-600">{{ t("admin.employees.edit.uploaded") }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Salary Slips -->
            <div class="group">
              <div
                class="bg-secondary-100 rounded-lg p-6 border-2 border-dashed border-secondary-300 hover:border-secondary-400 transition-colors"
              >
                <div class="text-center">
                  <div
                    class="w-12 h-12 bg-secondary-200 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary-300 transition-colors"
                  >
                    <svg
                      class="w-6 h-6 text-secondary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-sm font-medium text-neutral-900 mb-1">
                    {{ t("admin.employees.edit.uploadSalarySlips") }}
                  </h3>
                  <p class="text-xs text-neutral-500 mb-3">
                    {{ t("admin.employees.edit.supportedFormats") }}
                  </p>
                  <input
                    type="file"
                    @change="handleFileSelect($event, 'salarySlips')"
                    class="hidden"
                    ref="salarySlipsInput"
                    accept=".jpeg,.jpg,.pdf"
                    multiple
                  />
                  <button
                    type="button"
                    @click="$refs.salarySlipsInput.click()"
                    class="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                  >
                    {{ t("common.chooseFile") }}
                  </button>
                  <div
                    v-if="
                      documents.salarySlips && documents.salarySlips.length > 0
                    "
                    class="mt-2 flex items-center justify-center gap-2"
                  >
                    <svg
                      class="w-4 h-4 text-success-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-xs text-success-600"
                      >{{ t("admin.employees.edit.filesUploaded", { n: documents.salarySlips.length }) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Relieving Letter -->
            <div class="group">
              <div
                class="bg-secondary-100 rounded-lg p-6 border-2 border-dashed border-secondary-300 hover:border-secondary-400 transition-colors"
              >
                <div class="text-center">
                  <div
                    class="w-12 h-12 bg-secondary-200 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary-300 transition-colors"
                  >
                    <svg
                      class="w-6 h-6 text-secondary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-sm font-medium text-neutral-900 mb-1">
                    {{ t("admin.employees.edit.uploadRelieving") }}
                  </h3>
                  <p class="text-xs text-neutral-500 mb-3">
                    {{ t("admin.employees.edit.supportedFormats") }}
                  </p>
                  <input
                    type="file"
                    @change="handleFileSelect($event, 'relievingLetter')"
                    class="hidden"
                    ref="relievingLetterInput"
                    accept=".jpeg,.jpg,.pdf"
                  />
                  <button
                    type="button"
                    @click="$refs.relievingLetterInput.click()"
                    class="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                  >
                    {{ t("common.chooseFile") }}
                  </button>
                  <div
                    v-if="documents.relievingLetter"
                    class="mt-2 flex items-center justify-center gap-2"
                  >
                    <svg
                      class="w-4 h-4 text-success-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-xs text-success-600">{{ t("admin.employees.edit.uploaded") }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Experience Letter -->
            <div class="group">
              <div
                class="bg-secondary-100 rounded-lg p-6 border-2 border-dashed border-secondary-300 hover:border-secondary-400 transition-colors"
              >
                <div class="text-center">
                  <div
                    class="w-12 h-12 bg-secondary-200 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary-300 transition-colors"
                  >
                    <svg
                      class="w-6 h-6 text-secondary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-sm font-medium text-neutral-900 mb-1">
                    {{ t("admin.employees.edit.uploadExperience") }}
                  </h3>
                  <p class="text-xs text-neutral-500 mb-3">
                    {{ t("admin.employees.edit.supportedFormats") }}
                  </p>
                  <input
                    type="file"
                    @change="handleFileSelect($event, 'experienceLetter')"
                    class="hidden"
                    ref="experienceLetterInput"
                    accept=".jpeg,.jpg,.pdf"
                  />
                  <button
                    type="button"
                    @click="$refs.experienceLetterInput.click()"
                    class="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                  >
                    {{ t("common.chooseFile") }}
                  </button>
                  <div
                    v-if="documents.experienceLetter"
                    class="mt-2 flex items-center justify-center gap-2"
                  >
                    <svg
                      class="w-4 h-4 text-success-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-xs text-success-600">{{ t("admin.employees.edit.uploaded") }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Access Tab -->
        <div v-if="activeTab === 'account'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            {{ t("admin.employees.edit.accountAccess") }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.username") }} *</label
              >
              <input
                v-model="formData.username"
                type="text"
                class="input-base"
                placeholder="johndoe"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.loginEmail") }} *</label
              >
              <input
                v-model="formData.loginEmail"
                type="email"
                class="input-base"
                :placeholder="t('admin.employees.create.emailPlaceholder')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.password") }}</label
              >
              <input
                v-model="formData.password"
                type="password"
                class="input-base"
                :placeholder="t('admin.employees.edit.passwordKeep')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >{{ t("admin.employees.edit.confirmPassword") }}</label
              >
              <input
                v-model="formData.confirmPassword"
                type="password"
                class="input-base"
                :placeholder="t('admin.employees.edit.confirmPasswordPlaceholder')"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2"
              >{{ t("admin.employees.create.role") }} *</label
            >
            <select v-model="formData.role" class="input-base">
              <option value="">{{ t("admin.employees.create.selectRole") }}</option>
              <option value="employee">{{ t("admin.employees.edit.role.employee") }}</option>
              <option value="manager">{{ t("admin.employees.edit.role.manager") }}</option>
              <option value="hr">{{ t("admin.employees.edit.role.hr") }}</option>
              <option value="admin">{{ t("admin.employees.edit.role.admin") }}</option>
            </select>
          </div>
        </div>

        <!-- Form Actions -->
        <div
          class="flex justify-end gap-4 pt-6 border-t border-neutral-200 mt-8"
        >
          <button type="button" @click="$router.go(-1)" class="btn-outline">
            {{ t("common.cancel") }}
          </button>
          <button type="submit" class="btn-primary" :disabled="isLoading">
            <span v-if="isLoading">{{ t("common.updating") }}</span>
            <span v-else>{{ t("admin.employees.edit.update") }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "../i18n/index.js";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const activeTab = ref("personal");
const isLoading = ref(false);
const profilePhotoPreview = ref("");

const tabs = computed(() => [
  { id: "personal", label: t("admin.employees.edit.tab.personal") },
  { id: "professional", label: t("admin.employees.edit.tab.professional") },
  { id: "remuneration", label: t("admin.employees.edit.tab.remuneration") },
  { id: "documents", label: t("admin.employees.edit.tab.documents") },
  { id: "account", label: t("admin.employees.edit.tab.account") },
]);

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  maritalStatus: "",
  address: "",
  department: "",
  jobTitle: "",
  employmentType: "Full-time",
  startDate: "",
  manager: "",
  salary: "",
  status: "active",
  username: "",
  loginEmail: "",
  password: "",
  confirmPassword: "",
  role: "",
  // Remuneration fields
  baseSalary: "",
  monthlySalary: "",
  annualSalary: "",
  currency: "USD",
  transportationAllowance: "",
  mealAllowance: "",
  performanceBonus: "",
  overtimeRate: "",
  healthInsurance: false,
  healthInsuranceAmount: "",
  retirementPlan: false,
  retirementMatch: "",
  lifeInsurance: false,
  lifeInsuranceAmount: "",
  taxId: "",
  taxStatus: "",
  federalTax: "",
  stateTax: "",
  paymentMethod: "direct-deposit",
  bankName: "",
  accountNumber: "",
  routingNumber: "",
});

const documents = ref({
  appointmentLetter: null,
  salarySlips: [],
  relievingLetter: null,
  experienceLetter: null,
});

// Refs for file inputs
const photoInput = ref(null);
const appointmentLetterInput = ref(null);
const salarySlipsInput = ref(null);
const relievingLetterInput = ref(null);
const experienceLetterInput = ref(null);

const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePhotoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleFileSelect = (event, type) => {
  const files = event.target.files;
  if (type === "salarySlips") {
    documents.value[type] = Array.from(files);
  } else {
    documents.value[type] = files[0];
  }
};

const handleSubmit = async () => {
  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would make the actual API call to update the employee
    console.log("Updating employee:", formData.value);

    // Redirect back to employees page
    router.push("/employees");
  } catch (error) {
    console.error("Error updating employee:", error);
  } finally {
    isLoading.value = false;
  }
};

// Load employee data on mount
onMounted(() => {
  const employeeId = route.params.id;
  // Here you would fetch employee data from API
  // For now, we'll simulate loading existing data
  loadEmployeeData(employeeId);
});

const loadEmployeeData = (employeeId) => {
  // Simulate fetching employee data
  // In real app, this would be an API call
  const mockEmployee = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-01-15",
    gender: "male",
    nationality: "American",
    maritalStatus: "married",
    address: "123 Main Street, New York, NY 10001",
    department: "Engineering",
    jobTitle: "Senior Developer",
    employmentType: "Full-time",
    startDate: "2020-03-01",
    manager: "Sarah Admin",
    salary: "$80,000",
    status: "active",
    username: "johndoe",
    loginEmail: "john@example.com",
    role: "employee",
  };

  formData.value = { ...mockEmployee };
};
</script>

<style scoped></style>
