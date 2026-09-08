import Link from "next/link";

const included = [
    "Unlimited document uploads",
    "Unlimited employee accounts",
    "Hybrid semantic + keyword search",
    "Source citations on every answer",
    "Bulk employee onboarding",
    "Priority support",
];

export function Pricing() {
    return (
        <section id="pricing" className="px-6 py-20 sm:px-10">
            <div className="mx-auto max-w-xl text-center">
                <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                    Simple, transparent pricing
                </h2>
                <p className="mt-3 text-sm text-muted">
                    One plan. Everything included. No per-seat surprises.
                </p>
            </div>

            <div className="glass-panel relative mx-auto mt-10 max-w-md rounded-2xl border border-accent/20 p-8">
                <div className="text-center">
                    <p className="font-display text-4xl font-semibold text-white">
                        ₹4,999
                        <span className="text-base font-normal text-muted">/month</span>
                    </p>
                    <p className="mt-1 text-xs text-muted">billed monthly, cancel anytime</p>
                </div>

                <ul className="mt-8 flex flex-col gap-3">
                    {included.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-soft" />
                            {item}
                        </li>
                    ))}
                </ul>

                <Link
                    href="/signup"
                    className="mt-8 block w-full rounded-lg bg-accent px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-accent/90"
                >
                    Get started
                </Link>
            </div>
        </section>
    );
}