"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, FolderGit2, Bookmark, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Learning Log", href: "/log", icon: BookOpen },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Resources", href: "/resources", icon: Bookmark },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 lg:block">
            <div className="flex h-full flex-col px-4 py-6">
                <div className="flex items-center gap-2 px-2 pb-8">
                    <div className="flex bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 p-2 rounded-lg items-center justify-center">
                        <Code2 className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                        DevLog
                    </span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-white"
                                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 border-transparent dark:hover:text-white"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "h-5 w-5 flex-shrink-0 transition-colors duration-200",
                                        isActive
                                            ? "text-zinc-900 dark:text-white"
                                            : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    );
}
