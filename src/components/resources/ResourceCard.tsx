import { Resource } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileText, Video, GraduationCap, Globe, ExternalLink, Star } from "lucide-react";

interface ResourceCardProps {
    resource: Resource & {
        project?: { id: string; name: string } | null;
        entry?: { id: string; title: string } | null;
    };
}

export function ResourceCard({ resource }: ResourceCardProps) {
    const getIcon = (category: string) => {
        switch (category) {
            case "Article": return <FileText className="w-4 h-4 text-blue-500" />;
            case "Video": return <Video className="w-4 h-4 text-rose-500" />;
            case "Docs": return <Globe className="w-4 h-4 text-emerald-500" />;
            case "Course": return <GraduationCap className="w-4 h-4 text-amber-500" />;
            default: return <FileText className="w-4 h-4 text-zinc-500" />;
        }
    };

    return (
        <Card className="glass-card group flex flex-col relative overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                        <div className="p-2.5 bg-white/5 border border-white/10 shadow-inner rounded-lg shrink-0 w-max h-max">
                            {getIcon(resource.category)}
                        </div>
                        <div>
                            <a href={resource.url} target="_blank" rel="noreferrer" className="hover:underline font-semibold leading-tight line-clamp-2">
                                {resource.title}
                                <ExternalLink className="inline-block w-3.5 h-3.5 ml-1.5 opacity-50 relative -top-0.5" />
                            </a>
                            <div className="text-xs text-zinc-500 mt-1 truncate max-w-[200px] sm:max-w-xs">{resource.url}</div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {resource.isFavorite && (
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                        )}
                        <Badge variant="outline" className={`text-[10px] px-1.5 shrink-0 ${resource.isRead ? 'bg-white/5 text-zinc-500 border-white/5' : 'bg-white/10 text-zinc-300 border-white/20'}`}>
                            {resource.isRead ? "READ" : "UNREAD"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pt-2 pb-4 text-sm">
                {resource.notes && (
                    <p className="text-zinc-400 border-l-2 border-indigo-500/50 pl-3 py-1 mb-4 italic text-sm">
                        {resource.notes}
                    </p>
                )}

                <div className="flex gap-2 mt-auto">
                    {resource.project && (
                        <Link href={`/projects/${resource.project.id}`}>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 border-0 text-xs shadow-none">
                                P: {resource.project.name}
                            </Badge>
                        </Link>
                    )}
                    {resource.entry && (
                        <Link href={`/log/${resource.entry.id}`}>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 border-0 text-[10px] px-1.5 hidden sm:inline-flex shadow-none">
                                Entry Link
                            </Badge>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
