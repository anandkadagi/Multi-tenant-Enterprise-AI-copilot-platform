import type { ChatMessage } from "@/lib/api/types";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                        ? "bg-accent text-white"
                        : "glass-panel text-slate-100"
                }`}
            >
                <p className="whitespace-pre-wrap">
                    {message.content}
                    {message.isStreaming && (
                        <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-accent-soft align-middle" />
                    )}
                </p>

                {message.citations && message.citations.length > 0 && !message.isStreaming && (
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/10 pt-2.5">
                        {message.citations.map((c, i) => (
                            <span
                                key={i}
                                className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-muted"
                            >
                                {c.document.slice(0, 8)} · p.{c.page}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}