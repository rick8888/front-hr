<template>
  <div class="min-h-screen overflow-hidden bg-[#f7f8fc] text-neutral-800">
    <header class="sticky top-0 z-30 border-b border-neutral-200/80 bg-[#f7f8fc]/90 backdrop-blur-xl">
      <div class="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <a href="#top" class="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" @click="closeMenu">
          <img src="/brand/bravorh-logo-light.png" alt="Bravo RH" class="h-auto w-36 sm:w-40" />
        </a>

        <nav class="hidden items-center gap-7 text-sm font-medium text-neutral-600 lg:flex" :aria-label="t('landing.nav.label')">
          <a href="#features" class="transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">{{ t("landing.nav.features") }}</a>
          <a href="#benefits" class="transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">{{ t("landing.nav.benefits") }}</a>
          <a href="#faq" class="transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">{{ t("landing.nav.faq") }}</a>
        </nav>

        <div class="flex items-center gap-2">
          <div class="hidden items-center rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-xs font-semibold text-neutral-500 sm:flex">
            <button type="button" class="rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" :class="locale === 'fr' ? 'bg-white text-neutral-900 shadow-sm' : 'hover:text-neutral-800'" :aria-pressed="locale === 'fr'" @click="switchLocale('fr')">FR</button>
            <button type="button" class="rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" :class="locale === 'en' ? 'bg-white text-neutral-900 shadow-sm' : 'hover:text-neutral-800'" :aria-pressed="locale === 'en'" @click="switchLocale('en')">EN</button>
          </div>
          <RouterLink to="/login" class="hidden rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:inline-flex">
            {{ t("landing.nav.login") }}
          </RouterLink>
          <a href="#inscription" class="btn-primary hidden items-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 md:inline-flex">
            {{ t("landing.nav.contact") }}
            <span aria-hidden="true">↗</span>
          </a>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 lg:hidden"
            :aria-label="menuOpen ? t('landing.nav.close') : t('landing.nav.menu')"
            :aria-expanded="menuOpen"
            aria-controls="mobile-menu"
            @click="toggleMenu"
          >
            <svg v-if="!menuOpen" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="menuOpen" id="mobile-menu" class="border-t border-neutral-200 bg-white px-4 py-4 shadow-lg lg:hidden">
        <nav class="flex flex-col gap-1 text-sm font-medium text-neutral-700" :aria-label="t('landing.nav.label')">
          <a href="#features" class="rounded-lg px-3 py-2.5 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" @click="closeMenu">{{ t("landing.nav.features") }}</a>
          <a href="#benefits" class="rounded-lg px-3 py-2.5 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" @click="closeMenu">{{ t("landing.nav.benefits") }}</a>
          <a href="#faq" class="rounded-lg px-3 py-2.5 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" @click="closeMenu">{{ t("landing.nav.faq") }}</a>
        </nav>
        <div class="mt-3 flex items-center justify-between gap-3 border-t border-neutral-200 pt-3">
          <div class="flex items-center rounded-lg bg-neutral-50 p-0.5 text-xs font-semibold text-neutral-500">
            <button type="button" class="rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" :class="locale === 'fr' ? 'bg-white text-neutral-900 shadow-sm' : 'hover:text-neutral-800'" :aria-pressed="locale === 'fr'" @click="switchLocale('fr')">FR</button>
            <button type="button" class="rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" :class="locale === 'en' ? 'bg-white text-neutral-900 shadow-sm' : 'hover:text-neutral-800'" :aria-pressed="locale === 'en'" @click="switchLocale('en')">EN</button>
          </div>
          <RouterLink to="/login" class="rounded-lg px-3 py-2 text-sm font-semibold text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" @click="closeMenu">{{ t("landing.nav.login") }}</RouterLink>
        </div>
        <a href="#inscription" class="btn-primary mt-3 flex w-full items-center justify-center gap-2 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2" @click="closeMenu">
          {{ t("landing.nav.contact") }}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>

    <main id="top">
      <section class="relative isolate">
        <div class="pointer-events-none absolute -right-32 top-12 -z-10 h-96 w-96 rounded-full bg-primary-100/70 blur-3xl" aria-hidden="true" />
        <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16 lg:py-24">
          <div class="min-w-0">
            <p class="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-3 py-1.5 text-xs font-semibold tracking-wide text-primary-800 shadow-sm">
              <span class="h-2 w-2 rounded-full bg-secondary-500" aria-hidden="true" />
              {{ t("landing.hero.kicker") }}
            </p>
            <h1 class="mt-6 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.6rem]">
              {{ t("landing.hero.title") }}
            </h1>
            <p class="mt-5 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
              {{ t("landing.hero.subtitle") }}
            </p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#inscription" class="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                {{ t("landing.hero.cta") }}
                <span aria-hidden="true">↗</span>
              </a>
              <a href="#features" class="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-primary-200 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                {{ t("landing.hero.secondary") }}
                <span class="ml-2" aria-hidden="true">↓</span>
              </a>
            </div>
            <div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-neutral-500 sm:text-sm">
              <span>{{ t("landing.hero.proof1") }}</span>
              <span class="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" aria-hidden="true" />
              <span>{{ t("landing.hero.proof2") }}</span>
              <span class="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" aria-hidden="true" />
              <span>{{ t("landing.hero.proof3") }}</span>
            </div>
          </div>

          <div class="relative mx-auto w-full max-w-[620px] min-w-0">
            <div class="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary-100 via-white to-secondary-100 blur-xl" aria-hidden="true" />
            <div class="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xl shadow-primary-900/10 sm:rounded-3xl">
              <div class="flex items-center justify-between border-b border-neutral-100 px-4 py-3 sm:px-6 sm:py-4">
                <div class="flex items-center gap-2.5">
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-700" aria-hidden="true">BR</span>
                  <div>
                    <p class="text-xs font-semibold text-neutral-900 sm:text-sm">{{ t("landing.preview.product") }}</p>
                    <p class="text-[11px] text-neutral-500">{{ t("landing.preview.workspace") }}</p>
                  </div>
                </div>
                <span class="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800 sm:text-xs">{{ t("landing.preview.sample") }}</span>
              </div>

              <div class="p-4 sm:p-6">
                <div class="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p class="text-[11px] font-medium uppercase tracking-wide text-neutral-400">{{ t("landing.preview.dashboard") }}</p>
                    <h2 class="mt-1 text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">{{ t("landing.preview.greeting") }}</h2>
                  </div>
                  <span class="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-[10px] font-medium text-neutral-500 sm:text-xs">{{ t("landing.preview.period") }}</span>
                </div>

                <div class="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
                  <div class="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3 sm:p-4">
                    <p class="text-[10px] leading-4 text-neutral-500 sm:text-xs">{{ t("landing.preview.metric1") }}</p>
                    <p class="mt-2 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">128</p>
                    <p class="mt-1 text-[10px] text-neutral-400 sm:text-xs">{{ t("landing.preview.fictional") }}</p>
                  </div>
                  <div class="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 sm:p-4">
                    <p class="text-[10px] leading-4 text-neutral-500 sm:text-xs">{{ t("landing.preview.metric2") }}</p>
                    <p class="mt-2 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">112</p>
                    <p class="mt-1 text-[10px] text-neutral-400 sm:text-xs">{{ t("landing.preview.fictional") }}</p>
                  </div>
                  <div class="rounded-xl border border-violet-100 bg-violet-50/50 p-3 sm:p-4">
                    <p class="text-[10px] leading-4 text-neutral-500 sm:text-xs">{{ t("landing.preview.metric3") }}</p>
                    <p class="mt-2 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">06</p>
                    <p class="mt-1 text-[10px] text-neutral-400 sm:text-xs">{{ t("landing.preview.fictional") }}</p>
                  </div>
                </div>

                <div class="mt-4 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                  <div class="rounded-xl border border-neutral-100 p-3.5 sm:p-4">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-xs font-semibold text-neutral-800">{{ t("landing.preview.activity") }}</p>
                      <span class="text-[10px] text-neutral-400">{{ t("landing.preview.illustration") }}</span>
                    </div>
                    <div class="mt-4 flex h-20 items-end gap-2 border-b border-neutral-100 px-1 sm:h-24">
                      <span v-for="(height, index) in [36, 52, 43, 68, 55, 82, 61, 74, 48, 64, 88, 70]" :key="index" class="flex-1 rounded-t-sm bg-gradient-to-t from-primary-500 to-secondary-300" :style="{ height: `${height}%` }" aria-hidden="true" />
                    </div>
                    <div class="mt-2 flex justify-between text-[9px] text-neutral-400 sm:text-[10px]">
                      <span>{{ t("landing.preview.chartStart") }}</span>
                      <span>{{ t("landing.preview.chartEnd") }}</span>
                    </div>
                  </div>
                  <div class="rounded-xl border border-neutral-100 p-3.5 sm:p-4">
                    <p class="text-xs font-semibold text-neutral-800">{{ t("landing.preview.requests") }}</p>
                    <div class="mt-3 space-y-3">
                      <div class="flex items-center gap-2">
                        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-[9px] font-semibold text-primary-700" aria-hidden="true">AM</span>
                        <div class="min-w-0 flex-1">
                          <p class="truncate text-[10px] font-medium text-neutral-700">{{ t("landing.preview.request1") }}</p>
                          <p class="text-[9px] text-neutral-400">{{ t("landing.preview.requestType1") }}</p>
                        </div>
                        <span class="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-50 text-[9px] font-semibold text-secondary-700" aria-hidden="true">JK</span>
                        <div class="min-w-0 flex-1">
                          <p class="truncate text-[10px] font-medium text-neutral-700">{{ t("landing.preview.request2") }}</p>
                          <p class="text-[9px] text-neutral-400">{{ t("landing.preview.requestType2") }}</p>
                        </div>
                        <span class="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
                <p class="mt-4 text-center text-[10px] leading-relaxed text-neutral-400">{{ t("landing.preview.disclaimer") }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" class="scroll-mt-24 bg-neutral-900 text-white">
        <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 sm:py-18 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <p class="text-sm font-semibold text-secondary-300">{{ t("landing.benefits.kicker") }}</p>
            <h2 class="mt-3 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{{ t("landing.benefits.title") }}</h2>
            <p class="mt-4 max-w-lg text-sm leading-7 text-neutral-300 sm:text-base">{{ t("landing.benefits.subtitle") }}</p>
          </div>
          <div class="grid gap-3 sm:grid-cols-3">
            <article v-for="(item, index) in [1, 2, 3]" :key="item" class="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
              <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-xs font-semibold text-secondary-200" aria-hidden="true">0{{ index + 1 }}</span>
              <h3 class="mt-5 text-sm font-semibold text-white">{{ t(`landing.benefits.item${item}.title`) }}</h3>
              <p class="mt-2 text-xs leading-6 text-neutral-300">{{ t(`landing.benefits.item${item}.text`) }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="features" class="scroll-mt-24 bg-white">
        <div class="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
          <div class="max-w-2xl">
            <p class="text-sm font-semibold text-primary-700">{{ t("landing.features.kicker") }}</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{{ t("landing.features.title") }}</h2>
            <p class="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">{{ t("landing.features.subtitle") }}</p>
          </div>

          <div class="mt-9 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            <article v-for="feature in featureKeys" :key="feature" class="group rounded-2xl border border-neutral-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/5 sm:p-6">
              <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-100" aria-hidden="true">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <template v-if="feature === 'employees'">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm2 5h4m-2-2v4" />
                  </template>
                  <template v-else-if="feature === 'attendance'">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M12 8v4l2.5 1.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </template>
                  <template v-else-if="feature === 'leave'">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Zm3 8h3m-3 3h6" />
                  </template>
                  <template v-else-if="feature === 'payroll'">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9ZM16 12h2m-11 0h5" />
                  </template>
                  <template v-else-if="feature === 'documents'">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5m-9 5h5m-5 4h5" />
                  </template>
                  <template v-else>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M4 19V5m0 14h17M8 15v-3m5 3V8m5 7v-5" />
                  </template>
                </svg>
              </span>
              <h3 class="mt-5 text-base font-semibold text-neutral-900">{{ t(`landing.feature.${feature}.title`) }}</h3>
              <p class="mt-2 text-sm leading-6 text-neutral-600">{{ t(`landing.feature.${feature}.text`) }}</p>
            </article>
          </div>
          <p class="mt-6 text-sm leading-6 text-neutral-500">{{ t("landing.features.more") }}</p>
        </div>
      </section>

      <section class="border-y border-neutral-200 bg-[#f7f8fc]">
        <div class="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-18">
          <div class="max-w-2xl">
            <p class="text-sm font-semibold text-primary-700">{{ t("landing.workflow.kicker") }}</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{{ t("landing.workflow.title") }}</h2>
            <p class="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">{{ t("landing.workflow.subtitle") }}</p>
          </div>
          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <article v-for="(step, index) in workflowKeys" :key="step" class="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary-700" aria-hidden="true">0{{ index + 1 }}</span>
              <div>
                <h3 class="text-sm font-semibold text-neutral-900">{{ t(`landing.workflow.${step}.title`) }}</h3>
                <p class="mt-2 text-sm leading-6 text-neutral-600">{{ t(`landing.workflow.${step}.text`) }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" class="scroll-mt-24 bg-white">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-8 sm:py-18 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p class="text-sm font-semibold text-primary-700">{{ t("landing.faq.kicker") }}</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{{ t("landing.faq.title") }}</h2>
          </div>
          <div class="divide-y divide-neutral-200 border-y border-neutral-200">
            <details v-for="item in faqKeys" :key="item" class="group py-5">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-sm font-semibold text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 sm:text-base">
                {{ t(`landing.faq.q${item}`) }}
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p class="mt-3 max-w-3xl pr-10 text-sm leading-7 text-neutral-600">{{ t(`landing.faq.a${item}`) }}</p>
            </details>
          </div>
        </div>
      </section>

      <section id="inscription" class="scroll-mt-24 bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-700 text-white">
        <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div class="max-w-2xl">
            <p class="text-sm font-semibold text-primary-100">{{ t("landing.contact.kicker") }}</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{{ t("landing.contact.title") }}</h2>
            <p class="mt-3 text-sm leading-6 text-primary-50 sm:text-base">{{ t("landing.contact.subtitle") }}</p>
          </div>
          <form class="rounded-2xl bg-white p-5 text-neutral-800 shadow-xl sm:p-7" @submit.prevent="submitContact">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block text-sm font-medium">
                {{ t("landing.contact.name") }}
                <input v-model="contactForm.name" required maxlength="160" autocomplete="name" class="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25" />
              </label>
              <label class="block text-sm font-medium">
                {{ t("landing.contact.email") }}
                <input v-model="contactForm.email" required maxlength="180" type="email" autocomplete="email" class="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25" />
              </label>
              <label class="block text-sm font-medium sm:col-span-2">
                {{ t("landing.contact.company") }}
                <input v-model="contactForm.company" maxlength="160" autocomplete="organization" class="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25" />
              </label>
              <label class="block text-sm font-medium sm:col-span-2">
                {{ t("landing.contact.subject") }}
                <input v-model="contactForm.subject" required maxlength="160" class="mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25" />
              </label>
              <label class="block text-sm font-medium sm:col-span-2">
                {{ t("landing.contact.message") }}
                <textarea v-model="contactForm.message" required minlength="10" maxlength="5000" rows="4" class="mt-1.5 w-full resize-y rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25" />
              </label>
            </div>
            <p v-if="contactError" class="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
              {{ contactError }}
            </p>
            <p v-if="contactSuccess" class="mt-4 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800" role="status">
              {{ t("landing.contact.success") }}
            </p>
            <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" :disabled="isContactSubmitting" class="inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60">
                {{ isContactSubmitting ? t("landing.contact.sending") : t("landing.contact.cta") }}
              </button>
              <RouterLink to="/login" class="text-center text-sm font-semibold text-primary-700 hover:text-primary-900">
                {{ t("landing.nav.login") }}
              </RouterLink>
            </div>
          </form>
        </div>
      </section>
    </main>

    <footer class="bg-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 text-sm text-neutral-500 sm:px-8 md:flex-row md:items-center md:justify-between">
        <a href="#top" class="flex items-center gap-2 font-semibold text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
          <img src="/brand/bravorh-app-icon.png" alt="" class="h-7 w-7 rounded-lg" />
          Bravo RH
        </a>
        <p>{{ t("landing.footer.tagline") }}</p>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href="#inscription" class="hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">{{ t("landing.footer.contact") }}</a>
          <RouterLink to="/login" class="hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">{{ t("landing.footer.login") }}</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useLanding } from "./composables/useLanding.js";
import { useI18n } from "../../i18n/index.js";
import { landingApiService } from "./services/landing.api.service.js";

const { t } = useI18n();
const {
  menuOpen,
  locale,
  switchLocale,
  closeMenu,
  toggleMenu,
} = useLanding();

const contactForm = reactive({
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
});
const isContactSubmitting = ref(false);
const contactSuccess = ref(false);
const contactError = ref("");

async function submitContact() {
  if (isContactSubmitting.value) return;

  isContactSubmitting.value = true;
  contactSuccess.value = false;
  contactError.value = "";

  try {
    await landingApiService.sendContactMessage({ ...contactForm });
    Object.assign(contactForm, {
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    });
    contactSuccess.value = true;
  } catch {
    contactError.value = t("landing.contact.error");
  } finally {
    isContactSubmitting.value = false;
  }
}

const featureKeys = ["employees", "attendance", "leave", "payroll", "documents", "reporting"];
const workflowKeys = ["organize", "process", "review"];
const faqKeys = [1, 2, 3];
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  :global(html) {
    scroll-behavior: auto !important;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
