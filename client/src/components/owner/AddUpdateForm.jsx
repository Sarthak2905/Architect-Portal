import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { UPDATE_TYPES, UPDATE_TYPE_LABELS } from "../../utils/documentTypes";

export const AddUpdateForm = ({ onSubmit, isSubmitting }) => {
    const [values, setValues] = useState({
        title: "",
        message: "",
        type: "general",
        visibleToClient: true,
    });
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.title.trim()) {
            setError("Title is required");
            return;
        }
        setError("");
        onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted">Type</label>
                <select
                    value={values.type}
                    onChange={(e) => setValues((p) => ({ ...p, type: e.target.value }))}
                    className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm"
                >
                    {UPDATE_TYPES.map((t) => (
                        <option key={t} value={t}>{UPDATE_TYPE_LABELS[t]}</option>
                    ))}
                </select>
            </div>

            <Input
                label="Title"
                value={values.title}
                onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))}
                error={error}
                placeholder="Flooring completed on 2nd floor"
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted">Message (optional)</label>
                <textarea
                    value={values.message}
                    onChange={(e) => setValues((p) => ({ ...p, message: e.target.value }))}
                    rows={3}
                    className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm focus:border-primary transition-colors"
                />
            </div>

            <label className="flex items-center gap-2 text-sm text-muted">
                <input
                    type="checkbox"
                    checked={values.visibleToClient}
                    onChange={(e) => setValues((p) => ({ ...p, visibleToClient: e.target.checked }))}
                />
                Visible to client (sends a WhatsApp notification)
            </label>

            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post update"}
            </Button>
        </form>
    );
};