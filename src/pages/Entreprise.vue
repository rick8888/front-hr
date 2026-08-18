<template>
  <div class="flex w-full min-h-screen bg-neutral-50">
    <!-- Sidebar Navigation - Vertical Menu -->
    <div class="w-64 bg-white border-r border-neutral-200 shadow-sm flex-shrink-0">
      <div class="p-6 border-b border-neutral-200">
        <h1 class="text-2xl font-bold text-neutral-900 mb-1">Entreprise</h1>
        <p class="text-xs text-neutral-600">Configuration RH</p>
      </div>
      <div class="p-4 border-b border-neutral-200">
        <button 
          @click="saveAllData" 
          class="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Enregistrer toutes les modifications
        </button>
        <p class="text-xs text-neutral-500 mt-2 text-center">Sauvegarde automatique activée</p>
      </div>
      <nav class="p-4 space-y-1 overflow-y-auto" style="max-height: calc(100vh - 120px);">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 group',
            activeTab === tab.id
              ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600 shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 border-l-4 border-transparent',
          ]"
        >
          <component
            :is="tab.icon"
            v-if="tab.icon"
            :class="[
              'w-5 h-5 flex-shrink-0 transition-colors',
              activeTab === tab.id ? 'text-primary-600' : 'text-neutral-400 group-hover:text-primary-500'
            ]"
          />
          <span class="text-left flex-1">{{ tab.label }}</span>
          <div
            v-if="activeTab === tab.id"
            class="w-1.5 h-1.5 rounded-full bg-primary-600"
          ></div>
        </button>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-8">
        <!-- Tab Content -->
        <div class="bg-white rounded-xl border border-neutral-200 shadow-sm">
          <!-- Informations Entreprise Tab -->
          <div v-if="activeTab === 'company-info'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Informations de l'entreprise</h2>
                <p class="text-sm text-neutral-600">Configurez les informations légales et administratives</p>
              </div>
              <button 
                @click="saveCompanyInfo" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold"
              >
                Enregistrer
              </button>
            </div>

            <div class="space-y-6 max-w-4xl">
              <!-- Logo et informations de base -->
              <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <h3 class="text-lg font-semibold text-neutral-900 mb-4">Logo et identité</h3>
                <div class="flex items-center gap-6 mb-6">
                  <div class="w-32 h-32 rounded-lg border-2 border-dashed border-neutral-300 bg-white flex items-center justify-center">
                    <svg class="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
                      Changer le logo
                    </button>
                    <p class="text-xs text-neutral-500 mt-2">PNG, JPG max 2MB</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Nom de l'entreprise *</label>
                    <input v-model="companyInfo.name" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Forme juridique</label>
                    <select v-model="companyInfo.legalForm" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="SARL">SARL</option>
                      <option value="SA">SA</option>
                      <option value="SAS">SAS</option>
                      <option value="EURL">EURL</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Informations légales -->
              <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <h3 class="text-lg font-semibold text-neutral-900 mb-4">Informations légales</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">SIRET</label>
                    <input v-model="companyInfo.siret" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">SIREN</label>
                    <input v-model="companyInfo.siren" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">N° TVA</label>
                    <input v-model="companyInfo.vatNumber" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Code APE/NAF</label>
                    <input v-model="companyInfo.apeCode" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">RCS</label>
                    <input v-model="companyInfo.rcs" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Capital social</label>
                    <input v-model="companyInfo.shareCapital" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                </div>
              </div>

              <!-- Coordonnées -->
              <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <h3 class="text-lg font-semibold text-neutral-900 mb-4">Coordonnées</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Adresse</label>
                    <input v-model="companyInfo.address" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Ville</label>
                    <input v-model="companyInfo.city" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Code postal</label>
                    <input v-model="companyInfo.postalCode" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Téléphone</label>
                    <input v-model="companyInfo.phone" type="tel" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                    <input v-model="companyInfo.email" type="email" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Structure organisationnelle Tab -->
          <div v-if="activeTab === 'organization'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Structure organisationnelle</h2>
                <p class="text-sm text-neutral-600">Définissez la hiérarchie et les départements</p>
              </div>
              <button 
                @click="openDepartmentModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un département
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="dept in departments" :key="dept.id" class="border border-neutral-200 rounded-lg p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-neutral-900 mb-2">{{ dept.name }}</h3>
                    <p class="text-sm text-neutral-600 mb-3">{{ dept.description }}</p>
                    <div class="flex items-center gap-6 text-sm">
                      <div>
                        <span class="text-neutral-500">Manager:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ dept.manager || 'Non assigné' }}</span>
                      </div>
                      <div>
                        <span class="text-neutral-500">Effectif:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ dept.employeeCount }} employés</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="editDepartment(dept)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteDepartment(dept.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Éléments de salaires Tab -->
          <div v-if="activeTab === 'salary-elements'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Éléments de salaires</h2>
                <p class="text-sm text-neutral-600">Configurez les éléments de rémunération de base</p>
              </div>
              <button 
                @click="openSalaryElementModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un élément
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="element in salaryElements"
                :key="element.id"
                class="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-neutral-900">{{ element.name }}</h3>
                      <span
                        :class="[
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          element.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-100 text-neutral-600'
                        ]"
                      >
                        {{ element.status }}
                      </span>
                    </div>
                    <p class="text-sm text-neutral-600 mb-3">{{ element.description }}</p>
                    <div class="flex items-center gap-6 text-sm">
                      <div>
                        <span class="text-neutral-500">Type:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ element.type }}</span>
                      </div>
                      <div v-if="element.baseAmount">
                        <span class="text-neutral-500">Montant de base:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ element.baseAmount }}</span>
                      </div>
                      <div v-if="element.isTaxable !== undefined">
                        <span class="text-neutral-500">Imposable:</span>
                        <span class="ml-2 font-medium" :class="element.isTaxable ? 'text-green-600' : 'text-neutral-600'">
                          {{ element.isTaxable ? 'Oui' : 'Non' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 ml-4">
                    <button
                      @click="editSalaryElement(element)"
                      class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteSalaryElement(element.id)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="salaryElements.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-neutral-500 mb-4">Aucun élément de salaire configuré</p>
                <button
                  @click="openSalaryElementModal"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Ajouter le premier élément
                </button>
              </div>
            </div>
          </div>

          <!-- Déductions Tab -->
          <div v-if="activeTab === 'deductions'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Types de déductions</h2>
                <p class="text-sm text-neutral-600">Configurez les types de déductions applicables</p>
              </div>
              <button 
                @click="openDeductionModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un type
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="deduction in deductions"
                :key="deduction.id"
                class="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-neutral-900">{{ deduction.name }}</h3>
                      <span
                        :class="[
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          deduction.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-100 text-neutral-600'
                        ]"
                      >
                        {{ deduction.status }}
                      </span>
                    </div>
                    <p class="text-sm text-neutral-600 mb-3">{{ deduction.description }}</p>
                    <div class="flex items-center gap-6 text-sm">
                      <div>
                        <span class="text-neutral-500">Type:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ deduction.type }}</span>
                      </div>
                      <div v-if="deduction.rate">
                        <span class="text-neutral-500">Taux:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ deduction.rate }}%</span>
                      </div>
                      <div v-if="deduction.isMandatory !== undefined">
                        <span class="text-neutral-500">Obligatoire:</span>
                        <span class="ml-2 font-medium" :class="deduction.isMandatory ? 'text-orange-600' : 'text-neutral-600'">
                          {{ deduction.isMandatory ? 'Oui' : 'Non' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 ml-4">
                    <button
                      @click="editDeduction(deduction)"
                      class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteDeduction(deduction.id)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="deductions.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-neutral-500 mb-4">Aucun type de déduction configuré</p>
                <button
                  @click="openDeductionModal"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Ajouter le premier type
                </button>
              </div>
            </div>
          </div>

          <!-- Types d'absences Tab -->
          <div v-if="activeTab === 'absence-types'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Types d'absences</h2>
                <p class="text-sm text-neutral-600">Configurez les types d'absences et leurs règles</p>
              </div>
              <button 
                @click="openAbsenceTypeModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un type
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="absenceType in absenceTypes"
                :key="absenceType.id"
                class="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-neutral-900">{{ absenceType.name }}</h3>
                      <span
                        :class="[
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          absenceType.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-100 text-neutral-600'
                        ]"
                      >
                        {{ absenceType.status }}
                      </span>
                    </div>
                    <p class="text-sm text-neutral-600 mb-3">{{ absenceType.description }}</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span class="text-neutral-500">Payée:</span>
                        <span class="ml-2 font-medium" :class="absenceType.isPaid ? 'text-green-600' : 'text-neutral-600'">
                          {{ absenceType.isPaid ? 'Oui' : 'Non' }}
                        </span>
                      </div>
                      <div v-if="absenceType.maxDays">
                        <span class="text-neutral-500">Jours max/an:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ absenceType.maxDays }}</span>
                      </div>
                      <div v-if="absenceType.requiresApproval !== undefined">
                        <span class="text-neutral-500">Validation:</span>
                        <span class="ml-2 font-medium" :class="absenceType.requiresApproval ? 'text-orange-600' : 'text-green-600'">
                          {{ absenceType.requiresApproval ? 'Requis' : 'Automatique' }}
                        </span>
                      </div>
                      <div v-if="absenceType.accrualRate">
                        <span class="text-neutral-500">Acquisition:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ absenceType.accrualRate }} jours/mois</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 ml-4">
                    <button
                      @click="editAbsenceType(absenceType)"
                      class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteAbsenceType(absenceType.id)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="absenceTypes.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-neutral-500 mb-4">Aucun type d'absence configuré</p>
                <button
                  @click="openAbsenceTypeModal"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Ajouter le premier type
                </button>
              </div>
            </div>
          </div>

          <!-- Grilles salariales Tab -->
          <div v-if="activeTab === 'salary-grids'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Grilles salariales</h2>
                <p class="text-sm text-neutral-600">Définissez les grilles salariales par niveau</p>
              </div>
              <button 
                @click="openSalaryGridModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une grille
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="grid in salaryGrids" :key="grid.id" class="border border-neutral-200 rounded-lg p-6">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-semibold text-neutral-900">{{ grid.name }}</h3>
                    <p class="text-sm text-neutral-600">{{ grid.description }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="editSalaryGrid(grid)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteSalaryGrid(grid.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="space-y-2">
                  <div v-for="level in grid.levels" :key="level.level" class="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span class="font-medium text-neutral-700">{{ level.level }}</span>
                    <span class="text-sm text-neutral-600">{{ level.min }}€ - {{ level.max }}€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Types de primes Tab -->
          <div v-if="activeTab === 'primes'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Types de primes</h2>
                <p class="text-sm text-neutral-600">Configurez les types de primes</p>
              </div>
              <button 
                @click="openPrimeModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un type
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="prime in primes" :key="prime.id" class="border border-neutral-200 rounded-lg p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-neutral-900">{{ prime.name }}</h3>
                      <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{{ prime.status }}</span>
                    </div>
                    <p class="text-sm text-neutral-600 mb-2">{{ prime.description }}</p>
                    <span class="text-sm text-neutral-500">Type: {{ prime.type }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="editPrime(prime)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deletePrime(prime.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Types d'indemnités Tab -->
          <div v-if="activeTab === 'indemnites'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Types d'indemnités</h2>
                <p class="text-sm text-neutral-600">Configurez les types d'indemnités</p>
              </div>
              <button 
                @click="openIndemniteModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un type
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="indemnite in indemnites" :key="indemnite.id" class="border border-neutral-200 rounded-lg p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-neutral-900">{{ indemnite.name }}</h3>
                      <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{{ indemnite.status }}</span>
                    </div>
                    <p class="text-sm text-neutral-600 mb-2">{{ indemnite.description }}</p>
                    <div class="flex items-center gap-4 text-sm">
                      <span class="text-neutral-500">Type: <span class="font-medium text-neutral-700">{{ indemnite.type }}</span></span>
                      <span class="text-neutral-500">Montant: <span class="font-medium text-neutral-700">{{ indemnite.amount }}</span></span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="editIndemnite(indemnite)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteIndemnite(indemnite.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Types d'avantages Tab -->
          <div v-if="activeTab === 'avantages'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Types d'avantages</h2>
                <p class="text-sm text-neutral-600">Configurez les types d'avantages en nature</p>
              </div>
              <button 
                @click="openAvantageModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un type
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="avantage in avantages" :key="avantage.id" class="border border-neutral-200 rounded-lg p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-neutral-900">{{ avantage.name }}</h3>
                      <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{{ avantage.status }}</span>
                    </div>
                    <p class="text-sm text-neutral-600 mb-2">{{ avantage.description }}</p>
                    <div class="flex items-center gap-4 text-sm">
                      <span class="text-neutral-500">Type: <span class="font-medium text-neutral-700">{{ avantage.type }}</span></span>
                      <span class="text-neutral-500">Valeur: <span class="font-medium text-neutral-700">{{ avantage.value }}</span></span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="editAvantage(avantage)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteAvantage(avantage.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuration salariale Tab -->
          <div v-if="activeTab === 'payroll-config'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Configuration salariale</h2>
                <p class="text-sm text-neutral-600">Paramètres généraux de la paie</p>
              </div>
              <button 
                @click="saveSalaryConfig" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold"
              >
                Enregistrer
              </button>
            </div>

            <div class="space-y-6 max-w-4xl">
              <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <h3 class="text-lg font-semibold text-neutral-900 mb-4">Période de paie</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Fréquence</label>
                    <select
                      v-model="salaryConfig.payFrequency"
                      class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="monthly">Mensuelle</option>
                      <option value="biweekly">Bi-mensuelle</option>
                      <option value="weekly">Hebdomadaire</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Jour de paiement</label>
                    <input
                      v-model="salaryConfig.payDay"
                      type="number"
                      min="1"
                      max="31"
                      class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: 25"
                    />
                  </div>
                </div>
              </div>

              <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <h3 class="text-lg font-semibold text-neutral-900 mb-4">Heures de travail</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Heures par semaine</label>
                    <input
                      v-model="salaryConfig.hoursPerWeek"
                      type="number"
                      min="1"
                      max="60"
                      class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: 35"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 mb-2">Jours par semaine</label>
                    <input
                      v-model="salaryConfig.daysPerWeek"
                      type="number"
                      min="1"
                      max="7"
                      class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: 5"
                    />
                  </div>
                </div>
              </div>

              <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
                <h3 class="text-lg font-semibold text-neutral-900 mb-4">Cotisations sociales</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-white rounded-lg border border-neutral-200">
                    <div>
                      <p class="font-medium text-neutral-900">Taux de cotisation employeur</p>
                      <p class="text-sm text-neutral-600">Pourcentage des cotisations sociales</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        v-model="salaryConfig.employerContributionRate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        class="w-24 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-right"
                      />
                      <span class="text-neutral-600">%</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between p-4 bg-white rounded-lg border border-neutral-200">
                    <div>
                      <p class="font-medium text-neutral-900">Taux de cotisation salarié</p>
                      <p class="text-sm text-neutral-600">Pourcentage des cotisations sociales</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        v-model="salaryConfig.employeeContributionRate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        class="w-24 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-right"
                      />
                      <span class="text-neutral-600">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Régimes horaires Tab -->
          <div v-if="activeTab === 'work-schedules'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Régimes horaires</h2>
                <p class="text-sm text-neutral-600">Configurez les régimes de travail</p>
              </div>
              <button 
                @click="openWorkScheduleModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un régime
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="schedule in workSchedules" :key="schedule.id" class="border border-neutral-200 rounded-lg p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-neutral-900">{{ schedule.name }}</h3>
                      <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{{ schedule.status }}</span>
                    </div>
                    <p class="text-sm text-neutral-600 mb-3">{{ schedule.description }}</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span class="text-neutral-500">Heures/semaine:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ schedule.hoursPerWeek }}h</span>
                      </div>
                      <div>
                        <span class="text-neutral-500">Jours/semaine:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ schedule.daysPerWeek }}</span>
                      </div>
                      <div>
                        <span class="text-neutral-500">Début:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ schedule.startTime }}</span>
                      </div>
                      <div>
                        <span class="text-neutral-500">Fin:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ schedule.endTime }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="editWorkSchedule(schedule)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteWorkSchedule(schedule.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Politiques d'absences Tab -->
          <div v-if="activeTab === 'absence-policies'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Politiques d'absences</h2>
                <p class="text-sm text-neutral-600">Définissez les règles d'absences</p>
              </div>
              <button 
                @click="openAbsencePolicyModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une politique
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="policy in absencePolicies" :key="policy.id" class="border border-neutral-200 rounded-lg p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-neutral-900">{{ policy.name }}</h3>
                      <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{{ policy.status }}</span>
                    </div>
                    <p class="text-sm text-neutral-600 mb-3">{{ policy.description }}</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span class="text-neutral-500">Jours max:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ policy.maxDays }}</span>
                      </div>
                      <div>
                        <span class="text-neutral-500">Acquisition:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ policy.accrualRate }} jours/mois</span>
                      </div>
                      <div>
                        <span class="text-neutral-500">Report:</span>
                        <span class="ml-2 font-medium" :class="policy.carryOver ? 'text-green-600' : 'text-neutral-600'">
                          {{ policy.carryOver ? 'Autorisé' : 'Non autorisé' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="editAbsencePolicy(policy)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteAbsencePolicy(policy.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Conventions collectives Tab -->
          <div v-if="activeTab === 'collective-agreements'" class="p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h2 class="text-2xl font-bold text-neutral-900 mb-2">Conventions collectives</h2>
                <p class="text-sm text-neutral-600">Gérez les conventions collectives applicables</p>
              </div>
              <button 
                @click="openCollectiveAgreementModal" 
                class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une convention
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="agreement in collectiveAgreements" :key="agreement.id" class="border border-neutral-200 rounded-lg p-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-neutral-900">{{ agreement.name }}</h3>
                      <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{{ agreement.status }}</span>
                    </div>
                    <p class="text-sm text-neutral-600 mb-3">{{ agreement.description }}</p>
                    <div class="flex items-center gap-6 text-sm">
                      <div>
                        <span class="text-neutral-500">Code:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ agreement.code }}</span>
                      </div>
                      <div>
                        <span class="text-neutral-500">Date d'application:</span>
                        <span class="ml-2 font-medium text-neutral-700">{{ agreement.startDate }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="editCollectiveAgreement(agreement)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteCollectiveAgreement(agreement.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Salary Element Modal -->
    <div
      v-if="isSalaryElementModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeSalaryElementModal"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-neutral-200">
          <h3 class="text-xl font-bold text-neutral-900">
            {{ editingSalaryElement ? 'Modifier' : 'Ajouter' }} un élément de salaire
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
            <input
              v-model="salaryElementForm.name"
              type="text"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ex: Salaire de base"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Type *</label>
            <select
              v-model="salaryElementForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Base">Salaire de base</option>
              <option value="Bonus">Bonus</option>
              <option value="Commission">Commission</option>
              <option value="Heures supplémentaires">Heures supplémentaires</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea
              v-model="salaryElementForm.description"
              rows="3"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Description de l'élément"
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Montant de base</label>
              <input
                v-model="salaryElementForm.baseAmount"
                type="text"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: 2500€"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
              <select
                v-model="salaryElementForm.status"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="salaryElementForm.isTaxable"
              type="checkbox"
              id="taxable-salary"
              class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label for="taxable-salary" class="text-sm text-neutral-700">Imposable</label>
          </div>
        </div>
        <div class="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="closeSalaryElementModal"
            class="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="saveSalaryElement"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {{ editingSalaryElement ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Deduction Modal -->
    <div
      v-if="isDeductionModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeDeductionModal"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-neutral-200">
          <h3 class="text-xl font-bold text-neutral-900">
            {{ editingDeduction ? 'Modifier' : 'Ajouter' }} un type de déduction
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
            <input
              v-model="deductionForm.name"
              type="text"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ex: Assurance santé"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Type *</label>
            <select
              v-model="deductionForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Social">Cotisation sociale</option>
              <option value="Tax">Impôt</option>
              <option value="Insurance">Assurance</option>
              <option value="Retirement">Retraite</option>
              <option value="Other">Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea
              v-model="deductionForm.description"
              rows="3"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Description de la déduction"
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Taux (%)</label>
              <input
                v-model="deductionForm.rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: 2.5"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
              <select
                v-model="deductionForm.status"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="deductionForm.isMandatory"
              type="checkbox"
              id="mandatory-deduction"
              class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label for="mandatory-deduction" class="text-sm text-neutral-700">Déduction obligatoire</label>
          </div>
        </div>
        <div class="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="closeDeductionModal"
            class="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="saveDeduction"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {{ editingDeduction ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Absence Type Modal -->
    <div
      v-if="isAbsenceTypeModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeAbsenceTypeModal"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-neutral-200">
          <h3 class="text-xl font-bold text-neutral-900">
            {{ editingAbsenceType ? 'Modifier' : 'Ajouter' }} un type d'absence
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
            <input
              v-model="absenceTypeForm.name"
              type="text"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ex: Congés payés"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea
              v-model="absenceTypeForm.description"
              rows="3"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Description du type d'absence"
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Jours maximum par an</label>
              <input
                v-model="absenceTypeForm.maxDays"
                type="number"
                min="0"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: 25"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Taux d'acquisition (jours/mois)</label>
              <input
                v-model="absenceTypeForm.accrualRate"
                type="number"
                step="0.1"
                min="0"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ex: 2.08"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
              <select
                v-model="absenceTypeForm.status"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <input
                v-model="absenceTypeForm.isPaid"
                type="checkbox"
                id="paid-absence"
                class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <label for="paid-absence" class="text-sm text-neutral-700">Absence payée</label>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model="absenceTypeForm.requiresApproval"
                type="checkbox"
                id="approval-absence"
                class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <label for="approval-absence" class="text-sm text-neutral-700">Nécessite une validation</label>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <button
            @click="closeAbsenceTypeModal"
            class="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="saveAbsenceType"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {{ editingAbsenceType ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Department Modal -->
    <div v-if="isDepartmentModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDepartmentModal">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-neutral-200">
          <h3 class="text-xl font-bold text-neutral-900">{{ editingDepartment ? 'Modifier' : 'Ajouter' }} un département</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
            <input v-model="departmentForm.name" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea v-model="departmentForm.description" rows="3" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Manager</label>
            <input v-model="departmentForm.manager" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
        </div>
        <div class="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <button @click="closeDepartmentModal" class="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">Annuler</button>
          <button @click="saveDepartment" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">{{ editingDepartment ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>

    <!-- Prime Modal -->
    <div v-if="isPrimeModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closePrimeModal">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-neutral-200">
          <h3 class="text-xl font-bold text-neutral-900">{{ editingPrime ? 'Modifier' : 'Ajouter' }} un type de prime</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
            <input v-model="primeForm.name" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea v-model="primeForm.description" rows="3" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Type</label>
              <select v-model="primeForm.type" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="Variable">Variable</option>
                <option value="Fixe">Fixe</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
              <select v-model="primeForm.status" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <button @click="closePrimeModal" class="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">Annuler</button>
          <button @click="savePrime" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">{{ editingPrime ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>

    <!-- Indemnité Modal -->
    <div v-if="isIndemniteModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeIndemniteModal">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-neutral-200">
          <h3 class="text-xl font-bold text-neutral-900">{{ editingIndemnite ? 'Modifier' : 'Ajouter' }} un type d'indemnité</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
            <input v-model="indemniteForm.name" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea v-model="indemniteForm.description" rows="3" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Type</label>
              <select v-model="indemniteForm.type" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="Transport">Transport</option>
                <option value="Repas">Repas</option>
                <option value="Déplacement">Déplacement</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Montant</label>
              <input v-model="indemniteForm.amount" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Ex: 50€" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
            <select v-model="indemniteForm.status" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <button @click="closeIndemniteModal" class="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">Annuler</button>
          <button @click="saveIndemnite" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">{{ editingIndemnite ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>

    <!-- Avantage Modal -->
    <div v-if="isAvantageModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeAvantageModal">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-neutral-200">
          <h3 class="text-xl font-bold text-neutral-900">{{ editingAvantage ? 'Modifier' : 'Ajouter' }} un type d'avantage</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
            <input v-model="avantageForm.name" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea v-model="avantageForm.description" rows="3" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Type</label>
              <select v-model="avantageForm.type" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="Repas">Repas</option>
                <option value="Transport">Transport</option>
                <option value="Logement">Logement</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Valeur</label>
              <input v-model="avantageForm.value" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Ex: 8€" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
            <select v-model="avantageForm.status" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <button @click="closeAvantageModal" class="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">Annuler</button>
          <button @click="saveAvantage" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">{{ editingAvantage ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>

    <!-- Work Schedule Modal -->
    <div v-if="isWorkScheduleModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeWorkScheduleModal">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-neutral-200">
          <h3 class="text-xl font-bold text-neutral-900">{{ editingWorkSchedule ? 'Modifier' : 'Ajouter' }} un régime horaire</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
            <input v-model="workScheduleForm.name" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea v-model="workScheduleForm.description" rows="3" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Heures par semaine</label>
              <input v-model.number="workScheduleForm.hoursPerWeek" type="number" min="1" max="60" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Jours par semaine</label>
              <input v-model.number="workScheduleForm.daysPerWeek" type="number" min="1" max="7" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Heure de début</label>
              <input v-model="workScheduleForm.startTime" type="time" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Heure de fin</label>
              <input v-model="workScheduleForm.endTime" type="time" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
            <select v-model="workScheduleForm.status" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <button @click="closeWorkScheduleModal" class="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">Annuler</button>
          <button @click="saveWorkSchedule" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">{{ editingWorkSchedule ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>

    <!-- Absence Policy Modal -->
    <div v-if="isAbsencePolicyModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeAbsencePolicyModal">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-neutral-200">
          <h3 class="text-xl font-bold text-neutral-900">{{ editingAbsencePolicy ? 'Modifier' : 'Ajouter' }} une politique d'absence</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
            <input v-model="absencePolicyForm.name" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea v-model="absencePolicyForm.description" rows="3" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Jours maximum par an</label>
              <input v-model="absencePolicyForm.maxDays" type="number" min="0" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Taux d'acquisition (jours/mois)</label>
              <input v-model="absencePolicyForm.accrualRate" type="number" step="0.1" min="0" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="absencePolicyForm.carryOver" type="checkbox" id="carryover" class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500" />
            <label for="carryover" class="text-sm text-neutral-700">Autoriser le report de jours</label>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
            <select v-model="absencePolicyForm.status" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <button @click="closeAbsencePolicyModal" class="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">Annuler</button>
          <button @click="saveAbsencePolicy" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">{{ editingAbsencePolicy ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>

    <!-- Collective Agreement Modal -->
    <div v-if="isCollectiveAgreementModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeCollectiveAgreementModal">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-neutral-200">
          <h3 class="text-xl font-bold text-neutral-900">{{ editingCollectiveAgreement ? 'Modifier' : 'Ajouter' }} une convention collective</h3>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Nom *</label>
            <input v-model="collectiveAgreementForm.name" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Code</label>
            <input v-model="collectiveAgreementForm.code" type="text" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea v-model="collectiveAgreementForm.description" rows="3" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Date d'application</label>
              <input v-model="collectiveAgreementForm.startDate" type="date" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
              <select v-model="collectiveAgreementForm.status" class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-neutral-200 flex justify-end gap-3">
          <button @click="closeCollectiveAgreementModal" class="px-4 py-2 text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors">Annuler</button>
          <button @click="saveCollectiveAgreement" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">{{ editingCollectiveAgreement ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Icons
const CurrencyDollarIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const ReceiptPercentIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  `
}

const CalendarIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  `
}

const CogIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `
}

// Additional Icons
const BuildingOfficeIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  `
}

const GiftIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  `
}

const BanknotesIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  `
}

const SparklesIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  `
}

const ClockIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const DocumentTextIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
}

const ChartBarIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `
}

const UserGroupIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  `
}

const FolderIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  `
}

const tabs = [
  { id: "company-info", label: "Informations entreprise", icon: BuildingOfficeIcon },
  { id: "organization", label: "Structure organisationnelle", icon: UserGroupIcon },
  { id: "salary-elements", label: "Éléments de salaires", icon: CurrencyDollarIcon },
  { id: "salary-grids", label: "Grilles salariales", icon: ChartBarIcon },
  { id: "primes", label: "Types de primes", icon: GiftIcon },
  { id: "indemnites", label: "Types d'indemnités", icon: BanknotesIcon },
  { id: "deductions", label: "Types de déductions", icon: ReceiptPercentIcon },
  { id: "absence-types", label: "Types d'absences", icon: CalendarIcon },
  { id: "avantages", label: "Types d'avantages", icon: SparklesIcon },
  { id: "work-schedules", label: "Régimes horaires", icon: ClockIcon },
  { id: "absence-policies", label: "Politiques d'absences", icon: DocumentTextIcon },
  { id: "payroll-config", label: "Configuration paie", icon: CogIcon },
  { id: "collective-agreements", label: "Conventions collectives", icon: FolderIcon },
]

