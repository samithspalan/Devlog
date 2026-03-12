"use client";

import { useEntries, useCreateEntry } from "@/lib/hooks";
import { EntryCard } from "@/components/entries/EntryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { EntryFormModal } from "@/components/entries/EntryFormModal";

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
                <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                    <Plus className="h-4 w-4" />
                    New Entry
                </Button>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                    </>
                ) : entries && entries.length > 0 ? (
                    entries.map((entry) => (
                        <EntryCard key={entry.id} entry={entry} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        <h3 className="mt-4 text-lg font-semibold">No entries yet</h3>
                        <p className="mt-2 text-sm text-zinc-500">
                            Start documenting your learning journey by creating your first entry.
                        </p>
                        <Button onClick={() => setIsFormOpen(true)} variant="outline" className="mt-4">
                            Create Entry
                        </Button>
                    </div>
                )}
            </div>

            <EntryFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
        </div>
    );
}
