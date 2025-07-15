# TeamFlow Frontend

A modern, responsive React-based frontend for the TeamFlow project management application. Built with React 19, Vite, Tailwind CSS, and featuring a comprehensive set of project management tools.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**: Secure login/signup with role-based access control
- **Dashboard**: Overview of projects, tasks, and team statistics
- **Project Management**: Create, view, edit, and delete projects
- **Task Management**: Comprehensive task tracking with status updates
- **User Management**: Admin panel for managing team members and roles
- **Profile Management**: User profile viewing and editing

### Technical Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Notifications**: Toast notifications for user feedback
- **Protected Routes**: Role-based route protection
- **JWT Authentication**: Secure token-based authentication
- **Modern UI/UX**: Clean, intuitive interface

### User Roles
- **ROLE_MEMBER**: Basic user with project and task access
- **ROLE_PROJECT_MANAGER**: Can manage projects and users
- **ROLE_ADMIN**: Full system access

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.3
- **Styling**: Tailwind CSS 4.1.11
- **Routing**: React Router DOM 7.6.3
- **HTTP Client**: Axios 1.10.0
- **Notifications**: React Toastify 11.0.5
- **Development**: ESLint, TypeScript types

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- TeamFlow Backend running on `http://localhost:8080`

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to the project directory
cd teamflow-frontend

# Install dependencies
npm install
```

### 2. Environment Setup

The application is configured to connect to the backend at `http://localhost:8080`. Ensure your backend is running before starting the frontend.

