# DevLog - Premium Developer Tracker

DevLog is a premium, highly interactive tracking application designed for developers to log their daily learning, manage side projects, and curate useful resources. It features a responsive glassmorphic UI, dynamic light/dark mode, and robust authentication.

site is live at-https://devlog-aslxdfp5t-samithspalans-projects.vercel.app/log

## 🚀 Setup Instructions (Local Development)

To run this project locally, ensure you have **Node.js** (v18+) installed and follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd DevLog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your connection strings:
   ```env
   # PostgreSQL Connection (Neon Serverless)
   DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"
   
   # Clerk Authentication Keys
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   ```

4. **Initialize the Database:**
   Push the Prisma schema to your PostgreSQL database and generate the client.
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛠️ Tech Choices & Architecture

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS v4 + Shadcn UI
* **Animations:** Framer Motion
* **Authentication:** Clerk (@clerk/nextjs)

### 🗄️ Database & ORM Selection

**👉 Option A (Neon + Prisma):**
* **Database (Neon Serverless PostgreSQL):** Migrated to Neon Postgres as it pairs perfectly with Next.js, scaling automatically and handling thousands of concurrent connections effortlessly.
* **ORM (Prisma):** Chosen for its unparalleled developer experience and type safety, ensuring robust and reliable database operations.

---

## 🤖 AI Tools Used


* **ChatGPT (OpenAI):** Used for initial project ideation, brainstorming the database schema, and writing the copy for empty states.
* **GitHub Copilot:** Used extensively inside the IDE for inline code autocompletion, scaffolding repetitive UI components, and generating TypeScript interfaces.

---

## 🚧 Known Bugs & Limitations


* **Internet Dependency:** Because this application uses Clerk and a cloud Postgres provider, it cannot authenticate or fetch data while entirely offline.
* **Tailwind v4 Linting Warnings:** Depending on VS Code extensions, you may see occasional "Unknown At Rule" linting warnings in `globals.css` (e.g., `@theme`, `@custom-variant`). This is a cosmetic IDE issue due to the new syntax and does not affect the build.
* **Particle Canvas Performance:** The interactive `<ParticleBackground />` component is optimized using `requestAnimationFrame`, but older mobile devices or low-powered laptops might experience frame drops.
* **Hydration Mismatches:** Occasional console warnings regarding hydration mismatch may appear if browser extensions inject code into the HTML before React attaches.
