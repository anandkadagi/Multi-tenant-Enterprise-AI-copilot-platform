export interface JwtPayload {
    userId: string;
    tenantId: string;
    role: string;
    email: string;
    iat: number;
    exp: number;
}

export interface LoginResponse {
    token: string;
}

export interface Citation {
    document: string;
    page: number;
}

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    citations?: Citation[];
}

export interface ConversationResponse {
    conversationId: string;
}