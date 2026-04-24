# SnippifyX

> A modern, full-stack code snippet manager — save, organize, and share your code snippets beautifully.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-snippify--x.vercel.app-blue?style=flat-square&logo=vercel)](https://snippify-x.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## About

**SnippifyX** is a full-featured web application that lets developers save, manage, and share code snippets. Whether you want to keep your go-to code patterns private or share useful utilities with the community, SnippifyX has you covered.

**[🔗 Live Demo → https://snippify-x.vercel.app/](https://snippify-x.vercel.app/)**

---

## Features

- **Authentication** — Email/password and Google OAuth sign-in via Firebase
- **Snippet Management** — Create, edit, delete, and search your snippets
- **Folder Organization** — Group snippets into color-coded folders
- **Tagging System** — Add custom tags for easy categorization and filtering
- **Public Sharing** — Make snippets public and share them with the community
- **Like System** — Like and engage with other developers' public snippets
- **Real-time Notifications** — Instant alerts for likes and activity
- **Admin Panel** — Manage users, snippets, folders, and system settings
- **Responsive Design** — Fully optimized for desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, Radix UI |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| File Storage | Firebase Storage |
| Realtime | Firebase Realtime Database |
| Form Handling | React Hook Form + Zod |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Firebase](https://console.firebase.google.com/) project with the following enabled:
  - Authentication (Email/Password + Google)
  - Firestore Database
  - Storage

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ranayasir-90/snippifyX.git
   cd snippifyX
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (see below)

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root of the project and add the following:

```env
# Firebase Client-side Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com

# Firebase Admin SDK (Server-side only)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your-service-account@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> **Note:** Never commit your `.env.local` file. It is already listed in `.gitignore`.

---

## Usage

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/login` | Sign in to your account |
| `/signup` | Create a new account |
| `/dashboard` | Your personal snippet dashboard |
| `/snippets/new` | Create a new snippet |
| `/snippets/:id/edit` | Edit an existing snippet |
| `/folders` | Manage your folders |
| `/tags` | Manage your tags |
| `/public` | Browse all public snippets |
| `/admin` | Admin panel (admin users only) |

---

## Project Structure

```
snippifyX/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── dashboard/       # User dashboard page
│   │   ├── snippets/        # Snippet create/edit pages
│   │   ├── folders/         # Folder management
│   │   ├── admin/           # Admin panel pages
│   │   ├── login/           # Authentication pages
│   │   └── ...
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI primitives
│   │   └── ...
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── NotificationContext.tsx
│   ├── layouts/             # Shared page layouts
│   ├── lib/                 # Firebase config and service functions
│   └── hooks/               # Custom React hooks
├── .env.local               # Environment variables (not committed)
├── .gitignore
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Push your code to GitHub.
2. Import the repository on [Vercel](https://vercel.com/).
3. Add all environment variables from `.env.local` in the Vercel project settings.
4. Click **Deploy**.
5. After deployment, add your Vercel domain to Firebase **Authorized Domains**:
   - Firebase Console → Authentication → Settings → Authorized domains → Add domain

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing code style and passes linting before submitting.

---

<<<<<<< Updated upstream

=======
## License

Distributed under the [MIT License](LICENSE).

---

>>>>>>> Stashed changes
> Built by [Rana Yasir](https://github.com/ranayasir-90) · [Live Demo](https://snippify-x.vercel.app/) · [Report an Issue](https://github.com/ranayasir-90/snippifyX/issues)
