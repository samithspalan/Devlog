import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
}

export function StatsCard({ title, value, description, icon, className }: StatsCardProps) {
    return (
        <Card className={cn(
            "relative overflow-hidden group border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-indigo-500/10 hover:-translate-y-1",
            className
        )}>
            {/* Background glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Top Accent Border */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">{title}</CardTitle>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-colors duration-500">
                    {icon}
                </div>
            </CardHeader>

            <CardContent className="relative">
                <div className="text-3xl font-extrabold font-space text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
                    {value}
                </div>
                <p className="text-sm text-zinc-500 font-medium mt-2">{description}</p>
            </CardContent>
        </Card>
    );
}
