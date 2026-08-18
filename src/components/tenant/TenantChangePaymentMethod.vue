<template>
  <TenantPaymentCheckoutPanel
    :methods="methods"
    :context="context"
    :busy="busy"
    @cancel="$emit('cancel')"
    @proceed="$emit('proceed', $event)"
  />
</template>

<script setup>
import TenantPaymentCheckoutPanel from "./payment/TenantPaymentCheckoutPanel.vue";

defineProps({
  methods: { type: Array, required: true },
  context: { type: Object, default: () => ({}) },
  busy: { type: Boolean, default: false },
});

defineEmits(["cancel", "proceed"]);
</script>
