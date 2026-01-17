<template>
  <div class="px-8 py-6">
    <h1 class="text-2xl font-bold text-neutral-900 mb-6">Settings</h1>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 border-b border-neutral-200 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-3 font-medium text-sm transition-colors duration-200 border-b-2 whitespace-nowrap',
          activeTab === tab.id
            ? 'text-primary-600 border-primary-600'
            : 'text-neutral-600 border-transparent hover:text-neutral-900 hover:border-neutral-300',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <!-- General Tab -->
      <div v-if="activeTab === 'general'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-neutral-900">Company Information</h2>
          <button @click="saveGeneralSettings" class="btn-primary">
            Save Changes
          </button>
        </div>

        <div class="space-y-8 max-w-4xl">
          <!-- Company Logo Section -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Company Logo
            </h3>
            <div class="flex items-center gap-6">
              <div class="relative">
                <div
                  v-if="generalSettings.logo"
                  class="w-24 h-24 rounded-lg border-2 border-neutral-200 overflow-hidden bg-neutral-50 flex items-center justify-center"
                >
                  <img
                    :src="generalSettings.logo"
                    alt="Company Logo"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-24 h-24 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center"
                >
                  <svg
                    class="w-8 h-8 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <label
                  class="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer text-sm font-medium"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleLogoUpload"
                  />
                </label>
                <p class="text-xs text-neutral-500 mt-2">
                  Recommended: 200x200px, PNG or JPG, max 2MB
                </p>
                <button
                  v-if="generalSettings.logo"
                  @click="removeLogo"
                  class="text-sm text-error-600 hover:text-error-700 mt-2"
                >
                  Remove Logo
                </button>
              </div>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Basic Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Company Name <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="generalSettings.name"
                  type="text"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Company Type
                </label>
                <select
                  v-model="generalSettings.companyType"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                >
                  <option value="SARL">SARL</option>
                  <option value="SA">SA</option>
                  <option value="SAS">SAS</option>
                  <option value="EURL">EURL</option>
                  <option value="SNC">SNC</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Company Email <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="generalSettings.email"
                  type="email"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Phone <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="generalSettings.phone"
                  type="tel"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Website
                </label>
                <input
                  v-model="generalSettings.website"
                  type="url"
                  placeholder="https://www.example.com"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Founded Year
                </label>
                <input
                  v-model.number="generalSettings.foundedYear"
                  type="number"
                  placeholder="2020"
                  min="1900"
                  :max="new Date().getFullYear()"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                v-model="generalSettings.description"
                rows="3"
                placeholder="Company description..."
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              ></textarea>
            </div>
          </div>

          <!-- Address Information -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Address Information
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Street Address <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="generalSettings.address"
                  type="text"
                  placeholder="123 Business Street"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-2">
                    City <span class="text-error-600">*</span>
                  </label>
                  <input
                    v-model="generalSettings.city"
                    type="text"
                    placeholder="New York"
                    class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-2">
                    State/Province
                  </label>
                  <input
                    v-model="generalSettings.state"
                    type="text"
                    placeholder="NY"
                    class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-2">
                    Postal Code <span class="text-error-600">*</span>
                  </label>
                  <input
                    v-model="generalSettings.postalCode"
                    type="text"
                    placeholder="10001"
                    class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Country <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="generalSettings.country"
                  type="text"
                  placeholder="United States"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Legal Information -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Legal Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  SIRET Number
                </label>
                <input
                  v-model="generalSettings.siret"
                  type="text"
                  placeholder="123 456 789 00012"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  SIREN Number
                </label>
                <input
                  v-model="generalSettings.siren"
                  type="text"
                  placeholder="123 456 789"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  VAT Number (TVA)
                </label>
                <input
                  v-model="generalSettings.vatNumber"
                  type="text"
                  placeholder="FR12 345678901"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  RCS (Trade Register)
                </label>
                <input
                  v-model="generalSettings.rcs"
                  type="text"
                  placeholder="Paris B 123 456 789"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  APE Code (Activity Code)
                </label>
                <input
                  v-model="generalSettings.apeCode"
                  type="text"
                  placeholder="6201Z"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Share Capital
                </label>
                <input
                  v-model="generalSettings.shareCapital"
                  type="text"
                  placeholder="€10,000"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Contact Person -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Contact Person / Responsible
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="generalSettings.contactName"
                  type="text"
                  placeholder="John Doe"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Position/Title
                </label>
                <input
                  v-model="generalSettings.contactPosition"
                  type="text"
                  placeholder="HR Manager"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Email <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="generalSettings.contactEmail"
                  type="email"
                  placeholder="contact@company.com"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Phone
                </label>
                <input
                  v-model="generalSettings.contactPhone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Banking Information -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Banking Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Bank Name
                </label>
                <input
                  v-model="generalSettings.bankName"
                  type="text"
                  placeholder="Bank Name"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Account Number (IBAN)
                </label>
                <input
                  v-model="generalSettings.iban"
                  type="text"
                  placeholder="FR76 1234 5678 9012 3456 7890 123"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  BIC/SWIFT Code
                </label>
                <input
                  v-model="generalSettings.bic"
                  type="text"
                  placeholder="ABCDEFGH"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Account Holder Name
                </label>
                <input
                  v-model="generalSettings.accountHolder"
                  type="text"
                  placeholder="Company Name"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Social Media
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  LinkedIn
                </label>
                <input
                  v-model="generalSettings.linkedin"
                  type="url"
                  placeholder="https://linkedin.com/company/..."
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Twitter/X
                </label>
                <input
                  v-model="generalSettings.twitter"
                  type="url"
                  placeholder="https://twitter.com/..."
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Facebook
                </label>
                <input
                  v-model="generalSettings.facebook"
                  type="url"
                  placeholder="https://facebook.com/..."
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Instagram
                </label>
                <input
                  v-model="generalSettings.instagram"
                  type="url"
                  placeholder="https://instagram.com/..."
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 justify-end">
            <button @click="resetGeneralSettings" class="btn-outline">
              Reset Changes
            </button>
            <button @click="saveGeneralSettings" class="btn-primary">
              Save All Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Prime (Bonuses) Tab -->
      <div v-else-if="activeTab === 'prime'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-neutral-900">Prime (Bonuses)</h2>
          <button
            @click="openAddPrimeModal"
            class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Prime
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200">
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Prime Name
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Type
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Amount
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Status
                </th>
                <th
                  class="text-right px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr
                v-for="prime in primes"
                :key="prime.id"
                class="hover:bg-neutral-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-neutral-900">
                  {{ prime.name }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-600">
                  {{ prime.type }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-900">
                  ${{ formatNumber(prime.amount) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      prime.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ prime.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="editPrime(prime)"
                    class="text-primary-600 hover:text-primary-700 font-medium text-sm mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDeletePrime(prime)"
                    class="text-error-600 hover:text-error-700 font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Absences Type Tab -->
      <div v-else-if="activeTab === 'absences-type'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-neutral-900">Absences Type</h2>
          <button
            @click="openAddAbsenceTypeModal"
            class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Absence Type
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200">
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Type Name
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Code
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Max Days
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Requires Approval
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Status
                </th>
                <th
                  class="text-right px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr
                v-for="absenceType in absenceTypes"
                :key="absenceType.id"
                class="hover:bg-neutral-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-neutral-900">
                  {{ absenceType.name }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-600">
                  {{ absenceType.code }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-900">
                  {{ absenceType.maxDays }} days
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      absenceType.requiresApproval
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800',
                    ]"
                  >
                    {{ absenceType.requiresApproval ? "Yes" : "No" }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      absenceType.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ absenceType.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="editAbsenceType(absenceType)"
                    class="text-primary-600 hover:text-primary-700 font-medium text-sm mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDeleteAbsenceType(absenceType)"
                    class="text-error-600 hover:text-error-700 font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Avantage en Nature (Benefits in Kind) Tab -->
      <div v-else-if="activeTab === 'avantage-nature'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-neutral-900">
            Avantage en Nature (Benefits in Kind)
          </h2>
          <button
            @click="openAddBenefitModal"
            class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Benefit
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200">
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Benefit Name
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Category
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Taxable Value
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Description
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Status
                </th>
                <th
                  class="text-right px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr
                v-for="benefit in benefits"
                :key="benefit.id"
                class="hover:bg-neutral-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-neutral-900">
                  {{ benefit.name }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-600">
                  {{ benefit.category }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-900">
                  ${{ formatNumber(benefit.taxableValue) }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-600 max-w-xs truncate">
                  {{ benefit.description }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      benefit.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ benefit.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="editBenefit(benefit)"
                    class="text-primary-600 hover:text-primary-700 font-medium text-sm mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDeleteBenefit(benefit)"
                    class="text-error-600 hover:text-error-700 font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Régime Horaire Tab -->
      <div v-else-if="activeTab === 'regime-horaire'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-neutral-900">Régime Horaire</h2>
          <button
            @click="openAddRegimeModal"
            class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Régime Horaire
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200">
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Régime Name
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Contract Type
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Weekly Hours
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Schedule
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Status
                </th>
                <th
                  class="text-right px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr
                v-for="regime in regimes"
                :key="regime.id"
                class="hover:bg-neutral-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-neutral-900">
                  {{ regime.name }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-600">
                  {{ regime.contractType }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-900">
                  {{ regime.weeklyHours }}h/week
                </td>
                <td class="px-6 py-4 text-sm text-neutral-600">
                  <button
                    @click="viewSchedule(regime)"
                    class="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    View Schedule
                  </button>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      regime.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ regime.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="editRegime(regime)"
                    class="text-primary-600 hover:text-primary-700 font-medium text-sm mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDeleteRegime(regime)"
                    class="text-error-600 hover:text-error-700 font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Régime Absences Tab -->
      <div v-else-if="activeTab === 'regime-absences'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-neutral-900">Régime Absences</h2>
          <button
            @click="openAddAbsenceRegimeModal"
            class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Régime Absences
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-neutral-50 border-b border-neutral-200">
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Régime Name
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Contract Type
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Annual Quota
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Accumulation
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Carry Over
                </th>
                <th
                  class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Status
                </th>
                <th
                  class="text-right px-6 py-3 text-sm font-medium text-neutral-600"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr
                v-for="absenceRegime in absenceRegimes"
                :key="absenceRegime.id"
                class="hover:bg-neutral-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-neutral-900">
                  {{ absenceRegime.name }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-600">
                  {{ absenceRegime.contractType }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-900">
                  {{ absenceRegime.annualQuota }} days
                </td>
                <td class="px-6 py-4 text-sm text-neutral-600">
                  {{ absenceRegime.accumulationType }}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-600">
                  {{ absenceRegime.carryOverDays }} days
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      absenceRegime.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ absenceRegime.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="editAbsenceRegime(absenceRegime)"
                    class="text-primary-600 hover:text-primary-700 font-medium text-sm mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDeleteAbsenceRegime(absenceRegime)"
                    class="text-error-600 hover:text-error-700 font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Security Tab -->
      <div v-else-if="activeTab === 'security'" class="p-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-6">Security Settings</h2>
        <div class="space-y-6 max-w-2xl">
          <div class="p-4 bg-neutral-50 rounded-lg">
            <p class="text-sm font-medium text-neutral-900">Change Password</p>
            <p class="text-xs text-neutral-600 mt-1">
              Update your password regularly
            </p>
            <button
              @click="openChangePasswordModal"
              class="btn-outline text-sm mt-3"
            >
              Change Password
            </button>
          </div>
          <div class="p-4 bg-neutral-50 rounded-lg">
            <p class="text-sm font-medium text-neutral-900">
              Two-Factor Authentication
            </p>
            <p class="text-xs text-neutral-600 mt-1">
              Enable for enhanced security
            </p>
            <button @click="toggle2FA" class="btn-outline text-sm mt-3">
              {{ twoFAEnabled ? "Disable" : "Enable" }} 2FA
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications Tab -->
      <div v-else-if="activeTab === 'notifications'" class="p-6">
        <h2 class="text-lg font-bold text-neutral-900 mb-6">
          Notification Settings
        </h2>
        <div class="space-y-4 max-w-2xl">
          <div
            class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
          >
            <div>
              <p class="text-sm font-medium text-neutral-900">
                Email Notifications
              </p>
              <p class="text-xs text-neutral-600">Receive updates via email</p>
            </div>
            <input
              v-model="notificationSettings.email"
              type="checkbox"
              class="w-5 h-5 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
            />
          </div>
          <div
            class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
          >
            <div>
              <p class="text-sm font-medium text-neutral-900">Payroll Alerts</p>
              <p class="text-xs text-neutral-600">
                Alerts for payroll processing
              </p>
            </div>
            <input
              v-model="notificationSettings.payroll"
              type="checkbox"
              class="w-5 h-5 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
            />
          </div>
          <div
            class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
          >
            <div>
              <p class="text-sm font-medium text-neutral-900">
                Attendance Reminders
              </p>
              <p class="text-xs text-neutral-600">
                Daily attendance check reminders
              </p>
            </div>
            <input
              v-model="notificationSettings.attendance"
              type="checkbox"
              class="w-5 h-5 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Prime Modal -->
    <div
      v-if="isPrimeModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closePrimeModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">
            {{ editingPrime ? "Edit Prime" : "Add Prime" }}
          </h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Prime Name <span class="text-error-600">*</span>
            </label>
            <input
              v-model="primeForm.name"
              type="text"
              placeholder="e.g., Performance Bonus"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Type <span class="text-error-600">*</span>
            </label>
            <select
              v-model="primeForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Performance">Performance</option>
              <option value="Annual">Annual</option>
              <option value="Project">Project</option>
              <option value="Retention">Retention</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Amount <span class="text-error-600">*</span>
            </label>
            <input
              v-model.number="primeForm.amount"
              type="number"
              placeholder="0"
              min="0"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Status
            </label>
            <select
              v-model="primeForm.status"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="closePrimeModal"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="savePrime"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {{ editingPrime ? "Update" : "Add" }} Prime
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Absence Type Modal -->
    <div
      v-if="isAbsenceTypeModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeAbsenceTypeModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">
            {{ editingAbsenceType ? "Edit Absence Type" : "Add Absence Type" }}
          </h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Type Name <span class="text-error-600">*</span>
            </label>
            <input
              v-model="absenceTypeForm.name"
              type="text"
              placeholder="e.g., Sick Leave"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Code <span class="text-error-600">*</span>
            </label>
            <input
              v-model="absenceTypeForm.code"
              type="text"
              placeholder="e.g., SL"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Max Days
            </label>
            <input
              v-model.number="absenceTypeForm.maxDays"
              type="number"
              placeholder="0"
              min="0"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="flex items-center gap-2">
              <input
                v-model="absenceTypeForm.requiresApproval"
                type="checkbox"
                class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-neutral-700">Requires Approval</span>
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Status
            </label>
            <select
              v-model="absenceTypeForm.status"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="closeAbsenceTypeModal"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveAbsenceType"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {{ editingAbsenceType ? "Update" : "Add" }} Type
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Benefit Modal -->
    <div
      v-if="isBenefitModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeBenefitModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">
            {{ editingBenefit ? "Edit Benefit" : "Add Benefit" }}
          </h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Benefit Name <span class="text-error-600">*</span>
            </label>
            <input
              v-model="benefitForm.name"
              type="text"
              placeholder="e.g., Company Car"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Category <span class="text-error-600">*</span>
            </label>
            <select
              v-model="benefitForm.category"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Transport">Transport</option>
              <option value="Meal">Meal</option>
              <option value="Housing">Housing</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Taxable Value <span class="text-error-600">*</span>
            </label>
            <input
              v-model.number="benefitForm.taxableValue"
              type="number"
              placeholder="0"
              min="0"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              v-model="benefitForm.description"
              rows="3"
              placeholder="Enter description..."
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Status
            </label>
            <select
              v-model="benefitForm.status"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="closeBenefitModal"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveBenefit"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {{ editingBenefit ? "Update" : "Add" }} Benefit
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Régime Horaire Modal -->
    <div
      v-if="isRegimeModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeRegimeModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white">
          <h2 class="text-lg font-bold text-neutral-900">
            {{ editingRegime ? "Edit Régime Horaire" : "Add Régime Horaire" }}
          </h2>
        </div>
        <div class="px-6 py-4 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Régime Name <span class="text-error-600">*</span>
              </label>
              <input
                v-model="regimeForm.name"
                type="text"
                placeholder="e.g., Full Time Standard"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Contract Type <span class="text-error-600">*</span>
              </label>
              <select
                v-model="regimeForm.contractType"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              >
                <option value="CDI">CDI (Contrat à Durée Indéterminée)</option>
                <option value="CDD">CDD (Contrat à Durée Déterminée)</option>
                <option value="Stage">Stage</option>
                <option value="Intérimaire">Intérimaire</option>
                <option value="Freelance">Freelance</option>
                <option value="Temps Partiel">Temps Partiel</option>
                <option value="Apprentissage">Apprentissage</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Weekly Hours <span class="text-error-600">*</span>
              </label>
              <input
                v-model.number="regimeForm.weeklyHours"
                type="number"
                placeholder="35"
                min="0"
                max="60"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <select
                v-model="regimeForm.status"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <!-- Schedule Section -->
          <div class="border-t border-neutral-200 pt-4">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Weekly Schedule
            </h3>
            <div class="space-y-3">
              <div
                v-for="(day, index) in weekDays"
                :key="index"
                class="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg"
              >
                <div class="w-24">
                  <label class="flex items-center gap-2">
                    <input
                      v-model="regimeForm.schedule[day.key].enabled"
                      type="checkbox"
                      class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="text-sm font-medium text-neutral-700">{{
                      day.label
                    }}</span>
                  </label>
                </div>
                <div
                  v-if="regimeForm.schedule[day.key].enabled"
                  class="flex items-center gap-2 flex-1"
                >
                  <input
                    v-model="regimeForm.schedule[day.key].startTime"
                    type="time"
                    class="px-3 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                  <span class="text-sm text-neutral-600">to</span>
                  <input
                    v-model="regimeForm.schedule[day.key].endTime"
                    type="time"
                    class="px-3 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                  <input
                    v-model.number="regimeForm.schedule[day.key].breakMinutes"
                    type="number"
                    placeholder="Break (min)"
                    min="0"
                    class="w-32 px-3 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                  <span class="text-xs text-neutral-500 ml-auto">
                    {{
                      calculateDailyHours(
                        regimeForm.schedule[day.key].startTime,
                        regimeForm.schedule[day.key].endTime,
                        regimeForm.schedule[day.key].breakMinutes
                      )
                    }}h
                  </span>
                </div>
                <div v-else class="text-sm text-neutral-400">Day off</div>
              </div>
            </div>
            <div class="mt-4 p-3 bg-primary-50 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-neutral-700"
                  >Total Weekly Hours:</span
                >
                <span class="text-base font-bold text-primary-700">{{
                  calculateTotalWeeklyHours()
                }}h</span>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button
            @click="closeRegimeModal"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveRegime"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {{ editingRegime ? "Update" : "Add" }} Régime
          </button>
        </div>
      </div>
    </div>

    <!-- View Schedule Modal -->
    <div
      v-if="isViewScheduleModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeViewScheduleModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">
            Schedule: {{ viewingRegime?.name }}
          </h2>
        </div>
        <div class="px-6 py-4">
          <div class="space-y-3">
            <div
              v-for="(day, index) in weekDays"
              :key="index"
              class="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
            >
              <span class="text-sm font-medium text-neutral-700">{{
                day.label
              }}</span>
              <div v-if="viewingRegime?.schedule[day.key]?.enabled" class="flex items-center gap-2">
                <span class="text-sm text-neutral-600">
                  {{ viewingRegime.schedule[day.key].startTime }} -
                  {{ viewingRegime.schedule[day.key].endTime }}
                </span>
                <span
                  v-if="viewingRegime.schedule[day.key].breakMinutes > 0"
                  class="text-xs text-neutral-500"
                >
                  (Break: {{ viewingRegime.schedule[day.key].breakMinutes }}min)
                </span>
                <span class="text-sm font-medium text-primary-600">
                  {{
                    calculateDailyHours(
                      viewingRegime.schedule[day.key].startTime,
                      viewingRegime.schedule[day.key].endTime,
                      viewingRegime.schedule[day.key].breakMinutes
                    )
                  }}h
                </span>
              </div>
              <span v-else class="text-sm text-neutral-400">Day off</span>
            </div>
          </div>
          <div class="mt-4 p-3 bg-primary-50 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-neutral-700"
                >Total Weekly Hours:</span
              >
              <span class="text-base font-bold text-primary-700">{{
                viewingRegime?.weeklyHours || 0
              }}h</span>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end">
          <button
            @click="closeViewScheduleModal"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Régime Absences Modal -->
    <div
      v-if="isAbsenceRegimeModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeAbsenceRegimeModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200 sticky top-0 bg-white">
          <h2 class="text-lg font-bold text-neutral-900">
            {{ editingAbsenceRegime ? "Edit Régime Absences" : "Add Régime Absences" }}
          </h2>
        </div>
        <div class="px-6 py-4 space-y-6">
          <!-- Basic Information -->
          <div class="border-b border-neutral-200 pb-4">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Basic Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Régime Name <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="absenceRegimeForm.name"
                  type="text"
                  placeholder="e.g., Standard Leave Policy"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Contract Type <span class="text-error-600">*</span>
                </label>
                <select
                  v-model="absenceRegimeForm.contractType"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                >
                  <option value="CDI">CDI (Contrat à Durée Indéterminée)</option>
                  <option value="CDD">CDD (Contrat à Durée Déterminée)</option>
                  <option value="Stage">Stage</option>
                  <option value="Intérimaire">Intérimaire</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Temps Partiel">Temps Partiel</option>
                  <option value="Apprentissage">Apprentissage</option>
                  <option value="All">All Types</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Quota Configuration -->
          <div class="border-b border-neutral-200 pb-4">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Quota Configuration
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Annual Quota (days) <span class="text-error-600">*</span>
                </label>
                <input
                  v-model.number="absenceRegimeForm.annualQuota"
                  type="number"
                  placeholder="25"
                  min="0"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Accumulation Type <span class="text-error-600">*</span>
                </label>
                <select
                  v-model="absenceRegimeForm.accumulationType"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                >
                  <option value="Annual">Annual (Full at start of year)</option>
                  <option value="Monthly">Monthly (Accrued monthly)</option>
                  <option value="Quarterly">Quarterly (Accrued quarterly)</option>
                  <option value="Pro-rata">Pro-rata (Based on hire date)</option>
                </select>
              </div>
            </div>
            <div class="mt-4">
              <label class="flex items-center gap-2">
                <input
                  v-model="absenceRegimeForm.accrualFromHireDate"
                  type="checkbox"
                  class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="text-sm text-neutral-700">Accrual starts from hire date</span>
              </label>
            </div>
          </div>

          <!-- Carry Over & Expiry -->
          <div class="border-b border-neutral-200 pb-4">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Carry Over & Expiry
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Maximum Carry Over (days)
                </label>
                <input
                  v-model.number="absenceRegimeForm.carryOverDays"
                  type="number"
                  placeholder="5"
                  min="0"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Expiry Period (months)
                </label>
                <input
                  v-model.number="absenceRegimeForm.expiryMonths"
                  type="number"
                  placeholder="12"
                  min="0"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
            </div>
            <div class="mt-4">
              <label class="flex items-center gap-2">
                <input
                  v-model="absenceRegimeForm.allowCarryOver"
                  type="checkbox"
                  class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="text-sm text-neutral-700">Allow carry over to next year</span>
              </label>
            </div>
          </div>

          <!-- Leave Types Configuration -->
          <div class="border-b border-neutral-200 pb-4">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Leave Types Included
            </h3>
            <div class="space-y-2">
              <div
                v-for="absenceType in availableAbsenceTypes"
                :key="absenceType.id"
                class="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg"
              >
                <input
                  :id="`absence-type-${absenceType.id}`"
                  v-model="absenceRegimeForm.includedTypes"
                  :value="absenceType.id"
                  type="checkbox"
                  class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <label
                  :for="`absence-type-${absenceType.id}`"
                  class="text-sm text-neutral-700 flex-1"
                >
                  {{ absenceType.name }} ({{ absenceType.code }})
                </label>
                <span class="text-xs text-neutral-500">
                  Max: {{ absenceType.maxDays }} days
                </span>
              </div>
            </div>
          </div>

          <!-- Approval & Rules -->
          <div>
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Approval & Rules
            </h3>
            <div class="space-y-3">
              <div>
                <label class="flex items-center gap-2">
                  <input
                    v-model="absenceRegimeForm.requiresApproval"
                    type="checkbox"
                    class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm text-neutral-700">Requires manager approval</span>
                </label>
              </div>
              <div>
                <label class="flex items-center gap-2">
                  <input
                    v-model="absenceRegimeForm.allowHalfDays"
                    type="checkbox"
                    class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm text-neutral-700">Allow half-day leaves</span>
                </label>
              </div>
              <div>
                <label class="flex items-center gap-2">
                  <input
                    v-model="absenceRegimeForm.minimumNoticeDays"
                    type="number"
                    min="0"
                    placeholder="Minimum notice (days)"
                    class="w-48 px-3 py-2 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  />
                  <span class="text-sm text-neutral-700">days notice required</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Status
            </label>
            <select
              v-model="absenceRegimeForm.status"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button
            @click="closeAbsenceRegimeModal"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveAbsenceRegime"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {{ editingAbsenceRegime ? "Update" : "Add" }} Régime
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div
      v-if="isChangePasswordModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeChangePasswordModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Change Password</h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Current Password
            </label>
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="Enter current password"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              New Password
            </label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="Enter new password"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Confirm New Password
            </label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="Confirm new password"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="closeChangePasswordModal"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="changePassword"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeDeleteModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Confirm Deletion</h2>
        </div>
        <div class="px-6 py-4">
          <p class="text-sm text-neutral-600 mb-1">
            Are you sure you want to delete this item?
          </p>
          <p class="text-sm font-medium text-neutral-900">
            {{ deleteItemName }}
          </p>
          <p class="text-xs text-error-600 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="closeDeleteModal"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 text-sm font-medium bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const activeTab = ref("general");
const tabs = [
  { id: "general", label: "General" },
  { id: "prime", label: "Prime" },
  { id: "absences-type", label: "Absences Type" },
  { id: "avantage-nature", label: "Avantage en Nature" },
  { id: "regime-horaire", label: "Régime Horaire" },
  { id: "regime-absences", label: "Régime Absences" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
];

// General Settings
const generalSettings = ref({
  logo: null,
  name: "Bravo RH",
  companyType: "SARL",
  email: "info@bravorh.com",
  phone: "+1 234 567 8900",
  website: "https://www.bravorh.com",
  foundedYear: 2020,
  description: "Leading HR management solutions provider",
  address: "123 Business Street, Suite 100",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  country: "United States",
  siret: "123 456 789 00012",
  siren: "123 456 789",
  vatNumber: "FR12 345678901",
  rcs: "Paris B 123 456 789",
  apeCode: "6201Z",
  shareCapital: "€10,000",
  contactName: "John Doe",
  contactPosition: "HR Manager",
  contactEmail: "contact@bravorh.com",
  contactPhone: "+1 234 567 8901",
  bankName: "Bank of America",
  iban: "FR76 1234 5678 9012 3456 7890 123",
  bic: "ABCDEFGH",
  accountHolder: "Bravo RH",
  linkedin: "https://linkedin.com/company/bravorh",
  twitter: "https://twitter.com/bravorh",
  facebook: "https://facebook.com/bravorh",
  instagram: "https://instagram.com/bravorh",
});

// Prime Data
const primes = ref([
  {
    id: 1,
    name: "Performance Bonus",
    type: "Performance",
    amount: 5000,
    status: "Active",
  },
  {
    id: 2,
    name: "Annual Bonus",
    type: "Annual",
    amount: 10000,
    status: "Active",
  },
  {
    id: 3,
    name: "Project Completion",
    type: "Project",
    amount: 3000,
    status: "Active",
  },
  {
    id: 4,
    name: "Retention Bonus",
    type: "Retention",
    amount: 7500,
    status: "Active",
  },
]);

const isPrimeModalOpen = ref(false);
const editingPrime = ref(null);
const primeForm = ref({
  name: "",
  type: "Performance",
  amount: 0,
  status: "Active",
});

// Absence Types Data
const absenceTypes = ref([
  {
    id: 1,
    name: "Sick Leave",
    code: "SL",
    maxDays: 10,
    requiresApproval: true,
    status: "Active",
  },
  {
    id: 2,
    name: "Vacation",
    code: "VAC",
    maxDays: 20,
    requiresApproval: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Personal Leave",
    code: "PL",
    maxDays: 5,
    requiresApproval: true,
    status: "Active",
  },
  {
    id: 4,
    name: "Maternity Leave",
    code: "ML",
    maxDays: 90,
    requiresApproval: true,
    status: "Active",
  },
  {
    id: 5,
    name: "Unpaid Leave",
    code: "UL",
    maxDays: 30,
    requiresApproval: true,
    status: "Active",
  },
]);

const isAbsenceTypeModalOpen = ref(false);
const editingAbsenceType = ref(null);
const absenceTypeForm = ref({
  name: "",
  code: "",
  maxDays: 0,
  requiresApproval: true,
  status: "Active",
});

// Benefits Data
const benefits = ref([
  {
    id: 1,
    name: "Company Car",
    category: "Transport",
    taxableValue: 500,
    description: "Company vehicle provided to employees",
    status: "Active",
  },
  {
    id: 2,
    name: "Meal Vouchers",
    category: "Meal",
    taxableValue: 200,
    description: "Monthly meal allowance vouchers",
    status: "Active",
  },
  {
    id: 3,
    name: "Health Insurance",
    category: "Health",
    taxableValue: 300,
    description: "Premium health insurance coverage",
    status: "Active",
  },
  {
    id: 4,
    name: "Housing Allowance",
    category: "Housing",
    taxableValue: 1000,
    description: "Monthly housing accommodation allowance",
    status: "Active",
  },
]);

const isBenefitModalOpen = ref(false);
const editingBenefit = ref(null);
const benefitForm = ref({
  name: "",
  category: "Transport",
  taxableValue: 0,
  description: "",
  status: "Active",
});

// Régime Horaire Data
const weekDays = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const defaultSchedule = () => ({
  monday: { enabled: true, startTime: "09:00", endTime: "18:00", breakMinutes: 60 },
  tuesday: { enabled: true, startTime: "09:00", endTime: "18:00", breakMinutes: 60 },
  wednesday: { enabled: true, startTime: "09:00", endTime: "18:00", breakMinutes: 60 },
  thursday: { enabled: true, startTime: "09:00", endTime: "18:00", breakMinutes: 60 },
  friday: { enabled: true, startTime: "09:00", endTime: "18:00", breakMinutes: 60 },
  saturday: { enabled: false, startTime: "09:00", endTime: "18:00", breakMinutes: 60 },
  sunday: { enabled: false, startTime: "09:00", endTime: "18:00", breakMinutes: 60 },
});

const regimes = ref([
  {
    id: 1,
    name: "Full Time Standard",
    contractType: "CDI",
    weeklyHours: 35,
    status: "Active",
    schedule: {
      monday: { enabled: true, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      tuesday: { enabled: true, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      wednesday: { enabled: true, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      thursday: { enabled: true, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      friday: { enabled: true, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      saturday: { enabled: false, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      sunday: { enabled: false, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
    },
  },
  {
    id: 2,
    name: "Part Time Morning",
    contractType: "Temps Partiel",
    weeklyHours: 20,
    status: "Active",
    schedule: {
      monday: { enabled: true, startTime: "08:00", endTime: "12:00", breakMinutes: 0 },
      tuesday: { enabled: true, startTime: "08:00", endTime: "12:00", breakMinutes: 0 },
      wednesday: { enabled: true, startTime: "08:00", endTime: "12:00", breakMinutes: 0 },
      thursday: { enabled: true, startTime: "08:00", endTime: "12:00", breakMinutes: 0 },
      friday: { enabled: true, startTime: "08:00", endTime: "12:00", breakMinutes: 0 },
      saturday: { enabled: false, startTime: "08:00", endTime: "12:00", breakMinutes: 0 },
      sunday: { enabled: false, startTime: "08:00", endTime: "12:00", breakMinutes: 0 },
    },
  },
  {
    id: 3,
    name: "Internship Schedule",
    contractType: "Stage",
    weeklyHours: 35,
    status: "Active",
    schedule: {
      monday: { enabled: true, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      tuesday: { enabled: true, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      wednesday: { enabled: true, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      thursday: { enabled: true, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      friday: { enabled: true, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      saturday: { enabled: false, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
      sunday: { enabled: false, startTime: "09:00", endTime: "17:00", breakMinutes: 60 },
    },
  },
  {
    id: 4,
    name: "Temporary Worker",
    contractType: "Intérimaire",
    weeklyHours: 40,
    status: "Active",
    schedule: {
      monday: { enabled: true, startTime: "08:00", endTime: "17:00", breakMinutes: 60 },
      tuesday: { enabled: true, startTime: "08:00", endTime: "17:00", breakMinutes: 60 },
      wednesday: { enabled: true, startTime: "08:00", endTime: "17:00", breakMinutes: 60 },
      thursday: { enabled: true, startTime: "08:00", endTime: "17:00", breakMinutes: 60 },
      friday: { enabled: true, startTime: "08:00", endTime: "17:00", breakMinutes: 60 },
      saturday: { enabled: false, startTime: "08:00", endTime: "17:00", breakMinutes: 60 },
      sunday: { enabled: false, startTime: "08:00", endTime: "17:00", breakMinutes: 60 },
    },
  },
]);

const isRegimeModalOpen = ref(false);
const isViewScheduleModalOpen = ref(false);
const editingRegime = ref(null);
const viewingRegime = ref(null);
const regimeForm = ref({
  name: "",
  contractType: "CDI",
  weeklyHours: 35,
  status: "Active",
  schedule: defaultSchedule(),
});

// Régime Absences Data
const absenceRegimes = ref([
  {
    id: 1,
    name: "Standard Leave Policy",
    contractType: "CDI",
    annualQuota: 25,
    accumulationType: "Annual",
    carryOverDays: 5,
    expiryMonths: 12,
    allowCarryOver: true,
    accrualFromHireDate: false,
    requiresApproval: true,
    allowHalfDays: true,
    minimumNoticeDays: 2,
    includedTypes: [1, 2, 3], // Sick Leave, Vacation, Personal Leave
    status: "Active",
  },
  {
    id: 2,
    name: "Part-Time Leave Policy",
    contractType: "Temps Partiel",
    annualQuota: 15,
    accumulationType: "Pro-rata",
    carryOverDays: 3,
    expiryMonths: 12,
    allowCarryOver: true,
    accrualFromHireDate: true,
    requiresApproval: true,
    allowHalfDays: true,
    minimumNoticeDays: 1,
    includedTypes: [1, 2], // Sick Leave, Vacation
    status: "Active",
  },
  {
    id: 3,
    name: "Internship Leave Policy",
    contractType: "Stage",
    annualQuota: 10,
    accumulationType: "Monthly",
    carryOverDays: 0,
    expiryMonths: 6,
    allowCarryOver: false,
    accrualFromHireDate: true,
    requiresApproval: true,
    allowHalfDays: false,
    minimumNoticeDays: 3,
    includedTypes: [1, 3], // Sick Leave, Personal Leave
    status: "Active",
  },
  {
    id: 4,
    name: "Temporary Worker Policy",
    contractType: "Intérimaire",
    annualQuota: 20,
    accumulationType: "Pro-rata",
    carryOverDays: 0,
    expiryMonths: 12,
    allowCarryOver: false,
    accrualFromHireDate: true,
    requiresApproval: true,
    allowHalfDays: true,
    minimumNoticeDays: 1,
    includedTypes: [1, 2, 3], // Sick Leave, Vacation, Personal Leave
    status: "Active",
  },
]);

const isAbsenceRegimeModalOpen = ref(false);
const editingAbsenceRegime = ref(null);
const absenceRegimeForm = ref({
  name: "",
  contractType: "CDI",
  annualQuota: 25,
  accumulationType: "Annual",
  carryOverDays: 5,
  expiryMonths: 12,
  allowCarryOver: true,
  accrualFromHireDate: false,
  requiresApproval: true,
  allowHalfDays: true,
  minimumNoticeDays: 2,
  includedTypes: [],
  status: "Active",
});

// Get available absence types for selection
const availableAbsenceTypes = computed(() => {
  return absenceTypes.value.filter((type) => type.status === "Active");
});

// Delete Modal
const isDeleteModalOpen = ref(false);
const deleteItemName = ref("");
const deleteItemId = ref(null);
const deleteItemType = ref(""); // 'prime', 'absenceType', 'benefit', 'regime', 'absenceRegime'

// Security
const twoFAEnabled = ref(false);
const isChangePasswordModalOpen = ref(false);
const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Notifications
const notificationSettings = ref({
  email: true,
  payroll: true,
  attendance: false,
});

// Format number
const formatNumber = (num) => {
  return Number(num).toLocaleString("en-US");
};

// General Settings
const saveGeneralSettings = () => {
  // Validate required fields
  if (!generalSettings.value.name || !generalSettings.value.email || !generalSettings.value.phone) {
    alert("Please fill in all required fields");
    return;
  }

  // Save general settings logic
  console.log("Saving general settings:", generalSettings.value);
  alert("Company information saved successfully!");
};

const resetGeneralSettings = () => {
  if (confirm("Are you sure you want to reset all changes? This cannot be undone.")) {
    generalSettings.value = {
      logo: null,
      name: "Bravo RH",
      companyType: "SARL",
      email: "info@bravorh.com",
      phone: "+1 234 567 8900",
      website: "https://www.bravorh.com",
      foundedYear: 2020,
      description: "Leading HR management solutions provider",
      address: "123 Business Street, Suite 100",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      siret: "123 456 789 00012",
      siren: "123 456 789",
      vatNumber: "FR12 345678901",
      rcs: "Paris B 123 456 789",
      apeCode: "6201Z",
      shareCapital: "€10,000",
      contactName: "John Doe",
      contactPosition: "HR Manager",
      contactEmail: "contact@bravorh.com",
      contactPhone: "+1 234 567 8901",
      bankName: "Bank of America",
      iban: "FR76 1234 5678 9012 3456 7890 123",
      bic: "ABCDEFGH",
      accountHolder: "Bravo RH",
      linkedin: "https://linkedin.com/company/bravorh",
      twitter: "https://twitter.com/bravorh",
      facebook: "https://facebook.com/bravorh",
      instagram: "https://instagram.com/bravorh",
    };
  }
};

const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      generalSettings.value.logo = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeLogo = () => {
  if (confirm("Are you sure you want to remove the company logo?")) {
    generalSettings.value.logo = null;
  }
};

// Prime Functions
const openAddPrimeModal = () => {
  editingPrime.value = null;
  primeForm.value = {
    name: "",
    type: "Performance",
    amount: 0,
    status: "Active",
  };
  isPrimeModalOpen.value = true;
};

const editPrime = (prime) => {
  editingPrime.value = prime;
  primeForm.value = { ...prime };
  isPrimeModalOpen.value = true;
};

const closePrimeModal = () => {
  isPrimeModalOpen.value = false;
  editingPrime.value = null;
  primeForm.value = {
    name: "",
    type: "Performance",
    amount: 0,
    status: "Active",
  };
};

const savePrime = () => {
  if (!primeForm.value.name || !primeForm.value.amount) {
    alert("Please fill in all required fields");
    return;
  }

  if (editingPrime.value) {
    const index = primes.value.findIndex((p) => p.id === editingPrime.value.id);
    if (index !== -1) {
      primes.value[index] = {
        ...editingPrime.value,
        ...primeForm.value,
      };
    }
  } else {
    const newId =
      primes.value.length > 0
        ? Math.max(...primes.value.map((p) => p.id)) + 1
        : 1;
    primes.value.push({
      id: newId,
      ...primeForm.value,
    });
  }
  closePrimeModal();
};

const confirmDeletePrime = (prime) => {
  deleteItemName.value = prime.name;
  deleteItemId.value = prime.id;
  deleteItemType.value = "prime";
  isDeleteModalOpen.value = true;
};

// Absence Type Functions
const openAddAbsenceTypeModal = () => {
  editingAbsenceType.value = null;
  absenceTypeForm.value = {
    name: "",
    code: "",
    maxDays: 0,
    requiresApproval: true,
    status: "Active",
  };
  isAbsenceTypeModalOpen.value = true;
};

const editAbsenceType = (absenceType) => {
  editingAbsenceType.value = absenceType;
  absenceTypeForm.value = { ...absenceType };
  isAbsenceTypeModalOpen.value = true;
};

const closeAbsenceTypeModal = () => {
  isAbsenceTypeModalOpen.value = false;
  editingAbsenceType.value = null;
  absenceTypeForm.value = {
    name: "",
    code: "",
    maxDays: 0,
    requiresApproval: true,
    status: "Active",
  };
};

const saveAbsenceType = () => {
  if (!absenceTypeForm.value.name || !absenceTypeForm.value.code) {
    alert("Please fill in all required fields");
    return;
  }

  if (editingAbsenceType.value) {
    const index = absenceTypes.value.findIndex(
      (a) => a.id === editingAbsenceType.value.id
    );
    if (index !== -1) {
      absenceTypes.value[index] = {
        ...editingAbsenceType.value,
        ...absenceTypeForm.value,
      };
    }
  } else {
    const newId =
      absenceTypes.value.length > 0
        ? Math.max(...absenceTypes.value.map((a) => a.id)) + 1
        : 1;
    absenceTypes.value.push({
      id: newId,
      ...absenceTypeForm.value,
    });
  }
  closeAbsenceTypeModal();
};

const confirmDeleteAbsenceType = (absenceType) => {
  deleteItemName.value = absenceType.name;
  deleteItemId.value = absenceType.id;
  deleteItemType.value = "absenceType";
  isDeleteModalOpen.value = true;
};

// Benefit Functions
const openAddBenefitModal = () => {
  editingBenefit.value = null;
  benefitForm.value = {
    name: "",
    category: "Transport",
    taxableValue: 0,
    description: "",
    status: "Active",
  };
  isBenefitModalOpen.value = true;
};

const editBenefit = (benefit) => {
  editingBenefit.value = benefit;
  benefitForm.value = { ...benefit };
  isBenefitModalOpen.value = true;
};

const closeBenefitModal = () => {
  isBenefitModalOpen.value = false;
  editingBenefit.value = null;
  benefitForm.value = {
    name: "",
    category: "Transport",
    taxableValue: 0,
    description: "",
    status: "Active",
  };
};

const saveBenefit = () => {
  if (!benefitForm.value.name || !benefitForm.value.taxableValue) {
    alert("Please fill in all required fields");
    return;
  }

  if (editingBenefit.value) {
    const index = benefits.value.findIndex(
      (b) => b.id === editingBenefit.value.id
    );
    if (index !== -1) {
      benefits.value[index] = {
        ...editingBenefit.value,
        ...benefitForm.value,
      };
    }
  } else {
    const newId =
      benefits.value.length > 0
        ? Math.max(...benefits.value.map((b) => b.id)) + 1
        : 1;
    benefits.value.push({
      id: newId,
      ...benefitForm.value,
    });
  }
  closeBenefitModal();
};

const confirmDeleteBenefit = (benefit) => {
  deleteItemName.value = benefit.name;
  deleteItemId.value = benefit.id;
  deleteItemType.value = "benefit";
  isDeleteModalOpen.value = true;
};

// Delete Confirmation
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deleteItemName.value = "";
  deleteItemId.value = null;
  deleteItemType.value = "";
};

const confirmDelete = () => {
  if (deleteItemType.value === "prime") {
    primes.value = primes.value.filter((p) => p.id !== deleteItemId.value);
  } else if (deleteItemType.value === "absenceType") {
    absenceTypes.value = absenceTypes.value.filter(
      (a) => a.id !== deleteItemId.value
    );
  } else if (deleteItemType.value === "benefit") {
    benefits.value = benefits.value.filter((b) => b.id !== deleteItemId.value);
  } else if (deleteItemType.value === "regime") {
    regimes.value = regimes.value.filter((r) => r.id !== deleteItemId.value);
  } else if (deleteItemType.value === "absenceRegime") {
    absenceRegimes.value = absenceRegimes.value.filter(
      (r) => r.id !== deleteItemId.value
    );
  }
  closeDeleteModal();
};

// Security Functions
const openChangePasswordModal = () => {
  passwordForm.value = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  isChangePasswordModalOpen.value = true;
};

const closeChangePasswordModal = () => {
  isChangePasswordModalOpen.value = false;
  passwordForm.value = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
};

const changePassword = () => {
  if (
    passwordForm.value.newPassword !== passwordForm.value.confirmPassword
  ) {
    alert("Passwords do not match");
    return;
  }
  if (passwordForm.value.newPassword.length < 8) {
    alert("Password must be at least 8 characters long");
    return;
  }
  // Change password logic
  console.log("Changing password...");
  alert("Password changed successfully!");
  closeChangePasswordModal();
};

const toggle2FA = () => {
  twoFAEnabled.value = !twoFAEnabled.value;
  alert(
    `Two-Factor Authentication ${twoFAEnabled.value ? "enabled" : "disabled"}`
  );
};

// Régime Horaire Functions
const openAddRegimeModal = () => {
  editingRegime.value = null;
  regimeForm.value = {
    name: "",
    contractType: "CDI",
    weeklyHours: 35,
    status: "Active",
    schedule: defaultSchedule(),
  };
  isRegimeModalOpen.value = true;
};

const editRegime = (regime) => {
  editingRegime.value = regime;
  regimeForm.value = {
    name: regime.name,
    contractType: regime.contractType,
    weeklyHours: regime.weeklyHours,
    status: regime.status,
    schedule: JSON.parse(JSON.stringify(regime.schedule)),
  };
  isRegimeModalOpen.value = true;
};

const closeRegimeModal = () => {
  isRegimeModalOpen.value = false;
  editingRegime.value = null;
  regimeForm.value = {
    name: "",
    contractType: "CDI",
    weeklyHours: 35,
    status: "Active",
    schedule: defaultSchedule(),
  };
};

const saveRegime = () => {
  if (!regimeForm.value.name || !regimeForm.value.contractType) {
    alert("Please fill in all required fields");
    return;
  }

  // Calculate total weekly hours from schedule
  const totalHours = calculateTotalWeeklyHours();
  regimeForm.value.weeklyHours = totalHours;

  if (editingRegime.value) {
    const index = regimes.value.findIndex(
      (r) => r.id === editingRegime.value.id
    );
    if (index !== -1) {
      regimes.value[index] = {
        ...editingRegime.value,
        ...regimeForm.value,
      };
    }
  } else {
    const newId =
      regimes.value.length > 0
        ? Math.max(...regimes.value.map((r) => r.id)) + 1
        : 1;
    regimes.value.push({
      id: newId,
      ...regimeForm.value,
    });
  }
  closeRegimeModal();
};

const confirmDeleteRegime = (regime) => {
  deleteItemName.value = regime.name;
  deleteItemId.value = regime.id;
  deleteItemType.value = "regime";
  isDeleteModalOpen.value = true;
};

const viewSchedule = (regime) => {
  viewingRegime.value = regime;
  isViewScheduleModalOpen.value = true;
};

const closeViewScheduleModal = () => {
  isViewScheduleModalOpen.value = false;
  viewingRegime.value = null;
};

const calculateDailyHours = (startTime, endTime, breakMinutes = 0) => {
  if (!startTime || !endTime) return 0;
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  const breakHours = breakMinutes / 60;
  const totalHours = diffHours - breakHours;
  return totalHours > 0 ? totalHours.toFixed(1) : 0;
};

const calculateTotalWeeklyHours = () => {
  let total = 0;
  weekDays.forEach((day) => {
    const daySchedule = regimeForm.value.schedule[day.key];
    if (daySchedule.enabled) {
      const hours = parseFloat(
        calculateDailyHours(
          daySchedule.startTime,
          daySchedule.endTime,
          daySchedule.breakMinutes
        )
      );
      total += hours;
    }
  });
  return Math.round(total);
};

// Régime Absences Functions
const openAddAbsenceRegimeModal = () => {
  editingAbsenceRegime.value = null;
  absenceRegimeForm.value = {
    name: "",
    contractType: "CDI",
    annualQuota: 25,
    accumulationType: "Annual",
    carryOverDays: 5,
    expiryMonths: 12,
    allowCarryOver: true,
    accrualFromHireDate: false,
    requiresApproval: true,
    allowHalfDays: true,
    minimumNoticeDays: 2,
    includedTypes: [],
    status: "Active",
  };
  isAbsenceRegimeModalOpen.value = true;
};

const editAbsenceRegime = (regime) => {
  editingAbsenceRegime.value = regime;
  absenceRegimeForm.value = {
    name: regime.name,
    contractType: regime.contractType,
    annualQuota: regime.annualQuota,
    accumulationType: regime.accumulationType,
    carryOverDays: regime.carryOverDays,
    expiryMonths: regime.expiryMonths,
    allowCarryOver: regime.allowCarryOver,
    accrualFromHireDate: regime.accrualFromHireDate,
    requiresApproval: regime.requiresApproval,
    allowHalfDays: regime.allowHalfDays,
    minimumNoticeDays: regime.minimumNoticeDays,
    includedTypes: [...regime.includedTypes],
    status: regime.status,
  };
  isAbsenceRegimeModalOpen.value = true;
};

const closeAbsenceRegimeModal = () => {
  isAbsenceRegimeModalOpen.value = false;
  editingAbsenceRegime.value = null;
  absenceRegimeForm.value = {
    name: "",
    contractType: "CDI",
    annualQuota: 25,
    accumulationType: "Annual",
    carryOverDays: 5,
    expiryMonths: 12,
    allowCarryOver: true,
    accrualFromHireDate: false,
    requiresApproval: true,
    allowHalfDays: true,
    minimumNoticeDays: 2,
    includedTypes: [],
    status: "Active",
  };
};

const saveAbsenceRegime = () => {
  if (!absenceRegimeForm.value.name || !absenceRegimeForm.value.contractType) {
    alert("Please fill in all required fields");
    return;
  }

  if (absenceRegimeForm.value.includedTypes.length === 0) {
    alert("Please select at least one leave type");
    return;
  }

  if (editingAbsenceRegime.value) {
    const index = absenceRegimes.value.findIndex(
      (r) => r.id === editingAbsenceRegime.value.id
    );
    if (index !== -1) {
      absenceRegimes.value[index] = {
        ...editingAbsenceRegime.value,
        ...absenceRegimeForm.value,
      };
    }
  } else {
    const newId =
      absenceRegimes.value.length > 0
        ? Math.max(...absenceRegimes.value.map((r) => r.id)) + 1
        : 1;
    absenceRegimes.value.push({
      id: newId,
      ...absenceRegimeForm.value,
    });
  }
  closeAbsenceRegimeModal();
};

const confirmDeleteAbsenceRegime = (regime) => {
  deleteItemName.value = regime.name;
  deleteItemId.value = regime.id;
  deleteItemType.value = "absenceRegime";
  isDeleteModalOpen.value = true;
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
