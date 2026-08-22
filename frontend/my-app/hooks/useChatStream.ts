"use client";
import { useState, useCallback, useRef } from "react";
import type { ChatMessage, Citation, ConversationResponse } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export function useChatStream() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const idCounter = useRef(0);

    const nextId = () => `msg-${Date.now()}-${idCounter.current++}`;

    const startNewChat = useCallback(() => {
        setConversationId(null);
        setMessages([]);
    }, []);

    const sendMessage = useCallback(
        async (query: string) => {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) return;

            let activeConversationId = conversationId;

            if (!activeConversationId) {
                const data = await apiClient.post<ConversationResponse>("/conversations");
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
                const response = await fetch(
                    `${API_URL}/conversations/${activeConversationId}/messages`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ query }),
                    }
                );

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
                            // ignore malformed citations, non-fatal
                        }
                    } else {
                        fullText += chunkText;
                    }

                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, content: fullText, citations, isStreaming: true }
                                : m
                        )
                    );
                }

                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMsgId ? { ...m, isStreaming: false } : m
                    )
                );
            } catch (err) {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMsgId
                            ? {
                                  ...m,
                                  content: "Something went wrong reaching the assistant. Please try again.",
                                  isStreaming: false,
                              }
                            : m
                    )
                );
            } finally {
                setIsStreaming(false);
            }
        },
        [conversationId]
    );

    return { messages, sendMessage, isStreaming, startNewChat, conversationId };
}