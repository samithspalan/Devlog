"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, FolderGit2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Learning Log", href: "/log", icon: BookOpen },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Resources", href: "/resources", icon: Bookmark },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-black/80 backdrop-blur-2xl border-r border-white/10 hidden lg:flex flex-col h-screen">
            <div className="flex items-center gap-3 px-8 h-24 mt-2">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20 border border-white/10 shrink-0 bg-zinc-900">
                    <Image src="/logo.png" alt="DevLog Logo" fill className="object-cover" priority />
                </div>
                <span className="text-2xl font-bold font-space bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 tracking-tight">
                    DevLog.
                </span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 outline-none"
                        >
                            {/* Active Background Glow & Glass */}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/5 rounded-xl border border-indigo-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"></div>
                            )}

                            {/* Hover effect for inactive */}
                            {!isActive && (
                                <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300 border border-transparent group-hover:border-white/5"></div>
                            )}

                            {/* Active Left Indicator Bar */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
                            )}

                            <item.icon
                                className={cn(
                                    "w-5 h-5 relative z-10 transition-colors duration-300",
                                    isActive ? "text-indigo-400" : "text-zinc-400 group-hover:text-zinc-200"
                                )}
                            />
                            <span
                                className={cn(
                                    "font-medium tracking-wide text-sm relative z-10 transition-colors duration-300",
                                    isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                                )}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-8 border-t border-white/5 mt-auto bg-gradient-to-t from-black/50 to-transparent">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
                        <div className="w-full h-full bg-indigo-500/20 animate-pulse"></div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors tracking-tight">Engineer</p>
                        <p className="text-xs text-zinc-500 font-medium">Local Workspace</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
