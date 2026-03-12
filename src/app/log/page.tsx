"use client";

import { useEntries, useCreateEntry } from "@/lib/hooks";
import { EntryCard } from "@/components/entries/EntryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { EntryFormModal } from "@/components/entries/EntryFormModal";
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

const itemSlideLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function LogPage() {
    const { data: entries, isLoading } = useEntries();
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Learning Log</h1>
                    <p className="text-zinc-500 mt-1">Chronological journal of your daily learnings.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-indigo-500 text-white hover:bg-indigo-600 shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] transition-all">
                        <Plus className="h-4 w-4" />
                        New Entry
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                    </>
                ) : entries && entries.length > 0 ? (
                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                        {entries.map((entry) => (
                            <motion.div key={entry.id} variants={itemSlideLeft}>
                                <EntryCard entry={entry} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="glass-card flex flex-col items-center justify-center p-14 text-center rounded-xl border-dashed">
                        <h3 className="mt-4 text-xl font-space font-bold text-white">No entries yet</h3>
                        <p className="mt-2 text-sm text-zinc-400 font-medium">
                            Start documenting your learning journey by creating your first entry.
                        </p>
                        <Button onClick={() => setIsFormOpen(true)} variant="outline" className="mt-6 bg-white/5 border-white/10 hover:bg-white/10 text-white">
                            Create Entry
                        </Button>
                    </div>
                )}
            </div>

            <EntryFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
        </div>
    );
}
