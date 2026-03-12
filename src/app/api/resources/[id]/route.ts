import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { resourceSchema } from '@/lib/validations';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const resource = await prisma.resource.findUnique({
            where: { id },
            include: {
                project: true,
                entry: true,
            },
        });

        if (!resource) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        return NextResponse.json(resource);
    } catch (error) {
        console.error('Error fetching resource:', error);
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
        const result = resourceSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Validation Error', details: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { title, url, category, notes, isRead, isFavorite, entryId, projectId } = result.data;

        const resource = await prisma.resource.update({
            where: { id },
            data: {
                title,
                url,
                category,
                notes: notes || null,
                isRead,
                isFavorite,
                entryId: entryId || null,
                projectId: projectId || null,
            },
        });

        return NextResponse.json(resource);
    } catch (error) {
        console.error('Error updating resource:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.resource.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting resource:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
