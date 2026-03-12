import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Clearing old data...')
    await prisma.resource.deleteMany()
    await prisma.entry.deleteMany()
    await prisma.project.deleteMany()

    console.log('Creating demo projects...')
    const project1 = await prisma.project.create({
        data: {
            name: 'DevLog application',
            description: 'A developer productivity application with Next.js and Prisma.',
            techStack: JSON.stringify(['Next.js', 'React', 'Prisma', 'Tailwind', 'SQLite']),
            tags: JSON.stringify(['frontend', 'backend', 'fullstack']),
            status: 'Building',
            repoUrl: 'https://github.com/developer/devlog',
        },
    })

    const project2 = await prisma.project.create({
        data: {
            name: 'Weather CLI',
            description: 'A simple CLI tool to fetch weather from the terminal.',
            techStack: JSON.stringify(['Rust', 'CLI']),
            tags: JSON.stringify(['rust', 'cli', 'api']),
            status: 'Shipped',
            repoUrl: 'https://github.com/developer/weather-cli',
        },
    })

    const project3 = await prisma.project.create({
        data: {
            name: 'Personal Portfolio',
            description: 'My personal portfolio and blog site.',
            techStack: JSON.stringify(['Astro', 'Tailwind']),
            tags: JSON.stringify(['portfolio', 'frontend']),
            status: 'Idea',
        },
    })

    console.log('Creating demo entries...')
    const entry1 = await prisma.entry.create({
        data: {
            title: 'Learned about React Server Components',
            body: 'Today I spent time understanding the difference between Server Components and Client Components in Next.js. Server Components run on the server and do not add to the client bundle size.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
            tags: JSON.stringify(['react', 'nextjs', 'learning']),
        },
    })

    const entry2 = await prisma.entry.create({
        data: {
            title: 'Set up Prisma Schema for DevLog',
            body: 'Configured the initial Prisma schema with Entry, Project, and Resource models. Implemented relationships between them. Need to remember that SQLite does not support arrays natively, so I am storing tags as JSON strings.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
            tags: JSON.stringify(['prisma', 'database', 'backend']),
            projectId: project1.id,
        },
    })

    const entry3 = await prisma.entry.create({
        data: {
            title: 'Rust error handling is awesome',
            body: 'Working on my Weather CLI and just appreciating how Rust handles errors with Result and Option paradigms instead of try-catch blocks everywhere.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            tags: JSON.stringify(['rust', 'cli', 'thoughts']),
            projectId: project2.id,
        },
    })

    const entry4 = await prisma.entry.create({
        data: {
            title: 'Struggling with complicated TS generics',
            body: 'Spent an hour trying to narrow down a complex generic type in TypeScript. Ended up using a discriminated union instead which is much cleaner.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
            tags: JSON.stringify(['typescript', 'types', 'struggle']),
        },
    })

    // today's entry
    const entry5 = await prisma.entry.create({
        data: {
            title: 'Getting started on DevLog UI',
            body: 'Today I started building the frontend for DevLog. I am using Tailwind for styling and React Query for state management.',
            date: new Date(),
            tags: JSON.stringify(['ui', 'frontend', 'tailwind']),
            projectId: project1.id,
        },
    })

    console.log('Creating demo resources...')
    await prisma.resource.create({
        data: {
            title: 'Next.js Documentation',
            url: 'https://nextjs.org/docs',
            category: 'Docs',
            isFavorite: true,
            projectId: project1.id,
        },
    })

    await prisma.resource.create({
        data: {
            title: 'Prisma SQLite Guide',
            url: 'https://www.prisma.io/docs/concepts/database-connectors/sqlite',
            category: 'Docs',
            notes: 'Very helpful for understanding constraints of SQLite with Prisma (e.g., no scalar arrays).',
            entryId: entry2.id,
        },
    })

    await prisma.resource.create({
        data: {
            title: 'Rust Book - Error Handling',
            url: 'https://doc.rust-lang.org/book/ch09-00-error-handling.html',
            category: 'Docs',
            isRead: true,
            entryId: entry3.id,
            projectId: project2.id,
        },
    })

    await prisma.resource.create({
        data: {
            title: 'TypeScript Discriminated Unions',
            url: 'https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions',
            category: 'Article',
            notes: 'This solved my issue perfectly.',
            isRead: true,
            entryId: entry4.id,
        },
    })

    await prisma.resource.create({
        data: {
            title: 'Tailwind CSS Flexbox',
            url: 'https://tailwindcss.com/docs/flex',
            category: 'Docs',
        },
    })

    await prisma.resource.create({
        data: {
            title: 'React Query Tutorial',
            url: 'https://tkdodo.eu/blog/practical-react-query',
            category: 'Article',
            isFavorite: true,
            notes: 'The definitive guide on React Query best practices.',
        },
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
