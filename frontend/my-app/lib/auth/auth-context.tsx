"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { JwtPayload } from "@/lib/api/types";

interface AuthContextValue {
    user: JwtPayload | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeToken(token: string): JwtPayload | null {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;
        return payload;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<JwtPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = decodeToken(token);
            if (payload && payload.exp * 1000 > Date.now()) {
                setUser(payload);
            } else {
                localStorage.removeItem("token");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        const payload = decodeToken(token);
        setUser(payload);
        router.push("/chat");
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}