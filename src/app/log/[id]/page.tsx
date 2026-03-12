"use client";

import { useEntry, useDeleteEntry } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, FolderGit2, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { EntryFormModal } from "@/components/entries/EntryFormModal";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";

export default function EntryDetailPage() {
    const { id } = useParams() as { id: string };
    const { data: entry, isLoading } = useEntry(id);
    const deleteEntry = useDeleteEntry();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const router = useRouter();

    if (isLoading || !entry) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    let tags: string[] = [];
    if (entry.tags) {
        try { tags = JSON.parse(entry.tags); } catch { }
    }

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this log entry?")) {
            deleteEntry.mutate(id, {
                onSuccess: () => router.push("/log")
            });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-10">
            <Link href="/log" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 text-sm font-medium">
                <ChevronLeft className="w-4 h-4" />
                Back to Log
            </Link>

            <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                    <h1 className="text-4xl font-extrabold tracking-tight">{entry.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1.5 align-middle bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-zinc-800 dark:text-zinc-300">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(entry.date), 'MMMM d, yyyy')}
                        </span>
                        {entry.project && (
                            <span className="flex items-center gap-1.5 align-middle">
                                <FolderGit2 className="w-4 h-4" />
                                <Link href={`/projects/${entry.project.id}`} className="hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline">
                                    {entry.project.name}
                                </Link>
                            </span>
                        )}
                        {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 shrinks-0">
                    <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="gap-2">
                        <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDelete} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                        <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                </div>
            </div>

            <Card className="dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 shadow-sm mt-8">
                <CardContent className="pt-8 prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-300 min-h-[300px]">
                    {entry.body.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </CardContent>
            </Card>

            {entry.resources && entry.resources.length > 0 && (
                <div className="pt-6">
                    <h3 className="text-xl font-semibold tracking-tight mb-4">Attached Resources</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {entry.resources.map(resource => (
                            <a key={resource.id} href={resource.url} target="_blank" rel="noreferrer" className="block">
                                <Card className="hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-pointer dark:bg-zinc-900">
                                    <CardHeader className="p-4">
                                        <div className="font-semibold text-sm line-clamp-1">{resource.title}</div>
                                        <div className="text-xs text-zinc-500 line-clamp-1 mt-1">{resource.url}</div>
                                    </CardHeader>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <EntryFormModal
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                entryToEdit={{
                    id: entry.id,
                    title: entry.title,
                    body: entry.body,
                    date: new Date(entry.date),
                    tags: tags,
                    projectId: entry.project?.id || null,
                }}
            />
        </div>
    );
}
