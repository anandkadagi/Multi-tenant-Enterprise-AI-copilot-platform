import Link from "next/link";
import { NetworkMesh } from "@/components/NetworkMesh";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { Pricing } from "./Pricing";
import { Footer } from "./Footer";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-base">
            <nav className="flex items-center justify-between px-6 py-5 sm:px-10">
                <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-accent-soft node-pulse" />
                    <span className="font-display text-lg font-semibold text-white">Copilot</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
                    >
                        Get started
                    </Link>
                </div>
            </nav>

            <Hero />
            <Features />
            <Pricing />
            <Footer />
        </div>
    );
}