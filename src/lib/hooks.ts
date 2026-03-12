import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EntryInput, ProjectInput, ResourceInput } from "./validations";
import { Entry, Project, Resource } from "@prisma/client";

// FETCHERS
const fetcher = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "An error occurred while fetching the data.");
    }
    return res.json();
};

export const keys = {
    entries: ["entries"] as const,
    projects: ["projects"] as const,
    resources: ["resources"] as const,
    dashboard: ["dashboard"] as const,
};

// --- ENTRIES ---
export function useEntries() {
    return useQuery({
        queryKey: keys.entries,
        queryFn: () => fetcher("/api/entries") as Promise<(Entry & { project: Project | null })[]>,
    });
}

export function useEntry(id: string) {
    return useQuery({
        queryKey: [...keys.entries, id],
        queryFn: () => fetcher(`/api/entries/${id}`) as Promise<Entry & { project: Project | null, resources: Resource[] }>,
        enabled: !!id,
    });
}

export function useCreateEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEntry: EntryInput) =>
            fetcher("/api/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEntry),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.entries });
            queryClient.invalidateQueries({ queryKey: keys.dashboard });
        },
    });
}

export function useUpdateEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: EntryInput }) =>
            fetcher(`/api/entries/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: keys.entries });
            queryClient.invalidateQueries({ queryKey: [...keys.entries, variables.id] });
        },
    });
}

export function useDeleteEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => fetcher(`/api/entries/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.entries });
            queryClient.invalidateQueries({ queryKey: keys.dashboard });
        },
    });
}

// --- PROJECTS ---
export function useProjects() {
    return useQuery({
        queryKey: keys.projects,
        queryFn: () => fetcher("/api/projects") as Promise<Project[]>,
    });
}

export function useProject(id: string) {
    return useQuery({
        queryKey: [...keys.projects, id],
        queryFn: () => fetcher(`/api/projects/${id}`) as Promise<Project & { entries: Entry[], resources: Resource[] }>,
        enabled: !!id,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProject: ProjectInput) =>
            fetcher("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProject),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.projects });
            queryClient.invalidateQueries({ queryKey: keys.dashboard });
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ProjectInput }) =>
            fetcher(`/api/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: keys.projects });
            queryClient.invalidateQueries({ queryKey: [...keys.projects, variables.id] });
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => fetcher(`/api/projects/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.projects });
            queryClient.invalidateQueries({ queryKey: keys.dashboard });
        },
    });
}

// --- RESOURCES ---
export function useResources() {
    return useQuery({
        queryKey: keys.resources,
        queryFn: () => fetcher("/api/resources") as Promise<(Resource & { project: Project | null, entry: Entry | null })[]>,
    });
}

export function useCreateResource() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newResource: ResourceInput) =>
            fetcher("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newResource),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.resources });
            queryClient.invalidateQueries({ queryKey: keys.dashboard });
            queryClient.invalidateQueries({ queryKey: keys.entries });
            queryClient.invalidateQueries({ queryKey: keys.projects });
        },
    });
}

export function useUpdateResource() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ResourceInput> }) =>
            fetcher(`/api/resources/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.resources });
            queryClient.invalidateQueries({ queryKey: keys.entries });
            queryClient.invalidateQueries({ queryKey: keys.projects });
        },
    });
}

export function useDeleteResource() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => fetcher(`/api/resources/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: keys.resources });
            queryClient.invalidateQueries({ queryKey: keys.dashboard });
            queryClient.invalidateQueries({ queryKey: keys.entries });
            queryClient.invalidateQueries({ queryKey: keys.projects });
        },
    });
}

// --- DASHBOARD ---
export function useDashboard() {
    return useQuery({
        queryKey: keys.dashboard,
        queryFn: () => fetcher("/api/dashboard") as Promise<{
            stats: { totalEntries: number; totalProjects: number; totalResources: number; currentStreak: number };
            topTags: { name: string; count: number }[];
            activityData: { name: string; entries: number }[];
        }>,
    });
}