const activeTab = ref('company-info')

// Salary Elements
const salaryElements = ref([
  {
    id: 1,
    name: "Salaire de base",
    type: "Base",
    description: "Salaire mensuel de base de l'employé",
    baseAmount: "2500€",
    isTaxable: true,
    status: "Active",
  },
  {
    id: 2,
    name: "Prime de performance",
    type: "Bonus",
    description: "Prime variable selon les performances",
    baseAmount: "Variable",
    isTaxable: true,
    status: "Active",
  },
])

const isSalaryElementModalOpen = ref(false)
const editingSalaryElement = ref(null)
const salaryElementForm = ref({
  name: "",
  type: "Base",
  description: "",
  baseAmount: "",
  isTaxable: true,
  status: "Active",
})

// Deductions
const deductions = ref([
  {
    id: 1,
    name: "Cotisation sociale",
    type: "Social",
    description: "Cotisations sociales obligatoires",
    rate: 2.5,
    isMandatory: true,
    status: "Active",
  },
  {
    id: 2,
    name: "Assurance santé",
    type: "Insurance",
    description: "Contribution à l'assurance santé",
    rate: 1.5,
    isMandatory: false,
    status: "Active",
  },
])

const isDeductionModalOpen = ref(false)
const editingDeduction = ref(null)
const deductionForm = ref({
  name: "",
  type: "Social",
  description: "",
  rate: "",
  isMandatory: false,
  status: "Active",
})

