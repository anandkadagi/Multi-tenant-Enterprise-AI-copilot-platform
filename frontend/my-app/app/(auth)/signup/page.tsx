"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";
import type { SignupInitiateResponse, SignupVerifyResponse } from "@/lib/api/types";
import { NetworkMesh } from "@/components/NetworkMesh";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function SignupPage() {
    const [companyName, setCompanyName] = useState("");
    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const order = await apiClient.post<SignupInitiateResponse>("/api/public/registerCompany/initiate", {
                companyName,
                adminName,
                adminEmail,
                password,
            });

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                order_id: order.orderId,
                name: "Copilot",
                description: "Enterprise subscription",
                handler: async (response: any) => {
                    try {
                        const result = await apiClient.post<SignupVerifyResponse>(
                            "/api/public/registerCompany/verify",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }
                        );
                        login(result.token);
                    } catch (err) {
                        setError(
                            err instanceof ApiError
                                ? err.message
                                : "Payment succeeded but account setup failed. Contact support."
                        );
                    } finally {
                        setIsSubmitting(false);
                    }
                },
                modal: {
                    ondismiss: () => setIsSubmitting(false),
                },
                theme: { color: "#4C8DFF" },
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-base px-4 py-12">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-[400px] w-[600px] max-w-full">
                    <NetworkMesh />
                </div>
            </div>

            <div className="glass-panel relative z-10 w-full max-w-[420px] rounded-2xl px-8 py-10 shadow-2xl shadow-black/40">
                <div className="mb-8 text-center">
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
                        Set up your workspace
                    </h1>
                    <p className="mt-2 text-sm text-muted">
                        Start your subscription and create your admin account.
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted">Company name</label>
                        <input
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Acme Corp"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted">Your name</label>
                        <input
                            required
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            placeholder="Jane Doe"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted">Work email</label>
                        <input
                            type="email"
                            required
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="jane@acmecorp.com"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted">Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Processing..." : "Continue to payment"}
                    </button>
                </form>
            </div>
        </div>
    );
}