"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagCloudProps {
    tags: { name: string; count: number }[];
    className?: string;
}

export function TagCloud({ tags, className }: TagCloudProps) {
    // Array of colors for badges to make it dynamic
    const colors = [
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    ];

    return (
        <Card className={cn("dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800", className)}>
            <CardHeader>
                <CardTitle>Top Topics</CardTitle>
                <CardDescription>
                    Most frequent learning areas
                </CardDescription>
            </CardHeader>
            <CardContent>
                {tags.length === 0 ? (
                    <div className="flex h-[200px] items-center justify-center text-sm text-zinc-500">
                        No tags found yet.
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 pt-4">
                        {tags.map((tag, i) => (
                            <Badge
                                key={tag.name}
                                variant="outline"
                                className={cn(
                                    "px-3 py-1 text-sm font-medium border-0 transition-transform hover:scale-105 cursor-default",
                                    colors[i % colors.length]
                                )}
                            >
                                {tag.name}
                                <span className="ml-2 text-xs opacity-70">
                                    {tag.count}
                                </span>
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
