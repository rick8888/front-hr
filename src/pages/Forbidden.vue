<template>
  <div class="flex min-h-[60vh] items-center justify-center px-4 py-10 sm:px-8 sm:py-16">
    <div class="max-w-lg text-center">
      <div
        class="mb-6 text-8xl font-bold text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text"
      >
        403
      </div>
      <h1 class="text-3xl font-bold text-neutral-900 mb-2">Accès interdit</h1>
      <p class="text-lg text-neutral-600 mb-8">
        Vous n'avez pas les droits nécessaires pour accéder à cette page.
      </p>
      <RouterLink to="/" class="btn-primary"> Retour au tableau de bord </RouterLink>
    </div>
  </div>
</template>

<script setup></script>
