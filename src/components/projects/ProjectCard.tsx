import { Project } from "@prisma/client";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Github, ExternalLink, Activity, BookOpen, Layers } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface ProjectCardProps {
    project: Project & {
        _count?: { entries: number; resources: number }
    };
}

export function ProjectCard({ project }: ProjectCardProps) {
    let techStack: string[] = [];
    if (project.techStack) {
        try { techStack = JSON.parse(project.techStack); } catch { }
    }

    return (
        <Card className="group flex flex-col hover:shadow-lg transition-all duration-300 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3 border-b border-transparent">
                <div className="flex justify-between items-start gap-4">
                    <Link href={`/projects/${project.id}`} className="hover:underline font-bold text-xl tracking-tight line-clamp-1">
                        {project.name}
                    </Link>
                    <StatusBadge status={project.status} />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 line-clamp-2 min-h-[40px]">
                    {project.description}
                </p>
            </CardHeader>

            <CardContent className="flex-1 py-4">
                {techStack.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            <Layers className="w-3.5 h-3.5" /> Stack
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {techStack.slice(0, 4).map((tech) => (
                                <Badge key={tech} variant="secondary" className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300 px-2 py-0 text-xs shadow-sm">
                                    {tech}
                                </Badge>
                            ))}
                            {techStack.length > 4 && (
                                <span className="text-xs text-zinc-400 flex items-center ml-1">+{techStack.length - 4}</span>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="border-t border-zinc-100 dark:border-zinc-800/50 pt-3 pb-3 px-6 flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                <div className="flex gap-4">
                    {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <Github className="w-4 h-4" />
                        </a>
                    )}
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>

                {project._count && (
                    <div className="flex gap-3 text-xs font-medium">
                        <div className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" /> {project._count.entries}
                        </div>
                        <div className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" /> {project._count.resources}
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
