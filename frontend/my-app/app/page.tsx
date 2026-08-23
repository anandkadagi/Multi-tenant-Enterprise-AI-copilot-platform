"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

export default function Home() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login");
            } else if (user.role === "TENANT_ADMIN") {
                router.push("/admin/documents");
            } else {
                router.push("/chat");
            }
        }
    }, [isLoading, user, router]);

    return (
        <div className="flex flex-1 items-center justify-center bg-base">
            <p className="text-sm text-muted">Loading...</p>
        </div>
    );
}