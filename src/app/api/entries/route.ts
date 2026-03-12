import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { entrySchema } from '@/lib/validations';

export async function GET() {
    try {
        const entries = await prisma.entry.findMany({
            orderBy: { date: 'desc' },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    }
                }
            }
        });
        return NextResponse.json(entries);
    } catch (error) {
        console.error('Error fetching entries:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = entrySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Validation Error', details: result.error.flatten().fieldErrors }, { status: 400 });
        }

        const { title, body: content, date, tags, projectId } = result.data;

        const entry = await prisma.entry.create({
            data: {
                title,
                body: content,
                date,
                tags: JSON.stringify(tags),
                projectId: projectId || null,
            },
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error) {
        console.error('Error creating entry:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
