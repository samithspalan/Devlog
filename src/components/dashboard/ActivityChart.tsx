"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface ActivityChartProps {
    data: { name: string; entries: number }[];
    className?: string;
}

export function ActivityChart({ data, className }: ActivityChartProps) {
    return (
        <Card className={cn("dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800", className)}>
            <CardHeader>
                <CardTitle>Learning Activity</CardTitle>
                <CardDescription>
                    Logs created over the past 8 weeks
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                contentStyle={{ borderRadius: '8px', backgroundColor: '#18181b', border: 'none', color: '#fff' }}
                            />
                            <Bar
                                dataKey="entries"
                                fill="currentColor"
                                radius={[4, 4, 0, 0]}
                                className="fill-zinc-900 dark:fill-zinc-50"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
