import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { projectSchema } from '@/lib/validations';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                entries: { orderBy: { date: 'desc' } },
                resources: { orderBy: { createdAt: 'desc' } },
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const result = projectSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Validation Error', details: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, description, techStack, tags, status, repoUrl, liveUrl } = result.data;

        const project = await prisma.project.update({
            where: { id },
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

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.project.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
