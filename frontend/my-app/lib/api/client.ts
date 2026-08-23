const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

interface RequestOptions extends RequestInit {
    body?: any;
}

async function requestForm(path: string, formData: FormData): Promise<Response> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    if (response.status === 401) {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        throw new ApiError("Unauthorized", 401);
    }

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new ApiError(errorBody.message || "Upload failed", response.status);
    }

    return response;
}


async function request(path: string, options: RequestOptions = {}): Promise<Response> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (response.status === 401) {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        throw new ApiError("Unauthorized", 401);
    }

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new ApiError(errorBody.message || "Request failed", response.status);
    }

    return response;
}

export const apiClient = {
    get: async <T>(path: string): Promise<T> => {
        const res = await request(path, { method: "GET" });
        return res.json();
    },
    post: async <T>(path: string, body?: unknown): Promise<T> => {
        const res = await request(path, { method: "POST", body });
        return res.json();
    },
    // for streaming endpoints — returns raw Response so caller can read the body stream
    postStream: async (path: string, body?: unknown): Promise<Response> => {
        return request(path, { method: "POST", body });
    },

    postForm: async <T>(path: string, formData: FormData): Promise<T> => {
        const res = await requestForm(path, formData);
        return res.json();
    },
};