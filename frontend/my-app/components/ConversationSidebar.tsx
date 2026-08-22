import type { ConversationSummary } from "@/lib/api/types";
import { relativeTime } from "@/lib/utils/relativeTime";

interface ConversationSidebarProps {
    conversations: ConversationSummary[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onNewChat: () => void;
}

export function ConversationSidebar({ conversations, activeId, onSelect, onNewChat }: ConversationSidebarProps) {
    return (
        <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/5 bg-panel/40">
            <div className="p-3">
                <button
                    onClick={onNewChat}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5"
                >
                    <span className="text-accent-soft">+</span> New chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-3">
                <p className="px-2 py-2 text-[11px] font-medium uppercase tracking-wide text-muted/70">
                    Today
                </p>

                {conversations.length === 0 && (
                    <p className="px-2 py-4 text-center text-xs text-muted/60">
                        No conversations yet
                    </p>
                )}

                <div className="flex flex-col gap-0.5">
                    {conversations.map((c,index) => {
                        const isActive = c.id === activeId;
                        return (
                            <button
                                key={c.id}
                                onClick={() => onSelect(c.id)}
                                className={`flex flex-col items-start rounded-lg px-3 py-2 text-left transition ${
                                    isActive ? "bg-accent/15 text-white" : "text-slate-300 hover:bg-white/5"
                                }`}
                            >
                                <span className="text-sm font-medium">
                                    Chat {index+1}
                                </span>
                                <span className="text-[11px] text-muted">
                                    {relativeTime(c.createdAt)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}