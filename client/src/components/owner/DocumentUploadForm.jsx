import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { DOCUMENT_TYPES } from "../../utils/documentTypes";

export const DocumentUploadForm = ({ onSubmit, isSubmitting, defaultType }) => {
    const [file, setFile] = useState(null);
    const [type, setType] = useState(defaultType || "Invoice");
    const [title, setTitle] = useState("");
    const [visibleToClient, setVisibleToClient] = useState(true);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) return setError("Please choose a file");
        if (!title.trim()) return setError("Title is required");
        setError("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("title", title.trim());
        formData.append("visibleToClient", visibleToClient);

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm"
                >
                    {DOCUMENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="March Invoice"
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted">File</label>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="text-sm"
                />
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <label className="flex items-center gap-2 text-sm text-muted">
                <input
                    type="checkbox"
                    checked={visibleToClient}
                    onChange={(e) => setVisibleToClient(e.target.checked)}
                />
                Visible to client (sends a WhatsApp notification)
            </label>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
        </form>
    );
};