// Absence Types
const absenceTypes = ref([
  {
    id: 1,
    name: "Congés payés",
    description: "Congés annuels payés",
    isPaid: true,
    maxDays: 25,
    requiresApproval: true,
    accrualRate: 2.08,
    status: "Active",
  },
  {
    id: 2,
    name: "Congé maladie",
    description: "Absence pour maladie",
    isPaid: true,
    maxDays: null,
    requiresApproval: false,
    accrualRate: null,
    status: "Active",
  },
  {
    id: 3,
    name: "Congé sans solde",
    description: "Congé non rémunéré",
    isPaid: false,
    maxDays: null,
    requiresApproval: true,
    accrualRate: null,
    status: "Active",
  },
])

const isAbsenceTypeModalOpen = ref(false)
const editingAbsenceType = ref(null)
const absenceTypeForm = ref({
  name: "",
  description: "",
  isPaid: true,
  maxDays: "",
  requiresApproval: true,
  accrualRate: "",
  status: "Active",
})

// Company Info
const companyInfo = ref({
  name: "Bravo RH",
  legalForm: "SARL",
  siret: "",
  siren: "",
  vatNumber: "",
  apeCode: "",
  rcs: "",
  shareCapital: "",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
  email: "",
})

// Departments
const departments = ref([
  {
    id: 1,
    name: "Ressources Humaines",
    description: "Gestion des ressources humaines",
    manager: "Jean Dupont",
    employeeCount: 12,
  },
  {
    id: 2,
    name: "Développement",
    description: "Développement logiciel",
    manager: "Marie Martin",
    employeeCount: 25,
  },
])

