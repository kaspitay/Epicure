# Epicure

A modern recipe sharing platform where food enthusiasts can discover, save, and share culinary creations.

**Live Demo:** https://epicure-sjia.onrender.com

![CI](https://github.com/kaspitay/Epicure/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)

## Features

- **Recipe Discovery** - Browse recipes by cuisine, meal type, dietary preferences, and more
- **User Profiles** - Create an account as a regular user or content creator (chef)
- **Cookbooks** - Organize saved recipes into personal cookbooks
- **Follow Chefs** - Follow your favorite content creators
- **Advanced Search** - Filter recipes by multiple tags and categories
- **Interactive Recipes** - Track ingredients and steps while cooking
- **Responsive Design** - Optimized for desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API requests
- **Vitest** + React Testing Library for testing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Jest** for testing

## Prerequisites

- Node.js 18+ (or Docker)
- npm or yarn
- MongoDB Atlas account (or local MongoDB / Docker)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/kaspitay/Epicure.git
cd Epicure
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

Create `.env` files in both `backend` and `frontend` directories:

**backend/.env**
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/epicure
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Seed the Database (Optional)

```bash
cd backend
npm run seed-tags
```

## Running the Application

### Development Mode

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Production Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

### Docker (Recommended)

Run the entire stack with one command:

```bash
# Production mode
docker-compose up -d

# Development mode (with hot reload)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Stop all containers
docker-compose down
```

Services:
- **Frontend:** http://localhost (port 80)
- **Backend API:** http://localhost:3000
- **MongoDB:** localhost:27017

## Testing

### Backend Tests
```bash
cd backend
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run tests (watch mode)
npm run test:run         # Run once
npm run test:coverage    # Coverage report
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user/signup` | Register new user |
| POST | `/api/user/login` | User login |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipe` | Get all recipes |
| GET | `/api/recipe/:id` | Get recipe by ID |
| POST | `/api/recipe` | Create new recipe |
| PUT | `/api/recipe/:id` | Update recipe |
| DELETE | `/api/recipe/:id` | Delete recipe |

### Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | Get all tags |
| GET | `/api/tags/category/:category` | Get tags by category |
| GET | `/api/tags/popular` | Get popular tags |
| POST | `/api/tags` | Create new tags |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user` | Get all users |
| GET | `/api/user/:id` | Get user by ID |
| PUT | `/api/user/:id` | Update user |

## Project Structure

```
Epicure/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Entry point
│   ├── __tests__/          # Test files
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/            # API service layer
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── layout/         # Layout components
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript types
│   │   └── main.tsx        # Entry point
│   ├── __tests__/          # Test files
│   └── package.json
│
└── README.md
```

## Tag Categories

Recipes can be tagged with the following categories:

| Category | Examples |
|----------|----------|
| Cuisine | Italian, Mexican, Chinese, Indian, Japanese |
| Meal Type | Breakfast, Lunch, Dinner, Snack, Dessert |
| Dietary | Vegetarian, Vegan, Gluten-Free, Keto |
| Difficulty | Easy, Medium, Advanced |
| Cooking Time | Quick (15 min), Medium (30 min), Long (1h+) |

## Authors

This project was originally developed as a **Computer Science BSc Final Project** at Ben-Gurion University by:

- **Itay Kaspi** - [kaspitay](https://github.com/kaspitay)
- **Tamir Alaluf**
- **Ido Givaty**

Currently maintained and improved by **Itay Kaspi**.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

