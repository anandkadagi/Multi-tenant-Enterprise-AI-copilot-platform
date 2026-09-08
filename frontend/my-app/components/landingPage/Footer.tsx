export function Footer() {
    return (
        <footer className="border-t border-white/5 px-6 py-8 sm:px-10">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-soft" />
                    <span className="text-sm font-medium text-white">Copilot</span>
                </div>
                <p className="text-xs text-muted">
                    © {new Date().getFullYear()} Copilot. All rights reserved.
                </p>
            </div>
        </footer>
    );
}