<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-neutral-200"
      >
        <h2 class="text-xl font-bold text-neutral-900">{{ title }}</h2>
        <button
          @click="close"
          class="text-neutral-500 hover:text-neutral-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Body -->
      <div class="p-6">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div class="flex gap-3 p-6 border-t border-neutral-200 justify-end">
        <button @click="close" class="btn-outline">Cancel</button>
        <button @click="confirm" class="btn-primary">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: String,
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const close = () => {
  emit("update:modelValue", false);
};

const confirm = () => {
  emit("confirm");
  close();
};
</script>

<style scoped></style>
