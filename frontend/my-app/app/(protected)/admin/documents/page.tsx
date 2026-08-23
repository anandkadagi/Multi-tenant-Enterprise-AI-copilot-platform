"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { apiClient, ApiError } from "@/lib/api/client";
import type { DocumentUploadResult, DocumentRecord } from "@/lib/api/types";
import { Modal } from "@/components/Modal";
import { relativeTime } from "@/lib/utils/relativeTime";

export default function DocumentsPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<DocumentUploadResult | null>(null);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [documents, setDocuments] = useState<DocumentRecord[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDocuments = useCallback(async () => {
        try {
            const data = await apiClient.get<{ documents: DocumentRecord[] }>("/api/listDocs");
            setDocuments(data.documents);
            console.log(data.documents)
        } catch {
            // non-fatal — list just stays empty/stale
        } finally {
            setIsLoadingDocs(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleUpload = async (file: File) => {
        setError("");
        setResult(null);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const data = await apiClient.postForm<DocumentUploadResult>(
                "/api/uploadDocs",
                formData
            );
            setResult(data);
            setShowModal(true);
            fetchDocuments(); // refresh the list to include the new upload
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
    console.log("RENDER STATE:", { isLoadingDocs, documentsLength: documents.length });
    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="font-display text-xl font-semibold text-white">Documents</h1>
            <p className="mt-1 text-sm text-muted">
                Upload company documents to make them searchable by your team.
            </p>

            <div className="glass-panel mt-6 rounded-2xl p-8">
                <label
                    htmlFor="doc-upload"
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 px-6 py-12 text-center transition hover:border-accent/40 hover:bg-white/[0.02] ${
                        isUploading ? "pointer-events-none opacity-50" : ""
                    }`}
                >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
                        <span className="h-2 w-2 rounded-full bg-accent-soft" />
                    </div>
                    <p className="text-sm font-medium text-white">
                        {isUploading ? "Uploading..." : "Click to upload a document"}
                    </p>
                    <p className="mt-1 text-xs text-muted">PDF, DOCX, and other document formats</p>
                    <input
                        ref={fileInputRef}
                        id="doc-upload"
                        type="file"
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
            </div>

            {/* uploaded documents section */}
            <div className="mt-10">
                <h2 className="font-display text-sm font-semibold text-white">
                    Uploaded documents
                </h2>

                <div className="glass-panel mt-3 rounded-2xl">
                    {isLoadingDocs && (
                        <p className="px-5 py-6 text-center text-sm text-muted">Loading...</p>
                    )}

                    {!isLoadingDocs && documents.length === 0 && (
                        <p className="px-5 py-6 text-center text-sm text-muted">
                            No documents uploaded yet
                        </p>
                    )}

                    {!isLoadingDocs && documents.length > 0 && (
                        <div className="divide-y divide-white/5">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between px-5 py-3.5"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[10px] font-medium text-accent-soft">
                                            {doc.name.split(".").pop()?.slice(0, 3).toUpperCase()}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white">
                                                {doc.name}
                                            </p>
                                            <p className="text-xs text-muted">
                                                {doc.chunks} chunks · {relativeTime(doc.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                            doc.status === "processed"
                                                ? "bg-accent-soft/15 text-accent-soft"
                                                : "bg-red-500/15 text-red-300"
                                        }`}
                                    >
                                        {doc.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft/15">
                        <span className="h-3 w-3 rounded-full bg-accent-soft" />
                    </div>
                    <h2 className="font-display text-lg font-semibold text-white">
                        Document uploaded
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        {result?.chunks} chunks processed · {result?.embeddings} embeddings created
                    </p>
                    <button
                        onClick={() => setShowModal(false)}
                        className="mt-6 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90"
                    >
                        OK
                    </button>
                </div>
            </Modal>
        </div>
    );
}