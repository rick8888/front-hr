<template>
  <div class="flex min-h-0 w-full flex-col bg-neutral-50 lg:min-h-screen lg:flex-row">
    <!-- Mobile tabs -->
    <div class="border-b border-neutral-200 bg-white lg:hidden">
      <div class="px-4 py-3">
        <h1 class="text-lg font-bold text-neutral-900">{{ t('settings.title') }}</h1>
        <p class="text-xs text-neutral-600">{{ t('settings.subtitle') }}</p>
      </div>
      <nav class="flex gap-1 overflow-x-auto px-3 pb-3">
        <button
          v-for="tab in tabs"
          :key="`m-${tab.id}`"
          type="button"
          class="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap"
          :class="
            activeTab === tab.id
              ? 'bg-primary-50 text-primary-700'
              : 'bg-neutral-100 text-neutral-600'
          "
          @click="activeTab = tab.id"
        >
          {{ tabLabel(tab) }}
        </button>
      </nav>
    </div>

    <!-- Sidebar Navigation - Vertical Menu -->
    <div class="hidden w-64 shrink-0 border-r border-neutral-200 bg-white shadow-sm lg:block">
      <div class="p-6 border-b border-neutral-200">
        <h1 class="text-2xl font-bold text-neutral-900 mb-1">{{ t('settings.title') }}</h1>
        <p class="text-xs text-neutral-600">{{ t('settings.subtitle') }}</p>
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
          <span class="text-left flex-1">{{ tabLabel(tab) }}</span>
          <div
            v-if="activeTab === tab.id"
            class="w-1.5 h-1.5 rounded-full bg-primary-600"
          ></div>
        </button>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="min-w-0 flex-1 overflow-y-auto">
      <div class="p-4 sm:p-8">
        <!-- Tab Content -->
        <div class="bg-white rounded-xl border border-neutral-200 shadow-sm">
          <!-- General Tab -->
          <div v-if="activeTab === 'general'" class="p-4 sm:p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-2">{{ t('settings.general.title') }}</h2>
            <p class="text-sm text-neutral-600">{{ t('settings.general.subtitle') }}</p>
          </div>
          <button @click="saveGeneralSettings" class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold">
            {{ t('settings.general.save') }}
          </button>
        </div>

        <div class="mb-6">
          <div class="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-1">
            <button
              type="button"
              @click="generalSectionTab = 'company'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                generalSectionTab === 'company'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-600 hover:text-primary-700'
              ]"
            >
              {{ t('settings.general.section.company') }}
            </button>
            <button
              type="button"
              @click="generalSectionTab = 'legal'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                generalSectionTab === 'legal'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-600 hover:text-primary-700'
              ]"
            >
              {{ t('settings.general.section.legal') }}
            </button>
            <button
              type="button"
              @click="generalSectionTab = 'contact'"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                generalSectionTab === 'contact'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-600 hover:text-primary-700'
              ]"
            >
              {{ t('settings.general.section.contact') }}
            </button>
          </div>
        </div>

        <div class="space-y-8 max-w-4xl">
          <div v-show="generalSectionTab === 'company'" class="space-y-8">
          <!-- Company Logo Section -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t('settings.general.logo') }}
            </h3>
            <div class="flex items-center gap-6">
              <div class="relative">
                <div
                  v-if="generalSettings.logo"
                  class="w-24 h-24 rounded-lg border-2 border-neutral-200 overflow-hidden bg-neutral-50 flex items-center justify-center"
                >
                  <img
                    :src="generalSettings.logo"
                    :alt="t('settings.general.logo')"
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
                  {{ t('settings.general.uploadLogo') }}
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleLogoUpload"
                  />
                </label>
                <p class="text-xs text-neutral-500 mt-2">
                  {{ t('settings.general.logoHint') }}
                </p>
                <button
                  v-if="generalSettings.logo"
                  @click="removeLogo"
                  class="text-sm text-error-600 hover:text-error-700 mt-2"
                >
                  {{ t('settings.general.removeLogo') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t('settings.general.basicInfo') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t('settings.general.companyName') }} <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="generalSettings.name"
                  type="text"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t('settings.general.companyType') }}
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
                  {{ t('settings.general.companyEmail') }} <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="generalSettings.email"
                  type="email"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t('settings.general.phone') }} <span class="text-error-600">*</span>
                </label>
                <input
                  v-model="generalSettings.phone"
                  type="tel"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t('settings.general.website') }}
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
                  {{ t('settings.general.foundedYear') }}
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
                {{ t('settings.general.description') }}
              </label>
              <textarea
                v-model="generalSettings.description"
                rows="3"
                :placeholder="t('settings.general.descriptionPlaceholder')"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
              ></textarea>
            </div>
          </div>

          <!-- Address Information -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t('settings.general.addressInfo') }}
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t('settings.general.streetAddress') }} <span class="text-error-600">*</span>
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
                    {{ t('settings.general.city') }} <span class="text-error-600">*</span>
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
                    {{ t('settings.general.state') }}
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
                    {{ t('settings.general.postalCode') }} <span class="text-error-600">*</span>
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
                  {{ t('settings.general.country') }} <span class="text-error-600">*</span>
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
          </div>

          <!-- Legal Information -->
          <div v-show="generalSectionTab === 'legal'" class="space-y-8">
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t('settings.general.legalInfo') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t('settings.general.siret') }}
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
                  {{ t('settings.general.siren') }}
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
                  {{ t('settings.general.vatNumber') }}
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
                  {{ t('settings.general.rcs') }}
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
                  {{ t('settings.general.apeCode') }}
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
                  {{ t('settings.general.shareCapital') }}
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

          <!-- Banking Information -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t('settings.general.bankInfo') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t('settings.general.bankName') }}
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
                  {{ t('settings.general.iban') }}
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
                  {{ t('settings.general.bic') }}
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
                  {{ t('settings.general.accountHolder') }}
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
          </div>

          <!-- Contact & Social -->
          <div v-show="generalSectionTab === 'contact'" class="space-y-8">
          <!-- Contact Person -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t('settings.general.contactInfo') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t('settings.general.contactName') }} <span class="text-error-600">*</span>
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
                  {{ t('settings.general.contactPosition') }}
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
                  {{ t('settings.general.contactEmail') }} <span class="text-error-600">*</span>
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
                  {{ t('settings.general.contactPhone') }}
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

          <!-- Social Media -->
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">
              {{ t('settings.general.socialMedia') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  {{ t('settings.general.linkedin') }}
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
                  {{ t('settings.general.twitter') }}
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
                  {{ t('settings.general.facebook') }}
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
                  {{ t('settings.general.instagram') }}
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
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 justify-end">
            <button @click="resetGeneralSettings" class="btn-outline">
              {{ t('settings.general.resetChanges') }}
            </button>
            <button @click="saveGeneralSettings" class="btn-primary">
              {{ t('settings.general.saveAll') }}
            </button>
          </div>
	          </div>
	          </div>
	
	          <!-- Tous les types (Primes, Indemnités, Déductions, Absences, Avantages) -->
	          <div v-else-if="activeTab === 'types'" class="p-4 sm:p-8 space-y-8">
        <div class="flex flex-col gap-5">
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 class="text-2xl font-bold text-neutral-900 mb-2">Catalogue RH</h2>
              <p class="text-sm text-neutral-600">Organisation par domaine: rémunération, temps et avantages</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button @click="openAddPrimeModal" class="px-3 py-2 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">+ Prime</button>
              <button @click="openAddAbsenceTypeModal" class="px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">+ Absence</button>
              <button @click="openAddBenefitModal" class="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors">+ Avantage</button>
            </div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div class="bg-white border border-neutral-200 rounded-lg px-4 py-3">
              <p class="text-xs text-neutral-500 uppercase tracking-wider">Primes</p>
              <p class="text-xl font-bold text-neutral-900">{{ primes.length }}</p>
            </div>
            <div class="bg-white border border-neutral-200 rounded-lg px-4 py-3">
              <p class="text-xs text-neutral-500 uppercase tracking-wider">Indemnités</p>
              <p class="text-xl font-bold text-neutral-900">{{ indemnites.length }}</p>
            </div>
            <div class="bg-white border border-neutral-200 rounded-lg px-4 py-3">
              <p class="text-xs text-neutral-500 uppercase tracking-wider">Déductions</p>
              <p class="text-xl font-bold text-neutral-900">{{ reductions.length }}</p>
            </div>
            <div class="bg-white border border-neutral-200 rounded-lg px-4 py-3">
              <p class="text-xs text-neutral-500 uppercase tracking-wider">Absences</p>
              <p class="text-xl font-bold text-neutral-900">{{ absenceTypes.length }}</p>
            </div>
            <div class="bg-white border border-neutral-200 rounded-lg px-4 py-3">
              <p class="text-xs text-neutral-500 uppercase tracking-wider">Avantages</p>
              <p class="text-xl font-bold text-neutral-900">{{ benefits.length }}</p>
            </div>
          </div>

          <nav class="flex flex-wrap gap-2" aria-label="Accès rapide aux domaines">
            <button type="button" @click="scrollToTypesSection('types-compensation')" class="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-primary-100 hover:text-primary-800 rounded-lg transition-colors">Rémunération</button>
            <button type="button" @click="scrollToTypesSection('types-absences')" class="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-primary-100 hover:text-primary-800 rounded-lg transition-colors">Temps & Absences</button>
            <button type="button" @click="scrollToTypesSection('types-avantages')" class="inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-primary-100 hover:text-primary-800 rounded-lg transition-colors">Avantages</button>
          </nav>
        </div>

        <section id="types-compensation" class="space-y-4 scroll-mt-8">
          <h3 class="text-lg font-semibold text-neutral-900">Rémunération variable</h3>

          <div id="types-primes" class="bg-white border border-neutral-200 rounded-xl">
            <div class="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-neutral-900">Types de primes</p>
                <p class="text-xs text-neutral-500">Bonus, performance, ancienneté</p>
              </div>
              <button @click="openAddPrimeModal" class="px-3 py-2 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">Ajouter</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-neutral-50 border-b border-neutral-200">
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Nom</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Catégorie</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Statut</th>
                    <th class="text-right px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100">
                  <tr v-for="prime in primes" :key="prime.id" class="hover:bg-neutral-50 transition-colors">
                    <td class="px-5 py-3 text-sm font-medium text-neutral-900">{{ prime.name }}</td>
                    <td class="px-5 py-3 text-sm text-neutral-600">{{ prime.type }}</td>
                    <td class="px-5 py-3">
                      <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', prime.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-700']">
                        {{ prime.status === "Active" ? "Actif" : "Inactif" }}
                      </span>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <button @click="editPrime(prime)" class="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3">Modifier</button>
                      <button @click="confirmDeletePrime(prime)" class="text-error-600 hover:text-error-700 text-sm font-medium">Supprimer</button>
                    </td>
                  </tr>
                  <tr v-if="primes.length === 0"><td colspan="4" class="px-5 py-8 text-center text-sm text-neutral-500">Aucun type de prime.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="types-indemnites" class="bg-white border border-neutral-200 rounded-xl">
            <div class="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-neutral-900">Types d'indemnités</p>
                <p class="text-xs text-neutral-500">Transport, repas, déplacement</p>
              </div>
              <button @click="openAddIndemniteModal" class="px-3 py-2 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">Ajouter</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-neutral-50 border-b border-neutral-200">
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Nom</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Type</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Statut</th>
                    <th class="text-right px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100">
                  <tr v-for="indemnite in indemnites" :key="indemnite.id" class="hover:bg-neutral-50 transition-colors">
                    <td class="px-5 py-3 text-sm font-medium text-neutral-900">{{ indemnite.name }}</td>
                    <td class="px-5 py-3 text-sm text-neutral-600">{{ indemnite.type }}</td>
                    <td class="px-5 py-3">
                      <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', indemnite.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-700']">
                        {{ indemnite.status === "Active" ? "Actif" : "Inactif" }}
                      </span>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <button @click="editIndemnite(indemnite)" class="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3">Modifier</button>
                      <button @click="confirmDeleteIndemnite(indemnite)" class="text-error-600 hover:text-error-700 text-sm font-medium">Supprimer</button>
                    </td>
                  </tr>
                  <tr v-if="indemnites.length === 0"><td colspan="4" class="px-5 py-8 text-center text-sm text-neutral-500">Aucun type d'indemnité.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="types-deductions" class="bg-white border border-neutral-200 rounded-xl">
            <div class="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-neutral-900">Types de déductions</p>
                <p class="text-xs text-neutral-500">Mutuelle, prévoyance, retenues</p>
              </div>
              <button @click="openAddReductionModal" class="px-3 py-2 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">Ajouter</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-neutral-50 border-b border-neutral-200">
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Libellé</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Catégorie</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Statut</th>
                    <th class="text-right px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100">
                  <tr v-for="reduction in reductions" :key="reduction.id" class="hover:bg-neutral-50 transition-colors">
                    <td class="px-5 py-3 text-sm font-medium text-neutral-900">{{ reduction.label }}</td>
                    <td class="px-5 py-3 text-sm text-neutral-600">{{ reduction.category }}</td>
                    <td class="px-5 py-3">
                      <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', reduction.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-700']">
                        {{ reduction.status === "Active" ? "Actif" : "Inactif" }}
                      </span>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <button @click="editReduction(reduction)" class="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3">Modifier</button>
                      <button @click="confirmDeleteReduction(reduction)" class="text-error-600 hover:text-error-700 text-sm font-medium">Supprimer</button>
                    </td>
                  </tr>
                  <tr v-if="reductions.length === 0"><td colspan="4" class="px-5 py-8 text-center text-sm text-neutral-500">Aucun type de déduction.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="types-absences" class="scroll-mt-8">
          <div class="bg-white border border-neutral-200 rounded-xl">
            <div class="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold text-neutral-900">Temps & Absences</h3>
                <p class="text-xs text-neutral-500">Types d'absence, quotas et approbation</p>
              </div>
              <button @click="openAddAbsenceTypeModal" class="px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Ajouter</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-neutral-50 border-b border-neutral-200">
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Nom</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Code</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Quota max</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Validation</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Statut</th>
                    <th class="text-right px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100">
                  <tr v-for="absenceType in absenceTypes" :key="absenceType.id" class="hover:bg-neutral-50 transition-colors">
                    <td class="px-5 py-3 text-sm font-medium text-neutral-900">{{ absenceType.name }}</td>
                    <td class="px-5 py-3 text-sm text-neutral-600">{{ absenceType.code }}</td>
                    <td class="px-5 py-3 text-sm text-neutral-900">{{ absenceType.maxDays }} jours</td>
                    <td class="px-5 py-3 text-sm text-neutral-600">{{ absenceType.requiresApproval ? "Obligatoire" : "Non" }}</td>
                    <td class="px-5 py-3">
                      <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', absenceType.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-700']">
                        {{ absenceType.status === "Active" ? "Actif" : "Inactif" }}
                      </span>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <button @click="editAbsenceType(absenceType)" class="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3">Modifier</button>
                      <button @click="confirmDeleteAbsenceType(absenceType)" class="text-error-600 hover:text-error-700 text-sm font-medium">Supprimer</button>
                    </td>
                  </tr>
                  <tr v-if="absenceTypes.length === 0"><td colspan="6" class="px-5 py-8 text-center text-sm text-neutral-500">Aucun type d'absence.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="types-avantages" class="scroll-mt-8">
          <div class="bg-white border border-neutral-200 rounded-xl">
            <div class="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-semibold text-neutral-900">Avantages en nature</h3>
                <p class="text-xs text-neutral-500">Par catégorie et statut</p>
              </div>
              <button @click="openAddBenefitModal" class="px-3 py-2 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors">Ajouter</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-neutral-50 border-b border-neutral-200">
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Nom</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Catégorie</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Statut</th>
                    <th class="text-right px-5 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100">
                  <tr v-for="benefit in benefits" :key="benefit.id" class="hover:bg-neutral-50 transition-colors">
                    <td class="px-5 py-3 text-sm font-medium text-neutral-900">{{ benefit.name }}</td>
                    <td class="px-5 py-3 text-sm text-neutral-600">{{ benefit.category }}</td>
                    <td class="px-5 py-3">
                      <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', benefit.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-700']">
                        {{ benefit.status === "Active" ? "Actif" : "Inactif" }}
                      </span>
                    </td>
                    <td class="px-5 py-3 text-right">
                      <button @click="editBenefit(benefit)" class="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3">Modifier</button>
                      <button @click="confirmDeleteBenefit(benefit)" class="text-error-600 hover:text-error-700 text-sm font-medium">Supprimer</button>
                    </td>
                  </tr>
                  <tr v-if="benefits.length === 0"><td colspan="4" class="px-5 py-8 text-center text-sm text-neutral-500">Aucun avantage en nature.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
          </div>
          <div v-else-if="activeTab === 'regime-horaire'" class="p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-2">Régime horaire</h2>
            <p class="text-sm text-neutral-600">Configurez les régimes horaires de travail</p>
          </div>
          <button
            @click="openAddRegimeModal"
            class="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold"
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
          <div v-else-if="activeTab === 'regime-absences'" class="p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-2">Régime absences</h2>
            <p class="text-sm text-neutral-600">Configurez les régimes d'absences et congés</p>
          </div>
          <button
            @click="openAddAbsenceRegimeModal"
            class="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold"
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

          <SettingsBusinessPanel
            v-else-if="activeTab === 'business-central'"
            @go-tab="activeTab = $event"
          />

          <SettingsDepartmentsPanel v-else-if="activeTab === 'departments'" />

          <SettingsHolidaysPanel v-else-if="activeTab === 'holidays'" />

          <SettingsWhatsAppPanel v-else-if="activeTab === 'whatsapp'" />

          <div v-else-if="activeTab === 'preferences'" class="p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-neutral-900 mb-2">{{ t('settings.preferences.title') }}</h2>
            <p class="text-sm text-neutral-600">{{ t('settings.preferences.subtitle') }}</p>
          </div>
          <button @click="savePreferences" class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold">
            {{ t('settings.preferences.save') }}
          </button>
        </div>
        <div
          v-if="preferencesFeedback"
          class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 max-w-4xl"
        >
          {{ preferencesFeedback }}
        </div>
        <div class="space-y-8 max-w-4xl">
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">{{ t('settings.preferences.language') }}</h3>
            <select
              v-model="preferenceSettings.language"
              class="w-full max-w-xs px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="fr">{{ t('settings.preferences.lang.fr') }}</option>
              <option value="en">{{ t('settings.preferences.lang.en') }}</option>
            </select>
          </div>
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">{{ t('settings.preferences.timezone') }}</h3>
            <select
              v-model="preferenceSettings.timezone"
              class="w-full max-w-xs px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div class="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 class="text-base font-semibold text-neutral-900 mb-4">{{ t('settings.preferences.dateFormat') }}</h3>
            <select
              v-model="preferenceSettings.dateFormat"
              class="w-full max-w-xs px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="DD/MM/YYYY">JJ/MM/AAAA</option>
              <option value="MM/DD/YYYY">MM/JJ/AAAA</option>
              <option value="YYYY-MM-DD">AAAA-MM-JJ</option>
            </select>
          </div>
        </div>
          </div>

          <!-- Security Tab -->
          <div v-else-if="activeTab === 'security'" class="p-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-neutral-900 mb-2">Paramètres de sécurité</h2>
          <p class="text-sm text-neutral-600">Gérez la sécurité de votre compte et de votre entreprise</p>
        </div>
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
          <div v-else-if="activeTab === 'notifications'" class="p-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-neutral-900 mb-2">{{ t('settings.notifications.title') }}</h2>
          <p class="text-sm text-neutral-600">{{ t('settings.notifications.subtitle') }}</p>
        </div>
        <div class="space-y-4 max-w-2xl">
          <div
            class="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
          >
            <div>
              <p class="text-sm font-medium text-neutral-900">
                {{ t('settings.notifications.email') }}
              </p>
              <p class="text-xs text-neutral-600">{{ t('settings.notifications.emailHint') }}</p>
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
              <p class="text-sm font-medium text-neutral-900">{{ t('settings.notifications.payroll') }}</p>
              <p class="text-xs text-neutral-600">
                {{ t('settings.notifications.payrollHint') }}
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
                {{ t('settings.notifications.attendance') }}
              </p>
              <p class="text-xs text-neutral-600">
                {{ t('settings.notifications.attendanceHint') }}
              </p>
            </div>
            <input
              v-model="notificationSettings.attendance"
              type="checkbox"
              class="w-5 h-5 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
            />
          </div>
          <div class="pt-6">
            <button
              @click="saveNotificationSettings"
              class="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm hover:shadow-md text-sm font-semibold"
            >
              {{ t('settings.notifications.save') }}
            </button>
          </div>
          </div>
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
        <div class="px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <h2 class="text-lg font-bold text-neutral-900">
            {{ editingPrime ? "Modifier le type de prime" : "Ajouter un type de prime" }}
          </h2>
        </div>
        <div class="px-6 py-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Nom du type <span class="text-error-600">*</span>
            </label>
            <input
              v-model="primeForm.name"
              type="text"
              placeholder="Ex: Prime de performance"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Catégorie <span class="text-error-600">*</span>
            </label>
            <select
              v-model="primeForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Performance">Performance</option>
              <option value="Annuelle">Annuelle</option>
              <option value="Projet">Projet</option>
              <option value="Fidélité">Fidélité</option>
              <option value="Exceptionnelle">Exceptionnelle</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              v-model="primeForm.description"
              rows="3"
              placeholder="Description du type de prime..."
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Statut
            </label>
            <select
              v-model="primeForm.status"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Active">Actif</option>
              <option value="Inactive">Inactif</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50">
          <button
            @click="closePrimeModal"
            class="px-5 py-2.5 text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="savePrime"
            class="px-5 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            {{ editingPrime ? "Modifier" : "Ajouter" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Indemnité Modal -->
    <div
      v-if="isIndemniteModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeIndemniteModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <h2 class="text-lg font-bold text-neutral-900">
            {{ editingIndemnite ? "Modifier le type d'indemnité" : "Ajouter un type d'indemnité" }}
          </h2>
        </div>
        <div class="px-6 py-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Nom du type <span class="text-error-600">*</span>
            </label>
            <input
              v-model="indemniteForm.name"
              type="text"
              placeholder="Ex: Indemnité de transport"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Catégorie <span class="text-error-600">*</span>
            </label>
            <select
              v-model="indemniteForm.type"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Transport">Transport</option>
              <option value="Repas">Repas</option>
              <option value="Déplacement">Déplacement</option>
              <option value="Logement">Logement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              v-model="indemniteForm.description"
              rows="3"
              placeholder="Description du type d'indemnité..."
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Statut
            </label>
            <select
              v-model="indemniteForm.status"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Active">Actif</option>
              <option value="Inactive">Inactif</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50">
          <button
            @click="closeIndemniteModal"
            class="px-5 py-2.5 text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="saveIndemnite"
            class="px-5 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            {{ editingIndemnite ? "Modifier" : "Ajouter" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Déduction Modal -->
    <div
      v-if="isReductionModalOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeReductionModal"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-purple-50 to-purple-100">
          <h2 class="text-lg font-bold text-neutral-900">
            {{ editingReduction ? "Modifier le type de déduction" : "Ajouter un type de déduction" }}
          </h2>
        </div>
        <div class="px-6 py-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Libellé <span class="text-error-600">*</span>
            </label>
            <input
              v-model="reductionForm.label"
              type="text"
              placeholder="Ex: Cotisation mutuelle"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Catégorie <span class="text-error-600">*</span>
            </label>
            <select
              v-model="reductionForm.category"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Santé">Santé</option>
              <option value="Assurance">Assurance</option>
              <option value="Retraite">Retraite</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              v-model="reductionForm.description"
              rows="3"
              placeholder="Description du type de déduction..."
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Statut
            </label>
            <select
              v-model="reductionForm.status"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Active">Actif</option>
              <option value="Inactive">Inactif</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50">
          <button
            @click="closeReductionModal"
            class="px-5 py-2.5 text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="saveReduction"
            class="px-5 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            {{ editingReduction ? "Modifier" : "Ajouter" }}
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
        <div class="px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
          <h2 class="text-lg font-bold text-neutral-900">
            {{ editingBenefit ? "Modifier le type d'avantage" : "Ajouter un type d'avantage" }}
          </h2>
        </div>
        <div class="px-6 py-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Nom du type <span class="text-error-600">*</span>
            </label>
            <input
              v-model="benefitForm.name"
              type="text"
              placeholder="Ex: Véhicule de fonction"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Catégorie <span class="text-error-600">*</span>
            </label>
            <select
              v-model="benefitForm.category"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Transport">Transport</option>
              <option value="Repas">Repas</option>
              <option value="Logement">Logement</option>
              <option value="Santé">Santé</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              v-model="benefitForm.description"
              rows="3"
              placeholder="Description du type d'avantage en nature..."
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-neutral-700 mb-2">
              Statut
            </label>
            <select
              v-model="benefitForm.status"
              class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
            >
              <option value="Active">Actif</option>
              <option value="Inactive">Inactif</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3 bg-neutral-50">
          <button
            @click="closeBenefitModal"
            class="px-5 py-2.5 text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="saveBenefit"
            class="px-5 py-2.5 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            {{ editingBenefit ? "Modifier" : "Ajouter" }}
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
import { ref, computed, onMounted } from "vue";
import SettingsBusinessPanel from "./settings/components/SettingsBusinessPanel.vue";
import SettingsDepartmentsPanel from "./settings/components/SettingsDepartmentsPanel.vue";
import SettingsHolidaysPanel from "./settings/components/SettingsHolidaysPanel.vue";
import SettingsWhatsAppPanel from "./settings/components/SettingsWhatsAppPanel.vue";
import { useI18n, setLocale } from "../i18n/index.js";
import {
  loadPreferences,
  savePreferences as persistPreferencesToStorage,
} from "../i18n/preferences.js";

