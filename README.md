# Burj Al Khaleej Bakery Web Application

A production-grade bakery management system built with React, Firebase, and Cloudinary.

## Features

- **Public Landing Page**: Stunning hero section, category highlights, and contact information.
- **Dynamic Menu**: Real-time product listing with category filtering and OMR pricing.
- **Admin Dashboard**: Secure management of products and categories.
- **Image Management**: seamless integration with Cloudinary for optimized image hosting.
- **Responsive Design**: Fully mobile-optimized using Tailwind CSS and Framer Motion.

## Tech Stack

- **Frontend**: React 19 (Vite)
- **State Management**: React Query (TanStack)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Backend**: Firebase Auth & Firestore
- **Storage**: Cloudinary

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- pnpm (`npm install -g pnpm`)

### 2. Environment Configuration
Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Fill in your Firebase and Cloudinary credentials:
- **Firebase**: Create a project at [firebase.google.com](https://console.firebase.google.com/) and enable Auth (Email/Password) and Firestore.
- **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com/) and create an unsigned upload preset.

### 3. Firebase Security Rules
Deploy these rules to your Firestore:

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

### 4. Admin Setup
To grant a user admin access:
1. Register the user via the Firebase Console or the app (if registration is enabled).
2. Manually create a document in the `users` collection in Firestore:
   - **Document ID**: The UID of the user.
   - **Fields**: `{ role: "admin" }`

### 5. Installation
```bash
pnpm install
```

### 6. Development
```bash
pnpm dev
```

### 7. Production Build
```bash
pnpm build
```

## Deployment
This app is ready for deployment on **Vercel** or **Netlify**. Ensure you add the environment variables in your deployment dashboard.

---

Crafted with ❤️ for **Burj Al Khaleej**.
# burj-al-khaleej