const isDepartmentModalOpen = ref(false)
const editingDepartment = ref(null)
const departmentForm = ref({
  name: "",
  description: "",
  manager: "",
})

// Salary Grids
const salaryGrids = ref([
  {
    id: 1,
    name: "Grille standard",
    description: "Grille salariale standard pour tous les postes",
    levels: [
      { level: "Junior", min: 2500, max: 3500 },
      { level: "Confirmé", min: 3500, max: 5000 },
      { level: "Senior", min: 5000, max: 7000 },
    ],
  },
])

const isSalaryGridModalOpen = ref(false)
const editingSalaryGrid = ref(null)
const salaryGridForm = ref({
  name: "",
  description: "",
  levels: [],
})

// Primes
const primes = ref([
  {
    id: 1,
    name: "Prime de performance",
    description: "Prime variable selon les performances",
    type: "Variable",
    status: "Active",
  },
  {
    id: 2,
    name: "Prime annuelle",
    description: "Prime versée annuellement",
    type: "Fixe",
    status: "Active",
  },
])

const isPrimeModalOpen = ref(false)
const editingPrime = ref(null)
const primeForm = ref({
  name: "",
  description: "",
  type: "Variable",
  status: "Active",
})

// Indemnités
const indemnites = ref([
  {
    id: 1,
    name: "Indemnité de transport",
    description: "Remboursement des frais de transport",
    type: "Transport",
    amount: "50€",
    status: "Active",
  },
])

const isIndemniteModalOpen = ref(false)
const editingIndemnite = ref(null)
const indemniteForm = ref({
  name: "",
  description: "",
  type: "Transport",
  amount: "",
  status: "Active",
})