### 3. Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
teamflow-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Dashboard.jsx      # Main dashboard view
│   │   ├── Login.jsx          # Authentication component
│   │   ├── Navbar.jsx         # Navigation component
│   │   ├── Profile.jsx        # User profile management
│   │   ├── ProjectList.jsx    # Project listing and management
│   │   ├── ProjectDetails.jsx # Individual project view
│   │   ├── Signup.jsx         # User registration
│   │   ├── TaskList.jsx       # Task listing and management
│   │   ├── TaskDetails.jsx    # Individual task view
│   │   └── UserManagement.jsx # Admin user management
│   ├── api.js             # API service functions
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   ├── index.css          # Global styles
│   └── App.css            # Component-specific styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── eslint.config.js       # ESLint configuration
```

## 🔧 Configuration

### Vite Configuration
The application uses Vite with the following key configurations:

- **React Plugin**: Enables JSX and React features
- **Tailwind Plugin**: Integrates Tailwind CSS
- **Development Proxy**: Routes API calls to backend
- **Port**: Runs on port 5173 by default

### Tailwind CSS
Configured with a custom design system including:
- Dark mode support
- Custom color palette
- Responsive breakpoints
- Custom component styles

## 🔐 Authentication & Authorization

### Authentication Flow
1. User enters credentials on login page
2. Backend validates and returns JWT token
3. Token is stored in localStorage
4. All subsequent requests include the token
5. Automatic token refresh and session management

### Role-Based Access Control
- **Protected Routes**: Components wrapped with role checks
- **Dynamic Navigation**: Menu items based on user permissions
- **API Authorization**: Backend validates user permissions

### User Roles
```javascript
// Available roles
ROLE_MEMBER           // Basic user access
ROLE_PROJECT_MANAGER  // Project and user management
ROLE_ADMIN           // Full system access
```

## 📡 API Integration

### API Service (`src/api.js`)
Centralized API service with the following features:

- **Axios Configuration**: Base URL and headers setup
- **JWT Interceptors**: Automatic token inclusion
- **Error Handling**: 401 redirects and error responses
- **Request/Response Logging**: Debug information

### Available API Endpoints

#### Authentication
```javascript
login(username, password)           // User login
signup(username, email, password)   // User registration
```

#### Users
```javascript
getUsers(page, size)                // Get paginated users
getUser(id)                         // Get specific user
getCurrentUser()                    // Get current user
createUser(userData)                // Create new user
updateUser(id, userData)            // Update user
updateUserRoles(id, roles)          // Update user roles
deleteUser(id)                      // Delete user
```

#### Projects
```javascript
getProjects(page, size, sort)       // Get paginated projects
getProject(id)                      // Get specific project
createProject(projectData)          // Create new project
updateProject(id, projectData)      // Update project
deleteProject(id)                   // Delete project
```

#### Tasks
```javascript
getTasks(page, size, filters)       // Get paginated tasks
getTask(id)                         // Get specific task
createTask(taskData)                // Create new task
updateTask(id, taskData)            // Update task
updateTaskStatus(id, status)        // Update task status
deleteTask(id)                      // Delete task
```

#### Dashboard
```javascript
getDashboardStats()                 // Get dashboard statistics
getRecentProjects(page, size)       // Get recent projects
getRecentTasks(page, size)          // Get recent tasks
```

## 🎨 UI Components

### Core Components

#### Navigation (`Navbar.jsx`)
- Responsive navigation menu
- Dark mode toggle
- User profile dropdown
- Role-based menu items

#### Dashboard (`Dashboard.jsx`)
- Project and task statistics
- Recent activity feed
- Quick action buttons
- Responsive grid layout

#### Project Management
- **ProjectList.jsx**: Paginated project listing with search and filters
- **ProjectDetails.jsx**: Detailed project view with tasks and team

#### Task Management
- **TaskList.jsx**: Comprehensive task listing with filtering and sorting
- **TaskDetails.jsx**: Detailed task view with comments and updates

#### User Management
- **UserManagement.jsx**: Admin panel for user management
- **Profile.jsx**: User profile viewing and editing

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: Theme switching with localStorage persistence
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable styled components

## 🔄 State Management

### Local State
- User authentication state
- Dark mode preference
- Loading states
- Form data

### Data Flow
1. **API Calls**: Centralized in `api.js`
2. **Component State**: Local React state
3. **Local Storage**: User preferences and tokens
4. **Route Protection**: Role-based access control

## 🚨 Error Handling

### API Error Handling
- **401 Unauthorized**: Automatic logout and redirect
- **Network Errors**: User-friendly error messages
- **Validation Errors**: Form-specific error display

### User Feedback
- **Toast Notifications**: Success, error, and info messages
- **Loading States**: Skeleton loaders and spinners
- **Error Boundaries**: Graceful error handling

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Workflow
1. **Hot Reload**: Vite provides instant updates
2. **ESLint**: Code quality and consistency
3. **TypeScript Types**: Better development experience
4. **Proxy Configuration**: Seamless API integration

### Debugging
- **Console Logs**: Debug information in components
- **Network Tab**: API request/response inspection
- **React DevTools**: Component state inspection

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Static Hosting
The built application can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

### Environment Variables
Configure the backend URL for different environments:
```javascript
// In api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/';
```

## 🤝 Contributing

### Code Style
- **ESLint**: Enforced code style
- **Prettier**: Code formatting
- **React Best Practices**: Functional components, hooks

### Git Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📝 API Documentation

### Authentication Endpoints

#### POST /api/auth/signin
Login with username and password.
```javascript
{
  "username": "string",
  "password": "string"
}
```

#### POST /api/auth/signup
Register new user.
```javascript
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": ["ROLE_MEMBER"]
}
```

### User Endpoints

#### GET /api/users
Get paginated users list.
```javascript
// Query parameters
{
  "page": 0,
  "size": 10
}
```

#### GET /api/users/{id}
Get specific user by ID.

#### PUT /api/users/{id}
Update user information.

#### DELETE /api/users/{id}
Delete user.

### Project Endpoints

#### GET /api/projects
Get paginated projects list.
```javascript
// Query parameters
{
  "page": 0,
  "size": 10,
  "sort": "name,asc"
}
```

#### POST /api/projects
Create new project.
```javascript
{
  "name": "string",
  "description": "string",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

### Task Endpoints

#### GET /api/tasks
Get paginated tasks list with filters.
```javascript
// Query parameters
{
  "page": 0,
  "size": 10,
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

#### POST /api/tasks
Create new task.
```javascript
{
  "title": "string",
  "description": "string",
  "priority": "HIGH",
  "status": "TODO",
  "projectId": 1,
  "assigneeId": 1
}
```

## 🔧 Troubleshooting

### Common Issues

#### CORS Errors
- Ensure backend is running on `http://localhost:8080`
- Check proxy configuration in `vite.config.js`

#### Authentication Issues
- Clear localStorage and re-login
- Check token expiration
- Verify backend authentication endpoints

#### Build Errors
- Clear `node_modules` and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

## 📄 License

This project is part of the TeamFlow application suite.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check backend logs
4. Contact the development team

---

**TeamFlow Frontend** - Modern project management interface built with React and Tailwind CSS. 