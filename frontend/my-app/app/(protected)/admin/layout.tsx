"use client";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && user?.role !== "TENANT_ADMIN") {
            router.push("/chat");
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-base">
                <p className="text-sm text-muted">Loading...</p>
            </div>
        );
    }

    if (user?.role !== "TENANT_ADMIN") {
        return null;
    }

    

const navItems = [
    { href: "/chat", label: "Chat" },
    { href: "/admin/documents", label: "Documents" },
    { href: "/admin/employees", label: "Employees" },
];

    return (
        <div className="flex h-screen bg-base">
            <aside className="flex w-60 shrink-0 flex-col border-r border-white/5 bg-panel/40">
                <div className="flex items-center gap-2.5 px-5 py-5">
                    <span className="h-2 w-2 rounded-full bg-accent-soft node-pulse" />
                    <span className="font-display text-sm font-semibold text-white">Admin</span>
                </div>

                <nav className="flex flex-col gap-0.5 px-3">
                    {navItems.map((item) => {
                        const isActive = pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-accent/15 text-white"
                                        : "text-slate-300 hover:bg-white/5"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto px-3 py-4">
                    <Link
                        href="/chat"
                        className="block rounded-lg px-3 py-2 text-xs font-medium text-muted transition hover:text-white"
                    >
                        ← Back to chat
                    </Link>
                </div>
            </aside>

            <div className="flex-1 overflow-y-auto p-8">{children}</div>
        </div>
    );
}