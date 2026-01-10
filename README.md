# Tender Management Application

A web application for managing tenders with drag-and-drop kanban board, authentication, and product & vendor management.

## 📋 Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Tender Status](#tender-status)
- [Available Scripts](#available-scripts)
- [Building for Production](#building-for-production)

## 📝 Description

This application is a tender management system that allows users to:

- Login and authenticate with JWT tokens
- View tender lists in kanban board format
- Create new tenders with multi-step forms
- Manage products and vendors for each tender
- Move tenders between statuses with drag-and-drop

## ✨ Features

### Authentication

- Login with username and password
- JWT token management (access token & refresh token)
- Auto logout when token expires
- Protected routes

### Dashboard

- Kanban board with 3 status columns (Draft, On Going, Completed)
- Drag and drop to move tenders between statuses
- Summary cards for tender statistics
- Sorting options for tenders
- User dropdown with logout

### Create Tender

- Multi-step form with 4 stages:
  1. **General Information**: Tender name, date, requester, description
  2. **Products**: Add and manage products
  3. **Vendors**: Select vendors from list
  4. **Overview**: Review and start tender
- Form validation
- Auto-format date to ISO 8601

## 🛠 Tech Stack

### Core

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool & dev server

### State Management

- **Zustand 5.0.9** - Lightweight state management

### Routing

- **React Router DOM 7.12.0** - Client-side routing

### UI & Styling

- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Lucide React 0.562.0** - Icon library

### Drag & Drop

- **@dnd-kit/core 6.3.1** - Drag and drop core
- **@dnd-kit/sortable 10.0.0** - Sortable components

### HTTP Client

- **Fetch API** - Native browser API (custom wrapper)

## 📦 Prerequisites

Before getting started, make sure you have installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**

To check Node.js version:

```bash
node --version
npm --version
```

## 🚀 Installation

1. **Clone repository** (if using git):

```bash
git clone <repository-url>
cd tender-app
```

2. **Install dependencies**:

```bash
npm install
```

or if using yarn:

```bash
yarn install
```

or if using pnpm:

```bash
pnpm install
```

## 🔐 Environment Variables

Create a `.env` file in the project root with the following configuration:

```env
VITE_API_BASE_URL=https://vendortest.siloamhospitals.com/tender/api
```

**Note:**

- The `.env` file is not committed to the repository (already in `.gitignore`)
- For development, proxy is already configured in `vite.config.ts`
- In development, all requests to `/api/*` will be proxied to the backend
- In production, use `VITE_API_BASE_URL` for the API base URL

## ▶️ Running the Project

### Development Mode

Run the development server:

```bash
npm run dev
```

The application will run at `http://localhost:5173`

**Development Features:**

- Hot Module Replacement (HMR) - code changes are instantly visible
- Proxy for API requests (avoids CORS)
- Source maps for debugging

### Preview Production Build

To preview the production build locally:

```bash
npm run build
npm run preview
```

### Linting

Check code for errors and warnings:

```bash
npm run lint
```

### Format Code

Format code with Prettier:

```bash
npm run format
```

### Testing

Run the test suite:

```bash
npm test
```

## 📁 Project Structure

```
tender-app/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and assets
│   ├── components/        # React components
│   │   ├── create-tender/ # Components for create tender
│   │   ├── dashboard/     # Dashboard components
│   │   ├── form/         # Form components
│   │   ├── layout/       # Layout components
│   │   └── tender/       # Tender-related components
│   ├── constants/         # Constants
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables (create yourself)
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔌 API Endpoints

### Authentication

- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh-token` - Refresh access token

### Tender

- `GET /tender/all` - Get all tenders
- `POST /tender/create` - Create new tender
- `POST /tender/product/create/:tenderId` - Create product for tender

### Vendor

- `GET /vendor/options` - Get vendor options list

## 🔄 Authentication Flow

1. User logs in with username and password
2. Backend returns `accessToken`, `refreshToken`, and `user` object
3. Tokens are stored in `localStorage` and Zustand store
4. Every API request automatically adds `Authorization: Bearer {token}` header
5. If token expires (401), user is automatically logged out
6. Refresh token can be used to get a new access token

## 📊 Tender Status

Tenders have 3 statuses represented by numbers:

- **1 = Draft** - Newly created tender, not started yet
- **2 = On Going** - Tender is currently running
- **3 = Completed** - Tender is finished

**Note:**

- Newly created tenders automatically have status **1 (Draft)**
- Status can be changed by drag-and-drop on the kanban board
- Status mapping: `1 → 'draft'`, `2 → 'ongoing'`, `3 → 'completed'`

## 📜 Available Scripts

### `npm run dev`

Run the development server with HMR

### `npm run build`

Build the application for production

- Output: `dist/` folder
- Optimized and minified

### `npm run preview`

Preview production build locally

### `npm run lint`

Check code with ESLint

### `npm run format`

Format code with Prettier

### `npm test`

Run test suite with Vitest

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---