// Avantages
const avantages = ref([
  {
    id: 1,
    name: "Tickets restaurant",
    description: "Tickets restaurant d'une valeur de 8€",
    type: "Repas",
    value: "8€",
    status: "Active",
  },
])

const isAvantageModalOpen = ref(false)
const editingAvantage = ref(null)
const avantageForm = ref({
  name: "",
  description: "",
  type: "Repas",
  value: "",
  status: "Active",
})

// Work Schedules
const workSchedules = ref([
  {
    id: 1,
    name: "Temps plein standard",
    description: "35h/semaine, 5 jours",
    hoursPerWeek: 35,
    daysPerWeek: 5,
    startTime: "09:00",
    endTime: "17:00",
    status: "Active",
  },
])

const isWorkScheduleModalOpen = ref(false)
const editingWorkSchedule = ref(null)
const workScheduleForm = ref({
  name: "",
  description: "",
  hoursPerWeek: 35,
  daysPerWeek: 5,
  startTime: "09:00",
  endTime: "17:00",
  status: "Active",
})

// Absence Policies
const absencePolicies = ref([
  {
    id: 1,
    name: "Politique congés payés",
    description: "Règles pour les congés payés",
    maxDays: 25,
    accrualRate: 2.08,
    carryOver: true,
    status: "Active",
  },
])

const isAbsencePolicyModalOpen = ref(false)
const editingAbsencePolicy = ref(null)
const absencePolicyForm = ref({
  name: "",
  description: "",
  maxDays: "",
  accrualRate: "",
  carryOver: false,
  status: "Active",
})

// Collective Agreements
const collectiveAgreements = ref([
  {
    id: 1,
    name: "Convention collective nationale",
    code: "CCN",
    description: "Convention collective applicable",
    startDate: "2020-01-01",
    status: "Active",
  },
])

const isCollectiveAgreementModalOpen = ref(false)
const editingCollectiveAgreement = ref(null)
const collectiveAgreementForm = ref({
  name: "",
  code: "",
  description: "",
  startDate: "",
  status: "Active",
})

// Salary Config
const salaryConfig = ref({
  payFrequency: "monthly",
  payDay: 25,
  hoursPerWeek: 35,
  daysPerWeek: 5,
  employerContributionRate: 25.0,
  employeeContributionRate: 22.0,
  payPeriodStart: 1,
  payPeriodEnd: 31,
})

// Salary Element Methods
const openSalaryElementModal = () => {
  editingSalaryElement.value = null
  salaryElementForm.value = {
    name: "",
    type: "Base",
    description: "",
    baseAmount: "",
    isTaxable: true,
    status: "Active",
  }
  isSalaryElementModalOpen.value = true
}

const closeSalaryElementModal = () => {
  isSalaryElementModalOpen.value = false
  editingSalaryElement.value = null
}

const editSalaryElement = (element) => {
  editingSalaryElement.value = element
  salaryElementForm.value = { ...element }
  isSalaryElementModalOpen.value = true
}

const saveSalaryElement = () => {
  if (!salaryElementForm.value.name) {
    alert("Le nom est requis")
    return
  }

  if (editingSalaryElement.value) {
    const index = salaryElements.value.findIndex(e => e.id === editingSalaryElement.value.id)
    if (index !== -1) {
      salaryElements.value[index] = {
        ...salaryElementForm.value,
        id: editingSalaryElement.value.id,
      }
    }
  } else {
    const newId = Math.max(...salaryElements.value.map(e => e.id), 0) + 1
    salaryElements.value.push({
      ...salaryElementForm.value,
      id: newId,
    })
  }
  closeSalaryElementModal()
}

const deleteSalaryElement = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
    salaryElements.value = salaryElements.value.filter(e => e.id !== id)
  }
}

// Deduction Methods
const openDeductionModal = () => {
  editingDeduction.value = null
  deductionForm.value = {
    name: "",
    type: "Social",
    description: "",
    rate: "",
    isMandatory: false,
    status: "Active",
  }
  isDeductionModalOpen.value = true
}

const closeDeductionModal = () => {
  isDeductionModalOpen.value = false
  editingDeduction.value = null
}

const editDeduction = (deduction) => {
  editingDeduction.value = deduction
  deductionForm.value = { ...deduction }
  isDeductionModalOpen.value = true
}

const saveDeduction = () => {
  if (!deductionForm.value.name) {
    alert("Le nom est requis")
    return
  }

  if (editingDeduction.value) {
    const index = deductions.value.findIndex(d => d.id === editingDeduction.value.id)
    if (index !== -1) {
      deductions.value[index] = {
        ...deductionForm.value,
        id: editingDeduction.value.id,
      }
    }
  } else {
    const newId = Math.max(...deductions.value.map(d => d.id), 0) + 1
    deductions.value.push({
      ...deductionForm.value,
      id: newId,
    })
  }
  closeDeductionModal()
}

const deleteDeduction = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce type de déduction ?")) {
    deductions.value = deductions.value.filter(d => d.id !== id)
  }
}

// Absence Type Methods
const openAbsenceTypeModal = () => {
  editingAbsenceType.value = null
  absenceTypeForm.value = {
    name: "",
    description: "",
    isPaid: true,
    maxDays: "",
    requiresApproval: true,
    accrualRate: "",
    status: "Active",
  }
  isAbsenceTypeModalOpen.value = true
}

const closeAbsenceTypeModal = () => {
  isAbsenceTypeModalOpen.value = false
  editingAbsenceType.value = null
}

const editAbsenceType = (absenceType) => {
  editingAbsenceType.value = absenceType
  absenceTypeForm.value = {
    ...absenceType,
    maxDays: absenceType.maxDays || "",
    accrualRate: absenceType.accrualRate || "",
  }
  isAbsenceTypeModalOpen.value = true
}

const saveAbsenceType = () => {
  if (!absenceTypeForm.value.name) {
    alert("Le nom est requis")
    return
  }

  if (editingAbsenceType.value) {
    const index = absenceTypes.value.findIndex(a => a.id === editingAbsenceType.value.id)
    if (index !== -1) {
      absenceTypes.value[index] = {
        ...absenceTypeForm.value,
        id: editingAbsenceType.value.id,
        maxDays: absenceTypeForm.value.maxDays ? parseInt(absenceTypeForm.value.maxDays) : null,
        accrualRate: absenceTypeForm.value.accrualRate ? parseFloat(absenceTypeForm.value.accrualRate) : null,
      }
    }
  } else {
    const newId = Math.max(...absenceTypes.value.map(a => a.id), 0) + 1
    absenceTypes.value.push({
      ...absenceTypeForm.value,
      id: newId,
      maxDays: absenceTypeForm.value.maxDays ? parseInt(absenceTypeForm.value.maxDays) : null,
      accrualRate: absenceTypeForm.value.accrualRate ? parseFloat(absenceTypeForm.value.accrualRate) : null,
    })
  }
  closeAbsenceTypeModal()
}

