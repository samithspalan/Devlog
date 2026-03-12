"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceSchema, ResourceInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateResource, useUpdateResource, useProjects, useEntries } from "@/lib/hooks";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ResourceFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resourceToEdit?: {
        id: string;
        title: string;
        url: string;
        category: "Article" | "Video" | "Docs" | "Course" | "Other";
        notes?: string | null;
        isRead: boolean;
        isFavorite: boolean;
        entryId?: string | null;
        projectId?: string | null;
    };
}

export function ResourceFormModal({ open, onOpenChange, resourceToEdit }: ResourceFormModalProps) {
    const { data: projects } = useProjects();
    const { data: entries } = useEntries();
    const createResource = useCreateResource();
    const updateResource = useUpdateResource();

    const isEditing = !!resourceToEdit;

    const form = useForm<ResourceInput>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            title: resourceToEdit?.title || "",
            url: resourceToEdit?.url || "",
            category: resourceToEdit?.category || "Docs",
            notes: resourceToEdit?.notes || "",
            isRead: resourceToEdit?.isRead || false,
            isFavorite: resourceToEdit?.isFavorite || false,
            projectId: resourceToEdit?.projectId || undefined,
            entryId: resourceToEdit?.entryId || undefined,
        },
    });

    const onSubmit = (data: ResourceInput) => {
        if (isEditing && resourceToEdit) {
            updateResource.mutate(
                { id: resourceToEdit.id, data },
                {
                    onSuccess: () => {
                        toast.success("Resource updated successfully");
                        onOpenChange(false);
                    },
                    onError: () => {
                        toast.error("Failed to update resource");
                    },
                }
            );
        } else {
            createResource.mutate(data, {
                onSuccess: () => {
                    toast.success("Resource created successfully");
                    form.reset();
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Failed to create resource");
                },
            });
        }
    };

    const isPending = createResource.isPending || updateResource.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Resource" : "Save a Bookmark"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Resource Title" {...field} className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                                <SelectItem value="Article">Article</SelectItem>
                                                <SelectItem value="Video">Video</SelectItem>
                                                <SelectItem value="Docs">Documentation</SelectItem>
                                                <SelectItem value="Course">Course</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormItem className="flex flex-col justify-end pb-2 gap-2">
                                <div className="flex items-center space-x-4">
                                    <FormField
                                        control={form.control}
                                        name="isFavorite"
                                        render={({ field }) => (
                                            <div className="flex flex-row items-center space-x-2">
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">Favorite</FormLabel>
                                            </div>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isRead"
                                        render={({ field }) => (
                                            <div className="flex flex-row items-center space-x-2">
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">Read</FormLabel>
                                            </div>
                                        )}
                                    />
                                </div>
                            </FormItem>
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Why did you bookmark this? Any key takeaways?"
                                            className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-20 resize-none"
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <h4 className="text-sm font-medium mb-3">Associations (Optional)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="projectId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined} value={field.value || "none"}>
                                                <FormControl className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm h-9">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Link to project" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                                    <SelectItem value="none">No Project</SelectItem>
                                                    {projects?.map((project) => (
                                                        <SelectItem key={project.id} value={project.id}>
                                                            {project.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="entryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined} value={field.value || "none"}>
                                                <FormControl className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm h-9">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Link to entry" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                                    <SelectItem value="none">No Entry</SelectItem>
                                                    {entries?.map((entry) => (
                                                        <SelectItem key={entry.id} value={entry.id}>
                                                            {entry.title.substring(0, 30)}{entry.title.length > 30 ? '...' : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 space-x-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                                {isPending ? "Saving..." : "Save Resource"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
