import Link from "next/link";
import { NetworkMesh } from "@/components/NetworkMesh";

export function Hero() {
    return (
        <section className="relative overflow-hidden px-6 pb-24 pt-16 sm:px-10 sm:pt-24">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

            <div className="pointer-events-none absolute inset-0 flex items-start justify-center opacity-60">
                <div className="relative mt-10 h-[400px] w-[700px] max-w-full">
                    <NetworkMesh />
                </div>
            </div>

            <div className="relative mx-auto max-w-3xl text-center">
                <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-soft" />
                    Built for enterprise teams
                </div>

                <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                    Your company&apos;s knowledge,
                    <br />
                    <span className="text-accent">one search away.</span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg">
                    Upload your documents once. Let every employee find answers instantly —
                    with sources cited, scoped to your company, and nothing else.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/signup"
                        className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent/90 sm:w-auto"
                    >
                        Start free trial
                    </Link>
                    <Link
                        href="#pricing"
                        className="w-full rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 sm:w-auto"
                    >
                        View pricing
                    </Link>
                </div>
            </div>
        </section>
    );
}