const deleteAbsenceType = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce type d'absence ?")) {
    absenceTypes.value = absenceTypes.value.filter(a => a.id !== id)
  }
}

// Company Info Methods
const saveCompanyInfo = () => {
  // Sauvegarder les informations de l'entreprise
  console.log("Saving company info:", companyInfo.value)
  // TODO: Appel API
  alert("Informations de l'entreprise enregistrées avec succès !")
}

// Department Methods
const openDepartmentModal = () => {
  editingDepartment.value = null
  departmentForm.value = { name: "", description: "", manager: "" }
  isDepartmentModalOpen.value = true
}

const closeDepartmentModal = () => {
  isDepartmentModalOpen.value = false
  editingDepartment.value = null
}

const editDepartment = (dept) => {
  editingDepartment.value = dept
  departmentForm.value = { ...dept }
  isDepartmentModalOpen.value = true
}

const saveDepartment = () => {
  if (!departmentForm.value.name) {
    alert("Le nom est requis")
    return
  }
  if (editingDepartment.value) {
    const index = departments.value.findIndex(d => d.id === editingDepartment.value.id)
    if (index !== -1) {
      departments.value[index] = { ...departmentForm.value, id: editingDepartment.value.id, employeeCount: editingDepartment.value.employeeCount }
    }
  } else {
    const newId = Math.max(...departments.value.map(d => d.id), 0) + 1
    departments.value.push({ ...departmentForm.value, id: newId, employeeCount: 0 })
  }
  closeDepartmentModal()
}

const deleteDepartment = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce département ?")) {
    departments.value = departments.value.filter(d => d.id !== id)
  }
}

// Prime Methods
const openPrimeModal = () => {
  editingPrime.value = null
  primeForm.value = { name: "", description: "", type: "Variable", status: "Active" }
  isPrimeModalOpen.value = true
}

const closePrimeModal = () => {
  isPrimeModalOpen.value = false
  editingPrime.value = null
}

const editPrime = (prime) => {
  editingPrime.value = prime
  primeForm.value = { ...prime }
  isPrimeModalOpen.value = true
}

const savePrime = () => {
  if (!primeForm.value.name) {
    alert("Le nom est requis")
    return
  }
  if (editingPrime.value) {
    const index = primes.value.findIndex(p => p.id === editingPrime.value.id)
    if (index !== -1) {
      primes.value[index] = { ...primeForm.value, id: editingPrime.value.id }
    }
  } else {
    const newId = Math.max(...primes.value.map(p => p.id), 0) + 1
    primes.value.push({ ...primeForm.value, id: newId })
  }
  closePrimeModal()
}

const deletePrime = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce type de prime ?")) {
    primes.value = primes.value.filter(p => p.id !== id)
  }
}

// Indemnité Methods
const openIndemniteModal = () => {
  editingIndemnite.value = null
  indemniteForm.value = { name: "", description: "", type: "Transport", amount: "", status: "Active" }
  isIndemniteModalOpen.value = true
}

const closeIndemniteModal = () => {
  isIndemniteModalOpen.value = false
  editingIndemnite.value = null
}

const editIndemnite = (indemnite) => {
  editingIndemnite.value = indemnite
  indemniteForm.value = { ...indemnite }
  isIndemniteModalOpen.value = true
}

const saveIndemnite = () => {
  if (!indemniteForm.value.name) {
    alert("Le nom est requis")
    return
  }
  if (editingIndemnite.value) {
    const index = indemnites.value.findIndex(i => i.id === editingIndemnite.value.id)
    if (index !== -1) {
      indemnites.value[index] = { ...indemniteForm.value, id: editingIndemnite.value.id }
    }
  } else {
    const newId = Math.max(...indemnites.value.map(i => i.id), 0) + 1
    indemnites.value.push({ ...indemniteForm.value, id: newId })
  }
  closeIndemniteModal()
}

const deleteIndemnite = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce type d'indemnité ?")) {
    indemnites.value = indemnites.value.filter(i => i.id !== id)
  }
}

// Avantage Methods
const openAvantageModal = () => {
  editingAvantage.value = null
  avantageForm.value = { name: "", description: "", type: "Repas", value: "", status: "Active" }
  isAvantageModalOpen.value = true
}

const closeAvantageModal = () => {
  isAvantageModalOpen.value = false
  editingAvantage.value = null
}

const editAvantage = (avantage) => {
  editingAvantage.value = avantage
  avantageForm.value = { ...avantage }
  isAvantageModalOpen.value = true
}

const saveAvantage = () => {
  if (!avantageForm.value.name) {
    alert("Le nom est requis")
    return
  }
  if (editingAvantage.value) {
    const index = avantages.value.findIndex(a => a.id === editingAvantage.value.id)
    if (index !== -1) {
      avantages.value[index] = { ...avantageForm.value, id: editingAvantage.value.id }
    }
  } else {
    const newId = Math.max(...avantages.value.map(a => a.id), 0) + 1
    avantages.value.push({ ...avantageForm.value, id: newId })
  }
  closeAvantageModal()
}

const deleteAvantage = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce type d'avantage ?")) {
    avantages.value = avantages.value.filter(a => a.id !== id)
  }
}

// Work Schedule Methods
const openWorkScheduleModal = () => {
  editingWorkSchedule.value = null
  workScheduleForm.value = { name: "", description: "", hoursPerWeek: 35, daysPerWeek: 5, startTime: "09:00", endTime: "17:00", status: "Active" }
  isWorkScheduleModalOpen.value = true
}

const closeWorkScheduleModal = () => {
  isWorkScheduleModalOpen.value = false
  editingWorkSchedule.value = null
}

const editWorkSchedule = (schedule) => {
  editingWorkSchedule.value = schedule
  workScheduleForm.value = { ...schedule }
  isWorkScheduleModalOpen.value = true
}

const saveWorkSchedule = () => {
  if (!workScheduleForm.value.name) {
    alert("Le nom est requis")
    return
  }
  if (editingWorkSchedule.value) {
    const index = workSchedules.value.findIndex(w => w.id === editingWorkSchedule.value.id)
    if (index !== -1) {
      workSchedules.value[index] = { ...workScheduleForm.value, id: editingWorkSchedule.value.id }
    }
  } else {
    const newId = Math.max(...workSchedules.value.map(w => w.id), 0) + 1
    workSchedules.value.push({ ...workScheduleForm.value, id: newId })
  }
  closeWorkScheduleModal()
}

const deleteWorkSchedule = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce régime horaire ?")) {
    workSchedules.value = workSchedules.value.filter(w => w.id !== id)
  }
}

// Absence Policy Methods
const openAbsencePolicyModal = () => {
  editingAbsencePolicy.value = null
  absencePolicyForm.value = { name: "", description: "", maxDays: "", accrualRate: "", carryOver: false, status: "Active" }
  isAbsencePolicyModalOpen.value = true
}

