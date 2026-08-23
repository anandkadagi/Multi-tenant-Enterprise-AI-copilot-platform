"use client";
import { useState, useRef } from "react";
import { apiClient, ApiError } from "@/lib/api/client";
import type { BulkEmployeeResult } from "@/lib/api/types";

export default function EmployeesPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<BulkEmployeeResult | null>(null);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        setError("");
        setResult(null);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const data = await apiClient.postForm<BulkEmployeeResult>(
                "/api/upload/bulk_register",
                formData
            );
            setResult(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Upload failed");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="font-display text-xl font-semibold text-white">Employees</h1>
            <p className="mt-1 text-sm text-muted">
                Bulk-invite employees by uploading an Excel sheet with Name, Email, and Role columns.
            </p>

            <div className="glass-panel mt-6 rounded-2xl p-8">
                <label
                    htmlFor="employee-upload"
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 px-6 py-12 text-center transition hover:border-accent/40 hover:bg-white/[0.02] ${
                        isUploading ? "pointer-events-none opacity-50" : ""
                    }`}
                >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
                        <span className="h-2 w-2 rounded-full bg-accent-soft" />
                    </div>
                    <p className="text-sm font-medium text-white">
                        {isUploading ? "Processing..." : "Click to upload employee sheet"}
                    </p>
                    <p className="mt-1 text-xs text-muted">.xlsx or .xls</p>
                    <input
                        ref={fileInputRef}
                        id="employee-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </label>

                {error && (
                    <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-4 space-y-3">
                        <div className="rounded-lg border border-accent-soft/20 bg-accent-soft/10 px-4 py-3 text-sm text-slate-200">
                            <span className="font-medium text-white">{result.inserted}</span> employees invited successfully
                        </div>

                        {result.failed.length > 0 && (
                            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                                <p className="mb-2 text-xs font-medium text-muted">
                                    {result.failed.length} failed
                                </p>
                                <div className="flex flex-col gap-1">
                                    {result.failed.map((f, i) => (
                                        <div key={i} className="flex justify-between text-xs">
                                            <span className="text-slate-300">{f.email}</span>
                                            <span className="text-red-300">{f.reason}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}