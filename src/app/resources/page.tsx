"use client";

import { useResources } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceFormModal } from "@/components/resources/ResourceFormModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence, Variants } from "framer-motion";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemPop: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 350, damping: 25 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

export default function ResourcesPage() {
    const { data: resources, isLoading } = useResources();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filter, setFilter] = useState("All");

    const filteredResources = resources?.filter(res => filter === "All" || res.category === filter) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
                <div className="self-start">
                    <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">Bookmarks & Resources</h1>
                    <p className="text-zinc-600 dark:text-zinc-500 mt-1">Articles, videos, and documentation for your learning.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[140px] h-9 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-1">
                            <SelectValue placeholder="Filter category" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                            <SelectItem value="All">All Categories</SelectItem>
                            <SelectItem value="Article">Articles</SelectItem>
                            <SelectItem value="Docs">Documentation</SelectItem>
                            <SelectItem value="Video">Videos</SelectItem>
                            <SelectItem value="Course">Courses</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-indigo-500 text-white hover:bg-indigo-600 shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] h-9 transition-all">
                        <Plus className="h-4 w-4" />
                        Add Link
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-[180px] w-full rounded-xl" />
                        <Skeleton className="h-[180px] w-full rounded-xl" />
                        <Skeleton className="h-[180px] w-full rounded-xl" />
                        <Skeleton className="h-[180px] w-full rounded-xl" />
                    </>
                ) : filteredResources.length > 0 ? (
                    <motion.div variants={container} initial="hidden" animate="show" className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredResources.map((resource) => (
                                <motion.div key={resource.id} variants={itemPop} layout initial="hidden" animate="show" exit="exit" className="h-full">
                                    <ResourceCard resource={resource} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="glass-card col-span-full flex flex-col items-center justify-center p-14 text-center rounded-xl border-dashed">
                        <h3 className="mt-4 text-xl font-space font-bold text-black dark:text-white">No resources found</h3>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                            {filter !== "All" ? `You haven't saved any ${filter.toLowerCase()}s yet.` : "Start collecting useful resources."}
                        </p>
                        {filter === "All" && (
                            <Button onClick={() => setIsFormOpen(true)} variant="outline" className="mt-6 bg-black/5 border-black/10 hover:bg-black/10 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 text-black dark:text-white">
                                Add Resource
                            </Button>
                        )}
                        {filter !== "All" && (
                            <Button onClick={() => setFilter("All")} variant="outline" className="mt-6 bg-black/5 border-black/10 hover:bg-black/10 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 text-black dark:text-white">
                                Clear Filters
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <ResourceFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
        </div>
    );
}
