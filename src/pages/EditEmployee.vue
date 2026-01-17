<template>
  <div class="px-8 py-6">
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
            Edit Employee
          </h1>
          <p class="text-neutral-600">
            Update employee profile and information
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 text-sm text-neutral-600">
        <span>All Employees</span>
        <span>›</span>
        <span>Edit Employee</span>
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
            Personal Information
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
                  alt="Profile"
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
                >Profile Photo</label
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
                Change Photo
              </button>
              <p class="text-xs text-neutral-500 mt-1">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <!-- Personal Info Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >First Name *</label
              >
              <input
                v-model="formData.firstName"
                type="text"
                class="input-base"
                placeholder="John"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Last Name *</label
              >
              <input
                v-model="formData.lastName"
                type="text"
                class="input-base"
                placeholder="Doe"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Email Address *</label
              >
              <input
                v-model="formData.email"
                type="email"
                class="input-base"
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Phone Number</label
              >
              <input
                v-model="formData.phone"
                type="tel"
                class="input-base"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Date of Birth</label
              >
              <input
                v-model="formData.dateOfBirth"
                type="date"
                class="input-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Gender</label
              >
              <select v-model="formData.gender" class="input-base">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Nationality</label
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
                >Marital Status</label
              >
              <select v-model="formData.maritalStatus" class="input-base">
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </div>

          <!-- Address Section -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2"
              >Address</label
            >
            <textarea
              v-model="formData.address"
              rows="3"
              class="input-base"
              placeholder="123 Main Street, City, State, ZIP"
            ></textarea>
          </div>
        </div>

        <!-- Professional Information Tab -->
        <div v-if="activeTab === 'professional'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            Professional Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Department *</label
              >
              <select v-model="formData.department" class="input-base">
                <option value="">Select Department</option>
                <option value="Sales">Sales</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Job Title *</label
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
                >Employment Type</label
              >
              <select v-model="formData.employmentType" class="input-base">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Start Date</label
              >
              <input
                v-model="formData.startDate"
                type="date"
                class="input-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Manager</label
              >
              <select v-model="formData.manager" class="input-base">
                <option value="">Select Manager</option>
                <option value="Sarah Admin">Sarah Admin</option>
                <option value="John Director">John Director</option>
                <option value="Emma Lead">Emma Lead</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Salary</label
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
              >Employee Status</label
            >
            <div class="flex gap-4">
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="active"
                  class="text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-neutral-700">Active</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="inactive"
                  class="text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-neutral-700">Inactive</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="on-leave"
                  class="text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-neutral-700">On Leave</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Remuneration Tab -->
        <div v-if="activeTab === 'remuneration'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            Remuneration
          </h2>

          <!-- Salary Information -->
          <div>
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Salary Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >Base Salary *</label
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
                  >Monthly Salary</label
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
                  Calculated automatically
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >Annual Salary</label
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
                  Calculated automatically
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >Currency</label
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
              Allowances & Bonuses
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >Transportation Allowance</label
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
                  >Meal Allowance</label
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
                  >Performance Bonus</label
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
                  >Overtime Rate (per hour)</label
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
              Benefits
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
                      Health Insurance
                    </p>
                    <p class="text-xs text-neutral-500">
                      Medical, Dental, Vision coverage
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
                      401(k) Retirement Plan
                    </p>
                    <p class="text-xs text-neutral-500">
                      Company match percentage
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
                      Life Insurance
                    </p>
                    <p class="text-xs text-neutral-500">
                      Coverage amount
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
              Tax Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >Tax ID Number (SSN)</label
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
                  >Tax Filing Status</label
                >
                <select v-model="formData.taxStatus" class="input-base">
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married-jointly">Married Filing Jointly</option>
                  <option value="married-separately"
                    >Married Filing Separately</option
                  >
                  <option value="head-of-household"
                    >Head of Household</option
                  >
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >Federal Tax Withholding</label
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
                  >State Tax Withholding</label
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
              Payment Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >Payment Method</label
                >
                <select v-model="formData.paymentMethod" class="input-base">
                  <option value="direct-deposit">Direct Deposit</option>
                  <option value="check">Check</option>
                  <option value="wire-transfer">Wire Transfer</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2"
                  >Bank Name</label
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
                  >Account Number</label
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
                  >Routing Number</label
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
            Documents
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
                    Upload Appointment Letter
                  </h3>
                  <p class="text-xs text-neutral-500 mb-3">
                    Supported formats - .jpeg, .pdf
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
                    Choose File
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
                    <span class="text-xs text-success-600">Uploaded</span>
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
                    Upload Salary Slips
                  </h3>
                  <p class="text-xs text-neutral-500 mb-3">
                    Supported formats - .jpeg, .pdf
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
                    Choose File
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
                      >{{ documents.salarySlips.length }} file(s) uploaded</span
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
                    Upload Relieving Letter
                  </h3>
                  <p class="text-xs text-neutral-500 mb-3">
                    Supported formats - .jpeg, .pdf
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
                    Choose File
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
                    <span class="text-xs text-success-600">Uploaded</span>
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
                    Upload Experience Letter
                  </h3>
                  <p class="text-xs text-neutral-500 mb-3">
                    Supported formats - .jpeg, .pdf
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
                    Choose File
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
                    <span class="text-xs text-success-600">Uploaded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Access Tab -->
        <div v-if="activeTab === 'account'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            Account Access
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Username *</label
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
                >Login Email *</label
              >
              <input
                v-model="formData.loginEmail"
                type="email"
                class="input-base"
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Password</label
              >
              <input
                v-model="formData.password"
                type="password"
                class="input-base"
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2"
                >Confirm Password</label
              >
              <input
                v-model="formData.confirmPassword"
                type="password"
                class="input-base"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2"
              >Role *</label
            >
            <select v-model="formData.role" class="input-base">
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <!-- Form Actions -->
        <div
          class="flex justify-end gap-4 pt-6 border-t border-neutral-200 mt-8"
        >
          <button type="button" @click="$router.go(-1)" class="btn-outline">
            Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="isLoading">
            <span v-if="isLoading">Updating...</span>
            <span v-else>Update Employee</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activeTab = ref("personal");
const isLoading = ref(false);
const profilePhotoPreview = ref("");

const tabs = ref([
  { id: "personal", label: "Personal" },
  { id: "professional", label: "Professional" },
  { id: "remuneration", label: "Remuneration" },
  { id: "documents", label: "Documents" },
  { id: "account", label: "Account" },
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
