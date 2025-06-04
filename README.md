# Socially

**Socially** is a modern X/Twitter clone built with Next.js 15, delivering a minimalist microblogging experience. Users can create image posts via uploadthing, like posts, and get notifications for followers, likes, and comments. It features TailwindCSS and shadcn/ui for a responsive UI, Clerk for authentication, Next.js API Routes for backend logic, and PostgreSQL on Neon with Prisma ORM for type-safe data. Socially prioritizes user engagement and performance.

## Tech Stack 🛠️

- **Frontend**:
  - Next.js 15
  - TailwindCSS
  - shadcn/ui (for beautiful, reusable components)
- **Backend**:
  - Next.js API Routes
  - Clerk (authentication)
- **Database**:
  - PostgreSQL (hosted on Neon)
  - Prisma ORM (type-safe database interactions)
- **Media Storage**:
  - uploadthing

---

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- [PostgreSQL](https://console.neon.tech/app/projects) database
- [Clerk](https://clerk.com/) account
- [Uploadthing](https://uploadthing.com/) account

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/socially.git
   cd socially
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
    # Clerk AUTH
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=

    # Neon database
    DATABASE_URL=

    # Uploadthing
    UPLOADTHING_TOKEN=
   ```
4. Push database to prisma:
   ```bash
   npx prisma db push
   ```
5. Run development:
   ```bash
   npm run dev
   ```

---

## Screenshots 📸

soon

---

## Live Demo 🌐
[Socially Demo](https://socially-lovat-omega.vercel.app/)