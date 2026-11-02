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

  const r = trigger.getBoundingClientRect();
  const mw = menu.offsetWidth;
  const mh = menu.offsetHeight;
  const gap = 4;
  const pad = 8;

  let left = r.right - mw;
  left = Math.min(Math.max(pad, left), window.innerWidth - mw - pad);

  let top = r.bottom + gap;
  if (top + mh > window.innerHeight - pad && r.top - mh - gap >= pad) {
    top = r.top - mh - gap;
  }

  menuStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
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
