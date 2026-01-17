# Components Guide

This guide provides detailed information about all available components in the Bravo RH system.

## Common Components

### Button

Versatile button component with multiple variants and sizes.

```vue
<Button variant="primary" size="md" @click="handleClick">
  Click me
</Button>

<!-- Variants: primary, secondary, outline, ghost -->
<!-- Sizes: sm, md, lg -->
```

Props:

- `variant` - Button style variant
- `size` - Button size
- `disabled` - Disable button
- `icon` - Optional emoji/icon before text

### TextInput

Form input with validation support.

```vue
<TextInput
  v-model="email"
  label="Email"
  type="email"
  placeholder="you@example.com"
  :error="emailError"
  required
/>
```

Props:

- `modelValue` - Input value
- `type` - Input type
- `label` - Field label
- `placeholder` - Placeholder text
- `error` - Error message
- `hint` - Helper text
- `disabled` - Disable input
- `required` - Mark as required

### Select

Dropdown selection component.

```vue
<Select
  v-model="department"
  label="Department"
  :options="departmentOptions"
  placeholder="Choose a department"
/>
```

Props:

- `modelValue` - Selected value
- `label` - Field label
- `options` - Array of options {value, label}
- `placeholder` - Placeholder text
- `error` - Error message
- `disabled` - Disable select
- `required` - Mark as required

### TextArea

Multi-line text input.

```vue
<TextArea
  v-model="description"
  label="Description"
  :rows="4"
  placeholder="Enter your message"
/>
```

Props:

- `modelValue` - Text value
- `label` - Field label
- `placeholder` - Placeholder text
- `rows` - Number of rows
- `error` - Error message
- `disabled` - Disable textarea
- `required` - Mark as required

### Modal

Dialog/modal component.

```vue
<Modal v-model="isOpen" title="Confirm Action" @confirm="handleConfirm">
  Are you sure you want to proceed?
</Modal>
```

Props:

- `modelValue` - Show/hide modal
- `title` - Modal title

Events:

- `confirm` - When confirm button clicked
- `update:modelValue` - When modal closes

### Badge

Status badge component.

```vue
<Badge variant="success" icon="✓">
  Active
</Badge>

<!-- Variants: primary, success, warning, error, info -->
```

Props:

- `variant` - Badge style
- `icon` - Optional emoji/icon

### Toast

Toast notification component.

```vue
<Toast
  type="success"
  title="Success"
  message="Operation completed"
  :duration="3000"
/>

<!-- Types: success, error, warning, info -->
```

Props:

- `type` - Notification type
- `title` - Notification title
- `message` - Notification message
- `duration` - Auto-hide duration in ms

### Loading

Loading indicator component.

```vue
<Loading status="Loading data..." />
```

Props:

- `status` - Loading status text

### ProgressBar

Progress visualization component.

```vue
<ProgressBar :percentage="75" />
```

Props:

- `percentage` - Progress percentage (0-100)

### StatCard

Statistics display card.

```vue
<StatCard
  title="Total Employees"
  value="1,254"
  change="+12%"
  icon="👥"
  color="primary"
/>
```

Props:

- `title` - Card title
- `value` - Main value to display
- `change` - Change indicator
- `icon` - Emoji/icon
- `color` - Color variant

### Table

Reusable table component.

```vue
<Table :columns="columns" :rows="employees">
  <template #cell-name="{ value }">
    <strong>{{ value }}</strong>
  </template>
</Table>
```

Props:

- `columns` - Array of {key, label}
- `rows` - Array of data rows

Slots:

- `cell-{key}` - Custom cell rendering

## Layout Components

### AppLayout

Main layout wrapper.

```vue
<AppLayout>
  <RouterView />
</AppLayout>
```

Includes:

- Sidebar navigation
- Top header bar
- Main content area

### Sidebar

Navigation sidebar.

Automatically renders from `navigationItems` array in component.

### Header

Top header bar.

Includes search, notifications, theme toggle, and user menu.

## Using Components

### In Pages

```vue
<template>
  <div class="px-8 py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Page Title</h1>
    </div>

    <div class="card">
      <Button @click="handleAction">Action</Button>
    </div>
  </div>
</template>

<script setup>
import Button from "@/components/common/Button.vue";

const handleAction = () => {
  console.log("Action triggered");
};
</script>
```

### Slots and Customization

Most components support slots for customization. Check individual component files for available slots.

## Styling

All components use Tailwind CSS classes. The design system is defined in `tailwind.config.js`.

### Using Tailwind Classes

```vue
<div class="bg-primary-500 text-white px-4 py-2 rounded-lg">
  Styled with Tailwind
</div>
```

### Available Color Classes

- Primary: `bg-primary-{50-900}`, `text-primary-{50-900}`
- Secondary: `bg-secondary-{50-900}`, `text-secondary-{50-900}`
- Success: `bg-success-{50-900}`, `text-success-{50-900}`
- Warning: `bg-warning-{50-900}`, `text-warning-{50-900}`
- Error: `bg-error-{50-900}`, `text-error-{50-900}`
- Info: `bg-info-{50-900}`, `text-info-{50-900}`
- Neutral: `bg-neutral-{50-900}`, `text-neutral-{50-900}`

## Best Practices

1. **Use Composition API** - Prefer `<script setup>` syntax
2. **Reactive State** - Use `ref` and `computed` appropriately
3. **Event Handling** - Use `@event` directives
4. **Props** - Define all props with types and defaults
5. **Emits** - Define all emitted events
6. **Naming** - Use descriptive names for components, props, and events
7. **Accessibility** - Include labels and ARIA attributes
8. **Responsive** - Design for mobile-first then enhance

## Common Patterns

### Form with Validation

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <TextInput v-model="form.name" label="Name" :error="errors.name" required />
    <TextInput
      v-model="form.email"
      label="Email"
      type="email"
      :error="errors.email"
      required
    />
    <Button type="submit">Submit</Button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useForm } from "@/composables/useForm";

const { form, errors, setError } = useForm({
  name: "",
  email: "",
});

const handleSubmit = () => {
  // Validate and submit
};
</script>
```

### Data Table with Pagination

```vue
<template>
  <div>
    <Table :columns="columns" :rows="paginatedItems" />
    <div class="flex gap-2 mt-4">
      <Button @click="prevPage" :disabled="currentPage === 1">Previous</Button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <Button @click="nextPage" :disabled="currentPage === totalPages"
        >Next</Button
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePagination } from "@/composables/useDataTable";

const items = ref([]);
const { currentPage, totalPages, paginatedItems, nextPage, prevPage } =
  usePagination(items);
</script>
```

## Troubleshooting

### Component not rendering

- Check if component is imported
- Verify v-model binding syntax
- Check for prop type mismatches

### Events not firing

- Ensure @click or other event handlers are attached
- Check event names match component emit definitions
- Verify event handler function exists

### Styling not applied

- Check for CSS class typos
- Verify Tailwind classes are supported
- Check CSS specificity issues
- Review custom styles in `src/assets/css/main.css`
