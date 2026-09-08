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
    id: string;
    role: "user" | "assistant";
    content: string;
    citations?: Citation[];
    isStreaming?: boolean;
}

export interface ConversationResponse {
    conversationId: string;
}

export interface ConversationSummary {
    id: string;
    userId: string;
    companyId: string;
    createdAt: string;
    messages: [];
}

export interface MessagesResponse {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface DocumentUploadResult {
    chunks: number;
    embeddings: number;
    stored: boolean;
}

export interface BulkEmployeeResult {
    inserted: number;
    failed: Array<{ email: string; reason: string }>;
}

export interface DocumentRecord {
    id: string;
    tenantId: string;
    name: string;
    uploadedBy: string;
    chunks: number;
    status: string;
    createdAt: string;
}

export interface SignupInitiateResponse {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
}

export interface SignupVerifyResponse {
    token: string;
}