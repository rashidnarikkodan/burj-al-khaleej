<div align="center">
  <img src="https://via.placeholder.com/150x150.png?text=Burj+Al+Khaleej" alt="Burj Al Khaleej Logo" width="120" height="120" />

  # Burj Al Khaleej Bakery
  
  **A production-grade bakery management system & customer portal.**

  [![React](https://img.shields.io/badge/React-19.2-blue.svg?style=for-the-badge&logo=react)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
  [![Firebase](https://img.shields.io/badge/Firebase-12.1-FFCA28.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.3-black.svg?style=for-the-badge&logo=framer)](https://www.framer.com/motion)

  [Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Configuration](#environment-variables) • [Firebase Setup](#firebase-setup)
</div>

<br/>

## 📋 Overview
Burj Al Khaleej is a modern, responsive web application designed for a premium bakery. It features a stunning public-facing landing page and product menu, powered by a secure, real-time admin dashboard for managing inventory, categories, and media assets.

---

## ✨ Features
### Customer Portal
- **Immersive UI/UX**: Stunning hero section, dynamic category highlights, and micro-animations.
- **Real-Time Menu**: Dynamic product listing with instant category filtering.
- **Optimized Assets**: Ultra-fast image delivery via Cloudinary integration.
- **Responsive Design**: Flawless experience across mobile, tablet, and desktop devices.

### Admin Dashboard
- **Secure Authentication**: Protected routes and role-based access control via Firebase Auth.
- **Inventory Management**: Create, read, update, and delete (CRUD) operations for products and categories.
- **Media Uploads**: Seamless, authenticated image uploads directly to Cloudinary.

---

## 🛠 Tech Stack

| Category | Technologies |
| --- | --- |
| **Frontend Framework** | React 19, Vite 8 |
| **Routing** | React Router v7 |
| **Styling & UI** | Tailwind CSS v4, Lucide React, clsx, tailwind-merge |
| **Animations** | Framer Motion v12 |
| **State & Data Fetching** | TanStack React Query v5 |
| **Backend & Database** | Firebase v12 (Auth, Firestore) |
| **Storage & CDN** | Cloudinary |
| **Package Manager** | pnpm |

---

## 📂 Project Structure

```text
burj-al-khaleej/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks (React Query, etc.)
│   ├── pages/              # Application routes/pages
│   ├── services/           # Firebase & Cloudinary API clients
│   ├── store/              # Global state management
│   ├── types/              # TypeScript definitions (if applicable)
│   ├── utils/              # Helper functions
│   ├── App.jsx             # Root application component
│   └── main.jsx            # Application entry point
├── .env.example            # Environment variables template
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.ts          # Vite configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or newer)
- **pnpm** installed globally (`npm install -g pnpm`)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-org/burj-al-khaleej.git
cd burj-al-khaleej
pnpm install
```

### 3. Environment Variables
Copy the example environment file and fill in your credentials:
```bash
cp .env.example .env
```
Required variables typically include:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

---

## 🔥 Firebase Setup

1. **Create a Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Enable Services**: 
   - Enable **Authentication** (Email/Password provider).
   - Enable **Firestore Database**.
3. **Deploy Security Rules**: Apply the following rules to secure your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Public read for products and categories
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only manageable via Firebase Console or Admin SDK
    }
  }
}
```

### Admin Access
To grant a user admin privileges:
1. Register the user via the application or Firebase Auth console.
2. In the Firestore database, manually create a `users` collection.
3. Create a document with the Document ID matching the user's `UID`.
4. Add the field: `role: "admin"`.

---

## ☁️ Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/).
2. Go to **Settings > Upload** and create an **Unsigned Upload Preset**.
3. Copy the Cloud Name and Upload Preset into your `.env` file.

---

## 💻 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the development server with Hot Module Replacement (HMR). |
| `pnpm build` | Builds the app for production to the `dist` folder. |
| `pnpm preview` | Serves the production build locally for testing. |
| `pnpm lint` | Runs ESLint to check for code quality and style issues. |

---

## 🌍 Deployment

This application is optimized for zero-config deployments on modern edge platforms.

### Vercel / Netlify
1. Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the project into Vercel or Netlify.
3. The build settings should automatically be detected:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
4. Add all environment variables from your `.env` file into the deployment dashboard.
5. Deploy!

---

<div align="center">
  <p>Crafted with ❤️ for <b>Burj Al Khaleej</b>.</p>
</div>
