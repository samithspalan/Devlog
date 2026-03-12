"use client";

import { useDashboard } from "@/lib/hooks";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TagCloud } from "@/components/dashboard/TagCloud";
import { BookOpen, FolderGit2, Bookmark, Flame, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, Variants } from "framer-motion";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const itemScale: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
    const { data, isLoading } = useDashboard();

    if (isLoading || !data) {
        return (
            <div className="space-y-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-4xl font-space font-extrabold tracking-tight text-black dark:text-white">Dashboard</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">Loading your telemetry...</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-[140px] w-full rounded-2xl bg-white/5" />
                    <Skeleton className="h-[140px] w-full rounded-2xl bg-white/5" />
                    <Skeleton className="h-[140px] w-full rounded-2xl bg-white/5" />
                    <Skeleton className="h-[140px] w-full rounded-2xl bg-white/5" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Skeleton className="col-span-4 h-[400px] rounded-2xl bg-white/5" />
                    <Skeleton className="col-span-3 h-[400px] rounded-2xl bg-white/5" />
                </div>
            </div>
        );
    }

    const { stats, topTags, activityData } = data;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto pb-12">
            <div className="relative">
                <div className="absolute -left-10 top-0 w-20 h-20 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-5xl font-extrabold font-space text-gradient tracking-tight">
                            Developer Overview
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-2 font-medium flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            Your productivity telemetry at a glance.
                        </p>
                    </div>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
                <motion.div variants={itemUp}>
                    <StatsCard
                        title="Total Logs"
                        value={stats.totalEntries.toString()}
                        icon={<BookOpen className="h-5 w-5 text-indigo-400" />}
                        description="Learning journal logs"
                        className="border-indigo-500/20 shadow-[0_0_30px_-15px_rgba(99,102,241,0.5)] h-full"
                    />
                </motion.div>
                <motion.div variants={itemUp}>
                    <StatsCard
                        title="Current Streak"
                        value={`${stats.currentStreak} days`}
                        icon={<Flame className="h-5 w-5 text-orange-400" />}
                        description="Consecutive days logging"
                        className="border-orange-500/20 shadow-[0_0_30px_-15px_rgba(249,115,22,0.5)] h-full"
                    />
                </motion.div>
                <motion.div variants={itemUp}>
                    <StatsCard
                        title="Active Projects"
                        value={stats.totalProjects.toString()}
                        icon={<FolderGit2 className="h-5 w-5 text-pink-400" />}
                        description="Projects being built"
                        className="border-pink-500/20 shadow-[0_0_30px_-15px_rgba(236,72,153,0.5)] h-full"
                    />
                </motion.div>
                <motion.div variants={itemUp}>
                    <StatsCard
                        title="Resources"
                        value={stats.totalResources.toString()}
                        icon={<Bookmark className="h-5 w-5 text-emerald-400" />}
                        description="Bookmarks and docs"
                        className="border-emerald-500/20 shadow-[0_0_30px_-15px_rgba(16,185,129,0.5)] h-full"
                    />
                </motion.div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 pt-4"
            >
                <motion.div variants={itemScale} className="col-span-4 lg:col-span-5 h-[450px]">
                    <ActivityChart data={activityData} className="h-full" />
                </motion.div>
                <motion.div variants={itemScale} className="col-span-3 lg:col-span-2 h-[450px]">
                    <TagCloud tags={topTags} className="h-full" />
                </motion.div>
            </motion.div>
        </div>
    );
}
