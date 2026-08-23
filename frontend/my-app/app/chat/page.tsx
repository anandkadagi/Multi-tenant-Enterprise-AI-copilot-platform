// "use client";
// import { useEffect, useRef } from "react";
// import { useAuth } from "@/lib/auth/auth-context";
// import { useChatStream } from "@/hooks/useChatStream";
// import { ChatMessageBubble } from "@/components/ChatMessageBubble";
// import { ChatInput } from "@/components/ChatInput";

// export default function ChatPage() {
//     const { user, logout } = useAuth();
//     const { messages, sendMessage, isStreaming, startNewChat } = useChatStream();
//     const bottomRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     return (
//         <div className="flex h-screen flex-col bg-base">
//             {/* top bar */}
//             <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
//                 <div className="flex items-center gap-2.5">
//                     <span className="h-2 w-2 rounded-full bg-accent-soft node-pulse" />
//                     <h1 className="font-display text-base font-semibold text-white">Copilot</h1>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <button
//                         onClick={startNewChat}
//                         className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/5"
//                     >
//                         New chat
//                     </button>
//                     <span className="text-xs text-muted">{user?.email}</span>
//                     <button
//                         onClick={logout}
//                         className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition hover:text-white"
//                     >
//                         Log out
//                     </button>
//                 </div>
//             </header>

//             {/* messages */}
//             <div className="flex-1 overflow-y-auto px-6 py-6">
//                 <div className="mx-auto flex max-w-3xl flex-col gap-4">
//                     {messages.length === 0 && (
//                         <div className="flex h-[50vh] flex-col items-center justify-center text-center">
//                             <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
//                                 <span className="h-2.5 w-2.5 rounded-full bg-accent-soft node-pulse" />
//                             </div>
//                             <h2 className="font-display text-lg font-medium text-white">
//                                 Ask anything about your documents
//                             </h2>
//                             <p className="mt-1.5 max-w-sm text-sm text-muted">
//                                 Search across everything your team has uploaded — with sources cited.
//                             </p>
//                         </div>
//                     )}

//                     {messages.map((m) => (
//                         <ChatMessageBubble key={m.id} message={m} />
//                     ))}
//                     <div ref={bottomRef} />
//                 </div>
//             </div>

//             {/* input */}
//             <div className="border-t border-white/5 px-6 py-4">
//                 <div className="mx-auto max-w-3xl">
//                     <ChatInput onSend={sendMessage} disabled={isStreaming} />
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useChatStream } from "@/hooks/useChatStream";
import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { ChatInput } from "@/components/ChatInput";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import Link from "next/link";

export default function ChatPage() {
    const { user, logout } = useAuth();
    const {
        messages,
        sendMessage,
        isStreaming,
        startNewChat,
        loadConversation,
        conversationId,
        conversations,
        isLoadingHistory,
    } = useChatStream();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex h-screen bg-base">
            <ConversationSidebar
                conversations={conversations}
                activeId={conversationId}
                onSelect={loadConversation}
                onNewChat={startNewChat}
            />

            <div className="flex flex-1 flex-col">
                <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="h-2 w-2 rounded-full bg-accent-soft node-pulse" />
                        <h1 className="font-display text-base font-semibold text-white">Copilot</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {user?.role === "TENANT_ADMIN" && (
                            <Link
                                href="/admin/documents"
                                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/5"
                            >
                                Admin
                            </Link>
                        )}
                        <span className="text-xs text-muted">{user?.email}</span>
                        <button
                            onClick={logout}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition hover:text-white"
                        >
                            Log out
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="mx-auto flex max-w-3xl flex-col gap-4">
                        {isLoadingHistory && (
                            <p className="text-center text-sm text-muted">Loading conversation...</p>
                        )}

                        {!isLoadingHistory && messages.length === 0 && (
                            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
                                    <span className="h-2.5 w-2.5 rounded-full bg-accent-soft node-pulse" />
                                </div>
                                <h2 className="font-display text-lg font-medium text-white">
                                    Ask anything about your documents
                                </h2>
                                <p className="mt-1.5 max-w-sm text-sm text-muted">
                                    Search across everything your team has uploaded — with sources cited.
                                </p>
                            </div>
                        )}

                        {!isLoadingHistory && messages.map((m) => <ChatMessageBubble key={m.id} message={m} />)}
                        <div ref={bottomRef} />
                    </div>
                </div>

                <div className="border-t border-white/5 px-6 py-4">
                    <div className="mx-auto max-w-3xl">
                        <ChatInput onSend={sendMessage} disabled={isStreaming} />
                    </div>
                </div>
            </div>
        </div>
    );
}