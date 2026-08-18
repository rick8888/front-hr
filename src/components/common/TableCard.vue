<template>
  <section
    class="rounded-xl border border-neutral-200 bg-white shadow-xs"
  >
    <header
      v-if="title || $slots.header"
      class="border-b border-neutral-100 px-5 py-4 md:px-6"
    >
      <slot name="header">
        <h2 class="text-base font-semibold text-neutral-800">{{ title }}</h2>
      </slot>
    </header>

    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse text-left">
        <slot />
      </table>
    </div>

    <footer
      v-if="$slots.footer"
      class="border-t border-neutral-100 px-5 py-4 md:px-6"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
});
</script>
