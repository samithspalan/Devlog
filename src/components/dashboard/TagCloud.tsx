"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";

interface TagCloudProps {
    tags: { name: string; count: number }[];
    className?: string;
}

export function TagCloud({ tags, className }: TagCloudProps) {
    // Vibrant gradients for premium look
    const badgeStyles = [
        "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-200 hover:border-blue-500/50 shadow-[0_0_15px_-5px_var(--tw-shadow-color)] shadow-blue-500",
        "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-200 hover:border-emerald-500/50 shadow-[0_0_15px_-5px_var(--tw-shadow-color)] shadow-emerald-500",
        "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-200 hover:border-purple-500/50 shadow-[0_0_15px_-5px_var(--tw-shadow-color)] shadow-purple-500",
        "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-200 hover:border-amber-500/50 shadow-[0_0_15px_-5px_var(--tw-shadow-color)] shadow-amber-500",
        "bg-gradient-to-r from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-200 hover:border-rose-500/50 shadow-[0_0_15px_-5px_var(--tw-shadow-color)] shadow-rose-500",
    ];

    return (
        <Card className={cn(
            "glass-card border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-2xl transition-all duration-500 hover:border-black/20 dark:hover:border-white/20 relative group h-full",
            className
        )}>
            {/* Top Gradient Line (Right-aligned) */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-l from-transparent via-cyan-500 to-transparent opacity-50"></div>

            <CardHeader className="pb-4 border-b border-black/5 dark:border-white/5 relative z-10">
                <CardTitle className="flex items-center gap-2 text-xl font-space text-black dark:text-white">
                    <Hash className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                    Top Topics
                </CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400 font-medium">
                    Most frequent learning areas
                </CardDescription>
            </CardHeader>

            <CardContent className="h-[calc(100%-100px)] relative z-10">
                {tags.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-500 italic">
                        No tags found yet.
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2.5 pt-6 pb-2">
                        {tags.map((tag, i) => (
                            <Badge
                                key={tag.name}
                                variant="outline"
                                className={cn(
                                    "px-3.5 py-1.5 text-sm font-medium transition-all duration-500 hover:-translate-y-1 cursor-default backdrop-blur-md bg-white/50 dark:bg-transparent",
                                    badgeStyles[i % badgeStyles.length]
                                )}
                            >
                                {tag.name}
                                <span className="ml-2 font-bold opacity-80 backdrop-blur-md bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-md text-xs">
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
