"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { apiClient, ApiError } from "@/lib/api/client";
import type { SubscriptionStatus, RenewalInitiateResponse, RenewalVerifyResponse } from "@/lib/api/types";
import { NetworkMesh } from "@/components/NetworkMesh";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function RenewSubscriptionPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<SubscriptionStatus | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAuthLoading && user && user.role !== "TENANT_ADMIN") {
            router.push("/chat");
        }
    }, [isAuthLoading, user, router]);

    useEffect(() => {
        if (user?.role === "TENANT_ADMIN") {
            apiClient
                .get<SubscriptionStatus>("/api/subscription/status")
                .then(setStatus)
                .catch(() => setStatus(null));
        }
    }, [user]);

    const handleRenew = async () => {
        setError("");
        setIsProcessing(true);

        try {
            const order = await apiClient.post<RenewalInitiateResponse>("/api/subscription/renew");

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                order_id: order.orderId,
                name: "Copilot",
                description: "Subscription renewal",
                handler: async (response: any) => {
                    try {
                        await apiClient.post<RenewalVerifyResponse>("/api/subscription/renew/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        router.push("/admin/documents");
                    } catch (err) {
                        setError(
                            err instanceof ApiError
                                ? err.message
                                : "Payment succeeded but renewal failed. Contact support."
                        );
                    } finally {
                        setIsProcessing(false);
                    }
                },
                modal: { ondismiss: () => setIsProcessing(false) },
                theme: { color: "#4C8DFF" },
            };

            new window.Razorpay(options).open();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
            setIsProcessing(false);
        }
    };

    if (isAuthLoading || (user && user.role !== "TENANT_ADMIN")) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-base">
                <p className="text-sm text-muted">Loading...</p>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-base px-4">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-[400px] w-[600px] max-w-full">
                    <NetworkMesh />
                </div>
            </div>

            <div className="glass-panel relative z-10 w-full max-w-[420px] rounded-2xl px-8 py-10 text-center shadow-2xl shadow-black/40">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                </div>

                <h1 className="font-display text-xl font-semibold text-white">Subscription expired</h1>

                <p className="mt-2 text-sm text-muted">
                    {status?.expiresAt
                        ? `Your plan expired on ${new Date(status.expiresAt).toLocaleDateString()}.`
                        : "Your company doesn't have an active subscription."}{" "}
                    Renew now to restore access for your team.
                </p>

                {error && (
                    <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleRenew}
                    disabled={isProcessing}
                    className="mt-6 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isProcessing ? "Processing..." : "Renew subscription"}
                </button>
            </div>
        </div>
    );
}