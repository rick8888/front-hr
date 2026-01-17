<template>
  <div class="px-8 py-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-neutral-900 mb-2">Add New Employee</h1>
      <p class="text-neutral-600">Create a new employee profile and account</p>
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
                class="btn-primary mb-2"
              >
                Upload Photo
              </button>
              <p class="text-xs text-neutral-500">JPG, PNG or GIF • Max 5MB</p>
              <p
                v-if="profilePhotoPreview"
                class="text-xs text-success-600 mt-2"
              >
                ✓ Photo selected
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >First Name *</label
              >
              <input
                v-model="formData.firstName"
                type="text"
                placeholder="John"
                class="input-base"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Last Name *</label
              >
              <input
                v-model="formData.lastName"
                type="text"
                placeholder="Doe"
                class="input-base"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Email Address *</label
              >
              <input
                v-model="formData.email"
                type="email"
                placeholder="john.doe@company.com"
                class="input-base"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Phone Number</label
              >
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                class="input-base"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Date of Birth</label
              >
              <input v-model="formData.dob" type="date" class="input-base" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Gender</label
              >
              <select v-model="formData.gender" class="input-base">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Nationality</label
              >
              <input
                v-model="formData.nationality"
                type="text"
                placeholder="French"
                class="input-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Marital Status</label
              >
              <select v-model="formData.maritalStatus" class="input-base">
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1"
              >Address</label
            >
            <input
              v-model="formData.address"
              type="text"
              placeholder="123 Main Street"
              class="input-base"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >City</label
              >
              <input
                v-model="formData.city"
                type="text"
                placeholder="Paris"
                class="input-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >State/Province</label
              >
              <input
                v-model="formData.state"
                type="text"
                placeholder="Île-de-France"
                class="input-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >ZIP Code</label
              >
              <input
                v-model="formData.zip"
                type="text"
                placeholder="75000"
                class="input-base"
              />
            </div>
          </div>
        </div>

        <!-- Professional Information Tab -->
        <div v-if="activeTab === 'professional'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            Professional Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Department *</label
              >
              <select v-model="formData.department" class="input-base" required>
                <option value="">Select Department</option>
                <option value="Sales">Sales</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Job Title *</label
              >
              <input
                v-model="formData.jobTitle"
                type="text"
                placeholder="Senior Developer"
                class="input-base"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Employment Type *</label
              >
              <select
                v-model="formData.employmentType"
                class="input-base"
                required
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Start Date *</label
              >
              <input
                v-model="formData.startDate"
                type="date"
                class="input-base"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Manager</label
              >
              <select v-model="formData.manager" class="input-base">
                <option value="">Select Manager</option>
                <option value="Alice Johnson">Alice Johnson</option>
                <option value="Bob Smith">Bob Smith</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Salary</label
              >
              <input
                v-model="formData.salary"
                type="number"
                placeholder="50000"
                class="input-base"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-3"
              >Employee Status</label
            >
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="formData.status"
                  value="active"
                  class="w-4 h-4"
                />
                <span class="ml-2 text-sm text-neutral-700">Active</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="formData.status"
                  value="inactive"
                  class="w-4 h-4"
                />
                <span class="ml-2 text-sm text-neutral-700">Inactive</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="formData.status"
                  value="onLeave"
                  class="w-4 h-4"
                />
                <span class="ml-2 text-sm text-neutral-700">On Leave</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Rémunérations Tab -->
        <div v-if="activeTab === 'remuneration'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            Rémunérations
          </h2>

          <!-- Base Salary Section -->
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-neutral-900">
                Salaire de Base
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">
                  Montant Annuel (CTC)
                </label>
                <div class="relative">
                  <input
                    v-model.number="remuneration.baseSalary.annual"
                    type="number"
                    placeholder="50000"
                    class="input-base pl-8"
                  />
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">€</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">
                  Montant Mensuel
                </label>
                <div class="relative">
                  <input
                    v-model.number="remuneration.baseSalary.monthly"
                    type="number"
                    placeholder="4167"
                    class="input-base pl-8"
                  />
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">€</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1">
                  Période de Paiement
                </label>
                <select v-model="remuneration.baseSalary.paymentPeriod" class="input-base">
                  <option value="monthly">Mensuel</option>
                  <option value="biweekly">Bi-mensuel</option>
                  <option value="weekly">Hebdomadaire</option>
                </select>
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-neutral-700 mb-1">
                Date d'Effet
              </label>
              <input
                v-model="remuneration.baseSalary.effectiveDate"
                type="date"
                class="input-base"
              />
            </div>
          </div>

          <!-- Primes Section -->
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-neutral-900">Primes</h3>
              <button
                type="button"
                @click="openAddPrimeModal"
                class="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
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
                Ajouter Prime
              </button>
            </div>

            <div v-if="remuneration.primes.length === 0" class="text-center py-8 text-neutral-500 text-sm">
              Aucune prime ajoutée
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(prime, index) in remuneration.primes"
                :key="index"
                class="bg-white rounded-lg p-4 border border-neutral-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Type de Prime
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        {{ prime.type }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Montant
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        €{{ formatNumber(prime.amount) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Fréquence
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ prime.frequency }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Date d'Effet
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ prime.effectiveDate || "N/A" }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removePrime(index)"
                    class="ml-4 text-error-600 hover:text-error-700"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Avantages en Nature Section -->
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-neutral-900">
                Avantages en Nature
              </h3>
              <button
                type="button"
                @click="openAddBenefitModal"
                class="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
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
                Ajouter Avantage
              </button>
            </div>

            <div v-if="remuneration.benefits.length === 0" class="text-center py-8 text-neutral-500 text-sm">
              Aucun avantage ajouté
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(benefit, index) in remuneration.benefits"
                :key="index"
                class="bg-white rounded-lg p-4 border border-neutral-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Type d'Avantage
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        {{ benefit.type }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Valeur Taxable
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        €{{ formatNumber(benefit.taxableValue) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Fréquence
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ benefit.frequency }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Description
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ benefit.description || "N/A" }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeBenefit(index)"
                    class="ml-4 text-error-600 hover:text-error-700"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Remuneration Section -->
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-neutral-900">
                Autres Éléments de Rémunération
              </h3>
              <button
                type="button"
                @click="openAddOtherModal"
                class="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
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
                Ajouter Élément
              </button>
            </div>

            <div v-if="remuneration.others.length === 0" class="text-center py-8 text-neutral-500 text-sm">
              Aucun élément ajouté
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(other, index) in remuneration.others"
                :key="index"
                class="bg-white rounded-lg p-4 border border-neutral-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Libellé
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        {{ other.label }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Montant
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        €{{ formatNumber(other.amount) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Type
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ other.type }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Fréquence
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ other.frequency }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeOther(index)"
                    class="ml-4 text-error-600 hover:text-error-700"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Section -->
          <div class="bg-primary-50 rounded-lg p-6 border border-primary-200">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Récapitulatif Annuel
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  Salaire de Base
                </label>
                <p class="text-lg font-bold text-primary-700">
                  €{{ formatNumber(remuneration.baseSalary.annual || 0) }}
                </p>
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  Total Primes
                </label>
                <p class="text-lg font-bold text-primary-700">
                  €{{ formatNumber(calculateTotalPrimes()) }}
                </p>
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  Total Avantages
                </label>
                <p class="text-lg font-bold text-primary-700">
                  €{{ formatNumber(calculateTotalBenefits()) }}
                </p>
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  CTC Total
                </label>
                <p class="text-xl font-bold text-primary-800">
                  €{{ formatNumber(calculateTotalCTC()) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Déductions Tab -->
        <div v-if="activeTab === 'deductions'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            Déductions
          </h2>

          <!-- Taxes Section -->
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-neutral-900">Impôts</h3>
              <button
                type="button"
                @click="openAddTaxModal"
                class="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
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
                Ajouter Impôt
              </button>
            </div>

            <div v-if="deductions.taxes.length === 0" class="text-center py-8 text-neutral-500 text-sm">
              Aucun impôt ajouté
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(tax, index) in deductions.taxes"
                :key="index"
                class="bg-white rounded-lg p-4 border border-neutral-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Type d'Impôt
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        {{ tax.type }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Montant / Taux
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        {{ tax.isPercentage ? tax.amount + "%" : "€" + formatNumber(tax.amount) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Base de Calcul
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ tax.base }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Fréquence
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ tax.frequency }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeTax(index)"
                    class="ml-4 text-error-600 hover:text-error-700"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Security Contributions Section -->
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-neutral-900">
                Cotisations Sociales
              </h3>
              <button
                type="button"
                @click="openAddSocialSecurityModal"
                class="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
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
                Ajouter Cotisation
              </button>
            </div>

            <div v-if="deductions.socialSecurity.length === 0" class="text-center py-8 text-neutral-500 text-sm">
              Aucune cotisation sociale ajoutée
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(contribution, index) in deductions.socialSecurity"
                :key="index"
                class="bg-white rounded-lg p-4 border border-neutral-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Type de Cotisation
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        {{ contribution.type }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Taux / Montant
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        {{ contribution.isPercentage ? contribution.rate + "%" : "€" + formatNumber(contribution.amount) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Base de Calcul
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ contribution.base }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Part Employé
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ contribution.employeeShare }}%
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeSocialSecurity(index)"
                    class="ml-4 text-error-600 hover:text-error-700"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Insurance Deductions Section -->
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-neutral-900">
                Assurances
              </h3>
              <button
                type="button"
                @click="openAddInsuranceModal"
                class="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
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
                Ajouter Assurance
              </button>
            </div>

            <div v-if="deductions.insurance.length === 0" class="text-center py-8 text-neutral-500 text-sm">
              Aucune assurance ajoutée
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(insurance, index) in deductions.insurance"
                :key="index"
                class="bg-white rounded-lg p-4 border border-neutral-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Type d'Assurance
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        {{ insurance.type }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Montant Mensuel
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        €{{ formatNumber(insurance.amount) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Part Employé
                      </label>
                      <p class="text-sm text-neutral-700">
                        €{{ formatNumber(insurance.employeeShare) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Date d'Effet
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ insurance.effectiveDate || "N/A" }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeInsurance(index)"
                    class="ml-4 text-error-600 hover:text-error-700"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Deductions Section -->
          <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-neutral-900">
                Autres Déductions
              </h3>
              <button
                type="button"
                @click="openAddOtherDeductionModal"
                class="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
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
                Ajouter Déduction
              </button>
            </div>

            <div v-if="deductions.others.length === 0" class="text-center py-8 text-neutral-500 text-sm">
              Aucune déduction ajoutée
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(other, index) in deductions.others"
                :key="index"
                class="bg-white rounded-lg p-4 border border-neutral-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Libellé
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        {{ other.label }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Montant
                      </label>
                      <p class="text-sm font-medium text-neutral-900">
                        €{{ formatNumber(other.amount) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Type
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ other.type }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-neutral-500 mb-1">
                        Fréquence
                      </label>
                      <p class="text-sm text-neutral-700">
                        {{ other.frequency }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeOtherDeduction(index)"
                    class="ml-4 text-error-600 hover:text-error-700"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Section -->
          <div class="bg-error-50 rounded-lg p-6 border border-error-200">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Récapitulatif des Déductions Annuelles
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  Total Impôts
                </label>
                <p class="text-lg font-bold text-error-700">
                  €{{ formatNumber(calculateTotalTaxes()) }}
                </p>
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  Total Cotisations
                </label>
                <p class="text-lg font-bold text-error-700">
                  €{{ formatNumber(calculateTotalSocialSecurity()) }}
                </p>
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  Total Assurances
                </label>
                <p class="text-lg font-bold text-error-700">
                  €{{ formatNumber(calculateTotalInsurance()) }}
                </p>
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  Total Déductions
                </label>
                <p class="text-xl font-bold text-error-800">
                  €{{ formatNumber(calculateTotalDeductions()) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Net Salary Calculation -->
          <div class="bg-primary-50 rounded-lg p-6 border border-primary-200">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              Salaire Net
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  Salaire Brut Annuel
                </label>
                <p class="text-lg font-bold text-primary-700">
                  €{{ formatNumber(remuneration.baseSalary.annual || 0) }}
                </p>
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  Total Déductions Annuelles
                </label>
                <p class="text-lg font-bold text-error-700">
                  €{{ formatNumber(calculateTotalDeductions()) }}
                </p>
              </div>
              <div>
                <label class="block text-xs font-medium text-neutral-500 mb-1">
                  Salaire Net Annuel
                </label>
                <p class="text-xl font-bold text-primary-800">
                  €{{ formatNumber(calculateNetSalary()) }}
                </p>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-primary-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-neutral-500 mb-1">
                    Salaire Net Mensuel
                  </label>
                  <p class="text-lg font-bold text-primary-800">
                    €{{ formatNumber(calculateNetSalary() / 12) }}
                  </p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-neutral-500 mb-1">
                    Taux de Déduction
                  </label>
                  <p class="text-lg font-bold text-error-700">
                    {{ calculateDeductionRate() }}%
                  </p>
                </div>
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
            <!-- Upload Appointment Letter -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-3"
                >Upload Appointment Letter</label
              >
              <div
                class="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-secondary-400 hover:bg-secondary-50/30 transition-all cursor-pointer group"
                @click="$refs.appointmentLetterInput.click()"
              >
                <input
                  type="file"
                  @change="handleFileSelect('appointmentLetter', $event)"
                  class="hidden"
                  ref="appointmentLetterInput"
                />
                <div
                  class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary-200 transition-colors"
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
                <p class="text-sm text-neutral-600 font-medium">
                  Drag & Drop or choose file to upload
                </p>
                <p class="text-xs text-neutral-500 mt-1">
                  Supported formats - .jpeg, .pdf
                </p>
                <p
                  v-if="documents.appointmentLetter"
                  class="text-xs text-success-600 mt-3 font-medium"
                >
                  ✓ {{ documents.appointmentLetter.name }}
                </p>
              </div>
            </div>

            <!-- Upload Salary Slips -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-3"
                >Upload Salary Slips</label
              >
              <div
                class="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-secondary-400 hover:bg-secondary-50/30 transition-all cursor-pointer group"
                @click="$refs.salarySlipsInput.click()"
              >
                <input
                  type="file"
                  multiple
                  @change="handleFileSelect('salarySlips', $event)"
                  class="hidden"
                  ref="salarySlipsInput"
                />
                <div
                  class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary-200 transition-colors"
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
                <p class="text-sm text-neutral-600 font-medium">
                  Drag & Drop or choose file to upload
                </p>
                <p class="text-xs text-neutral-500 mt-1">
                  Supported formats - .jpeg, .pdf
                </p>
                <p
                  v-if="documents.salarySlips.length > 0"
                  class="text-xs text-success-600 mt-3 font-medium"
                >
                  ✓ {{ documents.salarySlips.length }} file{{
                    documents.salarySlips.length > 1 ? "s" : ""
                  }}
                </p>
              </div>
            </div>

            <!-- Upload Relieving Letter -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-3"
                >Upload Relieving Letter</label
              >
              <div
                class="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-secondary-400 hover:bg-secondary-50/30 transition-all cursor-pointer group"
                @click="$refs.relievingLetterInput.click()"
              >
                <input
                  type="file"
                  @change="handleFileSelect('relievingLetter', $event)"
                  class="hidden"
                  ref="relievingLetterInput"
                />
                <div
                  class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary-200 transition-colors"
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
                <p class="text-sm text-neutral-600 font-medium">
                  Drag & Drop or choose file to upload
                </p>
                <p class="text-xs text-neutral-500 mt-1">
                  Supported formats - .jpeg, .pdf
                </p>
                <p
                  v-if="documents.relievingLetter"
                  class="text-xs text-success-600 mt-3 font-medium"
                >
                  ✓ {{ documents.relievingLetter.name }}
                </p>
              </div>
            </div>

            <!-- Upload Experience Letter -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-3"
                >Upload Experience Letter</label
              >
              <div
                class="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-secondary-400 hover:bg-secondary-50/30 transition-all cursor-pointer group"
                @click="$refs.experienceLetterInput.click()"
              >
                <input
                  type="file"
                  @change="handleFileSelect('experienceLetter', $event)"
                  class="hidden"
                  ref="experienceLetterInput"
                />
                <div
                  class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary-200 transition-colors"
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
                <p class="text-sm text-neutral-600 font-medium">
                  Drag & Drop or choose file to upload
                </p>
                <p class="text-xs text-neutral-500 mt-1">
                  Supported formats - .jpeg, .pdf
                </p>
                <p
                  v-if="documents.experienceLetter"
                  class="text-xs text-success-600 mt-3 font-medium"
                >
                  ✓ {{ documents.experienceLetter.name }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Access Tab -->
        <div v-if="activeTab === 'account'" class="space-y-6">
          <h2 class="text-lg font-semibold text-neutral-900 pb-4 border-b">
            Account Access
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Username *</label
              >
              <input
                v-model="formData.username"
                type="text"
                placeholder="john.doe"
                class="input-base"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Email for Login *</label
              >
              <input
                v-model="formData.loginEmail"
                type="email"
                placeholder="john.doe@company.com"
                class="input-base"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Password *</label
              >
              <input
                v-model="formData.password"
                type="password"
                placeholder="••••••••"
                class="input-base"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1"
                >Confirm Password *</label
              >
              <input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="••••••••"
                class="input-base"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-3"
              >User Role</label
            >
            <div class="space-y-2">
              <div
                v-for="role in userRoles"
                :key="role"
                class="flex items-center"
              >
                <input
                  type="radio"
                  :id="`role-${role}`"
                  :value="role"
                  v-model="formData.role"
                  class="w-4 h-4"
                />
                <label
                  :for="`role-${role}`"
                  class="ml-2 text-sm font-medium text-neutral-700 cursor-pointer"
                  >{{ role }}</label
                >
              </div>
            </div>
          </div>

          <div class="bg-info-50 border border-info-200 rounded-lg p-4">
            <p class="text-sm text-info-700">
              An email with login credentials will be sent to the employee
              automatically.
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mt-6 bg-error-50 border border-error-200 rounded-lg p-4 flex gap-3"
        >
          <svg
            class="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <p class="text-sm text-error-700">{{ errorMessage }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-6 border-t border-neutral-200 mt-6">
          <button type="submit" :disabled="isLoading" class="btn-primary px-8">
            {{ isLoading ? "Creating..." : "Create Employee" }}
          </button>
          <router-link to="/employees" class="btn-outline px-8">
            Cancel
          </router-link>
        </div>
      </form>
    </div>

    <!-- Add Prime Modal -->
    <div
      v-if="isPrimeModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="isPrimeModalOpen = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Ajouter une Prime</h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Type de Prime <span class="text-error-600">*</span>
            </label>
            <select
              v-model="primeForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="Performance">Prime de Performance</option>
              <option value="Annual">Prime Annuelle</option>
              <option value="Project">Prime de Projet</option>
              <option value="Retention">Prime de Fidélité</option>
              <option value="Holiday">Prime de Vacances</option>
              <option value="Other">Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Montant <span class="text-error-600">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="primeForm.amount"
                type="number"
                placeholder="0"
                min="0"
                class="w-full px-4 py-2.5 pl-8 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">€</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Fréquence <span class="text-error-600">*</span>
            </label>
            <select
              v-model="primeForm.frequency"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="annual">Annuelle</option>
              <option value="monthly">Mensuelle</option>
              <option value="quarterly">Trimestrielle</option>
              <option value="one-time">Unique</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Date d'Effet
            </label>
            <input
              v-model="primeForm.effectiveDate"
              type="date"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="isPrimeModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            @click="addPrime"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    <!-- Add Benefit Modal -->
    <div
      v-if="isBenefitModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="isBenefitModalOpen = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Ajouter un Avantage en Nature</h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Type d'Avantage <span class="text-error-600">*</span>
            </label>
            <select
              v-model="benefitForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="Transport">Transport (Véhicule de société)</option>
              <option value="Meal">Tickets Restaurant</option>
              <option value="Housing">Logement</option>
              <option value="Health">Assurance Santé</option>
              <option value="Phone">Téléphone/Internet</option>
              <option value="Other">Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Valeur Taxable (mensuelle) <span class="text-error-600">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="benefitForm.taxableValue"
                type="number"
                placeholder="0"
                min="0"
                class="w-full px-4 py-2.5 pl-8 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">€</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Fréquence <span class="text-error-600">*</span>
            </label>
            <select
              v-model="benefitForm.frequency"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="monthly">Mensuelle</option>
              <option value="annual">Annuelle</option>
              <option value="quarterly">Trimestrielle</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              v-model="benefitForm.description"
              rows="3"
              placeholder="Description de l'avantage..."
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            ></textarea>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="isBenefitModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            @click="addBenefit"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    <!-- Add Other Modal -->
    <div
      v-if="isOtherModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="isOtherModalOpen = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Ajouter un Élément de Rémunération</h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Libellé <span class="text-error-600">*</span>
            </label>
            <input
              v-model="otherForm.label"
              type="text"
              placeholder="Ex: Indemnité de transport"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Montant <span class="text-error-600">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="otherForm.amount"
                type="number"
                placeholder="0"
                min="0"
                class="w-full px-4 py-2.5 pl-8 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">€</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Type <span class="text-error-600">*</span>
            </label>
            <select
              v-model="otherForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="allowance">Indemnité</option>
              <option value="bonus">Bonus</option>
              <option value="commission">Commission</option>
              <option value="overtime">Heures Supplémentaires</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Fréquence <span class="text-error-600">*</span>
            </label>
            <select
              v-model="otherForm.frequency"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="monthly">Mensuelle</option>
              <option value="annual">Annuelle</option>
              <option value="quarterly">Trimestrielle</option>
              <option value="one-time">Unique</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="isOtherModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            @click="addOther"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    <!-- Add Tax Modal -->
    <div
      v-if="isTaxModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="isTaxModalOpen = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Ajouter un Impôt</h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Type d'Impôt <span class="text-error-600">*</span>
            </label>
            <select
              v-model="taxForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="Impôt sur le Revenu">Impôt sur le Revenu</option>
              <option value="CSG">CSG (Contribution Sociale Généralisée)</option>
              <option value="CRDS">CRDS (Contribution au Remboursement de la Dette Sociale)</option>
              <option value="Précompte">Précompte</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label class="flex items-center gap-2 mb-2">
              <input
                v-model="taxForm.isPercentage"
                type="checkbox"
                class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-neutral-700">Calcul en pourcentage</span>
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              {{ taxForm.isPercentage ? "Taux (%)" : "Montant" }} <span class="text-error-600">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="taxForm.amount"
                type="number"
                :placeholder="taxForm.isPercentage ? '0' : '0'"
                min="0"
                :max="taxForm.isPercentage ? 100 : null"
                class="w-full px-4 py-2.5 pl-8 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                {{ taxForm.isPercentage ? "%" : "€" }}
              </span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Base de Calcul
            </label>
            <select
              v-model="taxForm.base"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="grossSalary">Salaire Brut</option>
              <option value="netSalary">Salaire Net</option>
            </select>
          </div>
          <div v-if="!taxForm.isPercentage">
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Fréquence
            </label>
            <select
              v-model="taxForm.frequency"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="monthly">Mensuelle</option>
              <option value="annual">Annuelle</option>
              <option value="quarterly">Trimestrielle</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="isTaxModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            @click="addTax"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    <!-- Add Social Security Modal -->
    <div
      v-if="isSocialSecurityModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="isSocialSecurityModalOpen = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Ajouter une Cotisation Sociale</h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Type de Cotisation <span class="text-error-600">*</span>
            </label>
            <select
              v-model="socialSecurityForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="Sécurité Sociale">Sécurité Sociale</option>
              <option value="Assurance Chômage">Assurance Chômage</option>
              <option value="Retraite">Retraite</option>
              <option value="Prévoyance">Prévoyance</option>
              <option value="Mutuelle">Mutuelle</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label class="flex items-center gap-2 mb-2">
              <input
                v-model="socialSecurityForm.isPercentage"
                type="checkbox"
                class="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-neutral-700">Calcul en pourcentage</span>
            </label>
          </div>
          <div v-if="socialSecurityForm.isPercentage">
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Taux Total (%) <span class="text-error-600">*</span>
            </label>
            <input
              v-model.number="socialSecurityForm.rate"
              type="number"
              placeholder="0"
              min="0"
              max="100"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div v-else>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Montant Mensuel <span class="text-error-600">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="socialSecurityForm.amount"
                type="number"
                placeholder="0"
                min="0"
                class="w-full px-4 py-2.5 pl-8 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">€</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Base de Calcul
            </label>
            <select
              v-model="socialSecurityForm.base"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="grossSalary">Salaire Brut</option>
              <option value="netSalary">Salaire Net</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Part Employé (%) <span class="text-error-600">*</span>
            </label>
            <input
              v-model.number="socialSecurityForm.employeeShare"
              type="number"
              placeholder="50"
              min="0"
              max="100"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="isSocialSecurityModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            @click="addSocialSecurity"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    <!-- Add Insurance Modal -->
    <div
      v-if="isInsuranceModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="isInsuranceModalOpen = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Ajouter une Assurance</h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Type d'Assurance <span class="text-error-600">*</span>
            </label>
            <select
              v-model="insuranceForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="Santé">Assurance Santé</option>
              <option value="Vie">Assurance Vie</option>
              <option value="Invalidité">Assurance Invalidité</option>
              <option value="Décès">Assurance Décès</option>
              <option value="Complémentaire">Complémentaire</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Montant Total Mensuel <span class="text-error-600">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="insuranceForm.amount"
                type="number"
                placeholder="0"
                min="0"
                class="w-full px-4 py-2.5 pl-8 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">€</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Part Employé (mensuelle) <span class="text-error-600">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="insuranceForm.employeeShare"
                type="number"
                placeholder="0"
                min="0"
                class="w-full px-4 py-2.5 pl-8 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">€</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Date d'Effet
            </label>
            <input
              v-model="insuranceForm.effectiveDate"
              type="date"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="isInsuranceModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            @click="addInsurance"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    <!-- Add Other Deduction Modal -->
    <div
      v-if="isOtherDeductionModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="isOtherDeductionModalOpen = false"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-bold text-neutral-900">Ajouter une Déduction</h2>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Libellé <span class="text-error-600">*</span>
            </label>
            <input
              v-model="otherDeductionForm.label"
              type="text"
              placeholder="Ex: Prêt salarial"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Montant <span class="text-error-600">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="otherDeductionForm.amount"
                type="number"
                placeholder="0"
                min="0"
                class="w-full px-4 py-2.5 pl-8 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">€</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Type <span class="text-error-600">*</span>
            </label>
            <select
              v-model="otherDeductionForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="loan">Prêt</option>
              <option value="advance">Avance sur Salaire</option>
              <option value="penalty">Pénalité</option>
              <option value="union">Cotisation Syndicale</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Fréquence <span class="text-error-600">*</span>
            </label>
            <select
              v-model="otherDeductionForm.frequency"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="monthly">Mensuelle</option>
              <option value="annual">Annuelle</option>
              <option value="quarterly">Trimestrielle</option>
              <option value="one-time">Unique</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="isOtherDeductionModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            @click="addOtherDeduction"
            class="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Tabs
const tabs = [
  { id: "personal", label: "Personal Information" },
  { id: "professional", label: "Professional Information" },
  { id: "remuneration", label: "Rémunérations" },
  { id: "deductions", label: "Déductions" },
  { id: "documents", label: "Documents" },
  { id: "account", label: "Account Access" },
];
const activeTab = ref("personal");

// Form data
const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  nationality: "",
  maritalStatus: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  department: "",
  jobTitle: "",
  employmentType: "",
  startDate: "",
  manager: "",
  salary: "",
  status: "active",
  username: "",
  loginEmail: "",
  password: "",
  confirmPassword: "",
  role: "Employee",
  photoFile: null,
});

// Profile photo preview
const profilePhotoPreview = ref(null);

// UI States
const isLoading = ref(false);
const errorMessage = ref("");

// Documents
const documents = ref({
  appointmentLetter: null,
  salarySlips: [],
  relievingLetter: null,
  experienceLetter: null,
});

// Rémunérations
const remuneration = ref({
  baseSalary: {
    annual: null,
    monthly: null,
    paymentPeriod: "monthly",
    effectiveDate: "",
  },
  primes: [],
  benefits: [],
  others: [],
});

// Modals
const isPrimeModalOpen = ref(false);
const isBenefitModalOpen = ref(false);
const isOtherModalOpen = ref(false);

// Form data for modals
const primeForm = ref({
  type: "",
  amount: null,
  frequency: "annual",
  effectiveDate: "",
});

const benefitForm = ref({
  type: "",
  taxableValue: null,
  frequency: "monthly",
  description: "",
});

const otherForm = ref({
  label: "",
  amount: null,
  type: "allowance",
  frequency: "monthly",
});

// Déductions
const deductions = ref({
  taxes: [],
  socialSecurity: [],
  insurance: [],
  others: [],
});

// Modals for deductions
const isTaxModalOpen = ref(false);
const isSocialSecurityModalOpen = ref(false);
const isInsuranceModalOpen = ref(false);
const isOtherDeductionModalOpen = ref(false);

// Form data for deduction modals
const taxForm = ref({
  type: "",
  amount: null,
  isPercentage: true,
  base: "grossSalary",
  frequency: "monthly",
});

const socialSecurityForm = ref({
  type: "",
  rate: null,
  amount: null,
  isPercentage: true,
  base: "grossSalary",
  employeeShare: 50,
});

const insuranceForm = ref({
  type: "",
  amount: null,
  employeeShare: null,
  effectiveDate: "",
});

const otherDeductionForm = ref({
  label: "",
  amount: null,
  type: "loan",
  frequency: "monthly",
});

const userRoles = ["Employee", "Manager", "HR", "Admin"];

// File inputs refs
const photoInput = ref(null);
const appointmentLetterInput = ref(null);
const salarySlipsInput = ref(null);
const relievingLetterInput = ref(null);
const experienceLetterInput = ref(null);

// Methods
const handleFileSelect = (docType, event) => {
  const files = event.target.files;
  if (docType === "appointmentLetter") {
    documents.value.appointmentLetter = files[0];
  } else if (docType === "salarySlips") {
    documents.value.salarySlips = Array.from(files);
  } else if (docType === "relievingLetter") {
    documents.value.relievingLetter = files[0];
  } else if (docType === "experienceLetter") {
    documents.value.experienceLetter = files[0];
  }
};

const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = "Photo must be less than 5MB";
      return;
    }
    formData.value.photoFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePhotoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const validateForm = () => {
  errorMessage.value = "";

  if (!formData.value.firstName.trim()) {
    errorMessage.value = "First name is required";
    activeTab.value = "personal";
    return false;
  }

  if (!formData.value.lastName.trim()) {
    errorMessage.value = "Last name is required";
    activeTab.value = "personal";
    return false;
  }

  if (!formData.value.email.trim()) {
    errorMessage.value = "Email is required";
    activeTab.value = "personal";
    return false;
  }

  if (!formData.value.department) {
    errorMessage.value = "Department is required";
    activeTab.value = "professional";
    return false;
  }

  if (!formData.value.jobTitle.trim()) {
    errorMessage.value = "Job title is required";
    activeTab.value = "professional";
    return false;
  }

  if (!formData.value.username.trim()) {
    errorMessage.value = "Username is required";
    activeTab.value = "account";
    return false;
  }

  if (!formData.value.password.trim() || formData.value.password.length < 8) {
    errorMessage.value = "Password must be at least 8 characters";
    activeTab.value = "account";
    return false;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    errorMessage.value = "Passwords do not match";
    activeTab.value = "account";
    return false;
  }

  return true;
};

// Rémunération Functions
const formatNumber = (num) => {
  if (!num) return "0";
  return Number(num).toLocaleString("fr-FR");
};

const openAddPrimeModal = () => {
  primeForm.value = {
    type: "",
    amount: null,
    frequency: "annual",
    effectiveDate: "",
  };
  isPrimeModalOpen.value = true;
};

const addPrime = () => {
  if (!primeForm.value.type || !primeForm.value.amount) {
    alert("Veuillez remplir tous les champs requis");
    return;
  }
  remuneration.value.primes.push({ ...primeForm.value });
  isPrimeModalOpen.value = false;
};

const removePrime = (index) => {
  remuneration.value.primes.splice(index, 1);
};

const openAddBenefitModal = () => {
  benefitForm.value = {
    type: "",
    taxableValue: null,
    frequency: "monthly",
    description: "",
  };
  isBenefitModalOpen.value = true;
};

const addBenefit = () => {
  if (!benefitForm.value.type || !benefitForm.value.taxableValue) {
    alert("Veuillez remplir tous les champs requis");
    return;
  }
  remuneration.value.benefits.push({ ...benefitForm.value });
  isBenefitModalOpen.value = false;
};

const removeBenefit = (index) => {
  remuneration.value.benefits.splice(index, 1);
};

const openAddOtherModal = () => {
  otherForm.value = {
    label: "",
    amount: null,
    type: "allowance",
    frequency: "monthly",
  };
  isOtherModalOpen.value = true;
};

const addOther = () => {
  if (!otherForm.value.label || !otherForm.value.amount) {
    alert("Veuillez remplir tous les champs requis");
    return;
  }
  remuneration.value.others.push({ ...otherForm.value });
  isOtherModalOpen.value = false;
};

const removeOther = (index) => {
  remuneration.value.others.splice(index, 1);
};

const calculateTotalPrimes = () => {
  return remuneration.value.primes.reduce((total, prime) => {
    const multiplier = prime.frequency === "annual" ? 1 : prime.frequency === "monthly" ? 12 : prime.frequency === "quarterly" ? 4 : 0;
    return total + (prime.amount * multiplier);
  }, 0);
};

const calculateTotalBenefits = () => {
  return remuneration.value.benefits.reduce((total, benefit) => {
    const multiplier = benefit.frequency === "annual" ? 1 : benefit.frequency === "monthly" ? 12 : benefit.frequency === "quarterly" ? 4 : 0;
    return total + (benefit.taxableValue * multiplier);
  }, 0);
};

const calculateTotalOthers = () => {
  return remuneration.value.others.reduce((total, other) => {
    const multiplier = other.frequency === "annual" ? 1 : other.frequency === "monthly" ? 12 : other.frequency === "quarterly" ? 4 : 0;
    return total + (other.amount * multiplier);
  }, 0);
};

const calculateTotalCTC = () => {
  return (remuneration.value.baseSalary.annual || 0) + calculateTotalPrimes() + calculateTotalBenefits() + calculateTotalOthers();
};

// Watch for salary changes to sync annual and monthly
watch(
  () => remuneration.value.baseSalary.annual,
  (newVal) => {
    if (newVal) {
      remuneration.value.baseSalary.monthly = Math.round(newVal / 12);
    }
  }
);

watch(
  () => remuneration.value.baseSalary.monthly,
  (newVal) => {
    if (newVal) {
      remuneration.value.baseSalary.annual = newVal * 12;
    }
  }
);

// Déductions Functions
const openAddTaxModal = () => {
  taxForm.value = {
    type: "",
    amount: null,
    isPercentage: true,
    base: "grossSalary",
    frequency: "monthly",
  };
  isTaxModalOpen.value = true;
};

const addTax = () => {
  if (!taxForm.value.type || !taxForm.value.amount) {
    alert("Veuillez remplir tous les champs requis");
    return;
  }
  deductions.value.taxes.push({ ...taxForm.value });
  isTaxModalOpen.value = false;
};

const removeTax = (index) => {
  deductions.value.taxes.splice(index, 1);
};

const openAddSocialSecurityModal = () => {
  socialSecurityForm.value = {
    type: "",
    rate: null,
    amount: null,
    isPercentage: true,
    base: "grossSalary",
    employeeShare: 50,
  };
  isSocialSecurityModalOpen.value = true;
};

const addSocialSecurity = () => {
  if (!socialSecurityForm.value.type || (!socialSecurityForm.value.rate && !socialSecurityForm.value.amount)) {
    alert("Veuillez remplir tous les champs requis");
    return;
  }
  deductions.value.socialSecurity.push({ ...socialSecurityForm.value });
  isSocialSecurityModalOpen.value = false;
};

const removeSocialSecurity = (index) => {
  deductions.value.socialSecurity.splice(index, 1);
};

const openAddInsuranceModal = () => {
  insuranceForm.value = {
    type: "",
    amount: null,
    employeeShare: null,
    effectiveDate: "",
  };
  isInsuranceModalOpen.value = true;
};

const addInsurance = () => {
  if (!insuranceForm.value.type || !insuranceForm.value.amount || !insuranceForm.value.employeeShare) {
    alert("Veuillez remplir tous les champs requis");
    return;
  }
  deductions.value.insurance.push({ ...insuranceForm.value });
  isInsuranceModalOpen.value = false;
};

const removeInsurance = (index) => {
  deductions.value.insurance.splice(index, 1);
};

const openAddOtherDeductionModal = () => {
  otherDeductionForm.value = {
    label: "",
    amount: null,
    type: "loan",
    frequency: "monthly",
  };
  isOtherDeductionModalOpen.value = true;
};

const addOtherDeduction = () => {
  if (!otherDeductionForm.value.label || !otherDeductionForm.value.amount) {
    alert("Veuillez remplir tous les champs requis");
    return;
  }
  deductions.value.others.push({ ...otherDeductionForm.value });
  isOtherDeductionModalOpen.value = false;
};

const removeOtherDeduction = (index) => {
  deductions.value.others.splice(index, 1);
};

const calculateTotalTaxes = () => {
  const grossSalary = remuneration.value.baseSalary.annual || 0;
  return deductions.value.taxes.reduce((total, tax) => {
    if (tax.isPercentage) {
      const base = tax.base === "grossSalary" ? grossSalary : grossSalary;
      return total + (base * tax.amount / 100);
    } else {
      const multiplier = tax.frequency === "annual" ? 1 : tax.frequency === "monthly" ? 12 : tax.frequency === "quarterly" ? 4 : 0;
      return total + (tax.amount * multiplier);
    }
  }, 0);
};

const calculateTotalSocialSecurity = () => {
  const grossSalary = remuneration.value.baseSalary.annual || 0;
  return deductions.value.socialSecurity.reduce((total, contribution) => {
    if (contribution.isPercentage) {
      const base = contribution.base === "grossSalary" ? grossSalary : grossSalary;
      const totalRate = contribution.rate || 0;
      const employeeRate = (totalRate * contribution.employeeShare) / 100;
      return total + (base * employeeRate / 100);
    } else {
      const employeeAmount = (contribution.amount * contribution.employeeShare) / 100;
      return total + (employeeAmount * 12);
    }
  }, 0);
};

const calculateTotalInsurance = () => {
  return deductions.value.insurance.reduce((total, insurance) => {
    return total + (insurance.employeeShare * 12);
  }, 0);
};

const calculateTotalOtherDeductions = () => {
  return deductions.value.others.reduce((total, other) => {
    const multiplier = other.frequency === "annual" ? 1 : other.frequency === "monthly" ? 12 : other.frequency === "quarterly" ? 4 : 0;
    return total + (other.amount * multiplier);
  }, 0);
};

const calculateTotalDeductions = () => {
  return calculateTotalTaxes() + calculateTotalSocialSecurity() + calculateTotalInsurance() + calculateTotalOtherDeductions();
};

const calculateNetSalary = () => {
  const grossSalary = remuneration.value.baseSalary.annual || 0;
  return Math.max(0, grossSalary - calculateTotalDeductions());
};

const calculateDeductionRate = () => {
  const grossSalary = remuneration.value.baseSalary.annual || 0;
  if (grossSalary === 0) return 0;
  return ((calculateTotalDeductions() / grossSalary) * 100).toFixed(2);
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock API response
    const response = {
      success: true,
      message: "Employee created successfully",
      data: {
        id: Math.floor(Math.random() * 10000),
        name: `${formData.value.firstName} ${formData.value.lastName}`,
        email: formData.value.email,
      },
    };

    if (response.success) {
      // Redirect after 1 second
      setTimeout(() => {
        router.push("/employees");
      }, 1000);
    } else {
      errorMessage.value = response.message || "Failed to create employee";
    }
  } catch (error) {
    errorMessage.value = "An error occurred. Please try again.";
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
