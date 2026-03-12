"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface ActivityChartProps {
    data: { name: string; entries: number }[];
    className?: string;
}

export function ActivityChart({ data, className }: ActivityChartProps) {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === "dark" || (typeof window !== "undefined" && document.documentElement.classList.contains("dark"));

    return (
        <Card className={cn(
            "glass-card border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-2xl transition-all duration-500 hover:border-black/20 dark:hover:border-white/20 overflow-hidden relative group",
            className
        )}>
            {/* Top Gradient Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

            <CardHeader className="pb-6">
                <CardTitle className="text-xl font-space text-black dark:text-white">Learning Activity</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-zinc-400 font-medium">
                    Logs recorded over the past 8 weeks
                </CardDescription>
            </CardHeader>

            <CardContent className="h-[calc(100%-100px)]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                                <stop offset="100%" stopColor="#c084fc" stopOpacity={0.4} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                        <XAxis
                            dataKey="name"
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            allowDecimals={false}
                            dx={-10}
                        />
                        <Tooltip
                            cursor={{ fill: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}
                            contentStyle={{
                                borderRadius: '12px',
                                backgroundColor: isDarkMode ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                backdropFilter: 'blur(10px)',
                                color: isDarkMode ? '#fff' : '#000'
                            }}
                        />
                        <Bar
                            dataKey="entries"
                            fill="url(#barGradient)"
                            radius={[6, 6, 0, 0]}
                            className="transition-all duration-300 hover:opacity-80"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
