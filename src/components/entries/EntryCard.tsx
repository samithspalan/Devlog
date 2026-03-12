import { Entry, Project } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowRight, Calendar, FolderGit2 } from "lucide-react";

interface EntryCardProps {
    entry: Entry & { project: Project | null };
}

export function EntryCard({ entry }: EntryCardProps) {
    let tags: string[] = [];
    if (entry.tags) {
        try {
            tags = JSON.parse(entry.tags);
        } catch { }
    }

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-xl leading-none tracking-tight">
                            <Link href={`/log/${entry.id}`} className="hover:underline flex items-center gap-2">
                                {entry.title}
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-transform" />
                            </Link>
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1.5 align-middle">
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
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 line-clamp-3">
                    {entry.body.split('\n').map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                    ))}
                </div>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
