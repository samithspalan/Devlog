"use client";

import { useDashboard } from "@/lib/hooks";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TagCloud } from "@/components/dashboard/TagCloud";
import { BookOpen, FolderGit2, Bookmark, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const { data, isLoading } = useDashboard();

    if (isLoading || !data) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-zinc-500">Your developer learning journey at a glance.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-[120px] w-full rounded-xl" />
                    <Skeleton className="h-[120px] w-full rounded-xl" />
                    <Skeleton className="h-[120px] w-full rounded-xl" />
                    <Skeleton className="h-[120px] w-full rounded-xl" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Skeleton className="col-span-4 h-[350px] rounded-xl" />
                    <Skeleton className="col-span-3 h-[350px] rounded-xl" />
                </div>
            </div>
        );
    }

    const { stats, topTags, activityData } = data;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-zinc-500 mt-1">Your developer learning journey at a glance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Log Entries"
                    value={stats.totalEntries.toString()}
                    icon={<BookOpen className="h-4 w-4 text-zinc-500" />}
                    description="Learning journal logs"
                />
                <StatsCard
                    title="Current Streak"
                    value={`${stats.currentStreak} days`}
                    icon={<Flame className="h-4 w-4 text-orange-500" />}
                    description="Consecutive days logging"
                />
                <StatsCard
                    title="Active Projects"
                    value={stats.totalProjects.toString()}
                    icon={<FolderGit2 className="h-4 w-4 text-zinc-500" />}
                    description="Projects being built"
                />
                <StatsCard
                    title="Saved Resources"
                    value={stats.totalResources.toString()}
                    icon={<Bookmark className="h-4 w-4 text-zinc-500" />}
                    description="Bookmarks and docs"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <ActivityChart data={activityData} className="col-span-4" />
                <TagCloud tags={topTags} className="col-span-3" />
            </div>
        </div>
    );
}
