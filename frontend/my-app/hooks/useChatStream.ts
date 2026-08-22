// "use client";
// import { useState, useCallback, useRef } from "react";
// import type { ChatMessage, Citation, ConversationResponse } from "@/lib/api/types";
// import { apiClient } from "@/lib/api/client";

// const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

// export function useChatStream() {
//     const [messages, setMessages] = useState<ChatMessage[]>([]);
//     const [conversationId, setConversationId] = useState<string | null>(null);
//     const [isStreaming, setIsStreaming] = useState(false);
//     const idCounter = useRef(0);

//     const nextId = () => `msg-${Date.now()}-${idCounter.current++}`;

//     const startNewChat = useCallback(() => {
//         setConversationId(null);
//         setMessages([]);
//     }, []);


//     const sendMessage = useCallback(
//         async (query: string) => {
//             const token =
//                 typeof window !== "undefined" ? localStorage.getItem("token") : null;
//             if (!token) return;

//             let activeConversationId = conversationId;

//             if (!activeConversationId) {
//                 const data = await apiClient.post<ConversationResponse>("/api/conversation/conversations");
//                 activeConversationId = data.conversationId;
//                 setConversationId(activeConversationId);
//             }

//             const userMsgId = nextId();
//             const assistantMsgId = nextId();

//             setMessages((prev) => [
//                 ...prev,
//                 { id: userMsgId, role: "user", content: query },
//                 { id: assistantMsgId, role: "assistant", content: "", isStreaming: true },
//             ]);
//             setIsStreaming(true);

//             try {
//                 const response = await fetch(
//                     `${API_URL}/api/conversation/conversations/${activeConversationId}/messages`,
//                     {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${token}`,
//                         },
//                         body: JSON.stringify({ query }),
//                     }
//                 );

//                 if (!response.ok || !response.body) {
//                     throw new Error("Failed to reach the assistant");
//                 }

//                 const reader = response.body.getReader();
//                 const decoder = new TextDecoder();
//                 let fullText = "";
//                 let citations: Citation[] = [];

//                 while (true) {
//                     const { done, value } = await reader.read();
//                     if (done) break;

//                     const chunkText = decoder.decode(value, { stream: true });

//                     if (chunkText.includes("__CITATIONS__")) {
//                         const [answerPart, citationsPart] = chunkText.split("__CITATIONS__");
//                         if (answerPart) fullText += answerPart;
//                         try {
//                             citations = JSON.parse(citationsPart);
//                         } catch {
//                             // ignore malformed citations, non-fatal
//                         }
//                     } else {
//                         fullText += chunkText;
//                     }

//                     setMessages((prev) =>
//                         prev.map((m) =>
//                             m.id === assistantMsgId
//                                 ? { ...m, content: fullText, citations, isStreaming: true }
//                                 : m
//                         )
//                     );
//                 }

//                 setMessages((prev) =>
//                     prev.map((m) =>
//                         m.id === assistantMsgId ? { ...m, isStreaming: false } : m
//                     )
//                 );
//             } catch (err) {
//                 setMessages((prev) =>
//                     prev.map((m) =>
//                         m.id === assistantMsgId
//                             ? {
//                                   ...m,
//                                   content: "Something went wrong reaching the assistant. Please try again.",
//                                   isStreaming: false,
//                               }
//                             : m
//                     )
//                 );
//             } finally {
//                 setIsStreaming(false);
//             }
//         },
//         [conversationId]
//     );

//     return { messages, sendMessage, isStreaming, startNewChat, conversationId };
// }

"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import type { ChatMessage, Citation, ConversationResponse, ConversationSummary, MessagesResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export function useChatStream() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const idCounter = useRef(0);

    const nextId = () => `msg-${Date.now()}-${idCounter.current++}`;

    const refreshConversations = useCallback(async () => {
        try {
            const data = await apiClient.get<{ conversations: ConversationSummary[] }>("/api/conversation/conversations");
            setConversations(data.conversations);
        } catch {
            // non-fatal — sidebar just stays empty/stale
        }
    }, []);

    useEffect(() => {
        refreshConversations();
    }, [refreshConversations]);

    const startNewChat = useCallback(() => {
        setConversationId(null);
        setMessages([]);
    }, []);

    const loadConversation = useCallback(async (id: string) => {
        setIsLoadingHistory(true);
        setConversationId(id);
        try {
            const data = await apiClient.get<MessagesResponse>(`/api/conversation/conversations/${id}/messages`);
            setMessages(
                data.messages.map((m) => ({
                    id: nextId(),
                    role: m.role,
                    content: m.content,
                }))
            );
        } catch {
            setMessages([]);
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    const sendMessage = useCallback(
        async (query: string) => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) return;

            let activeConversationId = conversationId;
            const isNewConversation = !activeConversationId;

            if (!activeConversationId) {
                const data = await apiClient.post<ConversationResponse>("/api/conversation/conversations");
                activeConversationId = data.conversationId;
                setConversationId(activeConversationId);
            }

            const userMsgId = nextId();
            const assistantMsgId = nextId();

            setMessages((prev) => [
                ...prev,
                { id: userMsgId, role: "user", content: query },
                { id: assistantMsgId, role: "assistant", content: "", isStreaming: true },
            ]);
            setIsStreaming(true);

            try {
                const response = await fetch(`${API_URL}/api/conversation/conversations/${activeConversationId}/messages`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ query }),
                });

                if (!response.ok || !response.body) {
                    throw new Error("Failed to reach the assistant");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullText = "";
                let citations: Citation[] = [];

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunkText = decoder.decode(value, { stream: true });

                    if (chunkText.includes("__CITATIONS__")) {
                        const [answerPart, citationsPart] = chunkText.split("__CITATIONS__");
                        if (answerPart) fullText += answerPart;
                        try {
                            citations = JSON.parse(citationsPart);
                        } catch {
                            // ignore malformed citations
                        }
                    } else {
                        fullText += chunkText;
                    }

                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantMsgId ? { ...m, content: fullText, citations, isStreaming: true } : m
                        )
                    );
                }

                setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? { ...m, isStreaming: false } : m)));

                if (isNewConversation) {
                    refreshConversations();
                }
            } catch {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMsgId
                            ? { ...m, content: "Something went wrong reaching the assistant. Please try again.", isStreaming: false }
                            : m
                    )
                );
            } finally {
                setIsStreaming(false);
            }
        },
        [conversationId, refreshConversations]
    );

    return {
        messages,
        sendMessage,
        isStreaming,
        startNewChat,
        loadConversation,
        conversationId,
        conversations,
        isLoadingHistory,
    };
}