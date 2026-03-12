import { z } from "zod";

export const entrySchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    body: z.string().min(1, "Body is required"),
    date: z.string(),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    projectId: z.string().optional().nullable(),
});

export type EntryInput = z.infer<typeof entrySchema>;

export const projectSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().min(1, "Description is required"),
    techStack: z.array(z.string()),
    tags: z.array(z.string()),
    status: z.enum(["Idea", "Building", "Shipped", "Paused"]),
    repoUrl: z.string().url().optional().nullable().or(z.literal("")),
    liveUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const resourceSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    url: z.string().url("Must be a valid URL"),
    category: z.enum(["Article", "Video", "Docs", "Course", "Other"]),
    notes: z.string().optional().nullable(),
    isRead: z.boolean(),
    isFavorite: z.boolean(),
    entryId: z.string().optional().nullable(),
    projectId: z.string().optional().nullable(),
});

export type ResourceInput = z.infer<typeof resourceSchema>;
