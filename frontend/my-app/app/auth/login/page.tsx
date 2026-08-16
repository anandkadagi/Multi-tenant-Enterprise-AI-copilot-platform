"use client";
import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { apiClient, ApiError } from "@/lib/api/client";
import type { LoginResponse } from "@/lib/api/types";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const data = await apiClient.post<LoginResponse>("/auth/login", { email, password });
            login(data.token);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "80px auto" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 8 }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 8 }}
            />
            <button type="submit" style={{ width: "100%", padding: 8 }}>Login</button>
        </form>
    );
}