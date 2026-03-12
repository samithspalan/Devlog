import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { resourceSchema } from '@/lib/validations';

export async function GET() {
    try {
        const resources = await prisma.resource.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                project: { select: { id: true, name: true } },
                entry: { select: { id: true, title: true } },
            }
        });
        return NextResponse.json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = resourceSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Validation Error', details: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { title, url, category, notes, isRead, isFavorite, entryId, projectId } = result.data;

        const resource = await prisma.resource.create({
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

        return NextResponse.json(resource, { status: 201 });
    } catch (error) {
        console.error('Error creating resource:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
