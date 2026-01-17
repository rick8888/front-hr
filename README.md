# Bravo RH - HR Management System

Vue 3 HR Management Admin interface built with Composition API and Tailwind CSS, based on the Figma UI Kit design (Light version).

## 🎯 Features

### Core Modules

- 📊 **Dashboard** - Overview with employee statistics and recent activity
- 👥 **Employee Management** - Manage employee records and profiles
- 📋 **Attendance Tracking** - Track employee check-in/out and attendance
- 💰 **Payroll Management** - Manage salaries and payroll processing
- 🏖️ **Leave Requests** - Manage employee leave applications
- ⭐ **Performance Reviews** - Track employee performance ratings
- 🎓 **Training & Development** - Manage training programs and enrollment
- 🔍 **Recruitment** - Manage job openings and candidate applications
- 🏢 **Departments** - Manage company departments
- 📈 **Reports & Analytics** - Detailed HR analytics and insights
- ℹ️ **Company Info** - Organization details and structure
- ⚙️ **Settings** - System configuration and preferences

## 🛠 Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Composition API** - Logic composition in Vue 3
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── common/         # Reusable components (Button, Input, Card, etc)
│   ├── layout/         # Layout components (Header, Sidebar)
├── pages/              # Page components
├── stores/             # Pinia stores
├── services/           # API services
├── composables/        # Reusable Composition API hooks
├── utils/              # Utility functions
├── config/             # Configuration files
├── assets/             # Static assets and styles
├── router/             # Vue Router configuration
└── App.vue            # Root component
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm or yarn

### Installation

```bash
cd bravo_rh
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🎨 Color Palette (Light Version)

| Color     | Hex     | Usage               |
| --------- | ------- | ------------------- |
| Primary   | #5b99f5 | Main actions, links |
| Secondary | #9333ea | Secondary actions   |
| Success   | #22c55e | Success states      |
| Warning   | #eab308 | Warning states      |
| Error     | #ef4444 | Error states        |
| Info      | #0ea5e9 | Information         |

## 📦 Available Components

### Common Components

- **Button** - Primary, secondary, outline, ghost variants
- **TextInput** - Text input with validation
- **Select** - Dropdown selection
- **TextArea** - Multi-line text input
- **Modal** - Dialog/modal component
- **Badge** - Status/tag badges
- **Toast** - Toast notifications
- **Loading** - Loading indicator
- **ProgressBar** - Progress visualization
- **StatCard** - Statistics display card
- **Table** - Reusable table component

### Layout Components

- **AppLayout** - Main layout wrapper
- **Sidebar** - Navigation sidebar
- **Header** - Top header bar

## 🔌 Composables

- **useForm** - Form state management
- **useLoading** - Loading state management
- **useDataTable** - Pagination, search, filter
- **useValidation** - Input validation utilities

## 📊 Available Pages

| Page                | Route                  | Purpose                           |
| ------------------- | ---------------------- | --------------------------------- |
| Dashboard           | `/`                    | Overview and statistics           |
| Employees           | `/employees`           | Employee directory and management |
| Attendance          | `/attendance`          | Daily attendance tracking         |
| Payroll             | `/payroll`             | Salary and payroll management     |
| Leave Requests      | `/leave-requests`      | Leave application management      |
| Performance Reviews | `/performance-reviews` | Employee evaluations              |
| Training            | `/training`            | Training programs                 |
| Recruitment         | `/recruitment`         | Job postings and candidates       |
| Departments         | `/departments`         | Department management             |
| Reports             | `/reports`             | Analytics and reports             |
| Company Info        | `/company-info`        | Organization information          |
| Settings            | `/settings`            | System settings                   |
| Login               | `/login`               | Authentication                    |

## 🔑 Demo Credentials

```
Email: admin@bravorh.com
Password: password123
```

## 📝 Utilities

### Formatters (`src/utils/formatters.js`)

- `formatDate()` - Format dates
- `formatTime()` - Format time
- `formatCurrency()` - Format currency values
- `truncateText()` - Truncate long text

### Validation (`src/utils/validation.js`)

- Email validation
- Phone number validation
- Password strength validation
- Required field validation

### Export (`src/utils/export.js`)

- Export to CSV
- Export to JSON
- Download files
- Copy to clipboard

## 🏗 Services

### API Client (`src/services/api.js`)

- Axios instance with interceptors
- Request/response handling
- Error handling

### Employee Service (`src/services/index.js`)

- Get all employees
- Get employee by ID
- Create/update employee
- Delete employee

### Other Services

- Attendance service
- Payroll service
- Department service

## 💾 State Management

Uses Pinia for state management:

- **authStore** - Authentication state
- Additional stores can be added as needed

## 🔐 Security Features

- JWT token authentication
- API interceptors for token refresh
- Protected routes (can be implemented)
- Input validation
- CORS handling

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop (1920px and above)
- Laptop (1366px - 1920px)
- Tablet (768px - 1365px)
- Mobile (320px - 767px)

## 🎓 Figma Design

Based on: [HR Management Admin - UI Kit](https://www.figma.com/design/hzpeLb1Ij92gFQdQahEjrs/HR-Management-Admin---UI-Kit--Community)

Light theme version with custom components and enhanced functionality.

## 📄 License

MIT

## 👨‍💻 Contributing

To contribute to this project:

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## 📞 Support

For support or issues, please contact: support@bravorh.com

---

**Last Updated:** December 9, 2025
