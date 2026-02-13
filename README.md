# AssetTrackPro

A comprehensive asset management system for tracking and managing company assets efficiently.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## 🎯 Overview

AssetTrackPro is a full-stack web application designed to help organizations track and manage their physical and digital assets. The application provides an intuitive interface for asset registration, tracking, reporting, and analytics.



ERD Diagram

![rfid_erd_full](https://github.com/user-attachments/assets/a3e9b068-51d9-4710-87e4-9b4fef300739)


Use Case Diagram

![rfid_use_case_full](https://github.com/user-attachments/assets/b95281ee-6c4c-411c-a2f4-08ab24d0b276)


Flow Chart

![rfid_flowchart_full](https://github.com/user-attachments/assets/4cb367a9-5aa6-43a9-a500-f5970bc90b2d)




## ✨ Features

- **Asset Management**: Create, read, update, and delete asset records
- **Category Management**: Organize assets by categories
- **Status Tracking**: Monitor asset status (Available, In Use, Maintenance, Retired)
- **Location Tracking**: Track asset location and assignment
- **User Management**: Role-based access control
- **Reporting**: Generate comprehensive asset reports
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📁 Project Structure

```
AssetTrackPro/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   └── database.js    # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   │   └── assetController.js
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── auth.js        # Authentication middleware
│   │   │   └── errorHandler.js
│   │   ├── models/            # Data models
│   │   │   └── Asset.js
│   │   ├── routes/            # API routes
│   │   │   └── assetRoutes.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── helpers.js
│   │   │   └── logger.js
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── .env.example           # Environment variables template
│   ├── .gitignore
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── public/                # Static files
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── components/        # Reusable components
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Header.css
│   │   │   │   └── index.js
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Footer.css
│   │   │   │   └── index.js
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.css
│   │   │   │   └── index.js
│   │   │   └── index.js       # Component exports
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useFetch.js
│   │   │   ├── useForm.js
│   │   │   └── index.js
│   │   ├── pages/             # Page components
│   │   │   ├── Home/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Home.css
│   │   │   │   └── index.js
│   │   │   └── Assets/
│   │   │       ├── Assets.jsx
│   │   │       ├── Assets.css
│   │   │       └── index.js
│   │   ├── services/          # API service layer
│   │   │   ├── api.js         # Axios configuration
│   │   │   └── assetService.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   ├── App.jsx            # Main app component
│   │   ├── App.css
│   │   ├── main.jsx           # Entry point
│   │   └── index.css
│   ├── .env.example           # Environment variables template
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── docs/                       # Documentation
├── presentation/              # Presentation materials
└── README.md                  # This file
```

## 🛠 Technology Stack

### Backend

- **Node.js**: JavaScript runtime (ES Modules)
- **Express.js**: Web application framework
- **Database**: PostgreSQL/MySQL (to be configured)
- **Authentication**: JWT (to be implemented)

### Frontend
- **React**: UI library
- **Vite**: Build tool and development server
- **Axios**: HTTP client for API calls
- **CSS3**: Styling

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Database** (PostgreSQL/MySQL) - optional for now

### Clone the Repository

```bash
git clone https://github.com/kawdoco/AssetTrackPro.git
cd AssetTrackPro
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file by copying the example file:

```bash
copy .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=assettrackpro_dev
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 4. Start the Backend Server

```bash
npm start
```

The backend server will start on `http://localhost:5000`

### Backend Folder Structure Explanation

- **config/**: Contains configuration files for database, environment, etc.
- **controllers/**: Business logic for handling requests
- **middleware/**: Custom middleware for authentication, error handling, etc.
- **models/**: Data models and database schemas
- **routes/**: API endpoint definitions
- **utils/**: Helper functions and utilities
- **app.js**: Express application setup with middleware
- **server.js**: Server initialization and startup

**Note**: The backend uses ES modules (`"type": "module"`), so all imports use `import`/`export` syntax instead of `require`/`module.exports`. Remember to include `.js` extensions in import statements.

## 💻 Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file by copying the example file:

```bash
copy .env.example .env
```

Update the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Frontend Folder Structure Explanation

- **assets/**: Static files like images, fonts, icons
- **components/**: Reusable UI components (Header, Footer, Button, etc.)
- **hooks/**: Custom React hooks for common functionality
- **pages/**: Page-level components (Home, Assets, Reports, etc.)
- **services/**: API service layer for backend communication
- **utils/**: Utility functions and constants
- **App.jsx**: Main application component
- **main.jsx**: Application entry point

## 🔨 Development

### Available Scripts

#### Backend
```bash
npm start          # Start the server
npm run dev        # Start with nodemon (hot reload)
npm test           # Run tests
```

#### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Code Organization Best Practices

1. **Components**: Keep components small and focused on a single responsibility
2. **Hooks**: Extract reusable logic into custom hooks
3. **Services**: Keep all API calls in service files
4. **Constants**: Define constants in utils/constants.js
5. **Styling**: Use component-level CSS files for better organization

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Assets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/assets` | Get all assets |
| GET    | `/assets/:id` | Get asset by ID |
| POST   | `/assets` | Create new asset |
| PUT    | `/assets/:id` | Update asset |
| DELETE | `/assets/:id` | Delete asset |

### Example Request

```javascript
// Get all assets
GET /api/assets

// Response
{
  "success": true,
  "message": "Assets retrieved successfully",
  "data": [...]
}
```

## 🤝 Contributing

### Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request

### Coding Standards

- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation when needed

## 📝 TODO

- [ ] Implement database integration
- [ ] Add authentication and authorization
- [ ] Create user management system
- [ ] Implement search and filtering
- [ ] Add data export functionality
- [ ] Create detailed reports and analytics
- [ ] Add file upload for asset images
- [ ] Implement email notifications
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

For questions or support, please contact the development team.

---

**Happy Coding! 🚀**




