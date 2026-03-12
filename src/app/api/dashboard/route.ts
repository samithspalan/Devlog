import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { startOfDay, startOfWeek, subWeeks, subDays, format, differenceInDays } from 'date-fns';

export async function GET() {
    try {
        const totalEntries = await prisma.entry.count();
        const totalProjects = await prisma.project.count();
        const totalResources = await prisma.resource.count();

        // Fetch entries for streak and tags
        const allEntries = await prisma.entry.findMany({
            orderBy: { date: 'desc' },
            select: { date: true, tags: true }
        });

        let currentStreak = 0;
        let maxStreak = 0;

        if (allEntries.length > 0) {
            // Create a set of unique dates (YYYY-MM-DD) that have entries
            const uniqueDates = Array.from(new Set(
                allEntries.map(e => format(e.date, 'yyyy-MM-dd'))
            )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

            // Calculate current streak
            const today = format(new Date(), 'yyyy-MM-dd');
            const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

            let streakActive = uniqueDates.includes(today) || uniqueDates.includes(yesterday);

            if (streakActive) {
                let checkDate = uniqueDates.includes(today) ? new Date(today) : new Date(yesterday);

                while (true) {
                    const dateStr = format(checkDate, 'yyyy-MM-dd');
                    if (uniqueDates.includes(dateStr)) {
                        currentStreak++;
                        checkDate = subDays(checkDate, 1);
                    } else {
                        break;
                    }
                }
            }
        }

        // Top tags
        const tagCounts: Record<string, number> = {};
        for (const entry of allEntries) {
            if (entry.tags) {
                try {
                    const parsedTags = JSON.parse(entry.tags) as string[];
                    for (const tag of parsedTags) {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    }
                } catch (e) { }
            }
        }

        const topTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // Activity chart data (last 8 weeks)
        const eightWeeksAgo = subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 7);
        const recentEntries = await prisma.entry.findMany({
            where: { date: { gte: eightWeeksAgo } },
            select: { date: true }
        });

        const weeksMap = new Map<string, number>();
        for (let i = 0; i < 8; i++) {
            const wDate = subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 7 - i);
            weeksMap.set(format(wDate, 'MMM dd'), 0);
        }

        rectifiedEntries: for (const entry of recentEntries) {
            const wDate = startOfWeek(entry.date, { weekStartsOn: 1 });
            const wStr = format(wDate, 'MMM dd');
            if (weeksMap.has(wStr)) {
                weeksMap.set(wStr, weeksMap.get(wStr)! + 1);
            }
        }

        const activityData = Array.from(weeksMap.entries()).map(([name, entries]) => ({
            name, entries
        }));

        return NextResponse.json({
            stats: {
                totalEntries,
                totalProjects,
                totalResources,
                currentStreak,
            },
            topTags,
            activityData
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