const { t, locale } = useI18n();
const preferencesFeedback = ref("");

function tabLabel(tab) {
  void locale.value;
  return t(tab.labelKey);
}

const activeTab = ref("general");
const generalSectionTab = ref("company");

function scrollToTypesSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// SVG Icon Components
const BuildingOfficeIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  `
};

const GiftIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  `
};

const CalendarIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  `
};

const ChatBubbleIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  `
};

const SparklesIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  `
};

const ClockIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
};

const DocumentTextIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
};

const ShieldCheckIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  `
};

const BellIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  `
};

const GlobeAltIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  `
};

const BanknotesIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  `
};

const ReceiptPercentIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  `
};

const tabs = [
  { id: "general", labelKey: "settings.tabs.general", icon: BuildingOfficeIcon },
  { id: "business-central", labelKey: "settings.tabs.business", icon: DocumentTextIcon },
  { id: "departments", labelKey: "settings.tabs.departments", icon: BuildingOfficeIcon },
  { id: "holidays", labelKey: "settings.tabs.holidays", icon: CalendarIcon },
  { id: "whatsapp", labelKey: "settings.tabs.whatsapp", icon: ChatBubbleIcon },
  { id: "preferences", labelKey: "settings.tabs.preferences", icon: GlobeAltIcon },
  { id: "notifications", labelKey: "settings.tabs.notifications", icon: BellIcon },
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
  shareCapital: "â‚¬10,000",
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
    name: "Prime de performance",
    type: "Performance",
    description: "Prime attribuée selon les performances",
    status: "Active",
  },
  {
    id: 2,
    name: "Prime annuelle",
    type: "Annuelle",
    description: "Prime versée annuellement",
    status: "Active",
  },
  {
    id: 3,
    name: "Prime de projet",
    type: "Projet",
    description: "Prime liée à la réalisation d'un projet",
    status: "Active",
  },
  {
    id: 4,
    name: "Prime de fidélité",
    type: "Fidélité",
    description: "Prime pour l'ancienneté",
    status: "Active",
  },
]);

