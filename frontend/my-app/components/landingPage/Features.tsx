const features = [
    {
        title: "Private by design",
        description: "Every company's documents are fully isolated. No employee ever sees another company's data — enforced at the retrieval layer, not just the UI.",
    },
    {
        title: "Answers with sources",
        description: "Every response cites the exact document and page it came from, so your team can verify and trust what the copilot tells them.",
    },
    {
        title: "Bulk onboarding",
        description: "Upload a spreadsheet to invite your whole team at once. No manual account creation, no back-and-forth.",
    },
    {
        title: "Built for scale",
        description: "Hybrid search across semantic meaning and exact keywords, so answers stay accurate as your document library grows.",
    },
];

export function Features() {
    return (
        <section className="px-6 py-20 sm:px-10">
            <div className="mx-auto max-w-5xl">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                        Everything your team needs to stop searching, and start asking.
                    </h2>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {features.map((f) => (
                        <div key={f.title} className="glass-panel rounded-2xl p-6">
                            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15">
                                <span className="h-2 w-2 rounded-full bg-accent-soft" />
                            </div>
                            <h3 className="font-display text-base font-semibold text-white">
                                {f.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}