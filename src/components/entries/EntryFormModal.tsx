"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entrySchema, EntryInput } from "@/lib/validations";
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
import { useCreateEntry, useUpdateEntry, useProjects } from "@/lib/hooks";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface EntryFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entryToEdit?: {
        id: string;
        title: string;
        body: string;
        date: Date;
        tags: string[];
        projectId?: string | null;
    };
}

export function EntryFormModal({ open, onOpenChange, entryToEdit }: EntryFormModalProps) {
    const { data: projects } = useProjects();
    const createEntry = useCreateEntry();
    const updateEntry = useUpdateEntry();

    const isEditing = !!entryToEdit;

    const form = useForm<EntryInput>({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: entryToEdit?.title || "",
            body: entryToEdit?.body || "",
            date: entryToEdit?.date ? format(new Date(entryToEdit.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            tags: entryToEdit?.tags || [],
            projectId: entryToEdit?.projectId || undefined,
        },
    });

    const onSubmit = (data: EntryInput) => {
        if (isEditing && entryToEdit) {
            updateEntry.mutate(
                { id: entryToEdit.id, data },
                {
                    onSuccess: () => {
                        toast.success("Entry updated successfully");
                        onOpenChange(false);
                    },
                    onError: () => {
                        toast.error("Failed to update entry");
                    },
                }
            );
        } else {
            createEntry.mutate(data, {
                onSuccess: () => {
                    toast.success("Entry created successfully");
                    form.reset();
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Failed to create entry");
                },
            });
        }
    };

    const isPending = createEntry.isPending || updateEntry.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Learning Log" : "New Learning Log"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="What did you learn today?" {...field} className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project (Optional)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                            <FormControl className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a project" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                                <SelectItem value="none">None</SelectItem>
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
                        </div>

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags (comma separated)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="react, typescript, ui"
                                            className="dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                            value={field.value.join(', ')}
                                            onChange={(e) => {
                                                const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                                                field.onChange(tags);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Details</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write your notes or documentation here..."
                                            className="min-h-[150px] dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4 space-x-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                                {isPending ? "Saving..." : "Save Entry"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
