"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateProject, useUpdateProject } from "@/lib/hooks";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectToEdit?: {
        id: string;
        name: string;
        description: string;
        status: "Idea" | "Building" | "Shipped" | "Paused";
        techStack: string[];
        tags: string[];
        repoUrl?: string | null;
        liveUrl?: string | null;
    };
}

export function ProjectFormModal({ open, onOpenChange, projectToEdit }: ProjectFormModalProps) {
    const createProject = useCreateProject();
    const updateProject = useUpdateProject();

    const isEditing = !!projectToEdit;

    const form = useForm<ProjectInput>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: projectToEdit?.name || "",
            description: projectToEdit?.description || "",
            status: projectToEdit?.status || "Idea",
            techStack: projectToEdit?.techStack || [],
            tags: projectToEdit?.tags || [],
            repoUrl: projectToEdit?.repoUrl || "",
            liveUrl: projectToEdit?.liveUrl || "",
        },
    });

    const onSubmit = (data: ProjectInput) => {
        if (isEditing && projectToEdit) {
            updateProject.mutate(
                { id: projectToEdit.id, data },
                {
                    onSuccess: () => {
                        toast.success("Project updated successfully");
                        onOpenChange(false);
                    },
                    onError: () => {
                        toast.error("Failed to update project");
                    },
                }
            );
        } else {
            createProject.mutate(data, {
                onSuccess: () => {
                    toast.success("Project created successfully");
                    form.reset();
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Failed to create project");
                },
            });
        }
    };

    const isPending = createProject.isPending || updateProject.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Project" : "New Project"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project Name" {...field} className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="What is this project about?"
                                            className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 resize-none h-24"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                            <SelectItem value="Idea">Idea</SelectItem>
                                            <SelectItem value="Building">Building</SelectItem>
                                            <SelectItem value="Shipped">Shipped</SelectItem>
                                            <SelectItem value="Paused">Paused</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="repoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Repository URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://github.com/..." {...field} value={field.value || ""} className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="liveUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Live URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} value={field.value || ""} className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="techStack"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tech Stack (comma separated)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Next.js, Tailwind, Prisma"
                                                className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                                value={field.value.join(', ')}
                                                onChange={(e) => {
                                                    const items = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                                                    field.onChange(items);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags (comma separated)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="frontend, prototype"
                                                className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                                value={field.value.join(', ')}
                                                onChange={(e) => {
                                                    const items = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                                                    field.onChange(items);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-4 space-x-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                                {isPending ? "Saving..." : "Save Project"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
