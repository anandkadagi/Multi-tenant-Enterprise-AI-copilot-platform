"use client";
import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { apiClient, ApiError } from "@/lib/api/client";
import type { LoginResponse } from "@/lib/api/types";
import { NetworkMesh } from "@/components/NetworkMesh";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const data = await apiClient.post<LoginResponse>("/api/auth/login", { email, password });
            login(data.token);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-base px-4">
            {/* ambient glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />

            {/* signature mesh, behind the card */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-[400px] w-[600px] max-w-full">
                    <NetworkMesh />
                </div>
            </div>

            {/* login card */}
            <div className="glass-panel relative z-10 w-full max-w-[400px] rounded-2xl px-8 py-10 shadow-2xl shadow-black/40">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
                        <span className="h-2 w-2 rounded-full bg-accent-soft node-pulse" />
                    </div>
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
                        Sign in to Copilot
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        Your company&apos;s knowledge, one search away.
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted">
                            Work email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>

            </div>
        </div>
    );
}