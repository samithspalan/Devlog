import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { entrySchema } from '@/lib/validations';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const entry = await prisma.entry.findUnique({
            where: { id },
            include: {
                project: true,
                resources: true,
            },
        });

        if (!entry) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        return NextResponse.json(entry);
    } catch (error) {
        console.error('Error fetching entry:', error);
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
        const result = entrySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Validation Error', details: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { title, body: content, date, tags, projectId } = result.data;

        const entry = await prisma.entry.update({
            where: { id },
            data: {
                title,
                body: content,
                date,
                tags: JSON.stringify(tags),
                projectId: projectId || null,
            },
        });

        return NextResponse.json(entry);
    } catch (error) {
        console.error('Error updating entry:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.entry.delete({ where: { id } });
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting entry:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
