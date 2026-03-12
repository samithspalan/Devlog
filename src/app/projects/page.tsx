"use client";

import { useProjects } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";

export default function ProjectsPage() {
    const { data: projects, isLoading } = useProjects();
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects Tracker</h1>
                    <p className="text-zinc-500 mt-1">Manage what you are building, shipped, or ideating.</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                    <Plus className="h-4 w-4" />
                    New Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <>
                        <Skeleton className="h-[250px] w-full rounded-xl" />
                        <Skeleton className="h-[250px] w-full rounded-xl" />
                        <Skeleton className="h-[250px] w-full rounded-xl" />
                    </>
                ) : projects && projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                        <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
                        <p className="mt-2 text-sm text-zinc-500">
                            Create your first project to start tracking your builds.
                        </p>
                        <Button onClick={() => setIsFormOpen(true)} variant="outline" className="mt-4">
                            Create Project
                        </Button>
                    </div>
                )}
            </div>

            <ProjectFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
        </div>
    );
}
