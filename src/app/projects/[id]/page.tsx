"use client";

import { useProject, useDeleteProject } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Trash2, Github, ExternalLink, Calendar, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { StatusBadge } from "@/components/projects/StatusBadge";
import { EntryCard } from "@/components/entries/EntryCard";

export default function ProjectDetailPage() {
    const { id } = useParams() as { id: string };
    const { data: project, isLoading } = useProject(id);
    const deleteProject = useDeleteProject();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const router = useRouter();

    if (isLoading || !project) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-[200px] w-full" />
            </div>
        );
    }

    let tags: string[] = [];
    let techStack: string[] = [];
    try {
        if (project.tags) tags = JSON.parse(project.tags);
        if (project.techStack) techStack = JSON.parse(project.techStack);
    } catch { }

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this project? This will NOT delete associated entries and resources, but they will become unlinked.")) {
            deleteProject.mutate(id, {
                onSuccess: () => router.push("/projects")
            });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-10">
            <Link href="/projects" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 text-sm font-medium">
                <ChevronLeft className="w-4 h-4" />
                Back to Projects
            </Link>

            <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-extrabold tracking-tight">{project.name}</h1>
                        <StatusBadge status={project.status} />
                    </div>

                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        {project.repoUrl && (
                            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-md transition-colors">
                                <Github className="w-4 h-4" /> Repository
                            </a>
                        )}
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-md transition-colors">
                                <ExternalLink className="w-4 h-4" /> Live Site
                            </a>
                        )}
                        <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 ml-auto mr-4 group hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                            <Calendar className="w-4 h-4" />
                            Started {format(new Date(project.createdAt), 'MMMM yyyy')}
                        </span>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-6">Learning Log</h2>
                        <div className="space-y-4">
                            {project.entries && project.entries.length > 0 ? (
                                project.entries.map((entry) => (
                                    <EntryCard key={entry.id} entry={{ ...entry, project: null }} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500">
                                    <p>No log entries bound to this project yet.</p>
                                    <Link href="/log" className="mt-2 text-sm underline hover:text-zinc-900 dark:hover:text-white">
                                        Create one in Learning Log
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card className="dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                        <CardContent className="pt-6 space-y-6">
                            <div>
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500 mb-3">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map(t => (
                                        <Badge key={t} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800">{t}</Badge>
                                    ))}
                                    {techStack.length === 0 && <span className="text-sm text-zinc-500">Not specified</span>}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500 mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(t => (
                                        <Badge key={t} variant="outline" className="border-zinc-200 dark:border-zinc-700">{t}</Badge>
                                    ))}
                                    {tags.length === 0 && <span className="text-sm text-zinc-500">No tags</span>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div>
                        <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                            Resources <span className="bg-zinc-100 dark:bg-zinc-800 text-xs px-2 py-0.5 rounded-full">{project.resources?.length || 0}</span>
                        </h3>
                        <div className="space-y-3">
                            {project.resources && project.resources.length > 0 ? (
                                project.resources.map(res => (
                                    <a key={res.id} href={res.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors group dark:bg-zinc-900">
                                        <div className="bg-zinc-100 p-2 rounded-md dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white shrink-0">
                                            <LinkIcon className="w-4 h-4" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="font-medium text-sm truncate">{res.title}</div>
                                            <div className="text-xs text-zinc-500 truncate">{res.url}</div>
                                        </div>
                                    </a>
                                ))
                            ) : (
                                <p className="text-sm text-zinc-500 italic px-2">No resources attached.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ProjectFormModal
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                projectToEdit={{
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    status: project.status as any,
                    techStack: techStack,
                    tags: tags,
                    repoUrl: project.repoUrl,
                    liveUrl: project.liveUrl,
                }}
            />
        </div>
    );
}
