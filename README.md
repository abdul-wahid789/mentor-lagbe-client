# Mentor Lagbe

## Short Description

Mentor Lagbe is a full-stack tuition and mentorship marketplace web application built to connect students, tutors, and administrators in one streamlined platform. Designed with a decoupled architecture, it pairs a responsive Next.js (App Router) frontend with a serverless Express.js and MongoDB backend. The platform enables tutors to publish and manage tuition listings, students to discover approved tuitions, apply, and leave feedback, and admins to moderate listings, manage users, and track Stripe subscription transactions. It features JWT-backed authentication, role-based dashboards, validated forms, and accessible UI components for a modern, seamless user experience.

- **Live Demo:** [mentor-lagbe-client-ashen.vercel.app](https://mentor-lagbe-client-ashen.vercel.app/)
- **Backend API:** [mentor-lagbe-server-ruddy.vercel.app](https://mentor-lagbe-server-ruddy.vercel.app/)

---

## Key Features

- **Secure Authentication & Social Login**
  Implemented a secure authentication flow using **Better Auth** with the MongoDB adapter and **JWT** plugins (`jwt` / `jwtClient`). Supports traditional Email/Password credentials alongside seamless **Google Social Login**, complete with role selection (`student` / `tutor`) and profile photo uploads.

- **Role-Based Dashboards (Student, Tutor & Admin)**
  Dedicated workspaces tailored to each user role:
  - **Students** can browse approved tuitions, bookmark listings, submit applications with preferred schedules, track application statuses, and submit tuition ratings and feedback.
  - **Tutors** can post new tuition listings, manage active posts, and review, accept, or reject incoming student applicants.
  - **Admins** can oversee all platform users, approve or reject pending tuition submissions with rejection notes, and monitor payment transactions.

- **Smart Route Protection (Next.js Proxy)**
  Utilizes a custom Next.js request proxy (`src/proxy.ts`) to guard protected routes (`/dashboard/:path*` and `/payment/:path*`). It verifies Better Auth session cookies before rendering and smoothly redirects unauthenticated users to `/login` with a preserved `callbackUrl`.

- **Stripe Subscription & Checkout Integration**
  Integrated **Stripe** checkout for upgrading from Free to **Pro Student** or **Pro Tutor** memberships (unlocking unlimited tuition posts for tutors and Pro benefits), complete with dedicated checkout, success, and cancel flows as well as transaction history tracking.

- **Image Uploads via ImgBB**
  Supports validated profile avatar and tuition banner uploads (JPG, PNG, WebP, GIF up to 5 MB) processed and hosted via the **ImgBB API**, keeping the database lightweight while serving fast external images.

- **Polished UI/UX with Shadcn & Tailwind CSS**
  Crafted with **Tailwind CSS v4**, **Shadcn UI** (`@base-ui/react` primitives), **Lucide React**, and **next-themes** for dark/light mode support, responsive sidebars, interactive dialogs/selects, **Sonner** toast notifications, and skeleton loading states.

- **Validated Form Handling**
  Forms across authentication, tuition creation, applications, and profile updates use **React Hook Form** with **Zod** (`@hookform/resolvers`) for strict client-side validation, clear field error states, and reliable API payloads.

---

## Technologies Used

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI (`@base-ui/react`), Lucide React, React Icons
- **Form Management & Validation:** React Hook Form, Zod, `@hookform/resolvers`
- **Notifications & Theming:** Sonner, `next-themes`
- **Payments:** Stripe (`@stripe/stripe-js`, `stripe`)

### Backend & Database
- **Framework:** Express.js (Serverless deployment on Vercel)
- **Database:** MongoDB (Atlas)
- **Image Hosting:** ImgBB API

### Authentication & Security
- **Auth Provider:** Better Auth (Email/Password credentials, Google OAuth, `@better-auth/mongo-adapter`)
- **Token Management:** Better Auth JWT plugin (`jwt` & `jwtClient`)
- **Security:** Next.js Route Proxy (`src/proxy.ts`), role-based session guards, CORS protection

---

## Getting Started

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the project root with your MongoDB, Better Auth, Google OAuth, ImgBB, Stripe, and backend API keys.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000).
