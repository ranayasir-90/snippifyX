<div align="center">

# 🚀 SnippifyX

**A modern, blazing-fast content snippet management application.**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

[Features](#-features) • [Installation](#-getting-started) • [Deployment](#-deployment--troubleshooting) • [Contributing](#-contributing)

</div>

---

## ✨ Features

SnippifyX is designed to keep your code organized, accessible, and shareable!

- 🔐 **Authentication**: Secure login/signup with Email/Password & Google OAuth.
- 📝 **Snippet Management**: Create, edit, organize, and share your favorite code snippets.
- 📁 **Folder Organization**: Keep your snippets neat and tidy inside folders.
- 🏷️ **Tagging System**: Add tags for lightning-fast categorization and search.
- 🌍 **Public Sharing**: Show off your brilliant snippets to the community.
- 🛡️ **Admin Panel**: Dedicated dashboard to manage content and system settings.
- 📱 **Responsive Design**: Flawless experience on both desktop and mobile devices!

---

## 🔐 Authentication System

We take security seriously! Our authentication is powered by **Firebase** and includes:

*   **Login Methods**: Email/Password and One-click Google OAuth.
*   **Form Validation**: Real-time validation using Zod schemas.
*   **Visual Feedback**: Beautiful loading states and user-friendly error messages.
*   **Security Features**: 
    * Industry-standard Firebase Auth.
    * Automatic session management.
    * Protected routes for users and admins.

---

## 🛠️ Tech Stack

| Frontend | Styling & UI | Backend & Auth | Utilities |
| :--- | :--- | :--- | :--- |
| Next.js 14 | Tailwind CSS | Firebase Auth | React Hook Form |
| React 18 | Radix UI | Firebase Firestore | Zod Validation |
| TypeScript | React Icons | | |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

*   Node.js 18+
*   npm or yarn
*   A Firebase project ([Create one here](https://console.firebase.google.com/))

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd SnippifyX
```

**2. Install dependencies**
```bash
npm install
# or
yarn install
```

**3. Set up Environment Variables**
Create a `.env.local` file in the root directory and add your Firebase configuration:

```env
# Client-side Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server-side Configuration (Admin)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your-service-account@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```
*(Note: Replace the placeholder values with your actual Firebase project settings!)*

**4. Run the development server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser! 🎉

---

## 🌍 Deployment & Troubleshooting

### Firebase Authorized Domains

For Google authentication to work in production, you **must** add your deployment domain to Firebase's authorized domains:

1. Go to Firebase Console -> Authentication -> Settings -> Authorized domains.
2. Add your domain (e.g., `your-app.railway.app`, `your-app.vercel.app`).

### Common Issues
*   **`auth/unauthorized-domain`**: Ensure your production domain is in the Firebase Authorized Domains list.
*   **Environment Variables**: Double-check that all Firebase variables are properly set in your hosting platform (Vercel, Railway, etc.). Do not include `https://` in the domain fields unless explicitly required by Firebase!

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

<div align="center">
  Made with ❤️ using Next.js & Firebase
</div>
