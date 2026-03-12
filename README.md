# DevLog 📓

DevLog is a Developer Learning Journal & Project Tracker built with the Next.js 15 App Router. It helps developers log their daily learnings, track side-projects from idea to shipped, and bookmark valuable resources, all in one modern dashboard.

## Tech Stack 🚀

This project strictly adheres to the requested modern React stack:

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode, no \`any\`)
- **Styling**: Tailwind CSS & shadcn/ui
- **Database**: SQLite
- **ORM**: Prisma
- **Validation**: Zod (for strictly typed API routes and forms)
- **Forms**: react-hook-form
- **Server State**: React Query (\`@tanstack/react-query\`)
- **Charts**: Recharts (for activity visualizations)

## Features 🌟

1. **Dashboard Overview**: See streaks, stats, top learning topics (Tag Cloud), and activity history.
2. **Learning Log**: Chronological feed of your learnings with rich text, tags, and project associations.
3. **Project Tracker**: Board of projects categorized by status (Idea, Building, Shipped, Paused). Links to logs and external repos.
4. **Resource Bookmarker**: Save helpful links, categorize them, and flag what's read or unread.
5. **REST API**: Next.js Route Handlers power a complete set of RESTful APIs.

## Implementation Details 🛠️

### Next.js API Routes (REST CRUD)
Next.js 15 App Router provides an exceptional way to build standard REST APIs. Inside `src/app/api`, the folders cleanly separate `entries`, `projects`, and `resources` resources. 

Each API endpoint:
- Extracts its HTTP method from the exported function (`GET`, `POST`, `PUT`, `DELETE`).
- Leverages Next.js `NextResponse` for typed JSON responses.
- Catches runtime errors elegantly with `try/catch`. 

### Zod Validation
We use **Zod** in `src/lib/validations.ts` as our single source of truth for schemas. 
- In API `POST` and `PUT` methods, `request.json()` is passed to `.safeParse()`, catching invalid frontend data instantly and returning HTTP 400 with `flatten().fieldErrors`.
- On the Frontend, Zod acts as a resolver for `react-hook-form` via `@hookform/resolvers/zod`. This prevents submission entirely if data is bad, yielding an amazing UX without server roundtrips.
- `z.infer` dynamically generates TypeScript types out of the schema!

### React Query Hooks
State is managed locally but synced with the server using `@tanstack/react-query` inside `src/lib/hooks.ts`. 
- **Querying**: Methods like `useEntries()` call REST GETs and automatically cache the array globally. Refetches happen behind the scenes for stale data.
- **Mutations**: Hook functions like `useCreateEntry()` execute REST POSTs. Upon `onSuccess`, we call `queryClient.invalidateQueries` which silently asks the UI to re-fetch the fresh data, meaning we never have to manage `useEffect` fetching blocks manually!

### Prisma & SQLite Database
Prisma handles our strict relational definitions in `prisma/schema.prisma`. 
- Every database interaction inside `src/app/api` goes through the Prisma Client, providing total TypeScript intellisense.
- **Relationships**: A Project `hasMany` Entries, and Resources attach logically to both using Foreign Keys (`projectId` / `entryId`). 
- **SQLite Note**: Since SQLite doesn't natively support arrays, tags and tech stacks are cleanly parsed/stringified to JSON under the hood. 

### Dashboard Calculations
The backend logic sitting in `/api/dashboard/route.ts` runs complex aggregations completely locally on SQLite. 
- Streaks count by tracking reverse chronological days `date-fns`. 
- Recharts visualizations compute last-8-weeks tallies into array shapes the UI can instantly snap onto a beautiful un-styled bar chart.

## Setup & Running Locally 🏃

1. **Install dependencies**: `npm install`
2. **Generate Database**: `npx prisma generate` followed by `npx prisma db push`
3. **Seed Mock Data**: `npm run prisma:seed` (Optional: seed uses `tsx` to insert realistic test entries)
4. **Start Development**: `npm run dev`

Open `http://localhost:3000` to view DevLog!