const isPrimeModalOpen = ref(false);
const editingPrime = ref(null);
const primeForm = ref({
  name: "",
  type: "Performance",
  description: "",
  status: "Active",
});

// Indemnité Data
const indemnites = ref([
  {
    id: 1,
    name: "Indemnité de transport",
    description: "Remboursement des frais de transport",
    type: "Transport",
    status: "Active",
  },
  {
    id: 2,
    name: "Indemnité de repas",
    description: "Tickets restaurant ou remboursement repas",
    type: "Repas",
    status: "Active",
  },
  {
    id: 3,
    name: "Indemnité kilométrique",
    description: "Remboursement kilométrique pour déplacements",
    type: "Déplacement",
    status: "Active",
  },
]);

const isIndemniteModalOpen = ref(false);
const editingIndemnite = ref(null);
const indemniteForm = ref({
  name: "",
  description: "",
  type: "Transport",
  status: "Active",
});

// Déductions Data
const reductions = ref([
  {
    id: 1,
    label: "Cotisation mutuelle",
    description: "Cotisation à la mutuelle d'entreprise",
    category: "Santé",
    status: "Active",
  },
  {
    id: 2,
    label: "Prévoyance",
    description: "Assurance prévoyance collective",
    category: "Assurance",
    status: "Active",
  },
  {
    id: 3,
    label: "Retenue sur salaire",
    description: "Retenue exceptionnelle",
    category: "Autre",
    status: "Active",
  },
]);

