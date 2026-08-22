"use client";
import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
    onSend: (query: string) => void;
    disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState("");

    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="glass-panel flex items-end gap-2 rounded-2xl p-2">
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your company's documents..."
                rows={1}
                className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none"
            />
            <button
                onClick={handleSend}
                disabled={disabled || !value.trim()}
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Send
            </button>
        </div>
    );
}