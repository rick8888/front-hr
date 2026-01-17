# Bravo RH - Getting Started Guide

## 🚀 Quick Start

### 1. Installation

```bash
cd bravo_rh
npm install
```

### 2. Development Server

```bash
npm run dev
```

Access the application at `http://localhost:5173`

### 3. Demo Login

```
Email: admin@bravorh.com
Password: password123
```

## 📖 Documentation

- **[README.md](./README.md)** - Project overview and features
- **[COMPONENTS.md](./COMPONENTS.md)** - Component library guide
- **[Getting Started](#getting-started)** - Below

## 🏗️ Project Architecture

### Directory Structure

```
bravo_rh/
├── public/                 # Static files
├── src/
│   ├── assets/            # Styles and static assets
│   ├── components/        # Vue components
│   │   ├── common/       # Reusable components
│   │   └── layout/       # Layout components
│   ├── composables/       # Vue 3 Composition functions
│   ├── config/            # Configuration files
│   ├── pages/             # Page components
│   ├── router/            # Vue Router setup
│   ├── services/          # API services
│   ├── stores/            # Pinia stores
│   ├── utils/             # Utility functions
│   ├── App.vue            # Root component
│   └── main.js            # Application entry point
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Project dependencies
```

## 🎨 Design System

### Colors

All colors are defined in `tailwind.config.js` and follow the Figma design.

- **Primary Blue**: #5b99f5
- **Secondary Purple**: #9333ea
- **Success Green**: #22c55e
- **Warning Yellow**: #eab308
- **Error Red**: #ef4444
- **Info Cyan**: #0ea5e9

### Typography

- **Font Family**: Inter
- **Base Size**: 16px
- **Line Height**: 1.5

### Spacing

- xs: 0.5rem
- sm: 0.75rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Available variables:

- `VITE_API_BASE_URL` - API base URL
- `VITE_APP_NAME` - Application name
- `VITE_ENV` - Environment (development/production)

### Tailwind CSS

Configured in `tailwind.config.js` with custom colors and components.

### Router

Routes defined in `src/router/index.js`:

| Path                   | Component          | Purpose                |
| ---------------------- | ------------------ | ---------------------- |
| `/`                    | Dashboard          | Main dashboard         |
| `/employees`           | Employees          | Employee listing       |
| `/attendance`          | Attendance         | Attendance tracking    |
| `/payroll`             | Payroll            | Payroll management     |
| `/leave-requests`      | LeaveRequests      | Leave management       |
| `/performance-reviews` | PerformanceReviews | Performance reviews    |
| `/training`            | Training           | Training programs      |
| `/recruitment`         | Recruitment        | Recruitment management |
| `/departments`         | Departments        | Department management  |
| `/reports`             | Reports            | Analytics and reports  |
| `/company-info`        | CompanyInfo        | Company information    |
| `/settings`            | Settings           | Settings               |
| `/login`               | Login              | Authentication         |

## 📚 Available Composables

### useForm

Form state and validation management.

```javascript
import { useForm } from "@/composables/useForm";

const { form, errors, setField, setError, hasErrors, reset } = useForm({
  name: "",
  email: "",
});
```

### useLoading

Loading state management.

```javascript
import { useLoading } from "@/composables/useLoading";

const { isLoading, error, startLoading, stopLoading, setError } = useLoading();
```

### useDataTable

Pagination, search, and filtering.

```javascript
import {
  usePagination,
  useSearch,
  useFilter,
} from "@/composables/useDataTable";
```

## 🔌 API Services

### Available Services

Located in `src/services/index.js`:

- `employeeService` - Employee CRUD operations
- `attendanceService` - Attendance tracking
- `payrollService` - Payroll operations
- `departmentService` - Department operations

### API Client

Configured in `src/services/api.js` with:

- Axios instance
- Request/response interceptors
- Error handling
- Token authentication

## 🎯 Common Tasks

### Adding a New Page

1. Create component in `src/pages/NewPage.vue`
2. Add route to `src/router/index.js`
3. Add navigation item in `src/components/layout/Sidebar.vue`

### Creating a Reusable Component

1. Create component in `src/components/common/MyComponent.vue`
2. Use `<script setup>` syntax
3. Define props with types
4. Define emitted events
5. Use Tailwind classes for styling

### Making an API Call

```javascript
import { employeeService } from "@/services";

const fetchEmployees = async () => {
  try {
    const response = await employeeService.getAll();
    employees.value = response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};
```

### Managing State with Pinia

```javascript
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMyStore = defineStore("myStore", () => {
  const items = ref([]);

  const addItem = (item) => {
    items.value.push(item);
  };

  return { items, addItem };
});
```

## ✅ Best Practices

1. **Component Naming** - Use PascalCase for components
2. **File Organization** - Keep related files together
3. **Props Validation** - Always validate props
4. **Error Handling** - Handle errors gracefully
5. **Performance** - Use computed() for derived state
6. **Accessibility** - Add ARIA labels and roles
7. **Documentation** - Comment complex logic
8. **Testing** - Write tests for services and utilities

## 🐛 Troubleshooting

### Port Already in Use

```bash
npm run dev -- --port 5174
```

### Module Not Found

- Check file path and spelling
- Verify imports use correct relative paths
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Tailwind Styles Not Applied

- Check class names are spelled correctly
- Verify classes are in `tailwind.config.js` content paths
- Rebuild: `npm run dev`

### API Errors

- Check API base URL in environment
- Verify server is running
- Check network tab in browser DevTools

## 📞 Support & Resources

- **Vue 3 Docs**: https://vuejs.org
- **Tailwind CSS**: https://tailwindcss.com
- **Vite Docs**: https://vitejs.dev
- **Pinia**: https://pinia.vuejs.org
- **Vue Router**: https://router.vuejs.org

## 📝 License

MIT License - See LICENSE file for details

---

**Last Updated**: December 9, 2025
