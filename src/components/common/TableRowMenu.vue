<template>
  <div class="inline-flex" @click.stop>
    <button
      ref="triggerRef"
      type="button"
      class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
      :aria-expanded="open"
      aria-haspopup="true"
      :aria-label="ariaLabel"
      @click="$emit('toggle')"
    >
      <slot name="icon">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
          />
        </svg>
      </slot>
    </button>

    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-[80]" @click="$emit('close')">
        <div
          ref="menuRef"
          class="fixed rounded-lg border border-neutral-200 bg-white py-1 shadow-md"
          :class="widthClass"
          :style="menuStyle"
          role="menu"
          @click.stop
        >
          <slot />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  ariaLabel: { type: String, default: "" },
  widthClass: { type: String, default: "w-40" },
});

defineEmits(["toggle", "close"]);

const triggerRef = ref(null);
const menuRef = ref(null);
const menuStyle = ref({});

function updatePosition() {
  const trigger = triggerRef.value;
  const menu = menuRef.value;
  if (!trigger || !menu) return;

  const triggerRect = trigger.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const scale = menuRect.width / menu.offsetWidth;
  if (!Number.isFinite(scale) || scale <= 0) return;

  const gap = 4;
  const pad = 8;
  const viewportWidth = window.innerWidth * scale;
  const viewportHeight = window.innerHeight * scale;

  let left = triggerRect.right - menuRect.width;
  left = Math.min(Math.max(pad * scale, left), viewportWidth - menuRect.width - pad * scale);

  let top = triggerRect.bottom + gap * scale;
  if (top + menuRect.height > viewportHeight - pad * scale
    && triggerRect.top - menuRect.height - gap * scale >= pad * scale) {
    top = triggerRect.top - menuRect.height - gap * scale;
  }

  menuStyle.value = {
    top: `${top / scale}px`,
    left: `${left / scale}px`,
  };
}

async function syncPosition() {
  if (!props.open) return;
  await nextTick();
  updatePosition();
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    syncPosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
  } else {
    window.removeEventListener("resize", updatePosition);
    window.removeEventListener("scroll", updatePosition, true);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updatePosition);
  window.removeEventListener("scroll", updatePosition, true);
});
</script>