const isReductionModalOpen = ref(false);
const editingReduction = ref(null);
const reductionForm = ref({
  label: "",
  description: "",
  category: "Santé",
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
    name: "Véhicule de fonction",
    category: "Transport",
    description: "Véhicule fourni par l'entreprise",
    status: "Active",
  },
  {
    id: 2,
    name: "Tickets restaurant",
    category: "Repas",
    description: "Tickets restaurant mensuels",
    status: "Active",
  },
  {
    id: 3,
    name: "Assurance santé",
    category: "Santé",
    description: "Couverture d'assurance santé premium",
    status: "Active",
  },
  {
    id: 4,
    name: "Allocation logement",
    category: "Logement",
    description: "Allocation mensuelle pour le logement",
    status: "Active",
  },
]);

const isBenefitModalOpen = ref(false);
const editingBenefit = ref(null);
const benefitForm = ref({
  name: "",
  category: "Transport",
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

const businessRulesSettings = ref({
  defaultContractType: "CDI",
  payrollCutoffDay: 25,
  defaultWorkRegimeId: null,
  defaultAbsenceRegimeId: null,
  enforceUniqueTypeCode: true,
  allowNegativeLeaveBalance: false,
  requireValidationForCompensation: true,
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

// Préférences (langue, fuseau, format date) — pilotent l'i18n global
const preferenceSettings = ref({ ...loadPreferences() });

// Format number
const formatNumber = (num) => {
  return Number(num).toLocaleString("en-US");
};

// Format currency
const formatCurrency = (num) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(num);
};

// General Settings
const saveGeneralSettings = () => {
  // Validate required fields
  if (!generalSettings.value.name || !generalSettings.value.email || !generalSettings.value.phone) {
    alert(t("settings.general.requiredFields"));
    return;
  }

  // Save general settings logic
  console.log("Saving general settings:", generalSettings.value);
  alert(t("settings.general.saveSuccess"));
};

const saveNotificationSettings = () => {
  localStorage.setItem("settings-notifications", JSON.stringify(notificationSettings.value));
  alert(t("settings.notifications.saved"));
};

const savePreferences = () => {
  const next = persistPreferencesToStorage(preferenceSettings.value);
  preferenceSettings.value = { ...next };
  setLocale(next.language, { persist: false });
  preferencesFeedback.value = t("settings.preferences.saved");
};

onMounted(() => {
  try {
    // Prefer the shared preferences loader (covers language immediately)
    preferenceSettings.value = { ...loadPreferences() };
    setLocale(preferenceSettings.value.language, { persist: false });

    const storedNotifications = localStorage.getItem("settings-notifications");
    if (storedNotifications) {
      notificationSettings.value = { ...notificationSettings.value, ...JSON.parse(storedNotifications) };
    }
    const storedBusinessCentral = localStorage.getItem("settings-business-central");
    if (storedBusinessCentral) {
      const parsed = JSON.parse(storedBusinessCentral);
      if (parsed?.businessRules) {
        businessRulesSettings.value = {
          ...businessRulesSettings.value,
          ...parsed.businessRules,
        };
      }
      if (Array.isArray(parsed?.catalogs?.primes)) primes.value = parsed.catalogs.primes;
      if (Array.isArray(parsed?.catalogs?.indemnites)) indemnites.value = parsed.catalogs.indemnites;
      if (Array.isArray(parsed?.catalogs?.reductions)) reductions.value = parsed.catalogs.reductions;
      if (Array.isArray(parsed?.catalogs?.absenceTypes)) absenceTypes.value = parsed.catalogs.absenceTypes;
      if (Array.isArray(parsed?.catalogs?.benefits)) benefits.value = parsed.catalogs.benefits;
      if (Array.isArray(parsed?.catalogs?.regimes)) regimes.value = parsed.catalogs.regimes;
      if (Array.isArray(parsed?.catalogs?.absenceRegimes)) absenceRegimes.value = parsed.catalogs.absenceRegimes;
    }
  } catch (_) {}
});

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
      shareCapital: "â‚¬10,000",
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
    description: "",
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
    description: "",
    status: "Active",
  };
};

const savePrime = () => {
  if (!primeForm.value.name) {
    alert("Veuillez remplir tous les champs obligatoires");
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
    description: "",
    status: "Active",
  };
};

const saveBenefit = () => {
  if (!benefitForm.value.name) {
    alert("Veuillez remplir tous les champs obligatoires");
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
  } else if (deleteItemType.value === "indemnite") {
    indemnites.value = indemnites.value.filter((i) => i.id !== deleteItemId.value);
  } else if (deleteItemType.value === "reduction") {
    reductions.value = reductions.value.filter((r) => r.id !== deleteItemId.value);
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

// Indemnité Functions
const openAddIndemniteModal = () => {
  editingIndemnite.value = null;
  indemniteForm.value = {
    name: "",
    description: "",
    type: "Transport",
    status: "Active",
  };
  isIndemniteModalOpen.value = true;
};

const editIndemnite = (indemnite) => {
  editingIndemnite.value = indemnite;
  indemniteForm.value = {
    name: indemnite.name,
    description: indemnite.description,
    type: indemnite.type,
    status: indemnite.status,
  };
  isIndemniteModalOpen.value = true;
};

const closeIndemniteModal = () => {
  isIndemniteModalOpen.value = false;
  editingIndemnite.value = null;
  indemniteForm.value = {
    name: "",
    description: "",
    type: "Transport",
    status: "Active",
  };
};

const saveIndemnite = () => {
  if (!indemniteForm.value.name) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  if (editingIndemnite.value) {
    const index = indemnites.value.findIndex(
      (i) => i.id === editingIndemnite.value.id
    );
    if (index !== -1) {
      indemnites.value[index] = {
        ...editingIndemnite.value,
        ...indemniteForm.value,
      };
    }
  } else {
    const newId =
      indemnites.value.length > 0
        ? Math.max(...indemnites.value.map((i) => i.id)) + 1
        : 1;
    indemnites.value.push({
      id: newId,
      ...indemniteForm.value,
    });
  }
  closeIndemniteModal();
};

const confirmDeleteIndemnite = (indemnite) => {
  deleteItemName.value = indemnite.name;
  deleteItemId.value = indemnite.id;
  deleteItemType.value = "indemnite";
  isDeleteModalOpen.value = true;
};

// Déduction Functions
const openAddReductionModal = () => {
  editingReduction.value = null;
  reductionForm.value = {
    label: "",
    description: "",
    category: "Santé",
    status: "Active",
  };
  isReductionModalOpen.value = true;
};

const editReduction = (reduction) => {
  editingReduction.value = reduction;
  reductionForm.value = {
    label: reduction.label,
    description: reduction.description,
    category: reduction.category,
    status: reduction.status,
  };
  isReductionModalOpen.value = true;
};

const closeReductionModal = () => {
  isReductionModalOpen.value = false;
  editingReduction.value = null;
  reductionForm.value = {
    label: "",
    description: "",
    category: "Santé",
    status: "Active",
  };
};

const saveReduction = () => {
  if (!reductionForm.value.label) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  if (editingReduction.value) {
    const index = reductions.value.findIndex(
      (r) => r.id === editingReduction.value.id
    );
    if (index !== -1) {
      reductions.value[index] = {
        ...editingReduction.value,
        ...reductionForm.value,
      };
    }
  } else {
    const newId =
      reductions.value.length > 0
        ? Math.max(...reductions.value.map((r) => r.id)) + 1
        : 1;
    reductions.value.push({
      id: newId,
      ...reductionForm.value,
    });
  }
  closeReductionModal();
};

const confirmDeleteReduction = (reduction) => {
  deleteItemName.value = reduction.label;
  deleteItemId.value = reduction.id;
  deleteItemType.value = "reduction";
  isDeleteModalOpen.value = true;
};
</script>

<style scoped>
/* Hide scrollbar for tabs */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Professional table styling */
table {
  border-collapse: separate;
  border-spacing: 0;
}

/* Enhanced hover effects */
.hover\:bg-neutral-50:hover {
  background-color: rgb(250 250 250);
}

/* Gradient backgrounds */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
</style>


