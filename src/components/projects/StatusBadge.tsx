import { Project } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
    let color = "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";

    if (status === "Building") {
        color = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    } else if (status === "Shipped") {
        color = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    } else if (status === "Idea") {
        color = "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    } else if (status === "Paused") {
        color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }

    return (
        <Badge variant="outline" className={`${color} border-0 font-semibold px-2.5 py-0.5`}>
            {status}
        </Badge>
    );
}
