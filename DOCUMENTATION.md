# TeamFlow Frontend - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Component Architecture](#component-architecture)
3. [State Management](#state-management)
4. [API Integration](#api-integration)
5. [Routing & Navigation](#routing--navigation)
6. [Authentication System](#authentication-system)
7. [Styling & UI](#styling--ui)
8. [Error Handling](#error-handling)
9. [Performance Optimization](#performance-optimization)
10. [Testing Strategy](#testing-strategy)
11. [Development Guidelines](#development-guidelines)

## Architecture Overview

### Technology Stack
- **React 19.1.0**: Latest React with concurrent features
- **Vite 7.0.3**: Fast build tool with HMR
- **Tailwind CSS 4.1.11**: Utility-first CSS framework
- **React Router DOM 7.6.3**: Client-side routing
- **Axios 1.10.0**: HTTP client for API calls
- **React Toastify 11.0.5**: Toast notifications

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.jsx   # Main dashboard view
│   ├── Login.jsx       # Authentication form
│   ├── Navbar.jsx      # Navigation component
│   ├── Profile.jsx     # User profile management
│   ├── ProjectList.jsx # Project listing
│   ├── ProjectDetails.jsx # Project details view
│   ├── Signup.jsx      # User registration
│   ├── TaskList.jsx    # Task listing
│   ├── TaskDetails.jsx # Task details view
│   └── UserManagement.jsx # Admin user management
├── api.js              # API service layer
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
├── index.css           # Global styles
└── App.css             # Component styles
```

## Component Architecture

### Component Hierarchy
```
App.jsx
├── Navbar.jsx
├── Routes
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── ProjectList.jsx
│   ├── ProjectDetails.jsx
│   ├── TaskList.jsx
│   ├── TaskDetails.jsx
│   ├── UserManagement.jsx
│   └── Profile.jsx
└── ToastContainer
```

### Component Patterns

#### Functional Components with Hooks
All components use functional components with React hooks for state management:

```javascript
import { useState, useEffect } from 'react';

const ComponentName = ({ props }) => {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return (
    // JSX
  );
};
```

#### Protected Route Pattern
```javascript
const ProtectedRoute = ({ children, user, requiredRole = null }) => {
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && !user.roles.includes(requiredRole)) {
    toast.error('Access denied');
    return <Navigate to="/dashboard" />;
  }
  return children;
};
```

### Key Components

#### App.jsx
- **Purpose**: Main application component with routing and global state
- **Key Features**:
  - User authentication state management
  - Dark mode toggle
  - Protected route implementation
  - Global error handling

#### Dashboard.jsx
- **Purpose**: Main dashboard with statistics and recent activity
- **Features**:
  - Project and task statistics
  - Recent projects and tasks
  - Quick action buttons
  - Responsive grid layout

#### UserManagement.jsx
- **Purpose**: Admin panel for user management
- **Features**:
  - Paginated user listing
  - User creation and editing
  - Role management
  - Search and filtering

## State Management

### Local State Strategy
The application uses React's built-in state management with the following patterns:

#### User Authentication State
```javascript
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
```

#### Form State Management
```javascript
const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: ''
});

const handleInputChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
```

#### Loading States
```javascript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
```

### Data Persistence
- **localStorage**: User tokens and preferences
- **Session Management**: Automatic token refresh
- **Dark Mode**: Persistent theme preference

## API Integration

### API Service Layer (`api.js`)

#### Axios Configuration
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### JWT Interceptors
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Error Handling
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Functions

#### Authentication
```javascript
export const login = (username, password) =>
  api.post('/auth/signin', { username, password });

export const signup = (username, email, password, role = ['member']) =>
  api.post('/auth/signup', { username, email, password, role });
```

#### Data Fetching
```javascript
export const getUsers = (page = 0, size = 10) =>
  api.get(`/users?page=${page}&size=${size}`);

export const getProjects = (page = 0, size = 10, sort = 'name,asc') =>
  api.get(`/projects?page=${page}&size=${size}&sort=${sort}`);
```

## Routing & Navigation

### Route Configuration
```javascript
<Routes>
  <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
  <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
  <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} />
  <Route path="/projects" element={<ProtectedRoute user={user}><ProjectList user={user} /></ProtectedRoute>} />
  <Route path="/projects/:id" element={<ProtectedRoute user={user}><ProjectDetails user={user} /></ProtectedRoute>} />
  <Route path="/tasks" element={<ProtectedRoute user={user}><TaskList user={user} /></ProtectedRoute>} />
  <Route path="/tasks/:id" element={<ProtectedRoute user={user}><TaskDetails user={user} /></ProtectedRoute>} />
  <Route path="/users" element={<ProtectedRoute user={user} requiredRole="ROLE_PROJECT_MANAGER"><UserManagement /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} /></ProtectedRoute>} />
  <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
</Routes>
```

### Navigation Component
- **Responsive Design**: Mobile-first navigation
- **Role-based Menu**: Dynamic menu items based on user roles
- **Dark Mode Toggle**: Theme switching functionality
- **User Profile**: Dropdown with user information

## Authentication System

### Authentication Flow
1. **Login Process**:
   ```javascript
   const handleLogin = async (username, password) => {
     try {
       const response = await login(username, password);
       localStorage.setItem('token', response.data.token);
       setUser({
         id: response.data.id,
         username: response.data.username,
         roles: response.data.roles,
       });
       toast.success('Logged in successfully!');
     } catch (error) {
       toast.error('Login failed: Invalid credentials');
     }
   };
   ```

2. **Token Management**:
   - Automatic token inclusion in requests
   - Token expiration handling
   - Automatic logout on 401 errors

3. **Session Persistence**:
   - Token stored in localStorage
   - User data cached for offline access
   - Automatic session restoration

### Role-Based Access Control
```javascript
const hasPermission = (user, requiredRole) => {
  return user && user.roles && user.roles.includes(requiredRole);
};
```

## Styling & UI

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... custom color palette
        }
      }
    }
  }
}
```

### Dark Mode Implementation
```javascript
const [isDarkMode, setIsDarkMode] = useState(() => {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) {
    return JSON.parse(saved);
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
});

useEffect(() => {
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
}, [isDarkMode]);
```

### Responsive Design
- **Mobile-first**: Base styles for mobile devices
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Flexible Layouts**: Grid and flexbox for responsive layouts
- **Touch-friendly**: Appropriate touch targets for mobile

## Error Handling

### API Error Handling
```javascript
try {
  const response = await apiCall();
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 404) {
    // Handle not found
  } else {
    // Handle general errors
    toast.error('An error occurred. Please try again.');
  }
}
```

### User Feedback
- **Toast Notifications**: Success, error, and info messages
- **Loading States**: Skeleton loaders and spinners
- **Form Validation**: Real-time validation feedback
- **Error Boundaries**: Graceful error handling

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'true');

// Debug logging in components
if (localStorage.getItem('debug') === 'true') {
  console.log('Debug info:', data);
}
```

## Performance Optimization

### Code Splitting
- **Route-based**: Each route loads independently
- **Component-based**: Large components can be lazy loaded
- **Bundle Analysis**: Monitor bundle size

### React Optimization
- **useMemo**: Memoize expensive calculations
- **useCallback**: Prevent unnecessary re-renders
- **React.memo**: Memoize components
- **Lazy Loading**: Load components on demand

### API Optimization
- **Pagination**: Load data in chunks
- **Caching**: Cache API responses
- **Debouncing**: Limit API calls for search
- **Error Retry**: Retry failed requests

## Testing Strategy

### Unit Testing
- **Component Testing**: Test individual components
- **Hook Testing**: Test custom hooks
- **Utility Testing**: Test helper functions

### Integration Testing
- **API Integration**: Test API calls
- **User Flows**: Test complete user journeys
- **Error Scenarios**: Test error handling

### E2E Testing
- **User Scenarios**: Test complete workflows
- **Cross-browser**: Test in multiple browsers
- **Performance**: Test loading times

## Development Guidelines

### Code Style
- **ESLint**: Enforced code style
- **Prettier**: Code formatting
- **React Best Practices**: Functional components, hooks

### Component Guidelines
```javascript
// Component structure
const ComponentName = ({ prop1, prop2, children }) => {
  // 1. State declarations
  const [state, setState] = useState(initialState);
  
  // 2. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // 3. Event handlers
  const handleEvent = () => {
    // Event logic
  };
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Naming Conventions
- **Components**: PascalCase (e.g., `UserManagement`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Functions**: camelCase

### File Organization
- **Components**: One component per file
- **Hooks**: Custom hooks in separate files
- **Utilities**: Helper functions in utils folder
- **Types**: TypeScript types in types folder

### Git Workflow
1. **Feature Branches**: Create branch for each feature
2. **Commit Messages**: Use conventional commits
3. **Pull Requests**: Review before merging
4. **Testing**: Ensure all tests pass

### Debugging Tips
- **React DevTools**: Use for component inspection
- **Network Tab**: Monitor API calls
- **Console Logs**: Strategic logging for debugging
- **Error Boundaries**: Catch and handle errors gracefully

---

This documentation provides a comprehensive overview of the TeamFlow frontend architecture and development guidelines. For specific implementation details, refer to the individual component files and API documentation. 