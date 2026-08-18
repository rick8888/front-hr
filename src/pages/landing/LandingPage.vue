<template>
  <div class="min-h-screen max-w-full overflow-x-hidden bg-[#f7f4ef] text-neutral-800">
    <header class="sticky top-0 z-20 border-b border-neutral-200/80 bg-[#f7f4ef]/95 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl min-w-0 items-center justify-between gap-2 px-4 sm:px-8">
        <a href="#top" class="flex min-w-0 items-center gap-2.5" @click="closeMenu">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">BR</span>
          <span class="truncate text-base font-semibold tracking-tight text-neutral-900">Bravo RH</span>
        </a>
        <nav class="hidden items-center gap-6 text-sm font-medium text-neutral-600 md:flex">
          <a href="#services" class="hover:text-neutral-900">{{ t("landing.nav.services") }}</a>
          <a href="#whatsapp" class="hover:text-neutral-900">{{ t("landing.nav.whatsapp") }}</a>
          <a href="#tarifs" class="hover:text-neutral-900">{{ t("landing.nav.plans") }}</a>
          <a href="#inscription" class="hover:text-neutral-900">{{ t("landing.nav.signup") }}</a>
        </nav>
        <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div class="hidden items-center rounded-lg bg-white/70 p-0.5 text-xs font-semibold text-neutral-500 sm:flex">
            <button
              type="button"
              class="rounded-md px-2 py-1"
              :class="locale === 'fr' ? 'bg-white text-neutral-900 shadow-sm' : 'hover:text-neutral-800'"
              @click="switchLocale('fr')"
            >
              FR
            </button>
            <button
              type="button"
              class="rounded-md px-2 py-1"
              :class="locale === 'en' ? 'bg-white text-neutral-900 shadow-sm' : 'hover:text-neutral-800'"
              @click="switchLocale('en')"
            >
              EN
            </button>
          </div>
          <RouterLink to="/login" class="hidden rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-white sm:inline-flex">
            {{ t("landing.nav.login") }}
          </RouterLink>
          <button type="button" class="btn-primary hidden text-sm md:inline-flex" @click="scrollToSignup">
            {{ t("landing.nav.signup") }}
          </button>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-800 hover:bg-white md:hidden"
            :aria-label="menuOpen ? t('landing.nav.close') : t('landing.nav.menu')"
            :aria-expanded="menuOpen"
            @click="toggleMenu"
          >
            <svg v-if="!menuOpen" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="menuOpen" class="border-t border-neutral-200 bg-[#f7f4ef] px-4 py-4 md:hidden">
        <nav class="flex flex-col gap-1 text-sm font-medium text-neutral-700">
          <button type="button" class="rounded-lg px-3 py-2.5 text-left hover:bg-white" @click="goToSection('services')">
            {{ t("landing.nav.services") }}
          </button>
          <button type="button" class="rounded-lg px-3 py-2.5 text-left hover:bg-white" @click="goToSection('whatsapp')">
            {{ t("landing.nav.whatsapp") }}
          </button>
          <button type="button" class="rounded-lg px-3 py-2.5 text-left hover:bg-white" @click="goToSection('tarifs')">
            {{ t("landing.nav.plans") }}
          </button>
          <button type="button" class="rounded-lg px-3 py-2.5 text-left hover:bg-white" @click="goToSection('inscription')">
            {{ t("landing.nav.signup") }}
          </button>
        </nav>
        <div class="mt-3 flex items-center justify-between gap-3 border-t border-neutral-200 pt-3">
          <div class="flex items-center rounded-lg bg-white/70 p-0.5 text-xs font-semibold text-neutral-500">
            <button
              type="button"
              class="rounded-md px-2 py-1"
              :class="locale === 'fr' ? 'bg-white text-neutral-900 shadow-sm' : 'hover:text-neutral-800'"
              @click="switchLocale('fr')"
            >
              FR
            </button>
            <button
              type="button"
              class="rounded-md px-2 py-1"
              :class="locale === 'en' ? 'bg-white text-neutral-900 shadow-sm' : 'hover:text-neutral-800'"
              @click="switchLocale('en')"
            >
              EN
            </button>
          </div>
          <RouterLink to="/login" class="text-sm font-medium text-primary-700" @click="closeMenu">
            {{ t("landing.nav.login") }}
          </RouterLink>
        </div>
        <button type="button" class="btn-primary mt-3 w-full py-2.5 text-sm" @click="scrollToSignup">
          {{ t("landing.nav.signup") }}
        </button>
      </div>
    </header>

    <main id="top">
      <section class="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl content-center items-center gap-8 px-4 py-10 sm:gap-10 sm:px-8 sm:py-14 lg:min-h-0 lg:grid-cols-2 lg:content-center lg:py-20">
        <div class="min-w-0">
          <p class="text-sm font-medium text-primary-700">{{ t("landing.hero.kicker") }}</p>
          <h1 class="mt-3 text-3xl font-semibold leading-tight tracking-tight break-words text-neutral-900 sm:text-4xl lg:text-5xl">
            {{ t("landing.hero.title") }}
          </h1>
          <p class="mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:mt-5 sm:text-lg">
            {{ t("landing.hero.subtitle") }}
          </p>
          <div class="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <button type="button" class="btn-primary w-full px-5 py-2.5 sm:w-auto" @click="scrollToSignup">
              {{ t("landing.hero.cta") }}
            </button>
            <a href="#tarifs" class="btn-outline w-full px-5 py-2.5 text-center text-sm sm:w-auto">
              {{ t("landing.hero.secondary") }}
            </a>
          </div>
          <p class="mt-4 text-sm text-neutral-500">{{ t("landing.hero.note") }}</p>
          <p class="mt-3 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full bg-[#25d366]/15 px-3 py-1.5 text-sm font-medium text-[#128c47]">
            <span class="h-2 w-2 shrink-0 rounded-full bg-[#25d366]" />
            <span>{{ t("landing.whatsapp.badge") }}</span>
          </p>
        </div>
        <div class="min-w-0 rounded-2xl border border-white bg-white/80 p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <p class="text-sm font-medium text-neutral-500">{{ t("landing.hero.dayTitle") }}</p>
          <ul class="mt-4 space-y-3 text-sm">
            <li
              v-for="(story, index) in dayStories"
              :key="index"
              class="rounded-2xl bg-[#f7f4ef] px-4 py-3 leading-relaxed"
            >
              {{ story }}
            </li>
          </ul>
        </div>
      </section>

      <section id="services" class="scroll-mt-24 border-t border-neutral-200/80 bg-white">
        <div class="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-16">
          <p class="text-sm font-medium text-primary-700">{{ t("landing.services.kicker") }}</p>
          <h2 class="mt-2 max-w-2xl text-2xl font-semibold tracking-tight break-words text-neutral-900 sm:text-3xl">
            {{ t("landing.services.title") }}
          </h2>
          <p class="mt-3 max-w-2xl text-neutral-600">{{ t("landing.services.subtitle") }}</p>

          <div class="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="service in featuredServices"
              :key="service.code"
              class="min-w-0 rounded-2xl border border-neutral-200 bg-[#fbfaf7] p-5"
            >
              <h3 class="text-base font-semibold text-neutral-900">{{ serviceName(service.code) }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-neutral-600">{{ serviceBlurb(service) }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="whatsapp" class="scroll-mt-24 bg-[#f7f4ef]">
        <div class="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:gap-10 sm:px-8 sm:py-16 lg:grid-cols-2">
          <div class="min-w-0">
            <p class="text-sm font-medium text-primary-700">{{ t("landing.whatsapp.kicker") }}</p>
            <h2 class="mt-2 max-w-xl text-2xl font-semibold tracking-tight break-words text-neutral-900 sm:text-3xl">
              {{ t("landing.whatsapp.title") }}
            </h2>
            <p class="mt-3 max-w-xl text-neutral-600">{{ t("landing.whatsapp.subtitle") }}</p>
          </div>
          <ul class="space-y-3">
            <li
              v-for="(point, index) in whatsappPoints"
              :key="index"
              class="rounded-2xl border border-white bg-white/80 px-4 py-4 text-sm leading-relaxed text-neutral-700 shadow-sm sm:px-5"
            >
              {{ point }}
            </li>
          </ul>
        </div>
      </section>

      <section id="tarifs" class="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:px-8 sm:py-16">
        <p class="text-sm font-medium text-primary-700">{{ t("landing.plans.kicker") }}</p>
        <h2 class="mt-2 max-w-2xl text-2xl font-semibold tracking-tight break-words text-neutral-900 sm:text-3xl">
          {{ t("landing.plans.title") }}
        </h2>
        <p class="mt-3 max-w-2xl text-neutral-600">{{ t("landing.plans.subtitle") }}</p>

        <div v-if="loading" class="mt-10 flex min-h-[180px] flex-col items-center justify-center gap-3 text-sm text-neutral-500">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600" />
          {{ t("common.loading") }}
        </div>

        <div v-else class="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="plan in visiblePlans"
            :key="plan.code"
            :class="[
              'flex min-w-0 flex-col rounded-2xl border bg-white p-5 shadow-sm',
              plan.isHighlighted ? 'border-primary-400 ring-2 ring-primary-100' : 'border-neutral-200',
            ]"
          >
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div class="min-w-0">
                <h3 class="text-lg font-semibold text-neutral-900">{{ plan.name }}</h3>
                <p class="mt-1 text-sm text-neutral-500">{{ plan.tagline }}</p>
              </div>
              <span
                v-if="plan.isHighlighted"
                class="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700"
              >
                {{ t("landing.plans.highlighted") }}
              </span>
            </div>
            <p class="mt-4 text-2xl font-semibold text-neutral-900">{{ formatPrice(plan) }}</p>
            <p class="mt-1 text-sm text-neutral-500">
              {{
                plan.maxEmployees == null
                  ? t("landing.plans.employeesUnlimited")
                  : t("landing.plans.employees", { n: plan.maxEmployees })
              }}
            </p>
            <p class="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {{ t("landing.plans.included") }}
            </p>
            <ul class="mt-2 flex-1 space-y-1.5 text-sm text-neutral-600">
              <li v-for="code in plan.includedServices.slice(0, 6)" :key="code">
                {{ serviceName(code) }}
              </li>
            </ul>
            <button
              type="button"
              class="mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold"
              :class="plan.isHighlighted ? 'btn-primary' : 'btn-outline'"
              @click="choosePlan(plan.code)"
            >
              {{ t("landing.plans.cta") }}
            </button>
          </article>
        </div>
      </section>

      <section id="inscription" class="scroll-mt-24 border-t border-neutral-200/80 bg-white">
        <div class="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:gap-10 sm:px-8 sm:py-16 lg:grid-cols-[1fr_1.15fr]">
          <div class="min-w-0">
            <p class="text-sm font-medium text-primary-700">{{ t("landing.form.kicker") }}</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight break-words text-neutral-900 sm:text-3xl">
              {{ t("landing.form.title") }}
            </h2>
            <p class="mt-3 text-neutral-600">{{ t("landing.form.subtitle") }}</p>
            <p v-if="selectedPlan" class="mt-6 rounded-2xl bg-[#f7f4ef] px-4 py-3 text-sm leading-relaxed text-neutral-700">
              {{ chosenPlanLabel }}
            </p>
          </div>

          <form class="min-w-0 rounded-2xl border border-neutral-200 bg-[#fbfaf7] p-4 sm:rounded-3xl sm:p-7" @submit.prevent="submit">
            <div
              v-if="error"
              class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {{ error }}
            </div>
            <div
              v-if="successMessage"
              class="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
            >
              {{ successMessage }}
              <RouterLink to="/login" class="ml-1 font-semibold underline">
                {{ t("landing.form.loginLink") }}
              </RouterLink>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block text-sm">
                <span class="mb-1 block font-medium text-neutral-800">{{ t("landing.form.firstName") }}</span>
                <input v-model="form.firstName" type="text" required class="input-base w-full text-base" />
              </label>
              <label class="block text-sm">
                <span class="mb-1 block font-medium text-neutral-800">{{ t("landing.form.lastName") }}</span>
                <input v-model="form.lastName" type="text" required class="input-base w-full text-base" />
              </label>
              <label class="block text-sm sm:col-span-2">
                <span class="mb-1 block font-medium text-neutral-800">{{ t("landing.form.email") }}</span>
                <input v-model="form.email" type="email" required class="input-base w-full text-base" />
              </label>
              <label class="block text-sm sm:col-span-2">
                <span class="mb-1 block font-medium text-neutral-800">{{ t("landing.form.phone") }}</span>
                <input v-model="form.phone" type="tel" class="input-base w-full text-base" />
              </label>
              <label class="block text-sm">
                <span class="mb-1 block font-medium text-neutral-800">{{ t("landing.form.password") }}</span>
                <input v-model="form.password" type="password" required minlength="8" class="input-base w-full text-base" />
              </label>
              <label class="block text-sm">
                <span class="mb-1 block font-medium text-neutral-800">{{ t("landing.form.confirmPassword") }}</span>
                <input v-model="form.confirmPassword" type="password" required class="input-base w-full text-base" />
              </label>
              <label class="block text-sm sm:col-span-2">
                <span class="mb-1 block font-medium text-neutral-800">{{ t("landing.form.companyName") }}</span>
                <input
                  :value="form.companyName"
                  type="text"
                  required
                  class="input-base w-full text-base"
                  @input="onCompanyNameInput"
                />
              </label>
              <label class="block min-w-0 text-sm">
                <span class="mb-1 block font-medium text-neutral-800">{{ t("landing.form.country") }}</span>
                <select v-model="form.countryId" required class="input-base w-full max-w-full text-base">
                  <option value="">{{ t("landing.form.countryPlaceholder") }}</option>
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                  </option>
                </select>
              </label>
              <label class="block min-w-0 text-sm">
                <span class="mb-1 block font-medium text-neutral-800">{{ t("landing.form.plan") }}</span>
                <select v-model="form.plan" class="input-base w-full max-w-full text-base">
                  <option v-for="plan in visiblePlans" :key="plan.code" :value="plan.code">
                    {{ plan.name }} — {{ formatPrice(plan) }}
                  </option>
                </select>
              </label>
              <div class="min-w-0 sm:col-span-2">
                <span class="mb-1 block text-sm font-medium text-neutral-800">{{ t("landing.form.subdomain") }}</span>
                <div class="flex min-w-0 flex-col overflow-hidden rounded-lg border border-neutral-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/25 sm:flex-row">
                  <input
                    v-model="form.subdomain"
                    type="text"
                    class="min-w-0 w-full px-3 py-2.5 text-base focus:outline-none"
                    placeholder="mon-entreprise"
                  />
                  <span class="flex shrink-0 items-center border-t border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-500 sm:border-l sm:border-t-0">
                    {{ t("landing.form.subdomainSuffix") }}
                  </span>
                </div>
                <p class="mt-1 text-xs text-neutral-500">{{ t("landing.form.subdomainHint") }}</p>
              </div>
            </div>

            <label class="mt-4 flex items-start gap-2 text-sm text-neutral-700">
              <input v-model="form.agreeToTerms" type="checkbox" class="mt-0.5 shrink-0 rounded border-neutral-300" />
              <span>{{ t("landing.form.terms") }}</span>
            </label>

            <button type="submit" class="btn-primary mt-5 w-full py-2.5" :disabled="submitting">
              {{ submitting ? t("landing.form.submitting") : t("landing.form.submit") }}
            </button>
            <p class="mt-4 text-center text-sm text-neutral-500">
              {{ t("landing.form.loginHint") }}
              <RouterLink to="/login" class="font-semibold text-primary-700 hover:underline">
                {{ t("landing.form.loginLink") }}
              </RouterLink>
            </p>
          </form>
        </div>
      </section>
    </main>

    <footer class="border-t border-neutral-200 bg-[#f7f4ef] px-4 py-8 text-center text-sm text-neutral-500 sm:px-5">
      <p>{{ t("landing.footer.tagline") }}</p>
      <RouterLink to="/login" class="mt-2 inline-block font-medium text-primary-700 hover:underline">
        {{ t("landing.footer.login") }}
      </RouterLink>
    </footer>
  </div>
</template>

<script setup>
import { useLanding } from "./composables/useLanding.js";
import { useI18n } from "../../i18n/index.js";

const { t } = useI18n();

const {
  loading,
  submitting,
  error,
  successMessage,
  form,
  menuOpen,
  countries,
  featuredServices,
  visiblePlans,
  selectedPlan,
  dayStories,
  whatsappPoints,
  chosenPlanLabel,
  locale,
  switchLocale,
  serviceName,
  serviceBlurb,
  formatPrice,
  choosePlan,
  onCompanyNameInput,
  closeMenu,
  toggleMenu,
  goToSection,
  scrollToSignup,
  submit,
} = useLanding();
</script>
