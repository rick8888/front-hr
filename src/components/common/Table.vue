<template>
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead>
        <tr class="border-b border-neutral-200">
          <th
            v-for="column in columns"
            :key="column.key"
            class="text-left px-6 py-3 text-sm font-medium text-neutral-600"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.id"
          class="border-b border-neutral-100 hover:bg-neutral-50"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 text-sm text-neutral-900"
          >
            <slot
              :name="`cell-${column.key}`"
              :value="row[column.key]"
              :row="row"
            >
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped></style>
