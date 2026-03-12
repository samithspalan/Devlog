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
                <Button onClick={() => setIsFormOpen(true)} className="gap-2 bg-indigo-500 text-white hover:bg-indigo-600 shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] h-9 transition-all">
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
                    <div className="glass-card col-span-full flex flex-col items-center justify-center p-14 text-center rounded-xl border-dashed">
                        <h3 className="mt-4 text-xl font-space font-bold text-white">No projects found</h3>
                        <p className="mt-2 text-sm text-zinc-400 font-medium">
                            Start tracking your first side project.
                        </p>
                        <Button onClick={() => setIsFormOpen(true)} variant="outline" className="mt-6 bg-white/5 border-white/10 hover:bg-white/10 text-white">
                            Add Project
                        </Button>
                    </div>
                )}
            </div>

            <ProjectFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
        </div>
    );
}
