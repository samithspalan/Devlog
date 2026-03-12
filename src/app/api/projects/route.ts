import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { projectSchema } from '@/lib/validations';

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: {
                    select: { entries: true, resources: true }
                }
            }
        });
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = projectSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Validation Error', details: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, description, techStack, tags, status, repoUrl, liveUrl } = result.data;

        const project = await prisma.project.create({
            data: {
                name,
                description,
                status,
                repoUrl: repoUrl || null,
                liveUrl: liveUrl || null,
                techStack: JSON.stringify(techStack),
                tags: JSON.stringify(tags),
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