const closeAbsencePolicyModal = () => {
  isAbsencePolicyModalOpen.value = false
  editingAbsencePolicy.value = null
}

const editAbsencePolicy = (policy) => {
  editingAbsencePolicy.value = policy
  absencePolicyForm.value = { ...policy, maxDays: policy.maxDays || "", accrualRate: policy.accrualRate || "" }
  isAbsencePolicyModalOpen.value = true
}

const saveAbsencePolicy = () => {
  if (!absencePolicyForm.value.name) {
    alert("Le nom est requis")
    return
  }
  if (editingAbsencePolicy.value) {
    const index = absencePolicies.value.findIndex(p => p.id === editingAbsencePolicy.value.id)
    if (index !== -1) {
      absencePolicies.value[index] = {
        ...absencePolicyForm.value,
        id: editingAbsencePolicy.value.id,
        maxDays: absencePolicyForm.value.maxDays ? parseInt(absencePolicyForm.value.maxDays) : null,
        accrualRate: absencePolicyForm.value.accrualRate ? parseFloat(absencePolicyForm.value.accrualRate) : null,
      }
    }
  } else {
    const newId = Math.max(...absencePolicies.value.map(p => p.id), 0) + 1
    absencePolicies.value.push({
      ...absencePolicyForm.value,
      id: newId,
      maxDays: absencePolicyForm.value.maxDays ? parseInt(absencePolicyForm.value.maxDays) : null,
      accrualRate: absencePolicyForm.value.accrualRate ? parseFloat(absencePolicyForm.value.accrualRate) : null,
    })
  }
  closeAbsencePolicyModal()
}

const deleteAbsencePolicy = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette politique d'absence ?")) {
    absencePolicies.value = absencePolicies.value.filter(p => p.id !== id)
  }
}

// Collective Agreement Methods
const openCollectiveAgreementModal = () => {
  editingCollectiveAgreement.value = null
  collectiveAgreementForm.value = { name: "", code: "", description: "", startDate: "", status: "Active" }
  isCollectiveAgreementModalOpen.value = true
}

const closeCollectiveAgreementModal = () => {
  isCollectiveAgreementModalOpen.value = false
  editingCollectiveAgreement.value = null
}

const editCollectiveAgreement = (agreement) => {
  editingCollectiveAgreement.value = agreement
  collectiveAgreementForm.value = { ...agreement }
  isCollectiveAgreementModalOpen.value = true
}

const saveCollectiveAgreement = () => {
  if (!collectiveAgreementForm.value.name) {
    alert("Le nom est requis")
    return
  }
  if (editingCollectiveAgreement.value) {
    const index = collectiveAgreements.value.findIndex(a => a.id === editingCollectiveAgreement.value.id)
    if (index !== -1) {
      collectiveAgreements.value[index] = { ...collectiveAgreementForm.value, id: editingCollectiveAgreement.value.id }
    }
  } else {
    const newId = Math.max(...collectiveAgreements.value.map(a => a.id), 0) + 1
    collectiveAgreements.value.push({ ...collectiveAgreementForm.value, id: newId })
  }
  closeCollectiveAgreementModal()
}

const deleteCollectiveAgreement = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette convention collective ?")) {
    collectiveAgreements.value = collectiveAgreements.value.filter(a => a.id !== id)
  }
}

// Salary Grid Methods
const openSalaryGridModal = () => {
  editingSalaryGrid.value = null
  salaryGridForm.value = { name: "", description: "", levels: [] }
  isSalaryGridModalOpen.value = true
}

const closeSalaryGridModal = () => {
  isSalaryGridModalOpen.value = false
  editingSalaryGrid.value = null
}

const editSalaryGrid = (grid) => {
  editingSalaryGrid.value = grid
  salaryGridForm.value = { ...grid }
  isSalaryGridModalOpen.value = true
}

const saveSalaryGrid = () => {
  if (!salaryGridForm.value.name) {
    alert("Le nom est requis")
    return
  }
  if (editingSalaryGrid.value) {
    const index = salaryGrids.value.findIndex(g => g.id === editingSalaryGrid.value.id)
    if (index !== -1) {
      salaryGrids.value[index] = { ...salaryGridForm.value, id: editingSalaryGrid.value.id }
    }
  } else {
    const newId = Math.max(...salaryGrids.value.map(g => g.id), 0) + 1
    salaryGrids.value.push({ ...salaryGridForm.value, id: newId })
  }
  closeSalaryGridModal()
}

const deleteSalaryGrid = (id) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette grille salariale ?")) {
    salaryGrids.value = salaryGrids.value.filter(g => g.id !== id)
  }
}

// Salary Config Methods
const saveSalaryConfig = () => {
  console.log("Saving salary config:", salaryConfig.value)
  // TODO: Appel API
  alert("Configuration salariale enregistrée avec succès !")
}

// Save all data to localStorage for persistence
const saveAllData = () => {
  const data = {
    companyInfo: companyInfo.value,
    departments: departments.value,
    salaryElements: salaryElements.value,
    deductions: deductions.value,
    absenceTypes: absenceTypes.value,
    primes: primes.value,
    indemnites: indemnites.value,
    avantages: avantages.value,
    workSchedules: workSchedules.value,
    absencePolicies: absencePolicies.value,
    collectiveAgreements: collectiveAgreements.value,
    salaryConfig: salaryConfig.value,
  }
  localStorage.setItem('entreprise_config', JSON.stringify(data))
  alert("Toutes les modifications ont été enregistrées !")
}

// Load data from localStorage on mount
const loadSavedData = () => {
  const saved = localStorage.getItem('entreprise_config')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.companyInfo) companyInfo.value = data.companyInfo
      if (data.departments) departments.value = data.departments
      if (data.salaryElements) salaryElements.value = data.salaryElements
      if (data.deductions) deductions.value = data.deductions
      if (data.absenceTypes) absenceTypes.value = data.absenceTypes
      if (data.primes) primes.value = data.primes
      if (data.indemnites) indemnites.value = data.indemnites
      if (data.avantages) avantages.value = data.avantages
      if (data.workSchedules) workSchedules.value = data.workSchedules
      if (data.absencePolicies) absencePolicies.value = data.absencePolicies
      if (data.collectiveAgreements) collectiveAgreements.value = data.collectiveAgreements
      if (data.salaryConfig) salaryConfig.value = data.salaryConfig
    } catch (e) {
      console.error("Error loading saved data:", e)
    }
  }
}

// Auto-save on changes (debounced)
let saveTimeout = null
watch([companyInfo, departments, salaryElements, deductions, absenceTypes, primes, indemnites, avantages, workSchedules, absencePolicies, collectiveAgreements, salaryConfig], () => {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveAllData()
  }, 1000)
}, { deep: true })

// Load on mount
onMounted(() => {
  loadSavedData()
})
</script>

