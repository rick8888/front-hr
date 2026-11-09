<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      :class="[
        'fixed inset-0 flex items-center justify-center z-50',
        backdropClass || 'bg-black bg-opacity-50',
      ]"
      @click.self="close"
    >
      <div
        :class="[
          'bg-white rounded-xl shadow-xl w-full mx-4',
          sizeClass,
          panelClass,
        ]"
      >
        <!-- Header -->
        <div
          :class="[
            'flex items-center justify-between px-6 py-4 border-b border-neutral-200',
            headerClass,
          ]"
        >
          <h2 :class="['text-lg font-bold text-neutral-900', titleClass]">{{ title }}</h2>
          <button
            type="button"
            @click="close"
            :class="[
              'text-neutral-500 hover:text-neutral-700 text-2xl leading-none',
              closeButtonClass,
            ]"
            :aria-label="closeLabel"
          >
            ×
          </button>
        </div>

        <!-- Body -->
        <div
          :class="[
            'px-6 py-4 max-h-[calc(100vh-8rem)] overflow-y-auto',
            bodyClass,
          ]"
        >
          <slot></slot>
        </div>

        <!-- Footer (par défaut: Cancel/Confirm — remplaçable via slot `footer`) -->
        <slot name="footer">
          <div
            v-if="!hideFooter"
            class="flex gap-3 px-6 py-4 border-t border-neutral-200 justify-end"
          >
            <button @click="close" class="btn-outline">Cancel</button>
            <button @click="confirm" class="btn-primary">Confirm</button>
          </div>
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
  title: String,
  /** Taille de la modale : sm, md (medium), lg, xl */
  size: { type: String, default: "default" },
  backdropClass: { type: String, default: "" },
  panelClass: { type: String, default: "" },
  headerClass: { type: String, default: "" },
  titleClass: { type: String, default: "" },
  closeButtonClass: { type: String, default: "" },
  closeLabel: { type: String, default: "Close dialog" },
  bodyClass: { type: String, default: "" },
  /** Masque le footer par défaut (utile quand on utilise son propre footer
   * custom ou quand la modale n'a pas d'action). */
  hideFooter: { type: Boolean, default: false },
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "max-w-sm";
    case "md":
    case "medium":
      return "max-w-lg";
    case "lg":
      return "max-w-2xl";
    case "xl":
      return "max-w-3xl";
    case "2xl":
      return "max-w-5xl";
    case "full":
      return "max-w-6xl";
    default:
      return "max-w-md";
  }
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
